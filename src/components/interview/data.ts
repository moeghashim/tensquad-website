// Shared, environment-neutral data for the Petra interview.
// Ported from design/Tensquads Interview.dc.html (copy, agents, squad rules).
// Safe to import on the server (no DOM, no React).
import { LOCALE } from '../../lib/locale'
import { AR } from './copy.ar'
import { EN } from './copy.en'

export const AGENT_IDS = [
  'petra',
  'machu',
  'alexandria',
  'angkor',
  'venice',
  'rio',
  'giza',
  'pisa',
  'kyoto',
  'zurich',
  'delphi',
  'greenwich',
  'sydney',
] as const

export type AgentId = (typeof AGENT_IDS)[number]

export function isAgentId(v: unknown): v is AgentId {
  return typeof v === 'string' && (AGENT_IDS as readonly string[]).includes(v)
}

/** The 12 seats around the table, in ring order (Petra sits at the centre). */
export const RING: AgentId[] = [
  'machu',
  'alexandria',
  'angkor',
  'venice',
  'rio',
  'giza',
  'pisa',
  'kyoto',
  'zurich',
  'delphi',
  'greenwich',
  'sydney',
]

export const LIGHT: Record<AgentId, string> = {
  petra: '#FBD8D0',
  machu: '#D3F0DF',
  alexandria: '#D9DBFF',
  angkor: '#FFE7AE',
  venice: '#FFD6F0',
  rio: '#E6DBFF',
  giza: '#FFE1C4',
  pisa: '#DCE8FF',
  kyoto: '#FFD3C7',
  zurich: '#EEF1F6',
  delphi: '#E8F2C9',
  greenwich: '#F6FBC4',
  sydney: '#D4F1FB',
}

/** The six answered steps, in order. Step index === number of answers given. */
export const STEP_KEYS = ['name', 'kind', 'what', 'channels', 'pains', 'mode'] as const
export type StepKey = (typeof STEP_KEYS)[number]

export const KIND_IDS = ['new', 'existing'] as const
export const MODE_IDS = ['ask', 'some', 'auto'] as const
export type ModeId = (typeof MODE_IDS)[number]

export interface Answer {
  key: StepKey
  /** Stored value: string for name/what/kind/mode, string[] for channels/pains. */
  value: string | string[]
  /** Human-readable label for the history line. */
  label: string
  /** The question Petra asked for this answer (shown in history). */
  question: string
}

export interface AnswerMap {
  name?: string
  kind?: string
  what?: string
  channels?: string[]
  pains?: string[]
  mode?: string
}

export function answerMap(answers: Answer[]): AnswerMap {
  const m: AnswerMap = {}
  for (const a of answers) {
    if (a.key === 'channels' || a.key === 'pains') m[a.key] = a.value as string[]
    else m[a.key] = a.value as string
  }
  return m
}

type Pair = readonly [string, string]

export interface Copy {
  petra: string
  master: string
  exit: string
  send: string
  next: string
  start: string
  again: string
  fine: string
  ph: string[]
  kind: Pair[]
  what: string[]
  channels: Pair[]
  pains: Pair[]
  mode: Pair[]
  modeLine: Record<ModeId, string>
  ag: Record<AgentId, [name: string, role: string, does: string]>
  q: Array<(a: AnswerMap) => string>
  of: (a: number, b: number) => string
  picked: (n: number) => string
  joined: (names: string[]) => string
  squad: (n: number) => string
}


// Static selection: LOCALE is a build-time constant, so the other locale's copy is tree-shaken.
export const copy: Copy = LOCALE === 'ar' ? AR : EN

/** Option lists per step, used for validation and for chip labels. */
export function optionsFor(key: StepKey): Pair[] {
  const c = copy
  if (key === 'kind') return c.kind
  if (key === 'channels') return c.channels
  if (key === 'pains') return c.pains
  if (key === 'mode') return c.mode
  if (key === 'what') return c.what.map((x) => [x, x] as const)
  return []
}

/** Which agents the rules add to the table, given the answers so far. */
export function ruleSquad(a: AnswerMap, step: number): AgentId[] {
  const s: AgentId[] = []
  const add = (id: AgentId) => {
    if (!s.includes(id)) s.push(id)
  }
  if (a.kind === 'new') {
    add('machu')
    add('angkor')
  }
  if (a.channels) {
    add('pisa')
    if (a.channels.includes('site')) add('angkor')
    if (a.channels.includes('shop')) add('greenwich')
    if (a.channels.length > 1) add('venice')
  }
  for (const p of a.pains ?? []) if (isAgentId(p)) add(p)
  if (step >= 6 && s.length < 2) {
    add('pisa')
    add('kyoto')
  }
  return s
}

/** Union that keeps first-seen order. */
export function union(a: readonly AgentId[], b: readonly AgentId[]): AgentId[] {
  const out = [...a]
  for (const id of b) if (!out.includes(id)) out.push(id)
  return out
}

export function mascotSrc(id: AgentId | 'petra'): string {
  return `/mascots/svg/${id}.svg`
}

/**
 * Validate a raw answer for one step. Returns the normalised value, or null
 * when it is not acceptable. Used by the browser (live actions) and the server.
 */
export function normaliseValue(key: StepKey, raw: unknown): string | string[] | null {
  if (key === 'name' || key === 'what') {
    return typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 200) : null
  }
  if (key === 'kind') return typeof raw === 'string' && (KIND_IDS as readonly string[]).includes(raw) ? raw : null
  if (key === 'mode') return typeof raw === 'string' && (MODE_IDS as readonly string[]).includes(raw) ? raw : null
  const allowed = optionsFor(key).map(([id]) => id)
  if (!Array.isArray(raw) || raw.length === 0) return null
  if (!raw.every((x) => typeof x === 'string' && allowed.includes(x))) return null
  return [...new Set(raw as string[])]
}

/** Human-readable label for an answer, built from the copy (never from model text). */
export function labelFor(key: StepKey, value: string | string[]): string {
  if (key === 'name' || key === 'what') return value as string
  const c = copy
  const list = key === 'kind' ? c.kind : key === 'mode' ? c.mode : key === 'channels' ? c.channels : c.pains
  const find = (id: string) => list.find(([x]) => x === id)?.[1] ?? id
  if (Array.isArray(value)) return value.map(find).join(LOCALE === 'ar' ? '، ' : ', ')
  return find(value)
}

/** Collect agent ids nominated under `join` or `members` anywhere in an OpenUI element tree. */
export function collectNominations(node: unknown, out: Set<string> = new Set(), depth = 0): Set<string> {
  if (!node || typeof node !== 'object' || depth > 12) return out
  if (Array.isArray(node)) {
    for (const n of node) collectNominations(n, out, depth + 1)
    return out
  }
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if ((k === 'join' || k === 'members') && Array.isArray(v)) {
      for (const id of v) if (typeof id === 'string') out.add(id)
    } else {
      collectNominations(v, out, depth + 1)
    }
  }
  return out
}
