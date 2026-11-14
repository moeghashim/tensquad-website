// English interview copy. Only the build for LOCALE 'en' ships this module.

import type { Copy } from './data'

export const EN: Copy = {
  petra: 'Petra',
  master: 'Master',
  exit: 'Exit',
  send: 'Send',
  next: 'Continue',
  start: 'Start free for 14 days',
  again: 'Start over',
  fine: 'No credit card · Cancel from the dashboard',
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
