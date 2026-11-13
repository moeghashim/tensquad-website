// Shared, environment-neutral data for the Petra interview.
// Ported from design/Tensquads Interview.dc.html (copy, agents, squad rules).
// Safe to import on the server (no DOM, no React).

export type Locale = 'en' | 'ar'

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
  dir: 'rtl' | 'ltr'
  petra: string
  master: string
  exit: string
  send: string
  next: string
  start: string
  again: string
  fine: string
  homeHref: string
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

const EN: Copy = {
  dir: 'ltr',
  petra: 'Petra',
  master: 'Master',
  exit: 'Exit',
  send: 'Send',
  next: 'Continue',
  start: 'Start free for 14 days',
  again: 'Start over',
  fine: 'No credit card · Cancel from the dashboard',
  homeHref: '/',
  ph: ['Your name', '', 'e.g. Handmade ceramics on Etsy'],
  kind: [
    ['new', 'New business'],
    ['existing', 'Existing business'],
  ],
  what: ['Date-seed coffee, caffeine-free', 'Handmade ceramics on Etsy', 'A print-on-demand streetwear brand'],
  channels: [
    ['site', 'My own website'],
    ['shopify', 'Shopify'],
    ['etsy', 'Etsy'],
    ['amazon', 'Amazon'],
    ['insta', 'Instagram'],
    ['shop', 'A physical shop'],
  ],
  pains: [
    ['pisa', 'Packing and shipping orders'],
    ['kyoto', 'Answering customers'],
    ['rio', 'Ads and social'],
    ['zurich', 'Bookkeeping'],
    ['giza', 'Stock and suppliers'],
    ['alexandria', 'Product listings'],
    ['delphi', 'Knowing the numbers'],
    ['sydney', 'Hiring'],
    ['machu', 'Watching competitors'],
  ],
  mode: [
    ['ask', 'Ask me first on everything'],
    ['some', 'Small things alone, ask for the rest'],
    ['auto', 'Run it and tell me after'],
  ],
  modeLine: {
    ask: 'The squad will ask before every action.',
    some: 'The squad will handle small things alone and ask you for the rest.',
    auto: 'The squad will run the work and tell you after.',
  },
  ag: {
    petra: ['Petra', 'Master', 'Takes every request and hands it to the right squadmate'],
    machu: ['Machu', 'Market researcher', 'Studies competitors and their prices'],
    alexandria: ['Alexandria', 'Catalog', 'Keeps products and prices correct'],
    angkor: ['Angkor', 'Website builder', 'Builds your pages one section at a time'],
    venice: ['Venice', 'Channels', 'Lists your products on every sales channel'],
    rio: ['Rio', 'Marketing', 'Runs ads, social and email'],
    giza: ['Giza', 'Inventory', 'Counts stock and talks to suppliers'],
    pisa: ['Pisa', 'Orders', 'Takes orders, ships them and handles returns'],
    kyoto: ['Kyoto', 'Support', 'Answers the customer inbox'],
    zurich: ['Zurich', 'Finance', 'Watches payouts, costs and profit'],
    delphi: ['Delphi', 'Analytics', 'Writes the reports and the weekly digest'],
    greenwich: ['Greenwich', 'Places', 'Keeps the business correct on every map'],
    sydney: ['Sydney', 'People', 'Hires and runs onboarding'],
  },
  q: [
    () => "Hi, I'm Petra. I put squads together. First, what should I call you?",
    (a) => `Good to meet you, ${a.name}. Is this a new business, or one that is already running?`,
    (a) => (a.kind === 'new' ? 'What do you want to sell, and to whom?' : 'What do you sell, and to whom?'),
    (a) =>
      a.kind === 'new'
        ? 'Where do you plan to sell it? Pick every place that applies.'
        : 'Where do you sell it? Pick every place that applies.',
    () => 'What takes up most of your week? Pick as many as you like.',
    () => 'Last one. How much should the squad do without asking you first?',
    (a) => `That is all I need, ${a.name}. Here is your squad.`,
  ],
  of: (a, b) => a + ' / ' + b,
  picked: (n) => (n ? n + ' picked' : 'Pick at least one'),
  joined: (l) => (l.length > 1 ? l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1] : l[0]) + ' joined the table. ',
  squad: (n) =>
    n
      ? 'Petra and ' + n + (n === 1 ? ' squadmate' : ' squadmates') + ' at the table'
      : 'Petra is waiting for your squad',
}

const AR: Copy = {
  dir: 'rtl',
  petra: 'بترا',
  master: 'القائدة',
  exit: 'خروج',
  send: 'إرسال',
  next: 'متابعة',
  start: 'ابدأ مجانًا لمدة 14 يومًا',
  again: 'ابدأ من جديد',
  fine: 'بدون بطاقة ائتمان · الإلغاء من لوحة التحكم',
  homeHref: '/ar',
  ph: ['اسمك', '', 'مثال: خزف يدوي الصنع على Etsy'],
  kind: [
    ['new', 'عمل جديد'],
    ['existing', 'عمل قائم'],
  ],
  what: ['قهوة نوى التمر، خالية من الكافيين', 'خزف يدوي الصنع على Etsy', 'علامة ملابس بالطباعة عند الطلب'],
  channels: [
    ['site', 'موقعي الخاص'],
    ['shopify', 'Shopify'],
    ['etsy', 'Etsy'],
    ['amazon', 'Amazon'],
    ['insta', 'Instagram'],
    ['shop', 'متجر فعلي'],
  ],
  pains: [
    ['pisa', 'تعبئة وشحن الطلبات'],
    ['kyoto', 'الرد على العملاء'],
    ['rio', 'الإعلانات ووسائل التواصل'],
    ['zurich', 'المحاسبة'],
    ['giza', 'المخزون والمورّدون'],
    ['alexandria', 'قوائم المنتجات'],
    ['delphi', 'معرفة الأرقام'],
    ['sydney', 'التوظيف'],
    ['machu', 'متابعة المنافسين'],
  ],
  mode: [
    ['ask', 'اسألني أولًا عن كل شيء'],
    ['some', 'الأمور الصغيرة وحدهم، والباقي بسؤالي'],
    ['auto', 'نفّذوا ثم أخبروني'],
  ],
  modeLine: {
    ask: 'سيسألك الفريق قبل كل إجراء.',
    some: 'سيتولى الفريق الأمور الصغيرة وحده ويسألك عن الباقي.',
    auto: 'سينفّذ الفريق العمل ويخبرك بعد ذلك.',
  },
  ag: {
    petra: ['بترا', 'القائدة', 'تستلم كل طلب وتوزّعه على الزميل المناسب'],
    machu: ['ماتشو', 'أبحاث السوق', 'يدرس المنافسين وأسعارهم'],
    alexandria: ['الإسكندرية', 'الكتالوج', 'تحافظ على صحة المنتجات والأسعار'],
    angkor: ['أنغكور', 'بناء المواقع', 'يبني صفحاتك قسمًا بعد قسم'],
    venice: ['البندقية', 'القنوات', 'تدرج منتجاتك في كل قناة بيع'],
    rio: ['ريو', 'التسويق', 'يدير الإعلانات ووسائل التواصل والبريد'],
    giza: ['الجيزة', 'المخزون', 'تعدّ المخزون وتتواصل مع المورّدين'],
    pisa: ['بيزا', 'الطلبات', 'يستلم الطلبات ويشحنها ويتولى المرتجعات'],
    kyoto: ['كيوتو', 'الدعم', 'تردّ على بريد العملاء'],
    zurich: ['زيورخ', 'المالية', 'يراقب المدفوعات والتكاليف والأرباح'],
    delphi: ['دلفي', 'التحليلات', 'تكتب التقارير والملخص الأسبوعي'],
    greenwich: ['غرينتش', 'الأماكن', 'يُبقي عملك صحيحًا على الخرائط'],
    sydney: ['سيدني', 'الموظفون', 'توظّف وتدير التهيئة'],
  },
  q: [
    () => 'مرحبًا، أنا بترا. أنا من يجمع الفِرق. أولًا، بماذا أناديك؟',
    (a) => 'سعدت بلقائك يا ' + a.name + '. هل عملك جديد أم قائم بالفعل؟',
    (a) => (a.kind === 'new' ? 'ماذا تريد أن تبيع، ولمن؟' : 'ماذا تبيع، ولمن؟'),
    (a) => (a.kind === 'new' ? 'أين تنوي البيع؟ اختر كل ما ينطبق.' : 'أين تبيع؟ اختر كل ما ينطبق.'),
    () => 'ما الذي يأخذ معظم أسبوعك؟ اختر ما تشاء.',
    () => 'السؤال الأخير. كم يفعل الفريق دون أن يسألك أولًا؟',
    (a) => 'هذا كل ما أحتاجه يا ' + a.name + '. هذا فريقك.',
  ],
  of: (a, b) => a + ' / ' + b,
  picked: (n) => (n ? 'اخترت ' + n : 'اختر واحدًا على الأقل'),
  joined: (l) => 'انضم إلى الطاولة: ' + l.join('، ') + '. ',
  squad: (n) => (n ? 'بترا و' + n + ' من الزملاء حول الطاولة' : 'بترا بانتظار فريقك'),
}

export function copyFor(locale: Locale): Copy {
  return locale === 'ar' ? AR : EN
}

/** Option lists per step, used for validation and for chip labels. */
export function optionsFor(locale: Locale, key: StepKey): Pair[] {
  const c = copyFor(locale)
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
export function normaliseValue(locale: Locale, key: StepKey, raw: unknown): string | string[] | null {
  if (key === 'name' || key === 'what') {
    return typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 200) : null
  }
  if (key === 'kind') return typeof raw === 'string' && (KIND_IDS as readonly string[]).includes(raw) ? raw : null
  if (key === 'mode') return typeof raw === 'string' && (MODE_IDS as readonly string[]).includes(raw) ? raw : null
  const allowed = optionsFor(locale, key).map(([id]) => id)
  if (!Array.isArray(raw) || raw.length === 0) return null
  if (!raw.every((x) => typeof x === 'string' && allowed.includes(x))) return null
  return [...new Set(raw as string[])]
}

/** Human-readable label for an answer, built from the copy (never from model text). */
export function labelFor(locale: Locale, key: StepKey, value: string | string[]): string {
  if (key === 'name' || key === 'what') return value as string
  const c = copyFor(locale)
  const list = key === 'kind' ? c.kind : key === 'mode' ? c.mode : key === 'channels' ? c.channels : c.pains
  const find = (id: string) => list.find(([x]) => x === id)?.[1] ?? id
  if (Array.isArray(value)) return value.map(find).join(locale === 'ar' ? '، ' : ', ')
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
