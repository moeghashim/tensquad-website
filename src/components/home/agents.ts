// Static mascot data for the round table. Colors and slugs are identical in both locales;
// names, roles and job copy come from copy.ts.

export interface AgentStyle {
  slug: string
  light: string
  base: string
  deep: string
  ask?: boolean
}

export const MASTER: AgentStyle = { slug: 'petra', light: '#FBD8D0', base: '#EBA196', deep: '#C9746A' }

// The twelve workers, in round-table order.
export const WORKERS: AgentStyle[] = [
  { slug: 'machu', light: '#D3F0DF', base: '#93D2B1', deep: '#5EA885' },
  { slug: 'alexandria', light: '#D9DBFF', base: '#8E95F2', deep: '#4F56C4' },
  { slug: 'angkor', light: '#FFE7AE', base: '#F5C25C', deep: '#D6952C' },
  { slug: 'venice', light: '#FFD6F0', base: '#F28CCB', deep: '#C9529C' },
  { slug: 'rio', light: '#E6DBFF', base: '#B194F2', deep: '#7E5ED0', ask: true },
  { slug: 'giza', light: '#FFE1C4', base: '#F4A866', deep: '#D27A34' },
  { slug: 'pisa', light: '#DCE8FF', base: '#97B7F5', deep: '#5F86D6' },
  { slug: 'kyoto', light: '#FFD3C7', base: '#F08B70', deep: '#CC5A40' },
  { slug: 'zurich', light: '#EEF1F6', base: '#B6C0CF', deep: '#7E8BA0' },
  { slug: 'delphi', light: '#E8F2C9', base: '#B5CB72', deep: '#7F9840' },
  { slug: 'greenwich', light: '#F6FBC4', base: '#DDEB5C', deep: '#A8B824' },
  { slug: 'sydney', light: '#D4F1FB', base: '#86CDE8', deep: '#4C9EC2' },
]

// Master first, then workers: index 0..12, matching the focus index (fs - 1).
export const ALL: AgentStyle[] = [MASTER, ...WORKERS]

export interface Position {
  x: number
  y: number
}

// Worker i sits on a circle of radius 44 around (50, 50), starting at -75deg, 30deg apart.
export const WORKER_POS: Position[] = WORKERS.map((_, i) => {
  const ang = ((-75 + 30 * i) * Math.PI) / 180
  return { x: 50 + 44 * Math.cos(ang), y: 50 + 44 * Math.sin(ang) }
})

export const mascot = (slug: string) => `/mascots/svg/${slug}.svg`

// Squad tile tilt: [-3, 2, -2, 3, -1][index % 5] in the design.
export const TILTS = [-3, 2, -2, 3, -1]
