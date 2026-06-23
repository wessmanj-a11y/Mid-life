export type StatKey = 'health' | 'relationships' | 'wealth' | 'purpose' | 'sanity' | 'energy';

export type Stats = Record<StatKey, number>;

export type Card = {
  id: string;
  title: string;
  type: 'Action' | 'Skill' | 'Chaos' | 'Heal';
  cost: number;
  damage?: number;
  effects?: Partial<Stats>;
  description: string;
  emoji: string;
  flavor: string;
};

export type Enemy = {
  id: string;
  title: string;
  resolve: number;
  attack: Partial<Stats>;
  emoji: string;
  description: string;
  boss?: boolean;
};

export type Relic = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  effects?: Partial<Stats>;
};

export type EventOption = {
  title: string;
  description: string;
  effects: Partial<Stats>;
  addCardId?: string;
  relicId?: string;
};

export type LifeEvent = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  options: EventOption[];
};

export type CharacterClass = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  startingCards: string[];
  bonusStats: Partial<Stats>;
};

export const startingStats: Stats = {
  health: 10,
  relationships: 10,
  wealth: 10,
  purpose: 10,
  sanity: 10,
  energy: 3,
};

export const actionCards: Card[] = [
  { id: 'therapy', title: 'Therapy', type: 'Heal', cost: 1, damage: 3, effects: { sanity: 2 }, emoji: '🛋️', description: 'Deal 3 resolve. Gain 2 sanity.', flavor: 'You pay someone to say “that sounds hard” and somehow it works.' },
  { id: 'dog-walk', title: 'Dog Walk', type: 'Skill', cost: 1, damage: 2, effects: { health: 1, sanity: 1 }, emoji: '🐕', description: 'Deal 2. Gain 1 health and 1 sanity.', flavor: 'The dog has no retirement plan and seems happier than you.' },
  { id: 'coffee', title: 'Coffee', type: 'Chaos', cost: 0, damage: 1, effects: { energy: 1, sanity: -1 }, emoji: '☕', description: 'Deal 1. Gain 1 energy. Lose 1 sanity.', flavor: 'A beverage and a legal personality disorder.' },
  { id: 'boundary', title: 'Boundary', type: 'Skill', cost: 1, damage: 5, effects: { relationships: 1 }, emoji: '🚧', description: 'Deal 5. Gain 1 relationship.', flavor: 'No is a complete sentence. A terrifying sentence, but complete.' },
  { id: 'spreadsheet', title: 'Spreadsheet', type: 'Action', cost: 1, damage: 4, effects: { wealth: 1 }, emoji: '📊', description: 'Deal 4. Gain 1 wealth.', flavor: 'Conditional formatting is cheaper than control issues.' },
  { id: 'gym-attempt', title: 'Gym Attempt', type: 'Action', cost: 2, damage: 7, effects: { health: 2, sanity: -1 }, emoji: '🏋️', description: 'Deal 7. Gain 2 health. Lose 1 sanity.', flavor: 'You pulled something getting dressed.' },
  { id: 'call-friend', title: 'Call Friend', type: 'Skill', cost: 1, damage: 3, effects: { relationships: 2 }, emoji: '📱', description: 'Deal 3. Gain 2 relationships.', flavor: 'A ten-minute call becomes group therapy with worse audio.' },
  { id: 'deep-breath', title: 'Deep Breath', type: 'Skill', cost: 0, damage: 2, effects: { sanity: 1 }, emoji: '🌬️', description: 'Deal 2. Gain 1 sanity.', flavor: 'Inhale. Exhale. Pretend the calendar is not real.' },
  { id: 'questionable-purchase', title: 'Questionable Purchase', type: 'Chaos', cost: 1, damage: 6, effects: { wealth: -2, purpose: 1 }, emoji: '🛒', description: 'Deal 6. Lose 2 wealth. Gain 1 purpose.', flavor: 'It is not a phase. It is a hobby with tracking numbers.' },
  { id: 'take-pto', title: 'Take PTO', type: 'Heal', cost: 2, damage: 4, effects: { health: 2, sanity: 2, wealth: -1 }, emoji: '🏖️', description: 'Deal 4. Gain health and sanity. Lose 1 wealth.', flavor: 'Your inbox becomes a crime scene.' },
  { id: 'emergency-plan', title: 'Emergency Plan', type: 'Action', cost: 1, damage: 5, effects: { purpose: 1 }, emoji: '🛰️', description: 'Deal 5. Gain 1 purpose.', flavor: 'You have a plan for the plan becoming a different plan.' },
  { id: 'air-fryer-card', title: 'Air Fryer Meal', type: 'Heal', cost: 1, damage: 2, effects: { health: 2, wealth: 1 }, emoji: '🍗', description: 'Deal 2. Gain 2 health and 1 wealth.', flavor: 'The countertop wizard saves dinner again.' },
  { id: 'dad-joke', title: 'Dad Lore', type: 'Skill', cost: 0, damage: 3, effects: { relationships: -1, sanity: 1 }, emoji: '🧢', description: 'Deal 3. Lose 1 relationship. Gain 1 sanity.', flavor: 'You said “Hi Hungry, I’m Dad” to an adult coworker.' },
  { id: 'solo-drive', title: 'Solo Drive', type: 'Action', cost: 1, damage: 4, effects: { purpose: 2 }, emoji: '🚙', description: 'Deal 4. Gain 2 purpose.', flavor: 'No destination. Just vibes and a podcast about ancient Rome.' },
];

export const enemies: Enemy[] = [
  { id: 'burnout', title: 'Burnout', resolve: 18, attack: { health: -2, purpose: -1 }, emoji: '🔥', description: 'You have not taken a real day off since flip phones.' },
  { id: 'regret', title: 'Regret', resolve: 16, attack: { sanity: -2 }, emoji: '👻', description: 'A ghost made of old texts and better comebacks.' },
  { id: 'comparison', title: 'Comparison', resolve: 17, attack: { wealth: -1, sanity: -1 }, emoji: '🕶️', description: 'Their highlight reel brought ring lights.' },
  { id: 'nostalgia', title: 'Nostalgia', resolve: 15, attack: { purpose: -2 }, emoji: '📼', description: 'Everything was better except the jeans.' },
  { id: 'perfectionism', title: 'Perfectionism', resolve: 20, attack: { sanity: -1, relationships: -1 }, emoji: '📋', description: 'A clipboard monster grading your breathing.' },
  { id: 'hoa', title: 'HOA President', resolve: 18, attack: { wealth: -2 }, emoji: '🏘️', description: 'Your mailbox is insufficiently beige.' },
  { id: 'joint-pain', title: 'Mysterious Joint Pain', resolve: 14, attack: { health: -2 }, emoji: '🦴', description: 'No origin story. Just lore.' },
  { id: 'doomscrolling', title: 'Doomscrolling', resolve: 16, attack: { sanity: -2, energy: -1 }, emoji: '📵', description: 'You checked one notification and learned civilization ended twice.' },
  { id: 'cfo', title: 'The CFO', resolve: 22, attack: { wealth: -1, purpose: -1, sanity: -1 }, emoji: '💼', description: 'Wants innovation, but cheaper and yesterday.' },
  { id: 'overthinking', title: '3AM Overthinking', resolve: 19, attack: { sanity: -2, health: -1 }, emoji: '🛏️', description: 'Why did you say that thing in 2012?' },
];

export const bosses: Record<number, Enemy> = {
  41: { id: 'group-chat', title: 'The Group Chat', resolve: 24, attack: { sanity: -2, relationships: -1 }, emoji: '💬', description: 'Seventeen messages and nobody answered the actual question.', boss: true },
  42: { id: 'car-repair-boss', title: 'Unexpected Car Repair', resolve: 26, attack: { wealth: -3 }, emoji: '🔧', description: 'The estimate has its own villain arc.', boss: true },
  43: { id: 'career-reorg', title: 'Career Reorg', resolve: 28, attack: { purpose: -2, sanity: -1 }, emoji: '🧩', description: 'Your role is the same except everything is different.', boss: true },
  44: { id: 'doctor-age', title: '“At Your Age”', resolve: 29, attack: { health: -2, sanity: -1 }, emoji: '🩺', description: 'The doctor said the forbidden phrase.', boss: true },
  45: { id: 'mirror', title: 'The Mirror', resolve: 30, attack: { sanity: -2, purpose: -1 }, emoji: '🪞', description: 'It shows your father, your future, and a weird eyebrow.', boss: true },
  46: { id: 'teen-advice', title: 'Teenager Needs Advice', resolve: 31, attack: { relationships: -2, sanity: -1 }, emoji: '🎓', description: 'This conversation will be remembered forever.', boss: true },
  47: { id: 'budget-review', title: 'Budget Review', resolve: 32, attack: { wealth: -2, purpose: -1 }, emoji: '📉', description: 'Please explain why resilience costs money.', boss: true },
  48: { id: 'regret-ghost', title: 'Regret Ghost', resolve: 34, attack: { sanity: -3 }, emoji: '👻', description: 'It brought receipts and dramatic lighting.', boss: true },
  49: { id: 'existential-crisis', title: 'Existential Crisis', resolve: 36, attack: { sanity: -2, purpose: -2 }, emoji: '🌌', description: 'It asks if any of this matters while eating your chips.', boss: true },
  50: { id: 'acceptance', title: 'Acceptance', resolve: 40, attack: { sanity: -1, purpose: -1, health: -1 }, emoji: '🧙', description: 'It does not attack hard. It asks questions.', boss: true },
};

export const relics: Relic[] = [
  { id: 'wisdom', title: 'Wisdom', emoji: '🦉', description: 'At the start of each year, gain 1 sanity.', effects: { sanity: 1 } },
  { id: 'perspective', title: 'Perspective', emoji: '🌍', description: 'Boss attacks hurt 1 less sanity.' },
  { id: 'resilience', title: 'Resilience', emoji: '🦆', description: 'Start each combat with +1 energy.', effects: { energy: 1 } },
  { id: 'connection', title: 'Connection', emoji: '🤝', description: 'After every victory, gain 1 relationship.', effects: { relationships: 1 } },
  { id: 'purpose-relic', title: 'Purpose', emoji: '🗼', description: 'At the end of the game, +4 purpose.', effects: { purpose: 4 } },
  { id: 'dog', title: 'Dog', emoji: '🐶', description: 'First health loss each combat is reduced by 1.' },
  { id: 'air-fryer', title: 'Air Fryer', emoji: '🍟', description: 'Rest stops give +1 extra health.' },
  { id: 'costco', title: 'Costco Membership', emoji: '🛒', description: 'Life events that cost wealth cost 1 less wealth.' },
  { id: 'weird-hobby', title: 'Weird Hobby', emoji: '🎸', description: 'Start each year with +1 purpose.', effects: { purpose: 1 } },
  { id: 'shoes', title: 'Comfortable Shoes', emoji: '👟', description: 'Gain +2 max-ish health now.', effects: { health: 2 } },
  { id: 'dad-lore', title: 'Dad Lore', emoji: '🧢', description: 'Coffee no longer feels embarrassing. Still unhealthy.' },
  { id: 'emergency-fund', title: 'Emergency Fund', emoji: '💵', description: 'Gain 3 wealth now.', effects: { wealth: 3 } },
  { id: 'therapy-breakthrough', title: 'Therapy Breakthrough', emoji: '💡', description: 'Gain 3 sanity and 1 purpose now.', effects: { sanity: 3, purpose: 1 } },
];

export const lifeEvents: LifeEvent[] = [
  { id: 'promotion', title: 'Promotion!', emoji: '🎉', description: 'More money. More stress. More spreadsheets.', options: [
    { title: 'Accept with dead eyes', description: '+3 wealth, -2 sanity', effects: { wealth: 3, sanity: -2 } },
    { title: 'Negotiate like a grownup', description: '+2 wealth, +1 purpose', effects: { wealth: 2, purpose: 1 } },
    { title: 'Decline and feel powerful', description: '+2 sanity, -1 wealth', effects: { sanity: 2, wealth: -1 } },
  ]},
  { id: 'heartbreak', title: 'Daughter’s First Heartbreak', emoji: '💔', description: 'Cue the awkward dad vibes.', options: [
    { title: 'Listen, do not solve', description: '+3 relationships, +1 purpose', effects: { relationships: 3, purpose: 1 } },
    { title: 'Threaten a teenager', description: '-2 relationships, +1 sanity somehow', effects: { relationships: -2, sanity: 1 } },
    { title: 'Order pizza', description: '+2 relationships, -1 wealth', effects: { relationships: 2, wealth: -1 } },
  ]},
  { id: 'solo-trip', title: 'Solo Trip', emoji: '🏔️', description: 'You remembered who you are.', options: [
    { title: 'Take the scenic route', description: '+3 purpose, +1 sanity, -2 wealth', effects: { purpose: 3, sanity: 1, wealth: -2 } },
    { title: 'Post zero photos', description: '+2 sanity', effects: { sanity: 2 } },
    { title: 'Buy a hat with a story', description: '+1 purpose, -1 wealth, gain Solo Drive', effects: { purpose: 1, wealth: -1 }, addCardId: 'solo-drive' },
  ]},
  { id: 'new-hobby', title: 'New Hobby', emoji: '🎸', description: 'Expensive. Time-consuming. Totally worth it.', options: [
    { title: 'Go all in immediately', description: '+3 purpose, -3 wealth', effects: { purpose: 3, wealth: -3 }, relicId: 'weird-hobby' },
    { title: 'Be normal for once', description: '+1 purpose', effects: { purpose: 1 } },
    { title: 'Watch 14 hours of reviews', description: '+1 sanity, -1 energy', effects: { sanity: 1, energy: -1 } },
  ]},
  { id: 'doctor', title: 'Annual Physical', emoji: '🩺', description: 'Your bloodwork has opinions.', options: [
    { title: 'Actually change something', description: '+3 health, +1 sanity', effects: { health: 3, sanity: 1 }, addCardId: 'gym-attempt' },
    { title: 'Ignore portal message', description: '-2 health, +1 sanity', effects: { health: -2, sanity: 1 } },
    { title: 'Buy comfortable shoes', description: '+2 health, -1 wealth', effects: { health: 2, wealth: -1 }, relicId: 'shoes' },
  ]},
  { id: 'bird-feeder', title: 'Bird Feeder Era', emoji: '🐦', description: 'You are one app away from identifying sparrows.', options: [
    { title: 'Become bird guy', description: '+2 purpose, +1 sanity', effects: { purpose: 2, sanity: 1 } },
    { title: 'Tell everyone', description: '+1 relationships, -1 sanity', effects: { relationships: 1, sanity: -1 } },
    { title: 'Name the cardinal Steve', description: '+2 sanity', effects: { sanity: 2 } },
  ]},
];

export const classes: CharacterClass[] = [
  { id: 'corporate', title: 'Corporate Survivor', emoji: '💼', description: 'Converts sanity into money. Has opinions about slide decks.', startingCards: ['spreadsheet', 'coffee', 'boundary', 'emergency-plan'], bonusStats: { wealth: 2, sanity: -1 } },
  { id: 'adventurer', title: 'Divorced Adventurer', emoji: '🧭', description: 'Every loss becomes lore. Questionable tattoo pending.', startingCards: ['therapy', 'dog-walk', 'call-friend', 'solo-drive'], bonusStats: { purpose: 2, relationships: -1 } },
  { id: 'dreamer', title: 'Midlife Dreamer', emoji: '🌌', description: 'Purpose cards hit harder. Budgeting hits back.', startingCards: ['questionable-purchase', 'deep-breath', 'take-pto'], bonusStats: { purpose: 3, wealth: -2 } },
  { id: 'disaster', title: 'Disaster Manager', emoji: '🛰️', description: 'Thrives during chaos. Has a backup plan for the backup plan.', startingCards: ['emergency-plan', 'spreadsheet', 'coffee', 'boundary'], bonusStats: { energy: 1, purpose: 1 } },
];
