import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Renderer, createParser, type ActionEvent, type ParseResult } from '@openuidev/react-lang'
import {
  STEP_KEYS,
  answerMap,
  collectNominations,
  copy,
  isAgentId,
  labelFor,
  normaliseValue,
  ruleSquad,
  union,
  type Answer,
  type AgentId,
  type StepKey,
} from './data'
import { getInterviewLibrary } from './openui-library'
import {
  Choices,
  ContinueBar,
  Frame,
  History,
  InterviewContext,
  QuestionBlock,
  SeatRing,
  TeamPanel,
  TextField,
} from './parts'

// Parses a finished live turn on the client, so the stream-end check does not
// depend on when the renderer's callbacks run.
let parser: ReturnType<typeof createParser> | undefined
const getTurnParser = () => (parser ??= createParser(getInterviewLibrary().toJSONSchema(), 'Ask'))

/**
 * Petra's interview. Starts scripted (the design's own flow) and switches to
 * the generative layer when /api/petra streams. Any live failure drops back to
 * the scripted flow for the rest of the session. Both layers share one state:
 * the list of answers.
 */
export function Interview() {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [nominated, setNominated] = useState<AgentId[]>([])
  const [joinedNow, setJoinedNow] = useState<AgentId[]>([])
  const [mode, setMode] = useState<'scripted' | 'live'>('scripted')
  const [liveText, setLiveText] = useState<string | null>(null)
  const [streaming, setStreaming] = useState(false)
  const [draft, setDraft] = useState('')
  const [sel, setSel] = useState<string[]>([])

  const liveDown = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const nominatedRef = useRef<AgentId[]>([])

  const step = answers.length
  const isFinal = step >= STEP_KEYS.length
  const rules = ruleSquad(answerMap(answers), step)
  const table = useMemo(() => union(rules, nominated).filter((id) => id !== 'petra'), [rules.join(), nominated.join()])
  const team: AgentId[] = ['petra', ...table]
  nominatedRef.current = nominated

  /** Start (or restart) a live turn. Failure switches to the scripted flow for good. */
  const requestTurn = useCallback(
    async (next: Answer[]) => {
      abortRef.current?.abort()
      const ac = new AbortController()
      abortRef.current = ac
      setLiveText('')
      setStreaming(true)
      try {
        const res = await fetch('/api/petra', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            answers: next.map((a) => ({ key: a.key, value: a.value })),
            table: union(ruleSquad(answerMap(next), next.length), nominatedRef.current).filter((id) => id !== 'petra'),
          }),
          signal: ac.signal,
        })
        if (!res.ok || !res.body) throw new Error(`unavailable ${res.status}`)
        setMode('live')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          setLiveText(acc)
        }
        acc += decoder.decode()
        setLiveText(acc)
        if (!getTurnParser().parse(acc).root) throw new Error('no root')
        setStreaming(false)
      } catch {
        if (ac.signal.aborted) return
        liveDown.current = true
        setMode('scripted')
        setLiveText(null)
        setStreaming(false)
      }
    },
    [],
  )

  // Probe on mount. Until it answers, the scripted first question is shown.
  useEffect(() => {
    requestTurn([])
    return () => abortRef.current?.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const answersRef = useRef<Answer[]>(answers)
  answersRef.current = answers

  /** Record one answer. Used by both layers. */
  const commit = useCallback(
    (key: StepKey, value: string | string[], question: string) => {
      const before = ruleSquad(answerMap(answersRef.current), answersRef.current.length)
      const next = [...answersRef.current, { key, value, label: labelFor(key, value), question }]
      const after = ruleSquad(answerMap(next), next.length)
      setJoinedNow(after.filter((x) => !before.includes(x)))
      setAnswers(next)
      answersRef.current = next
      setDraft('')
      setSel([])
      if (!liveDown.current) requestTurn(next)
    },
    [requestTurn],
  )

  /** Answer from a live (OpenUI) input. The key and question come from the current step. */
  const onLiveAction = useCallback(
    (event: ActionEvent) => {
      if (event.type !== 'answer') return
      const current = answersRef.current.length
      const key = STEP_KEYS[current]
      if (!key) return
      const value = normaliseValue(key, event.params.value)
      if (value === null) return
      const question = typeof event.params.question === 'string' ? event.params.question.slice(0, 300) : ''
      commit(key, value, question)
    },
    [commit],
  )

  const onParse = useCallback(
    (res: ParseResult | null) => {
      if (!res?.root) return
      const ids = [...collectNominations(res.root)].filter(isAgentId).filter((id) => id !== 'petra')
      if (ids.length === 0) return
      setNominated((prev) => {
        const merged = union(prev, ids as AgentId[])
        return merged.length === prev.length ? prev : merged
      })
    },
    [],
  )

  const restart = () => {
    abortRef.current?.abort()
    answersRef.current = []
    setAnswers([])
    setNominated([])
    setJoinedNow([])
    setDraft('')
    setSel([])
    if (liveDown.current) {
      setLiveText(null)
      setMode('scripted')
    } else {
      requestTurn([])
    }
  }

  // Scripted layer: the design's own copy and inputs, one step at a time.
  const map = answerMap(answers)
  const scriptedQuestion = (joinedNow.length ? copy.joined(joinedNow.map((id) => copy.ag[id][0])) : '') +
    (isFinal ? copy.q[6](map) : copy.q[step](map))

  const scriptedKey = STEP_KEYS[Math.min(step, STEP_KEYS.length - 1)]
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  let scriptedInput: ReactNode = null
  if (!isFinal) {
    if (scriptedKey === 'name') {
      const v = draft.trim()
      scriptedInput = (
        <TextField
          value={draft}
          onChange={setDraft}
          onSubmit={() => v && commit('name', v, scriptedQuestion)}
          placeholder={copy.ph[0]}
          sendLabel={copy.send}
          canSend={v.length > 0}
        />
      )
    } else if (scriptedKey === 'kind') {
      scriptedInput = (
        <Choices options={copy.kind.map(([value, label]) => ({ value, label }))} onPick={(v) => commit('kind', v, scriptedQuestion)} />
      )
    } else if (scriptedKey === 'what') {
      const v = draft.trim()
      scriptedInput = (
        <TextField
          value={draft}
          onChange={setDraft}
          onSubmit={() => v && commit('what', v, scriptedQuestion)}
          placeholder={copy.ph[2]}
          sendLabel={copy.send}
          canSend={v.length > 0}
          suggestions={copy.what}
          onSuggest={setDraft}
        />
      )
    } else if (scriptedKey === 'channels' || scriptedKey === 'pains') {
      const list = scriptedKey === 'channels' ? copy.channels : copy.pains
      scriptedInput = (
        <>
          <Choices options={list.map(([value, label]) => ({ value, label }))} selected={sel} multi onPick={toggle} />
          <ContinueBar
            label={copy.next}
            picked={copy.picked(sel.length)}
            canSend={sel.length > 0}
            onSend={() => sel.length && commit(scriptedKey, sel, scriptedQuestion)}
          />
        </>
      )
    } else if (scriptedKey === 'mode') {
      scriptedInput = (
        <Choices options={copy.mode.map(([value, label]) => ({ value, label }))} onPick={(v) => commit('mode', v, scriptedQuestion)} />
      )
    }
  } else {
    scriptedInput = (
      <TeamPanel
        team={team}
        copy={copy}
        modeLine={copy.modeLine[(map.mode as keyof typeof copy.modeLine) ?? 'ask'] ?? ''}
        onRestart={restart}
      />
    )
  }

  const dots = STEP_KEYS.map((_, i) => ({
    w: i === step ? '24px' : '6px',
    bg: i <= step ? '#181818' : 'rgba(13,13,13,.16)',
  }))

  const history = isFinal
    ? null
    : answers.slice(-2).filter((a) => a.question).map((a) => ({ q: a.question, a: a.label }))

  const stage =
    mode === 'live' && liveText !== null ? (
      <Renderer
        response={liveText}
        library={getInterviewLibrary()}
        isStreaming={streaming}
        onAction={onLiveAction}
        onParseResult={onParse}
      />
    ) : (
      <QuestionBlock key={`s${step}-${joinedNow.join()}`} text={scriptedQuestion}>
        {scriptedInput}
      </QuestionBlock>
    )

  return (
    <InterviewContext.Provider value={{ team, restart }}>
      <Frame
        copy={copy}
        dots={dots}
        stepLabel={isFinal ? '' : copy.of(step + 1, STEP_KEYS.length)}
        history={history ? <History items={history} /> : null}
        stage={stage}
        seats={<SeatRing squad={table} copy={copy} />}
        rowAlign={isFinal ? 'flex-end' : 'center'}
        squadLabel={copy.squad(table.length)}
      />
    </InterviewContext.Provider>
  )
}
