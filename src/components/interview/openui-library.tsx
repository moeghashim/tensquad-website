// OpenUI component library for the generative Petra interview.
//
// The model may only emit these components. Each renderer is one of the
// design's own interview pieces (see parts.tsx), so a live turn looks exactly
// like the scripted one. Answers go back to the client as actions.
//
// Model turn shape (OpenUI Lang), for example:
//   root = Ask("Good to meet you, Lina. Is this a new business, or one already running?", choices, ["machu", "angkor"])
//   choices = Choices([{value: "new", label: "New business"}, {value: "existing", label: "Existing business"}])
import { useContext, useState } from 'react'
import { createLibrary, defineComponent, useTriggerAction } from '@openuidev/react-lang'
import { z } from 'zod/v4'
import { AGENT_IDS, copyFor } from './data'
import {
  AnswerContext,
  Choices as ChoicesView,
  ContinueBar,
  InterviewContext,
  QuestionBlock,
  TeamPanel,
  TextField,
} from './parts'

const AgentId = z.enum(AGENT_IDS)
const Option = z.object({ value: z.string().describe('Answer id sent back when picked'), label: z.string().describe('Text shown on the chip') })

const Choices = defineComponent({
  name: 'Choices',
  description:
    'Single-pick chips. Picking one sends that answer and moves to the next question. Use for "kind" and "mode" questions.',
  props: z.object({
    options: z.array(Option).describe('2 to 6 options, in the order to show them'),
  }),
  component: ({ props }) => {
    const ctx = useContext(AnswerContext)
    return (
      <ChoicesView
        options={props.options}
        onPick={(value) => {
          const opt = props.options.find((o) => o.value === value)
          ctx?.answer(value, opt?.label ?? value)
        }}
      />
    )
  },
})

const MultiChoices = defineComponent({
  name: 'MultiChoices',
  description:
    'Multi-select chips with a Continue button. Use for "channels" and "pains" questions. The user must pick at least one.',
  props: z.object({
    options: z.array(Option).describe('3 to 9 options'),
  }),
  component: ({ props }) => {
    const ctx = useContext(AnswerContext)
    const { locale } = useContext(InterviewContext)
    const copy = copyFor(locale)
    const [selected, setSelected] = useState<string[]>([])
    const toggle = (value: string) =>
      setSelected((s) => (s.includes(value) ? s.filter((x) => x !== value) : [...s, value]))
    const labels = props.options.filter((o) => selected.includes(o.value)).map((o) => o.label)
    return (
      <>
        <ChoicesView options={props.options} selected={selected} multi onPick={toggle} />
        <ContinueBar
          label={copy.next}
          picked={copy.picked(selected.length)}
          canSend={selected.length > 0}
          onSend={() => {
            if (selected.length && ctx) ctx.answer(selected, labels.join(locale === 'ar' ? '، ' : ', '))
          }}
        />
      </>
    )
  },
})

const TextAnswer = defineComponent({
  name: 'TextAnswer',
  description:
    'Free text input with a placeholder and optional suggestion chips (a chip fills the input, it does not send). Use for "name" and "what" questions.',
  props: z.object({
    placeholder: z.string().describe('Hint text inside the input, e.g. "Your name"'),
    suggestions: z.array(z.string()).optional().describe('Up to 3 example answers shown as chips'),
  }),
  component: ({ props }) => {
    const ctx = useContext(AnswerContext)
    const { locale } = useContext(InterviewContext)
    const copy = copyFor(locale)
    const [draft, setDraft] = useState('')
    const value = draft.trim()
    const send = () => {
      if (value && ctx) ctx.answer(value.slice(0, 200), value.slice(0, 200))
    }
    return (
      <TextField
        value={draft}
        onChange={setDraft}
        onSubmit={send}
        placeholder={props.placeholder}
        sendLabel={copy.send}
        canSend={value.length > 0}
        suggestions={props.suggestions}
        onSuggest={setDraft}
      />
    )
  },
})

const Squad = defineComponent({
  name: 'Squad',
  description:
    'The final team list with the mode line and the start button. Use only as the input of the last question, after all six answers.',
  props: z.object({
    mode: z.enum(['ask', 'some', 'auto']).describe('The autonomy mode the user picked'),
    members: z.array(AgentId).optional().describe('Squadmates Petra recruits, besides Petra'),
  }),
  component: ({ props }) => {
    const { locale, team, restart } = useContext(InterviewContext)
    const copy = copyFor(locale)
    return <TeamPanel team={team} copy={copy} modeLine={copy.modeLine[props.mode]} onRestart={restart} />
  },
})

const Ask = defineComponent({
  name: 'Ask',
  description:
    'Petra asks one question and shows one input under it. The question types out. "join" lists agents who join the round table because of this answer.',
  props: z.object({
    question: z.string().describe('The question, one or two short sentences, in the user language'),
    input: z
      .union([Choices.ref, MultiChoices.ref, TextAnswer.ref, Squad.ref])
      .describe('Exactly one input for this question'),
    join: z
      .array(AgentId)
      .optional()
      .describe('Agents newly implied by the answers so far that are not yet at the table. Last argument, may be omitted'),
  }),
  component: ({ props, renderNode }) => {
    const trigger = useTriggerAction()
    const answer = (value: string | string[], label: string) =>
      trigger(label, undefined, { type: 'answer', params: { value, label, question: props.question } })
    return (
      <AnswerContext.Provider value={{ question: props.question, answer }}>
        <QuestionBlock text={props.question}>{renderNode(props.input)}</QuestionBlock>
      </AnswerContext.Provider>
    )
  },
})

export const interviewLibrary = createLibrary({
  root: 'Ask',
  components: [Ask, Choices, MultiChoices, TextAnswer, Squad],
})

export const ACTION_ANSWER = 'answer'
