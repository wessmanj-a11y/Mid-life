import { useState } from 'react';
import {
  actionCards,
  bosses,
  classes,
  enemies,
  lifeEvents,
  relics,
  startingStats,
  type Card,
  type CharacterClass,
  type Enemy,
  type LifeEvent,
  type Relic,
  type StatKey,
  type Stats,
} from './gameData';

type Screen = 'start' | 'class' | 'map' | 'combat' | 'event' | 'reward' | 'gameover';
type Reward = { kind: 'card'; card: Card } | { kind: 'relic'; relic: Relic };

type GameState = {
  screen: Screen;
  character?: CharacterClass;
  age: number;
  encounter: number;
  stats: Stats;
  deck: Card[];
  drawPile: Card[];
  discardPile: Card[];
  hand: Card[];
  relics: Relic[];
  enemy?: Enemy;
  enemyResolve: number;
  event?: LifeEvent;
  rewards: Reward[];
  message: string;
  ending?: string;
  gameOverReason?: string;
};

const statLabels: Record<StatKey, string> = {
  health: 'Health',
  relationships: 'Relationships',
  wealth: 'Wealth',
  purpose: 'Purpose',
  sanity: 'Sanity',
  energy: 'Energy',
};

const statIcons: Record<StatKey, string> = {
  health: '❤️',
  relationships: '🤝',
  wealth: '💵',
  purpose: '🧭',
  sanity: '🧠',
  energy: '⚡',
};

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function sample<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count);
}

function clampStats(stats: Stats): Stats {
  return {
    health: Math.max(0, Math.min(25, stats.health)),
    relationships: Math.max(0, Math.min(25, stats.relationships)),
    wealth: Math.max(0, Math.min(25, stats.wealth)),
    purpose: Math.max(0, Math.min(25, stats.purpose)),
    sanity: Math.max(0, Math.min(25, stats.sanity)),
    energy: Math.max(0, Math.min(10, stats.energy)),
  };
}

function applyEffects(stats: Stats, effects: Partial<Stats> = {}, ownedRelics: Relic[] = []): Stats {
  const adjusted = { ...effects };

  if (ownedRelics.some((r) => r.id === 'costco') && (adjusted.wealth ?? 0) < 0) {
    adjusted.wealth = (adjusted.wealth ?? 0) + 1;
  }

  return clampStats({
    health: stats.health + (adjusted.health ?? 0),
    relationships: stats.relationships + (adjusted.relationships ?? 0),
    wealth: stats.wealth + (adjusted.wealth ?? 0),
    purpose: stats.purpose + (adjusted.purpose ?? 0),
    sanity: stats.sanity + (adjusted.sanity ?? 0),
    energy: stats.energy + (adjusted.energy ?? 0),
  });
}

function cardById(id: string): Card | undefined {
  return actionCards.find((card) => card.id === id);
}

function relicById(id: string): Relic | undefined {
  return relics.find((relic) => relic.id === id);
}

function buildStartingDeck(character: CharacterClass): Card[] {
  const defaultCards = ['therapy', 'dog-walk', 'coffee', 'boundary', 'spreadsheet', 'deep-breath'];
  return [...defaultCards, ...character.startingCards].map(cardById).filter(Boolean) as Card[];
}

function drawCards(drawPile: Card[], discardPile: Card[], count = 5) {
  let draw = [...drawPile];
  let discard = [...discardPile];
  const hand: Card[] = [];

  while (hand.length < count) {
    if (draw.length === 0) {
      if (discard.length === 0) break;
      draw = shuffle(discard);
      discard = [];
    }

    const next = draw.pop();
    if (next) hand.push(next);
  }

  return { drawPile: draw, discardPile: discard, hand };
}

function getBossForAge(age: number): Enemy {
  return bosses[Math.min(age + 1, 50)] ?? bosses[50];
}

function getEnding(stats: Stats, ownedRelics: Relic[]): string {
  const purpose = stats.purpose + (ownedRelics.some((r) => r.id === 'purpose-relic') ? 4 : 0);
  const total = stats.health + stats.relationships + stats.wealth + purpose + stats.sanity;

  if (stats.health >= 14 && stats.relationships >= 14 && purpose >= 14) return 'Thriving';
  if (stats.relationships >= 17) return 'Family First';
  if (stats.wealth >= 18 && stats.sanity <= 8) return 'Wealthy But Tired';
  if (stats.wealth >= 18 && purpose >= 12) return 'Corporate Goblin';
  if (purpose >= 18 && stats.wealth <= 9) return 'Enlightened Weirdo';
  if (stats.health <= 7 || stats.sanity <= 7) return 'Survivor';
  if (total >= 62) return 'Mostly Held Together';
  return 'Beautiful Disaster';
}

function makeRewards(ownedRelics: Relic[]): Reward[] {
  const cardRewards = sample(actionCards, 2).map((card) => ({ kind: 'card', card }) as Reward);
  const availableRelics = relics.filter((relic) => !ownedRelics.some((owned) => owned.id === relic.id));
  const relicReward = sample(availableRelics, 1).map((relic) => ({ kind: 'relic', relic }) as Reward);
  return shuffle([...cardRewards, ...relicReward]);
}

const initialState: GameState = {
  screen: 'start',
  age: 40,
  encounter: 0,
  stats: startingStats,
  deck: [],
  drawPile: [],
  discardPile: [],
  hand: [],
  relics: [],
  enemyResolve: 0,
  rewards: [],
  message: 'Welcome to your forties. The tutorial is over.',
};

function StatPanel({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-6">
      {(Object.keys(stats) as StatKey[]).map((key) => (
        <div key={key} className="rounded-2xl border border-white/10 bg-black/40 p-3 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{statIcons[key]} {statLabels[key]}</div>
          <div className="text-3xl font-black text-white">{stats[key]}</div>
        </div>
      ))}
    </div>
  );
}

function GameCard({ card, disabled, onClick }: { card: Card; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-3xl border border-white/15 bg-slate-950/80 p-4 text-left shadow-2xl transition duration-200 ${
        disabled ? 'opacity-40 grayscale' : 'hover:-translate-y-2 hover:border-pink-300 hover:shadow-pink-500/20 active:scale-95'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/30 to-cyan-500/20 text-5xl">{card.emoji}</div>
        <div className="rounded-full bg-yellow-300 px-3 py-1 text-sm font-black text-black">{card.cost} ⚡</div>
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight text-white">{card.title}</h3>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-pink-300">{card.type}</p>
      <p className="min-h-14 text-sm text-slate-100">{card.description}</p>
      <p className="mt-3 border-t border-white/10 pt-3 text-xs italic text-slate-400">{card.flavor}</p>
    </button>
  );
}

function RelicCard({ relic, onClick }: { relic: Relic; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick as never} className="w-full rounded-3xl border border-amber-300/20 bg-amber-950/40 p-4 text-left shadow-xl transition hover:-translate-y-1 hover:border-amber-200">
      <div className="text-5xl">{relic.emoji}</div>
      <h3 className="text-2xl font-black uppercase text-amber-100">{relic.title}</h3>
      <p className="text-sm text-amber-50/80">{relic.description}</p>
    </Tag>
  );
}

export default function App() {
  const [game, setGame] = useState<GameState>(initialState);

  const totalDeck = game.deck.length;

  function reset() {
    setGame(initialState);
  }

  function withLossCheck(next: GameState): GameState {
    if (next.stats.health <= 0) {
      return { ...next, screen: 'gameover', gameOverReason: 'Your Health hit 0. Your knees filed a formal complaint.' };
    }
    if (next.stats.sanity <= 0) {
      return { ...next, screen: 'gameover', gameOverReason: 'Your Sanity hit 0. The group chat won.' };
    }
    return next;
  }

  function chooseClass(character: CharacterClass) {
    const deck = shuffle(buildStartingDeck(character));
    const stats = applyEffects(startingStats, character.bonusStats);
    setGame({
      ...initialState,
      screen: 'map',
      character,
      stats,
      deck,
      drawPile: deck,
      message: `${character.title} selected. You feel ready, which is adorable.`,
    });
  }

  function startCombat(enemy: Enemy, nextEncounter: number) {
    const energyBonus = game.relics.some((relic) => relic.id === 'resilience') ? 1 : 0;
    const drawPile = shuffle(game.deck);
    const drawn = drawCards(drawPile, []);
    setGame({
      ...game,
      ...drawn,
      screen: 'combat',
      encounter: nextEncounter,
      enemy,
      enemyResolve: enemy.resolve,
      stats: { ...game.stats, energy: 3 + energyBonus },
      message: enemy.boss ? 'Boss fight. Try not to become a LinkedIn post.' : 'An enemy appears wearing your insecurities as pants.',
    });
  }

  function beginEncounter() {
    const nextEncounter = game.encounter + 1;
    const isBoss = nextEncounter === 4;

    if (isBoss) {
      startCombat(getBossForAge(game.age), nextEncounter);
      return;
    }

    if (Math.random() < 0.38) {
      setGame({
        ...game,
        screen: 'event',
        encounter: nextEncounter,
        event: sample(lifeEvents, 1)[0],
        message: 'Life refuses to stay in its lane.',
      });
      return;
    }

    startCombat(sample(enemies, 1)[0], nextEncounter);
  }

  function finishYearOrReturn(next: GameState): GameState {
    if (next.encounter >= 4) {
      if (next.age >= 49) {
        return {
          ...next,
          screen: 'gameover',
          ending: getEnding(next.stats, next.relics),
          gameOverReason: 'You reached age 50. Not perfect. Not clean. But yours.',
        };
      }

      const yearRelicStats = next.relics.reduce<Partial<Stats>>((effects, relic) => {
        if (relic.id === 'wisdom') effects.sanity = (effects.sanity ?? 0) + 1;
        if (relic.id === 'weird-hobby') effects.purpose = (effects.purpose ?? 0) + 1;
        return effects;
      }, {});

      return {
        ...next,
        screen: 'map',
        age: next.age + 1,
        encounter: 0,
        stats: applyEffects(next.stats, yearRelicStats),
        message: `You survived another year. Age ${next.age + 1} unlocked. Gross but impressive.`,
      };
    }

    return { ...next, screen: 'map', message: 'Encounter survived. Your reward is another obligation.' };
  }

  function winCombat(current: GameState): GameState {
    const stats = current.relics.some((relic) => relic.id === 'connection')
      ? applyEffects(current.stats, { relationships: 1 })
      : current.stats;

    return {
      ...current,
      screen: 'reward',
      stats,
      rewards: makeRewards(current.relics),
      message: `${current.enemy?.title ?? 'Enemy'} defeated. Choose your coping mechanism.`,
    };
  }

  function playCard(card: Card, index: number) {
    if (!game.enemy || game.stats.energy < card.cost) return;

    const hand = game.hand.filter((_, handIndex) => handIndex !== index);
    const discardPile = [...game.discardPile, card];
    const statsAfterCost = { ...game.stats, energy: game.stats.energy - card.cost };
    const stats = applyEffects(statsAfterCost, card.effects, game.relics);
    const enemyResolve = Math.max(0, game.enemyResolve - (card.damage ?? 0));

    let next: GameState = {
      ...game,
      hand,
      discardPile,
      stats,
      enemyResolve,
      message: `${card.title} dealt ${card.damage ?? 0} resolve damage.`,
    };

    if (enemyResolve <= 0) next = winCombat(next);
    setGame(withLossCheck(next));
  }

  function endTurn() {
    if (!game.enemy) return;

    let attack = { ...game.enemy.attack };
    if (game.enemy.boss && game.relics.some((relic) => relic.id === 'perspective') && (attack.sanity ?? 0) < 0) {
      attack.sanity = (attack.sanity ?? 0) + 1;
    }
    if (game.relics.some((relic) => relic.id === 'dog') && (attack.health ?? 0) < 0) {
      attack.health = (attack.health ?? 0) + 1;
    }

    const stats = applyEffects({ ...game.stats, energy: 3 + (game.relics.some((r) => r.id === 'resilience') ? 1 : 0) }, attack, game.relics);
    const discardPile = [...game.discardPile, ...game.hand];
    const drawn = drawCards(game.drawPile, discardPile);

    setGame(withLossCheck({
      ...game,
      ...drawn,
      stats,
      message: `${game.enemy.title} attacked: ${Object.entries(attack).map(([key, value]) => `${statLabels[key as StatKey]} ${value}`).join(', ')}.`,
    }));
  }

  function chooseReward(reward: Reward) {
    let deck = game.deck;
    let ownedRelics = game.relics;
    let stats = game.stats;

    if (reward.kind === 'card') {
      deck = [...deck, reward.card];
    } else {
      ownedRelics = [...ownedRelics, reward.relic];
      stats = applyEffects(stats, reward.relic.effects, ownedRelics);
    }

    const next = finishYearOrReturn({
      ...game,
      screen: 'map',
      deck,
      drawPile: shuffle(deck),
      discardPile: [],
      hand: [],
      relics: ownedRelics,
      stats,
      enemy: undefined,
      rewards: [],
    });

    setGame(withLossCheck(next));
  }

  function chooseEventOption(index: number) {
    if (!game.event) return;
    const option = game.event.options[index];
    let deck = game.deck;
    let ownedRelics = game.relics;
    let stats = applyEffects(game.stats, option.effects, ownedRelics);

    if (option.addCardId) {
      const card = cardById(option.addCardId);
      if (card) deck = [...deck, card];
    }

    if (option.relicId) {
      const relic = relicById(option.relicId);
      if (relic && !ownedRelics.some((owned) => owned.id === relic.id)) {
        ownedRelics = [...ownedRelics, relic];
        stats = applyEffects(stats, relic.effects, ownedRelics);
      }
    }

    const next = finishYearOrReturn({
      ...game,
      screen: 'map',
      event: undefined,
      deck,
      drawPile: shuffle(deck),
      relics: ownedRelics,
      stats,
      message: option.description,
    });

    setGame(withLossCheck(next));
  }

  return (
    <main className="min-h-screen bg-[#07070a] p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-300">Solo deckbuilder prototype</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter md:text-8xl">MID-<span className="text-pink-400">LIFE</span></h1>
            <p className="max-w-2xl text-slate-300">Survive age 40 to 50 without becoming a weird bitter goblin.</p>
          </div>
          {game.screen !== 'start' && (
            <button onClick={reset} className="self-start rounded-full border border-white/15 bg-white/10 px-5 py-3 font-black uppercase hover:bg-white/20">
              New Run
            </button>
          )}
        </header>

        {game.screen !== 'start' && game.screen !== 'class' && (
          <section className="mb-6 space-y-3">
            <StatPanel stats={game.stats} />
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-slate-300">
              <strong>Age {game.age}</strong> · Encounter {game.encounter}/4 · Deck {totalDeck} · Draw {game.drawPile.length} · Discard {game.discardPile.length} · Relics {game.relics.length}
              <br />
              <span className="text-pink-200">{game.message}</span>
            </div>
          </section>
        )}

        {game.screen === 'start' && (
          <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl md:grid-cols-[1.2fr_.8fr]">
            <div>
              <h2 className="mb-4 text-5xl font-black uppercase leading-none">You are 40. Life is good. Also, everything is on fire.</h2>
              <p className="mb-6 text-lg text-slate-300">Fight Burnout, Regret, The CFO, mysterious joint pain, and the final boss: Acceptance.</p>
              <button onClick={() => setGame({ ...game, screen: 'class' })} className="rounded-2xl bg-pink-500 px-8 py-4 text-xl font-black uppercase text-white shadow-lg shadow-pink-500/30 hover:bg-pink-400">
                Start Aging
              </button>
            </div>
            <div className="rounded-[2rem] border border-pink-300/20 bg-gradient-to-br from-pink-500/20 to-cyan-500/10 p-6">
              <div className="text-8xl">💀</div>
              <h3 className="text-4xl font-black uppercase">Win condition</h3>
              <p className="text-slate-200">Reach age 50 with Health and Sanity above zero. Your ending depends on what you protected.</p>
            </div>
          </section>
        )}

        {game.screen === 'class' && (
          <section>
            <h2 className="mb-5 text-4xl font-black uppercase">Choose Your Mid-Life Build</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {classes.map((character) => (
                <button key={character.id} onClick={() => chooseClass(character)} className="rounded-[2rem] border border-white/15 bg-white/[0.05] p-5 text-left shadow-xl transition hover:-translate-y-2 hover:border-pink-300">
                  <div className="text-6xl">{character.emoji}</div>
                  <h3 className="text-3xl font-black uppercase">{character.title}</h3>
                  <p className="text-sm text-slate-300">{character.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {game.screen === 'map' && (
          <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
              <h2 className="text-4xl font-black uppercase">Year {game.age} → {game.age + 1}</h2>
              <div className="my-6 grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((slot) => (
                  <div key={slot} className={`rounded-2xl border p-5 text-center ${slot <= game.encounter ? 'border-pink-400 bg-pink-500/20' : 'border-white/10 bg-white/5'}`}>
                    <div className="text-4xl">{slot === 4 ? '👹' : '🃏'}</div>
                    <div className="text-xs font-black uppercase tracking-widest">{slot === 4 ? 'Boss' : `Encounter ${slot}`}</div>
                  </div>
                ))}
              </div>
              <button onClick={beginEncounter} className="rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-black uppercase text-black hover:bg-cyan-300">
                Begin Next Encounter
              </button>
            </div>
            <aside className="rounded-[2rem] border border-amber-300/20 bg-black/30 p-5 shadow-2xl">
              <h3 className="mb-3 text-3xl font-black uppercase text-amber-100">Treasures</h3>
              <div className="space-y-3">
                {game.relics.length === 0 ? <p className="text-slate-400">No treasures yet. Just vibes and lower back tension.</p> : game.relics.map((relic) => <RelicCard key={relic.id} relic={relic} />)}
              </div>
            </aside>
          </section>
        )}

        {game.screen === 'event' && game.event && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <div className="text-7xl">{game.event.emoji}</div>
            <h2 className="text-5xl font-black uppercase">{game.event.title}</h2>
            <p className="mb-6 text-slate-300">{game.event.description}</p>
            <div className="grid gap-4 md:grid-cols-3">
              {game.event.options.map((option, index) => (
                <button key={option.title} onClick={() => chooseEventOption(index)} className="rounded-3xl border border-white/15 bg-slate-950/80 p-5 text-left transition hover:-translate-y-2 hover:border-pink-300">
                  <h3 className="text-2xl font-black uppercase">{option.title}</h3>
                  <p className="text-slate-300">{option.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {game.screen === 'combat' && game.enemy && (
          <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <aside className="rounded-[2rem] border border-red-300/20 bg-gradient-to-br from-red-950/60 to-black p-6 shadow-2xl">
              <div className="text-7xl">{game.enemy.emoji}</div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-red-300">{game.enemy.boss ? 'Boss' : 'Enemy'}</p>
              <h2 className="text-4xl font-black uppercase">{game.enemy.title}</h2>
              <p className="mb-4 text-slate-300">{game.enemy.description}</p>
              <div className="rounded-2xl bg-black/50 p-4">
                <div className="mb-2 flex justify-between text-sm font-black uppercase tracking-widest text-red-200">
                  <span>Resolve</span><span>{game.enemyResolve}/{game.enemy.resolve}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-black">
                  <div className="h-full bg-red-400" style={{ width: `${(game.enemyResolve / game.enemy.resolve) * 100}%` }} />
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
                <strong className="text-white">Attack: </strong>
                {Object.entries(game.enemy.attack).map(([key, value]) => `${statLabels[key as StatKey]} ${value}`).join(' · ')}
              </div>
              <button onClick={endTurn} className="mt-5 w-full rounded-2xl bg-red-500 px-5 py-3 font-black uppercase text-white hover:bg-red-400">End Turn</button>
            </aside>
            <div>
              <h2 className="mb-4 text-4xl font-black uppercase">Your Hand</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {game.hand.map((card, index) => (
                  <GameCard key={`${card.id}-${index}`} card={card} disabled={game.stats.energy < card.cost} onClick={() => playCard(card, index)} />
                ))}
              </div>
            </div>
          </section>
        )}

        {game.screen === 'reward' && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
            <h2 className="text-5xl font-black uppercase">Choose a Reward</h2>
            <p className="mb-6 text-slate-300">Pick one. You cannot have everything. That is sort of the theme.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {game.rewards.map((reward) => reward.kind === 'card'
                ? <GameCard key={`card-${reward.card.id}`} card={reward.card} onClick={() => chooseReward(reward)} />
                : <RelicCard key={`relic-${reward.relic.id}`} relic={reward.relic} onClick={() => chooseReward(reward)} />
              )}
            </div>
          </section>
        )}

        {game.screen === 'gameover' && (
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl">
            <div className="text-8xl">{game.ending ? '🏆' : '💀'}</div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-300">{game.ending ? 'Ending unlocked' : 'Run ended'}</p>
            <h2 className="text-6xl font-black uppercase">{game.ending ?? 'Mid-Life Crisis'}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-300">{game.gameOverReason}</p>
            <div className="mx-auto my-6 max-w-4xl"><StatPanel stats={game.stats} /></div>
            <button onClick={reset} className="rounded-2xl bg-pink-500 px-8 py-4 text-xl font-black uppercase text-white hover:bg-pink-400">Start New Run</button>
          </section>
        )}
      </div>
    </main>
  );
}
