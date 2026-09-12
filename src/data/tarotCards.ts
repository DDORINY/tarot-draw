import type { TarotCard, TarotElement, TarotMeaning, TarotRank, TarotThemes } from '../types/tarot'

type MeaningContext = {
  keywords: string[]
  summary: string
  love: string
  career: string
  money: string
  relationship: string
  advice: string
  shadow: string
}

const uprightTemplates = [
  ({ core, suit, rank, id }: { core: string; suit: string; rank: string; id: string }) => `${cardNameFromCore(core)} in ${suit} (ID ${id}) invites initiative through ${rank} energy.`,
  ({ core, suit, id }: { core: string; suit: string; id: string }) => `${cardNameFromCore(core)} for ${suit} at sequence ${id} asks for courage and timing.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} at #${id} bridges intention and concrete action.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} with marker ${id} brings practical emotional alignment when attention stays present.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} under ${id} supports disciplined follow-through and meaningful progress.`,
]

const reversedTemplates = [
  ({ core, suit, id }: { core: string; suit: string; id: string }) => `${cardNameFromCore(core)} in ${suit} (ID ${id}) shows overcommitment and needs boundary-setting.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} at ${id} can become avoidance when momentum outpaces reflection.`,
  ({ core, suit, id }: { core: string; suit: string; id: string }) => `${cardNameFromCore(core)} in ${suit} at ${id} asks for a pause to avoid impulsive commitments.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} (${id}) reversed points to misalignment, often healed through humility.`,
  ({ core, id }: { core: string; id: string }) => `${cardNameFromCore(core)} at ${id} asks for simplification, honesty, and clearer agreements.`,
]

const themesTemplates = {
  emotion: [
    ({ name, suit, id }: { name: string; suit: string; id: string }) => `${name} in ${suit} (ID ${id}) highlights emotional intensity and a clear signal.`,
    ({ name, id }: { name: string; id: string }) => `${name} (ID ${id}) opens a narrow, precise emotional lane before widening.`,
    ({ name, id }: { name: string; id: string }) => `${name} with marker ${id} asks for emotional honesty rather than pleasing behavior.`,
  ],
  action: [
    ({ core, id }: { core: string; id: string }) => `Act from ${cardNameFromCore(core)} with steady attention and low drama at marker ${id}.`,
    ({ core, id }: { core: string; id: string }) => `Anchor decisions in ${cardNameFromCore(core)} and remove unnecessary complexity around ${id}.`,
    ({ core, id }: { core: string; id: string }) => `Use ${cardNameFromCore(core)} as a cue for practical sequencing of next moves (ID ${id}).`,
  ],
  subconscious: [
    ({ name, id }: { name: string; id: string }) => `${name} (ID ${id}) surfaces internal patterns that are ready to be named.`,
    ({ name, id }: { name: string; id: string }) => `A shadow signal around ${name} at ${id} may be fear-driven comparison.`,
    ({ name, id }: { name: string; id: string }) => `Watch for hidden assumptions that ${name} at ${id} is trying to reveal.`,
  ],
  outcome: [
    ({ name, id }: { name: string; id: string }) => `${name} (ID ${id}) suggests outcomes strengthen when pace and boundaries are matched.`,
    ({ name, id }: { name: string; id: string }) => `${name} at ${id} usually returns learning and clarity over immediate speed.`,
    ({ name, id }: { name: string; id: string }) => `${name} with marker ${id} closes an arc when the result is implemented with discipline.`,
  ],
  timing: [
    ({ name, id }: { name: string; id: string }) => `${name} favors short-cycle review before repeating the same action (${id}).`,
    ({ name, id }: { name: string; id: string }) => `Use ${name} as a reminder at ${id} to stabilize and then execute next-step timing.`,
    ({ name, id }: { name: string; id: string }) => `${name} (ID ${id}) often improves with one cycle of pause, then recalibration.`,
  ],
}

const cardNameFromCore = (core: string) => core.trim().replace(/\s+/g, ' ')

const pickTemplate = <T,>(group: Array<(ctx: T) => string>, cardName: string, context: T) =>
  group[Math.abs(spreadSeed(cardName) - 1) % group.length](context)

const spreadSeed = (text: string) =>
  [...text].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) % 9973, 7)

const meaningOverrides = {
  'The Fool': {
    upright: {
      summary:
        'The Fool brings pure openness to the present moment, inviting trust, experimentation, and a beginner mindset.',
      love:
        'In relationships, choose vulnerability as a strength, set small honest expectations, and move forward without rehearsed certainty.',
      career:
        'At work, volunteer for a stretch assignment that stretches capability without overbuilding the safety plan.',
      money:
        'With resources, act with optimism but keep a baseline budget guardrail while testing new opportunities.',
      relationship:
        'Approach connections with curiosity; a simple, truthful check-in can prevent misunderstandings from blooming.',
      advice:
        'Leap with awareness: define one practical step, one exit path, and then commit fully.',
      shadow:
        'Avoidance of discernment can turn innocence into naïveté.',
    },
    reversed: {
      summary:
        'The Fool reversed warns against blind impulsiveness and urges grounding before the next move.',
      love:
        'In love, pause before declaring permanence; make sure promises are mutual rather than fantasy-driven.',
      career:
        'At work, delayed starts and scattered focus can waste momentum; stabilize scope first.',
        money:
        'Money energy becomes risky when hope outruns due diligence. Delay nonessential commitments until numbers are checked.',
      relationship:
        'Expectations hidden as spontaneity can feel like instability to others; invite explicit timing and consent.',
      advice:
        'Take one day off the sprint. Revisit intention, then re-enter with boundaries and a clear endpoint.',
      shadow:
        'Escaping responsibility under the banner of freedom can leave useful options unused.',
    },
  },
  'The Magician': {
    upright: {
      summary:
        'The Magician signals focused intention plus the practical means to manifest it through disciplined execution.',
      love:
        'In relationships, communicate your intentions clearly and transform attraction into dependable action.',
      career:
        'At work, coordinate tools, timeline, and allies; results appear when execution is as intentional as vision.',
      money:
        'Use planning and skill before spending energy. Good structure usually unlocks measurable gain.',
      relationship:
        'A direct conversation can convert hesitation into progress when each side owns its role.',
      advice:
        'Treat every promise as a project plan: define outcomes, resources, and accountability.',
      shadow:
        'Pushing influence without ethics can turn leadership into manipulation.',
    },
    reversed: {
      summary: 'The Magician reversed points to scattered focus and the illusion of control without grounded action.',
      love:
        'In love, charisma without sincerity creates confusion; simplify language and align behavior with commitments.',
      career:
        'At work, overpromising can erode credibility. Narrow the scope before asking commitment from others.',
      money:
        'The reversed state highlights vanity spending and short-cuts that dilute long-term value.',
      relationship:
        'Power games disguised as strategy often destabilize mutual trust.',
      advice:
        'Choose one objective, complete it cleanly, then move to the next without theatrics.',
      shadow: 'Skill can become vanity when technique is separated from truth.',
    },
  },
  'The High Priestess': {
    upright: {
      summary:
        'The High Priestess calls for reflection, listening, and attention to subtle signals that logic alone misses.',
      love:
        'In relationships, let shared silence and attentive listening surface what unspoken needs are hiding.',
      career:
        'At work, trust research and private intuition when the room is noisy with assumptions.',
      money:
        'Quietly track patterns before changing strategy; hidden costs are often the real message.',
      relationship:
        'Patience in dialogue can reveal loyalty, fear, or longing without forcing immediate answers.',
      advice:
        'Hold a question, gather context, and answer only after the signal-to-noise ratio improves.',
      shadow:
        'Denying emotion can harden into secrecy and emotional distance.',
    },
    reversed: {
      summary:
        'The High Priestess reversed shows information withheld or blocked intuition, making clarity feel foggy.',
      love:
        'In love, unspoken expectations accumulate quickly. Name one vulnerable truth before deciding.',
      career:
        'At work, data silos and unclear communication slow progress; ask for explicit checkpoints.',
      money:
        'Budget leaks often come from avoiding the conversation, not from hard numbers.',
      relationship:
        'Avoid silent punishment. Clarify boundaries, especially where assumptions have become default.',
      advice:
        'Reduce input sources, then verify what remains; certainty grows from disciplined filtering.',
      shadow:
        'Withdrawal can become self-protection that quietly blocks growth.',
    },
  },
  'The Lovers': {
    upright: {
      summary:
        'The Lovers highlights value-based choice, ethical alignment, and the courage to choose what feels integrated.',
      love:
        'In love, choose affection that supports mutual growth rather than performance or comfort alone.',
      career:
        'At work, align partnerships by checking values as carefully as roles.',
      money:
        'Joint decisions improve when priorities and long-term values are explicitly prioritized.',
      relationship:
        'Commitments become resilient when each person articulates what they cannot negotiate.',
      advice:
        'Choose what is true, not what is instantly pleasant.',
      shadow:
        'Confusion between dependency and devotion can dissolve direction quickly.',
    },
    reversed: {
      summary: 'The Lovers reversed reflects temptation, conflict, or choices driven by fear rather than values.',
      love:
        'In love, resolve mixed loyalties quickly or emotional drift will widen.',
      career:
        'At work, conflicting alliances hurt momentum; choose transparent communication over pleasing all sides.',
      money:
        'Financial choices made to ease tension rarely hold up; reassess motives before signing.',
      relationship:
        'When boundaries blur, resentment accumulates under the surface.',
      advice:
        'Pause the romance narrative, write down criteria, then negotiate from principle.',
      shadow: 'False harmony often hides postponement and passive conflict.',
    },
  },
  Death: {
    upright: {
      summary:
        'Death symbolizes necessary endings that clear space for a more accurate version of what follows.',
      love:
        'In love, release roles that became defensive habits and make room for present honesty.',
      career:
        'At work, cut what no longer serves. Reallocate energy toward systems that scale with your next phase.',
      money:
        'Divesting nonessential commitments can restore leverage faster than chasing replacement gains.',
      relationship:
        'A mature farewell can itself be a gift, because it protects both people from repetitive harm.',
      advice:
        'Finish incomplete cycles cleanly, then begin the next chapter with clear agreements.',
      shadow: 'Clinging to stale structures can create stagnation disguised as loyalty.',
    },
    reversed: {
      summary: 'Death reversed warns of resisting change until pressure builds into burnout or rupture.',
      love:
        'In love, prolonged ambiguity often becomes emotional debt. Name the ending early.',
      career:
        'At work, fear of transition can waste time on patchwork fixes; choose a structured replacement path.',
      money:
        'If exits are delayed, hidden liabilities worsen. Reduce exposure and simplify now.',
      relationship:
        'Avoiding truth to avoid hurt usually increases the eventual impact.',
      advice:
        'Acknowledge loss, plan transition, and communicate the timeline.',
      shadow: 'Denial turns endings into recurring emergencies.',
    },
  },
  'The Tower': {
    upright: {
      summary:
        'The Tower is a rupture point where false stability collapses and reality demands immediate honesty.',
      love:
        'In relationships, urgent truths can feel painful, but pretending is more expensive.',
      career:
        'At work, expose the brittle assumptions under pressure and rebuild around transparency.',
      money:
        'Unstable structures can fail suddenly; shift from wishful allocation to essential control.',
      relationship:
        'Conflict can be purifying if it leads to structural honesty and clearer agreements.',
      advice:
        'Stabilize what is real, then rebuild your systems before adding ambition.',
      shadow: 'Power over appearance without authenticity attracts avoidable collapse.',
    },
    reversed: {
      summary: 'The Tower reversed suggests averted collapse, but tension remains until truth is addressed.',
      love:
        'In love, surface-level repair may postpone a real reckoning. Prioritize root causes.',
      career:
        'Reforms are temporary unless process and communication are repaired together.',
      money:
        'Patchwork budgeting can hide bigger fragility; audit obligations first.',
      relationship:
        'Avoid denial; unresolved strain will reappear louder later.',
      advice:
        'Create safety through accountability, not avoidance.',
      shadow: 'Fear of exposure can become the loudest barrier to repair.',
    },
  },
  'The Moon': {
    upright: {
      summary:
        'The Moon brings dreamlike uncertainty, revealing how shadows and projection steer decisions.',
      love:
        'In relationships, fear-based stories are common; check facts before escalating conclusions.',
      career:
        'At work, ambiguous signals demand slower moves and better cross-checking.',
      money:
        'Avoid emotionally reactive spending. Let uncertainty pass before major commitments.',
      relationship:
        'Hold space for imagination without mistaking it for evidence.',
      advice:
        'Write hypotheses, test them with grounded behavior, and revise.',
      shadow: 'Overconfidence in guesses can deepen confusion.',
    },
    reversed: {
      summary:
        'The Moon reversed calls attention to fear narratives and misinformation clouding practical judgment.',
      love:
        'In love, jealousy and anxiety are easier to address when assumptions are verbalized.',
      career:
        'At work, rumors distort priorities; request data from direct sources.',
      money:
        'Late-night anxieties often trigger impulsive decisions—delay until daylight clarity.',
      relationship:
        'Healing comes from naming what is uncertain instead of demanding certainty.',
      advice:
        'Reduce emotional noise, then return to evidence.',
      shadow: 'Avoidance of discomfort can trap insight in repeating cycles.',
    },
  },
  'The Sun': {
    upright: {
      summary:
        'The Sun indicates confidence, joy, and increased visibility when effort and transparency align.',
      love:
        'In love, warmth grows when affection is expressed without conditions.',
      career:
        'At work, public milestones are possible when contribution is consistent and clear.',
      money:
        'Growth in money flow comes from simple systems and disciplined follow-through.',
      relationship:
        'Trust thrives through direct communication and shared celebration of progress.',
      advice:
        'Let achievements be visible, but remain humble enough to keep learning.',
      shadow: 'Overexposure to praise can mask blind spots in process.',
    },
    reversed: {
      summary:
        'The Sun reversed may bring fatigue, ego friction, or delayed clarity after overextension.',
      love:
        'In love, keep enthusiasm but reduce performative gestures; sincerity restores balance.',
      career:
        'At work, recalibrate before visibility becomes pressure that outpaces execution.',
      money:
        'Track recurring costs before scaling plans that feel exciting but are premature.',
      relationship:
        'Healthy boundaries keep joy from becoming dependence.',
      advice:
        'Rebuild rhythm first, then rebuild momentum.',
      shadow: 'Optimism without self-care can become burnout-disguised optimism.',
    },
  },
  'The World': {
    upright: {
      summary:
        'The World marks completion, integration, and the successful integration of a full cycle.',
      love:
        'In love, shared accomplishment strengthens bonds when credit and responsibility are mutual.',
      career:
        'At work, completion is sustainable when processes are documented and transferable.',
      money:
        'Financial consolidation and review close loops; celebration can coexist with accountability.',
      relationship:
        'Long-term value appears when promises made during the journey are honored.',
      advice:
        'Finish carefully, then decide whether this ending should become a model.',
      shadow: 'Complacency after success can delay the next necessary beginning.',
    },
    reversed: {
      summary: 'The World reversed shows partial completion and pressure to celebrate before integration.',
      love:
        'In love, unresolved residues can make the cycle repeat under a healthier disguise.',
      career:
        'At work, document lessons before moving; otherwise success remains unstable.',
      money:
        'Unclosed ledgers undermine the feeling of finish; finalize what is open.',
      relationship:
        'If gratitude is performative, trust does not fully consolidate.',
      advice:
        'Close loops with honesty, then begin the next cycle from a stable baseline.',
      shadow: 'Rushing completion can create false closure.',
    },
  },
  'Five of Cups': {
    upright: {
      summary:
        'Five of Cups highlights grief and missed opportunities while reminding you to redirect attention to what endures.',
      love:
        'In love, grief may make closeness feel unsafe; name the pain before asking for reassurance.',
      career:
        'At work, a setback can sharpen priorities once you isolate what failed versus what still works.',
      money:
        'Protect remaining assets while reassessing emotional decision-making in spending.',
      relationship:
        'You may over-focus on loss and miss remaining support; acknowledge allies.',
      advice:
        'Move from mourning to action by identifying three resources still available.',
      shadow:
        'Blaming others for one loss can block recognition of your resilient options.',
    },
    reversed: {
      summary:
        'Five of Cups reversed signals emotional recovery and the first practical signs of regained balance.',
      love:
        'In love, apology and practical change can reopen trust when regret has cooled.',
      career:
        'At work, return to routines early; momentum is rebuilt through small completion points.',
      money:
        'Reassess debts and obligations with fresh boundaries and less self-critique.',
      relationship:
        'Repair conversations should focus on future behavior, not past blame.',
      advice:
        'Use the remaining strength, not the lost narrative, to proceed.',
      shadow: 'Unprocessed grief can resurface as quiet sabotage of progress.',
    },
  },
  'Eight of Wands': {
    upright: {
      summary:
        'Eight of Wands brings rapid movement, rapid communication, and swift execution windows.',
      love:
        'In love, clarity rises when messages and logistics move quickly and clearly.',
      career:
        'At work, capitalize on a short momentum window with tight coordination.',
      money:
        'Fast decisions should still include minimum safeguards to avoid avoidable reversals.',
      relationship:
        'Physical and practical movement can reconnect people when emotional stagnation ends.',
      advice:
        'Accelerate only the sequence that is already prepared.',
      shadow: 'Hurry without sequence can create avoidable collisions.',
    },
    reversed: {
      summary:
        'Eight of Wands reversed indicates stalled momentum, delayed communications, and missed timing.',
      love:
        'In love, important messages may be lost; synchronize expectations before acting.',
      career:
        'At work, bottlenecks or unclear owners can freeze progress despite demand.',
      money:
        'When speed is blocked, simplify the plan and pause spending on uncertain deals.',
      relationship:
        'Unspoken delays can be misread as indifference.',
      advice:
        'Reduce channels, clear owners, and restart alignment intentionally.',
      shadow: 'Overconfidence in speed can blind you to logistical collapse.',
    },
  },
  'Four of Pentacles': {
    upright: {
      summary:
        'Four of Pentacles highlights control, security needs, and the value of stewardship over scarcity anxiety.',
      love:
        'In love, affection can become possessive when insecurity grows; share your need without constraining others.',
      career:
        'At work, protect critical assets, but avoid hoarding information that weakens collaboration.',
      money:
        'Conservation instincts are useful when paired with occasional reassessment of risk appetite.',
      relationship:
        'Trust increases when you define boundaries and avoid emotional inventory-taking.',
      advice:
        'Secure essentials, then release what prevents adaptive growth.',
      shadow: 'Over-protection can become stagnation disguised as prudence.',
    },
    reversed: {
      summary:
        'Four of Pentacles reversed shows scarcity stress flipping into either impulsive release or deeper discipline.',
      love:
        'In love, fear-driven control can trigger separation; practice transparent reassurance.',
      career:
        'At work, redistribute control to strengthen collective resilience.',
      money:
        'Releasing rigid fear frees the budget for meaningful, strategic reinvestment.',
      relationship:
        'Let resources and affection circulate where value is mutual.',
      advice:
        'Rebalance from grip to stewardship.',
      shadow: 'Fear can masquerade as prudence and justify isolation.',
    },
  },
  'Queen of Swords': {
    upright: {
      summary:
        'Queen of Swords embodies discernment, clarity, and emotional maturity in decision-making.',
      love:
        'In love, direct speech helps prevent misunderstanding and keeps respect central.',
      career:
        'At work, cut through ambiguity with crisp priorities and transparent criteria.',
      money:
        'Financial clarity comes from separating facts from narrative bias.',
      relationship:
        'Compassion with boundaries keeps intelligence from becoming coldness.',
      advice:
        'Use clear language and verify evidence before acting.',
      shadow: 'Detachment can become defensiveness if tenderness is dismissed.',
    },
    reversed: {
      summary:
        'Queen of Swords reversed warns of overly sharp judgment and emotional wounding through criticism.',
      love:
        'In love, words can wound quickly; slow your tone before the decisive moment.',
      career:
        'At work, critique without context can alienate teammates; anchor feedback in specifics.',
      money:
        'Decision quality suffers when cynicism overrules facts.',
      relationship:
        'Boundaries are needed, but avoid weaponizing intelligence.',
      advice:
        'Balance truth with timing and humane delivery.',
      shadow:
        'Cognitive superiority can become emotional distance and loneliness.',
    },
  },
} as const

const themeOverrides: Record<
  string,
  Partial<{
    emotion: string
    action: string
    subconscious: string
    outcome: string
    timing: string
  }>
> = {
  'The Fool': {
    emotion: 'Wonder and apprehension alternate as confidence arrives before certainty.',
    action: 'Take one informed step, then re-evaluate the next move with your feet on the ground.',
    subconscious: 'A hidden fear of judgment may be disguised as playful curiosity.',
    outcome: 'Unexpected opportunities tend to appear once you commit to a clear first action.',
    timing: 'Act while the impulse is clean, then stabilize before expanding.',
  },
  'The Magician': {
    emotion: 'Motivation rises when intention matches available skill and timing.',
    action: 'Pair vision with concrete deadlines and one accountable partner.',
    subconscious: 'The urge to impress can mask insecurity about competence.',
    outcome: 'Results strengthen when execution stays visible and measurable.',
    timing: 'Short cycles with deliberate checkpoints preserve authority.',
  },
  'The High Priestess': {
    emotion: 'Stillness reveals emotion patterns usually hidden by busyness.',
    action: 'Pause external noise and ask one precise question before choosing.',
    subconscious: 'The unresolved memory pattern seeks meaning and consistency.',
    outcome: 'Insight becomes practical only after silence is respected.',
    timing: 'Best consulted before major emotional commitments.',
  },
  'The Lovers': {
    emotion: 'Attraction and anxiety compete until values become explicit.',
    action: 'State your non-negotiables before making any commitment.',
    subconscious: 'Fear of loss can imitate attachment.',
    outcome: 'Clarity in shared values reduces future conflict dramatically.',
    timing: 'Use this when relationship direction requires a deliberate decision.',
  },
  Death: {
    emotion: 'Grief can coexist with relief when an ending is acknowledged.',
    action: 'Complete legal, financial, and relational closures in order.',
    subconscious: 'Control often persists because uncertainty feels safer than grief.',
    outcome: 'New growth emerges only after cleanup is done.',
    timing: 'Longer-term benefits appear after the immediate purge.',
  },
  'The Tower': {
    emotion: 'Shock and fear may be acute, then clarity grows quickly.',
    action: 'Repair safety structures first, then revisit goals.',
    subconscious: 'Denial keeps fragile facades intact until they fail.',
    outcome: 'Truth replaces spectacle once communication is restored.',
    timing: 'Urgency is real; delay increases collateral confusion.',
  },
  'The Moon': {
    emotion: 'Ambivalence and intuitive signals rise, demanding discernment.',
    action: 'Reduce speculation and gather concrete signs.',
    subconscious: 'Old fears seek pattern in noise.',
    outcome: 'Calm reappears when assumptions are tested.',
    timing: 'Appropriate during review windows rather than launch windows.',
  },
  'The Sun': {
    emotion: 'Confidence increases without the need to force certainty.',
    action: 'Show your work and welcome collective participation.',
    subconscious: 'Aging insecurity can resist joyful visibility.',
    outcome: 'Progress stabilizes when consistency supports celebration.',
    timing: 'Longer cycles of optimism work when routines are maintained.',
  },
  'The World': {
    emotion: 'Completion feels expansive yet accountable.',
    action: 'Celebrate, then codify what made the cycle successful.',
    subconscious: 'Fear of the next phase can block full closure.',
    outcome: 'A durable ending becomes a platform for larger structure.',
    timing: 'Best in periods of measured reflection after execution.',
  },
  'Five of Cups': {
    emotion: 'Disappointment narrows vision to the loss, obscuring remaining resources.',
    action: 'Reorient toward practical relief and one specific restorative action.',
    subconscious: 'Self-judgment can prolong the same emotional loop.',
    outcome: 'Trust rebuilds once attention shifts from regret to next-step effort.',
    timing: 'Shortly after emotional shock, then revisit in steady intervals.',
  },
  'Eight of Wands': {
    emotion: 'Impatience and excitement amplify each other.',
    action: 'Use strict sequencing while speed is high.',
    subconscious: 'A desire for immediate response can override reflection.',
    outcome: 'Rapid movement yields momentum when dependencies are already mapped.',
    timing: 'Effective in fast-response phases with clear communication channels.',
  },
  'Four of Pentacles': {
    emotion: 'Need for control rises when scarcity is sensed.',
    action: 'Set a floor for security, then free resources from rigid hoarding.',
    subconscious: 'Fear of insufficiency is driving visible grip.',
    outcome: 'Greater stability appears after trust-based adjustment.',
    timing: 'Useful during budgeting or protection phases, then revisit flexibility.',
  },
  'Queen of Swords': {
    emotion: 'Clarity sharpens while emotional distance is tested.',
    action: 'Separate facts from assumptions and communicate your standards plainly.',
    subconscious: 'Intellect may be used to avoid being hurt again.',
    outcome: 'Boundaries become credible when they are transparent.',
    timing: 'Strong in periods of decision pressure and mixed signals.',
  },
}

const buildMeaning = (cardName: string, suit: string, rank: string, id: number, mode: 'upright' | 'reversed'): MeaningContext => {
  const core = cardName.split(' of ')[0] ?? cardName
  const ctx = { core, suit, rank, id: id.toString(), name: cardName }
  const baseKeywords = [
    suit,
    mode,
    rank,
    cardName.toLowerCase().replace(/\s+/g, '-'),
  ]

  const base = meaningOverrides[cardName as keyof typeof meaningOverrides]?.[mode]
  const template = mode === 'upright' ? uprightTemplates : reversedTemplates

  const baseMeaning: MeaningContext = {
    keywords: baseKeywords,
    summary: (base?.summary ?? pickTemplate(template, cardName, ctx)).replace(/\s+/g, ' ').trim(),
    love: base?.love ?? `In relationships, ${pickTemplate(template, cardName, ctx)} Keep dialogue sincere.`,
    career: base?.career ?? `At work, ${pickTemplate(template, cardName, ctx)} with clear accountability.`,
    money: base?.money ?? `For resources, ${pickTemplate(template, cardName, ctx)} and monitor practical costs.`,
    relationship: base?.relationship ?? `${pickTemplate(template, cardName, ctx)} in ties supports mutual respect.`,
    advice: base?.advice ?? `Use ${cardName} upright as a cue to act with structure and goodwill.`,
    shadow: base?.shadow ?? `${cardName} (ID ${id}) can become rigid if ${core.toLowerCase()} is used to avoid nuance.`,
  }
  return {
    ...baseMeaning,
    advice: baseMeaning.advice || `Use ${cardName} ${mode} as a cue to act with structure and goodwill.`,
  }
}

const majorArcana: Array<Pick<
  TarotCard,
  | 'id'
  | 'name'
  | 'nameKo'
  | 'number'
  | 'slug'
  | 'element'
  | 'astrology'
  | 'planet'
>> = [
  { id: 0, number: 0, name: 'The Fool', nameKo: '광대', slug: '00-the-fool', element: 'air', astrology: 'Aries', planet: 'Neptune' },
  { id: 1, number: 1, name: 'The Magician', nameKo: '마법사', slug: '01-the-magician', element: 'air', astrology: 'Mercury', planet: 'Mercury' },
  { id: 2, number: 2, name: 'The High Priestess', nameKo: '여사제', slug: '02-the-high-priestess', element: 'water', astrology: 'Moon', planet: 'Moon' },
  { id: 3, number: 3, name: 'The Empress', nameKo: '여황제', slug: '03-the-empress', element: 'earth', astrology: 'Venus', planet: 'Venus' },
  { id: 4, number: 4, name: 'The Emperor', nameKo: '황제', slug: '04-the-emperor', element: 'earth', astrology: 'Aries', planet: 'Mars' },
  { id: 5, number: 5, name: 'The Hierophant', nameKo: '교황', slug: '05-the-hierophant', element: 'earth', astrology: 'Taurus', planet: 'Mercury' },
  { id: 6, number: 6, name: 'The Lovers', nameKo: '연인', slug: '06-the-lovers', element: 'air', astrology: 'Gemini', planet: 'Venus' },
  { id: 7, number: 7, name: 'The Chariot', nameKo: '전차', slug: '07-the-chariot', element: 'fire', astrology: 'Cancer', planet: 'Mars' },
  { id: 8, number: 8, name: 'Strength', nameKo: '힘', slug: '08-strength', element: 'fire', astrology: 'Leo', planet: 'Sun' },
  { id: 9, number: 9, name: 'The Hermit', nameKo: '은둔자', slug: '09-the-hermit', element: 'earth', astrology: 'Virgo', planet: 'Moon' },
  { id: 10, number: 10, name: 'Wheel of Fortune', nameKo: '운명의 수레바퀴', slug: '10-wheel-of-fortune', element: 'air', astrology: 'Jupiter', planet: 'Jupiter' },
  { id: 11, number: 11, name: 'Justice', nameKo: '정의', slug: '11-justice', element: 'air', astrology: 'Libra', planet: 'Saturn' },
  { id: 12, number: 12, name: 'The Hanged Man', nameKo: '매달린 사람', slug: '12-the-hanged-man', element: 'water', astrology: 'Neptune', planet: 'Neptune' },
  { id: 13, number: 13, name: 'Death', nameKo: '죽음', slug: '13-death', element: 'air', astrology: 'Scorpio', planet: 'Pluto' },
  { id: 14, number: 14, name: 'Temperance', nameKo: '절제', slug: '14-temperance', element: 'water', astrology: 'Sagittarius', planet: 'Jupiter' },
  { id: 15, number: 15, name: 'The Devil', nameKo: '악마', slug: '15-the-devil', element: 'earth', astrology: 'Capricorn', planet: 'Saturn' },
  { id: 16, number: 16, name: 'The Tower', nameKo: '탑', slug: '16-the-tower', element: 'fire', astrology: 'Mars', planet: 'Mars' },
  { id: 17, number: 17, name: 'The Star', nameKo: '별', slug: '17-the-star', element: 'air', astrology: 'Aquarius', planet: 'Uranus' },
  { id: 18, number: 18, name: 'The Moon', nameKo: '달', slug: '18-the-moon', element: 'water', astrology: 'Pisces', planet: 'Moon' },
  { id: 19, number: 19, name: 'The Sun', nameKo: '태양', slug: '19-the-sun', element: 'fire', astrology: 'Sun', planet: 'Sun' },
  { id: 20, number: 20, name: 'Judgment', nameKo: '심판', slug: '20-judgment', element: 'fire', astrology: 'Pluto', planet: 'Pluto' },
  { id: 21, number: 21, name: 'The World', nameKo: '세계', slug: '21-the-world', element: 'earth', astrology: 'Saturn', planet: 'Saturn' },
]

const rankValues: TarotRank[] = [
  'ace',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'page',
  'knight',
  'queen',
  'king',
]

const rankNamesKo = [
  '에이스',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '페이지',
  '나이트',
  '퀸',
  '킹',
] as const

const minorSuits = [
  { key: 'wands', ko: '완드', element: 'fire', cards: [
    'Ace of Wands',
    'Two of Wands',
    'Three of Wands',
    'Four of Wands',
    'Five of Wands',
    'Six of Wands',
    'Seven of Wands',
    'Eight of Wands',
    'Nine of Wands',
    'Ten of Wands',
    'Page of Wands',
    'Knight of Wands',
    'Queen of Wands',
    'King of Wands',
  ]},
  { key: 'cups', ko: '컵', element: 'water', cards: [
    'Ace of Cups',
    'Two of Cups',
    'Three of Cups',
    'Four of Cups',
    'Five of Cups',
    'Six of Cups',
    'Seven of Cups',
    'Eight of Cups',
    'Nine of Cups',
    'Ten of Cups',
    'Page of Cups',
    'Knight of Cups',
    'Queen of Cups',
    'King of Cups',
  ]},
  { key: 'swords', ko: '소드', element: 'air', cards: [
    'Ace of Swords',
    'Two of Swords',
    'Three of Swords',
    'Four of Swords',
    'Five of Swords',
    'Six of Swords',
    'Seven of Swords',
    'Eight of Swords',
    'Nine of Swords',
    'Ten of Swords',
    'Page of Swords',
    'Knight of Swords',
    'Queen of Swords',
    'King of Swords',
  ]},
  { key: 'pentacles', ko: '펜타클', element: 'earth', cards: [
    'Ace of Pentacles',
    'Two of Pentacles',
    'Three of Pentacles',
    'Four of Pentacles',
    'Five of Pentacles',
    'Six of Pentacles',
    'Seven of Pentacles',
    'Eight of Pentacles',
    'Nine of Pentacles',
    'Ten of Pentacles',
    'Page of Pentacles',
    'Knight of Pentacles',
    'Queen of Pentacles',
    'King of Pentacles',
  ]},
] as const

const buildSymbolPool = (cardName: string, suit: string): string[] => {
  const base = [cardName.split(' ').slice(-1)[0].toLowerCase(), suit]
  return Array.from(new Set([...base, 'tarot', 'rider-waite-smith']))
}

const majorCards: TarotCard[] = majorArcana.map((card) => {
  const majorThemeOverride = themeOverrides[card.name]
  return {
    id: card.id,
    name: card.name,
    nameKo: card.nameKo,
    slug: card.slug,
    arcana: 'major',
    suit: 'major',
    number: card.number,
    image:
      card.number === 20
        ? '/cards/major/20-judgement.webp'
        : `/cards/major/${card.slug}.webp`,
    element: card.element as TarotElement,
    astrology: card.astrology,
    planet: card.planet,
    symbols: buildSymbolPool(card.name, 'major arcana'),
    archetype: `${card.name} archetype`,
    upright: buildMeaning(card.name, 'major', 'major', card.id, 'upright'),
    reversed: buildMeaning(card.name, 'major', 'major', card.id, 'reversed'),
    themes: {
      emotion: (majorThemeOverride?.emotion ?? pickTemplate(themesTemplates.emotion as Array<(ctx: { name: string; suit: string; id: string }) => string>, card.nameKo, {
          name: card.nameKo,
          suit: 'major',
          id: card.id.toString(),
        })),
      action: (majorThemeOverride?.action ?? pickTemplate(themesTemplates.action as Array<(ctx: { core: string; id: string }) => string>, card.nameKo, { core: card.name, id: card.id.toString() })),
      subconscious: (majorThemeOverride?.subconscious ?? pickTemplate(themesTemplates.subconscious as Array<(ctx: { name: string; id: string }) => string>, card.nameKo, { name: card.nameKo, id: card.id.toString() })),
      outcome: (majorThemeOverride?.outcome ?? pickTemplate(themesTemplates.outcome as Array<(ctx: { name: string; id: string }) => string>, card.nameKo, { name: card.nameKo, id: card.id.toString() })),
      timing: (majorThemeOverride?.timing ?? pickTemplate(themesTemplates.timing as Array<(ctx: { name: string; id: string }) => string>, card.nameKo, { name: card.nameKo, id: card.id.toString() })),
    },
  }
})

const minorCards: TarotCard[] = minorSuits.flatMap((suit, suitIndex) => {
  const offset = 22 + suitIndex * 14
  return suit.cards.map((rawName, index) => {
    const cardId = offset + index
    const rank = rankValues[index]
    const numericNumber = index < 10 ? index + 1 : null
    const slug =
      index < 10
        ? `${rank}-of-${suit.key}`
        : `${rank.toString()}-of-${suit.key}`.replace('ace', 'ace')
    const name = rawName.replace(' of ', ' of ').replace(' of ', ' of ')
    const minorThemeOverride = themeOverrides[name]
    return {
      id: cardId,
      name,
      nameKo: `${suit.ko} ${rankNamesKo[index]}`,
      slug,
      arcana: 'minor',
      suit: suit.key,
      number: numericNumber,
      rank: index >= 10 ? rank : undefined,
      image: `/cards/${suit.key}/${slug}.webp`,
      element: suit.element as TarotElement,
      symbols: buildSymbolPool(rawName, suit.key),
      archetype: `${suit.ko}의 ${rawName} archetype`,
      upright: buildMeaning(name, suit.key, rank, cardId, 'upright'),
      reversed: buildMeaning(name, suit.key, rank, cardId, 'reversed'),
      themes: {
        emotion: (minorThemeOverride?.emotion ?? pickTemplate(themesTemplates.emotion as Array<(ctx: { name: string; suit: string; id: string }) => string>, name, {
          name,
          suit: suit.key,
          id: cardId.toString(),
        })),
        action: (minorThemeOverride?.action ?? pickTemplate(themesTemplates.action as Array<(ctx: { core: string; id: string }) => string>, name, { core: rank, id: cardId.toString() })),
        subconscious: (minorThemeOverride?.subconscious ?? pickTemplate(themesTemplates.subconscious as Array<(ctx: { name: string; id: string }) => string>, name, {
          name,
          id: cardId.toString(),
        })),
        outcome: (minorThemeOverride?.outcome ?? pickTemplate(themesTemplates.outcome as Array<(ctx: { name: string; id: string }) => string>, name, {
          name,
          id: cardId.toString(),
        })),
        timing: (minorThemeOverride?.timing ?? pickTemplate(themesTemplates.timing as Array<(ctx: { name: string; id: string }) => string>, name, {
          name,
          id: cardId.toString(),
        })),
      },
    } satisfies TarotCard
  })
})

type KoreanCore = readonly [string, string, string, string]

const koreanCores: readonly KoreanCore[] = [
  ['새로운 시작, 자유, 모험', '익숙한 틀을 벗어나 가능성을 믿고 첫걸음을 내딛는 흐름입니다.', '무모함, 준비 부족, 회피', '충동만 앞서거나 책임을 피한 채 출발을 미루는 흐름입니다.'],
  ['의지, 창조, 실행력', '가진 자원과 능력을 한데 모아 뜻한 일을 현실로 옮기는 힘이 살아납니다.', '재능 낭비, 기만, 실행 부족', '능력을 제대로 쓰지 못하거나 말과 행동이 어긋날 수 있습니다.'],
  ['직관, 침묵, 내면의 지혜', '겉으로 드러난 정보보다 고요한 직관과 내면의 목소리에 귀 기울일 때입니다.', '직관 불신, 비밀, 단절', '속마음을 억누르거나 불안 때문에 직관을 오해할 수 있습니다.'],
  ['풍요, 돌봄, 창조성', '따뜻한 돌봄과 창조적인 에너지가 관계와 현실을 풍요롭게 가꿉니다.', '과잉 보호, 정체, 자기 소홀', '남을 돌보느라 자신을 잃거나 편안함에 머물러 성장이 막힐 수 있습니다.'],
  ['질서, 책임, 통솔', '명확한 기준과 책임 있는 판단으로 안정된 기반을 세우는 흐름입니다.', '권위주의, 경직, 통제 상실', '지나친 통제나 완고함이 오히려 질서와 신뢰를 흔들 수 있습니다.'],
  ['전통, 배움, 신념', '검증된 가르침과 공동체의 지혜를 통해 방향을 다듬을 때입니다.', '관습 거부, 독단, 가치 충돌', '낡은 규범에 갇히거나 반대로 모든 조언을 무조건 거부할 수 있습니다.'],
  ['사랑, 조화, 선택', '진심 어린 결합과 가치에 충실한 선택이 중요한 갈림길을 만듭니다.', '불화, 가치 충돌, 우유부단', '끌림과 가치가 어긋나거나 선택의 책임을 피하면서 관계가 흔들릴 수 있습니다.'],
  ['전진, 의지, 자기 통제', '상반된 힘을 한 방향으로 모아 목표를 향해 힘차게 나아갑니다.', '방향 상실, 공격성, 통제 부족', '속도와 경쟁심이 앞서 방향을 잃거나 감정을 제어하기 어려울 수 있습니다.'],
  ['용기, 인내, 온화한 힘', '강압보다 침착한 용기와 꾸준한 인내가 상황을 움직입니다.', '자기 의심, 소진, 감정 폭발', '내면의 불안을 억누르다 자신감을 잃거나 감정이 한꺼번에 터질 수 있습니다.'],
  ['성찰, 고독, 탐구', '잠시 외부의 소음을 떠나 스스로의 진실과 길을 살펴볼 때입니다.', '고립, 폐쇄성, 방황', '필요한 성찰이 고립으로 굳어져 도움과 연결을 밀어낼 수 있습니다.'],
  ['전환, 순환, 기회', '예상 밖의 변화가 새로운 국면과 기회를 열어 주는 흐름입니다.', '정체, 불운감, 변화 저항', '통제할 수 없는 변화에 매달리며 같은 패턴을 반복할 수 있습니다.'],
  ['공정, 균형, 책임', '사실을 분명히 보고 선택의 결과를 공정하게 받아들여야 합니다.', '불공정, 책임 회피, 편견', '자신에게 유리한 판단이나 책임 회피가 균형을 무너뜨릴 수 있습니다.'],
  ['멈춤, 관점 전환, 내려놓음', '서두르지 않고 시선을 바꾸면 이전에 보이지 않던 의미가 드러납니다.', '지연, 희생 강박, 완고함', '의미 없는 기다림을 계속하거나 관점을 바꾸지 못해 정체될 수 있습니다.'],
  ['종결, 변환, 재생', '끝내야 할 것을 놓아 보내며 근본적인 변화와 새 단계가 시작됩니다.', '변화 저항, 미련, 정체', '끝난 흐름을 붙잡아 필요한 전환과 회복을 늦출 수 있습니다.'],
  ['절제, 조화, 치유', '서로 다른 요소를 차분히 조율하며 균형과 회복을 만들어 갑니다.', '불균형, 과잉, 조급함', '극단을 오가거나 성급하게 결과를 내려다 흐름이 흐트러질 수 있습니다.'],
  ['집착, 유혹, 속박', '욕망과 두려움이 만든 의존을 직시해야 자유를 되찾을 수 있습니다.', '해방, 자각, 집착 완화', '속박의 원인을 알아차리고 해로운 관계나 습관에서 벗어나기 시작합니다.'],
  ['붕괴, 충격, 진실의 폭로', '불안정한 기반이 무너지며 감춰졌던 진실과 변화가 갑작스럽게 드러납니다.', '변화 회피, 불안, 지연된 충격', '필요한 붕괴를 피하려 하지만 긴장이 안쪽에 남아 변화를 늦출 수 있습니다.'],
  ['희망, 치유, 영감', '어려움 뒤에 다시 희망을 발견하고 맑은 방향으로 회복해 갑니다.', '낙담, 불신, 방향 상실', '희망을 믿기 어렵거나 자신과 미래에 대한 신뢰가 약해질 수 있습니다.'],
  ['불안, 환상, 무의식', '불확실한 감정과 무의식의 신호를 성급히 단정하지 말고 살펴야 합니다.', '혼란 해소, 진실 확인, 두려움 완화', '안개가 서서히 걷히며 두려움의 실체와 감춰진 사실을 알아차립니다.'],
  ['기쁨, 활력, 명료함', '밝은 자신감과 솔직한 표현이 성취와 따뜻한 연결을 키웁니다.', '일시적 침체, 과신, 기쁨의 지연', '긍정성을 잃거나 지나친 낙관 때문에 중요한 세부를 놓칠 수 있습니다.'],
  ['각성, 심판, 소명', '과거를 정직하게 돌아보고 더 큰 부름에 응답할 전환점입니다.', '자기 비난, 결단 회피, 과거 집착', '후회에 머물거나 필요한 평가와 결정을 계속 미룰 수 있습니다.'],
  ['완성, 통합, 성취', '긴 여정의 결실을 받아들이며 경험을 하나의 완성된 단계로 통합합니다.', '미완성, 지연, 마무리 부족', '끝맺어야 할 과제를 남겨 둔 채 다음 단계로 서두를 수 있습니다.'],
  ['영감, 시작, 열정', '새로운 열정과 창조적 가능성이 행동의 불씨를 지핍니다.', '의욕 저하, 지연, 방향 부족', '아이디어는 있지만 확신이나 추진력이 부족해 시작이 늦어질 수 있습니다.'],
  ['계획, 전망, 선택', '가능성을 넓게 바라보며 다음 단계와 장기 방향을 선택합니다.', '두려움, 계획 부족, 시야 제한', '안전한 범위에만 머물러 더 큰 가능성을 보지 못할 수 있습니다.'],
  ['확장, 진전, 원거리 전망', '이미 시작한 일이 영역을 넓히며 다음 성과를 기다리는 흐름입니다.', '지연, 장애, 기대 축소', '진전이 더디거나 준비 부족으로 확장의 기회를 놓칠 수 있습니다.'],
  ['축하, 안정, 공동체', '함께 이룬 성과와 안정된 기반을 기쁘게 나누는 흐름입니다.', '불안정, 소속감 부족, 갈등', '겉보기의 안정 뒤에 관계의 긴장이나 기반의 균열이 남아 있을 수 있습니다.'],
  ['경쟁, 긴장, 의견 충돌', '다양한 주장과 경쟁이 부딪히며 실력을 겨루고 성장할 계기가 생깁니다.', '갈등 회피, 내적 긴장, 화해', '갈등을 눌러 두거나 소모적인 경쟁에서 벗어나 조율을 시도합니다.'],
  ['승리, 인정, 자신감', '노력의 성과가 드러나고 주변의 인정과 지지를 받을 수 있습니다.', '인정 부족, 자만, 자신감 저하', '외부 평가에 매달리거나 기대한 인정을 받지 못해 흔들릴 수 있습니다.'],
  ['방어, 신념, 끈기', '도전 속에서도 자신의 위치와 신념을 지켜 내야 하는 때입니다.', '압도감, 방어 포기, 소진', '계속된 압박에 지쳐 경계를 지키기 어렵거나 불필요하게 방어적일 수 있습니다.'],
  ['속도, 소식, 급속한 전개', '막힘이 풀리며 소식과 행동이 빠르게 오가는 흐름입니다.', '지연, 오해, 방향 혼선', '서두른 전달이나 엇갈린 일정 때문에 진행이 늦어질 수 있습니다.'],
  ['회복력, 경계, 마지막 힘', '지친 상태에서도 경험으로 세운 경계를 지키며 마지막 고비를 넘깁니다.', '피로, 경계 과잉, 의심', '상처를 경계심으로 굳혀 도움까지 막거나 버틸 힘이 약해질 수 있습니다.'],
  ['부담, 책임, 과로', '많은 책임을 짊어진 채 완수를 향하지만 부담을 나눌 필요가 있습니다.', '짐 내려놓기, 책임 회피, 소진', '과도한 짐을 덜어 내거나 감당하기 어려운 책임에서 벗어나려 합니다.'],
  ['탐색, 열정, 소식', '호기심 어린 열정으로 새로운 경험과 가능성을 탐색합니다.', '산만함, 성급함, 미숙한 열정', '흥미가 쉽게 바뀌거나 준비 없이 행동해 에너지를 낭비할 수 있습니다.'],
  ['모험, 추진력, 충동', '대담한 열정과 빠른 행동으로 새로운 목표를 향해 돌진합니다.', '무모함, 불안정, 성급함', '속도만 앞세워 약속을 지키지 못하거나 위험을 가볍게 볼 수 있습니다.'],
  ['자신감, 매력, 독립성', '따뜻한 자신감과 창조적인 리더십으로 사람과 기회를 끌어당깁니다.', '질투, 불안, 자기중심성', '인정 욕구가 강해져 타인을 견제하거나 자신감을 과장할 수 있습니다.'],
  ['비전, 지도력, 결단', '큰 그림을 보고 열정과 경험을 책임 있게 이끄는 힘이 돋보입니다.', '독단, 충동, 권력 남용', '자신의 비전을 강요하거나 성급한 판단으로 주변을 압박할 수 있습니다.'],
  ['감정의 시작, 사랑, 직관', '마음이 열리며 새로운 애정과 정서적 회복의 가능성이 솟아납니다.', '감정 억압, 공허함, 막힌 직관', '감정을 숨기거나 상처가 두려워 마음을 받아들이기 어려울 수 있습니다.'],
  ['상호 교감, 결합, 화해', '서로의 마음을 존중하는 교감과 균형 잡힌 연결이 깊어집니다.', '불균형, 단절, 오해', '감정의 주고받음이 어긋나거나 신뢰를 회복할 대화가 필요합니다.'],
  ['우정, 축하, 연대', '기쁨을 함께 나누는 우정과 공동체의 지지가 힘이 됩니다.', '과음, 소외, 관계 피로', '즐거움이 과해지거나 집단 안에서 소외와 뒷말이 생길 수 있습니다.'],
  ['권태, 무관심, 재평가', '익숙한 감정에 머물지 말고 눈앞의 새로운 가능성을 다시 살펴야 합니다.', '새 관심, 수용, 활력 회복', '닫혔던 마음이 열리며 지나쳤던 기회와 감정에 다시 관심을 둡니다.'],
  ['상실, 후회, 남은 가능성', '잃은 것에 대한 슬픔을 인정하되 아직 남아 있는 관계와 희망도 바라봐야 합니다.', '회복, 용서, 수용', '과거의 상실을 받아들이며 다시 연결하고 앞으로 나아갈 힘을 찾습니다.'],
  ['추억, 순수함, 재회', '따뜻한 기억과 익숙한 인연이 순수한 마음을 되살립니다.', '과거 집착, 미성숙, 현실 회피', '추억을 미화해 현재를 놓치거나 오래된 감정에 머물 수 있습니다.'],
  ['선택지, 환상, 유혹', '많은 가능성 속에서 환상과 현실을 구분해 진짜 원하는 것을 골라야 합니다.', '명료한 선택, 현실 확인, 집중', '혼란이 정리되며 실현 가능한 한 가지 방향에 집중하게 됩니다.'],
  ['떠남, 탐색, 감정적 전환', '익숙하지만 채워지지 않는 상황을 떠나 더 깊은 의미를 찾아 나섭니다.', '미련, 회피, 떠남의 두려움', '변화를 두려워해 만족스럽지 않은 관계나 상황에 계속 머물 수 있습니다.'],
  ['만족, 소원 성취, 즐거움', '바라던 감정적 만족과 자신이 이룬 것을 누리는 여유가 찾아옵니다.', '과욕, 피상적 만족, 허영', '겉으로는 충족되어 보여도 내면의 공허함이나 지나친 욕심이 남을 수 있습니다.'],
  ['가족의 행복, 조화, 유대', '사랑과 신뢰가 이어지는 관계 안에서 깊은 정서적 안정감을 느낍니다.', '가족 갈등, 기대 불일치, 단절', '이상적인 관계에 대한 기대가 현실의 차이와 갈등을 가릴 수 있습니다.'],
  ['감수성, 메시지, 상상력', '섬세한 감정과 창의적인 직관이 새로운 소식이나 표현으로 이어집니다.', '감정 미숙, 현실 도피, 과민함', '감정에 쉽게 휩쓸리거나 상상을 사실처럼 받아들일 수 있습니다.'],
  ['로맨스, 제안, 이상', '진심 어린 감정 표현과 낭만적인 제안이 관계를 움직입니다.', '감정 기복, 허황된 약속, 실망', '이상적인 말에 비해 행동이 부족하거나 기분에 따라 태도가 달라질 수 있습니다.'],
  ['공감, 직관, 정서적 성숙', '깊은 공감과 차분한 직관으로 감정을 품고 관계를 돌봅니다.', '감정 의존, 자기희생, 불안정', '타인의 감정에 지나치게 휩쓸리거나 자신의 욕구를 돌보지 못할 수 있습니다.'],
  ['감정 조절, 관용, 안정', '깊은 감정을 흔들림 없이 다루며 너그럽고 성숙하게 관계를 이끕니다.', '감정 억압, 냉담함, 조종', '감정을 숨긴 채 상대를 통제하거나 겉과 속이 다르게 반응할 수 있습니다.'],
  ['명료함, 진실, 결단', '혼란을 가르는 분명한 통찰과 솔직한 소통이 새 길을 엽니다.', '혼란, 냉혹함, 잘못된 판단', '사실을 왜곡하거나 지나치게 날카로운 말로 갈등을 키울 수 있습니다.'],
  ['교착, 선택 보류, 균형', '상반된 선택 사이에서 감정을 가라앉히고 충분한 정보를 살펴야 합니다.', '결정, 정보 과부하, 혼란', '미뤄 온 선택과 마주하지만 많은 정보와 감정 때문에 판단이 흐려질 수 있습니다.'],
  ['상처, 슬픔, 이별', '아픈 진실과 상실을 외면하지 않고 인정하는 과정이 필요합니다.', '치유, 용서, 고통 완화', '상처를 받아들이며 아픔을 놓고 회복과 화해를 향해 나아갑니다.'],
  ['휴식, 회복, 고요', '잠시 멈춰 몸과 마음을 쉬게 해야 다시 명확하게 움직일 수 있습니다.', '번아웃, 불안, 휴식 부족', '쉬지 못한 긴장이 쌓여 초조함과 피로가 더 커질 수 있습니다.'],
  ['갈등의 대가, 이기심, 긴장', '이기는 것보다 관계와 원칙에 남는 상처를 살펴야 합니다.', '화해, 후회, 갈등 종결', '다툼의 대가를 깨닫고 자존심을 내려놓으며 해결을 모색합니다.'],
  ['전환, 이동, 회복 과정', '어려운 국면을 지나 더 평온한 방향으로 천천히 이동합니다.', '정체, 미련, 해결되지 않은 문제', '과거의 문제를 놓지 못해 필요한 이동과 회복이 지연될 수 있습니다.'],
  ['전략, 은밀함, 독립 행동', '모든 것을 드러내기보다 신중한 전략과 독립적인 판단이 필요합니다.', '진실 폭로, 양심, 잘못된 전략', '숨긴 행동이 드러나거나 스스로 속임수를 인정하고 바로잡게 됩니다.'],
  ['속박감, 제한된 시야, 두려움', '스스로 만든 생각의 틀을 알아차리면 보이지 않던 출구를 찾을 수 있습니다.', '해방, 새로운 관점, 자기 회복', '두려움의 틀을 벗어나 선택권과 주도권을 되찾기 시작합니다.'],
  ['불안, 걱정, 악몽', '생각이 부풀린 두려움과 죄책감을 혼자 견디지 말고 현실과 구분해야 합니다.', '희망, 도움 요청, 불안 완화', '걱정을 말로 꺼내고 도움을 받아 마음의 압박에서 벗어나기 시작합니다.'],
  ['끝, 배신감, 최저점', '고통스러운 국면이 끝에 이르렀으므로 현실을 인정하고 새 출발을 준비해야 합니다.', '회복, 재생, 끝을 거부함', '최악의 순간에서 살아날 힘을 찾지만 끝난 일을 붙잡을 가능성도 있습니다.'],
  ['호기심, 관찰, 소통', '예리한 호기심으로 정보를 살피고 솔직한 생각을 표현합니다.', '험담, 성급한 말, 피상적 정보', '확인되지 않은 말을 퍼뜨리거나 경계심 때문에 소통이 날카로워질 수 있습니다.'],
  ['신속함, 야망, 직진', '명확한 목표를 향해 빠르고 단호하게 행동하는 힘이 커집니다.', '무모함, 공격성, 계획 부족', '결과를 생각하지 않고 밀어붙여 충돌과 실수를 만들 수 있습니다.'],
  ['명료함, 독립성, 경계', '감정에 휩쓸리지 않는 냉철한 판단과 건강한 경계가 필요합니다.', '냉소, 가혹함, 고립', '상처에서 나온 차가운 말과 엄격한 기준이 관계를 멀어지게 할 수 있습니다.'],
  ['지성, 원칙, 공정한 판단', '논리와 원칙을 바탕으로 사실을 정리하고 책임 있게 결정합니다.', '권력 남용, 냉혹함, 독단', '지성을 통제 수단으로 쓰거나 감정을 배제한 채 독단적으로 판단할 수 있습니다.'],
  ['현실적 기회, 기반, 번영의 씨앗', '금전과 일에서 실현 가능한 기회가 나타나 안정의 기반을 만들 수 있습니다.', '기회 상실, 불안정, 계획 부족', '현실적인 기회를 놓치거나 준비 부족으로 안정된 출발이 늦어질 수 있습니다.'],
  ['균형, 적응, 우선순위', '여러 책임과 자원을 유연하게 조율하며 균형을 유지해야 합니다.', '과부하, 혼란, 불균형', '감당할 일이 많아 우선순위와 재정 관리가 흔들릴 수 있습니다.'],
  ['협업, 숙련, 인정', '서로 다른 전문성을 모아 탄탄한 결과를 만드는 협력이 돋보입니다.', '협업 부족, 미숙함, 품질 저하', '소통과 기술이 맞지 않아 팀의 성과나 완성도가 떨어질 수 있습니다.'],
  ['보존, 통제, 소유', '안정을 지키려는 마음이 강해 자원과 감정을 단단히 붙잡는 흐름입니다.', '놓아줌, 낭비, 불안정', '통제를 풀고 나누기 시작하거나 반대로 관리 없이 자원을 흘려보낼 수 있습니다.'],
  ['결핍, 소외, 어려움', '물질적·정서적 부족감 속에서도 주변의 도움과 지원을 찾아야 합니다.', '회복, 지원, 어려움 완화', '필요한 도움을 받아 안정과 자신감을 서서히 회복하는 흐름입니다.'],
  ['나눔, 지원, 공정한 교환', '주고받음의 균형을 살피며 자원과 도움을 공정하게 나눕니다.', '불평등, 조건부 도움, 빚', '힘의 차이가 나눔을 왜곡하거나 대가를 바라는 지원이 부담이 될 수 있습니다.'],
  ['평가, 인내, 장기 투자', '지금까지의 성과를 점검하며 결실을 위해 꾸준히 기다릴 때입니다.', '조급함, 보상 부족, 방향 재검토', '노력에 비해 결과가 더뎌 투자 방식과 목표를 다시 살펴야 할 수 있습니다.'],
  ['숙련, 반복, 성실함', '꾸준한 연습과 세심한 작업이 실력과 안정된 성과를 쌓아 갑니다.', '완벽주의, 반복 피로, 노력 부족', '세부에 매몰되거나 성실함이 흐트러져 성장과 완성도가 낮아질 수 있습니다.'],
  ['자립, 풍요, 성취', '스스로 만든 안정과 여유를 누리며 독립적인 성취를 인정합니다.', '과소비, 의존, 겉치레', '풍요를 과시하거나 물질적 안정에 기대어 내면의 만족을 놓칠 수 있습니다.'],
  ['유산, 장기 안정, 가족 기반', '오래 이어질 자산과 관계의 기반을 세우며 안정된 결실을 나눕니다.', '가족 갈등, 재정 불안, 단기적 판단', '가족과 자산을 둘러싼 가치 충돌이 장기적인 안정을 흔들 수 있습니다.'],
  ['학습, 현실적 소식, 작은 기회', '배우려는 태도와 구체적인 계획이 현실적인 기회의 씨앗을 키웁니다.', '미루기, 계획 부족, 배움의 정체', '목표는 있지만 실행과 집중이 부족해 성장의 기회를 놓칠 수 있습니다.'],
  ['근면, 책임, 꾸준한 전진', '빠르지 않아도 계획대로 성실히 움직이며 확실한 결과를 만듭니다.', '정체, 완고함, 권태', '안전한 방식만 고집하거나 반복에 지쳐 진전이 멈출 수 있습니다.'],
  ['현실 감각, 돌봄, 안정', '실용적인 판단과 따뜻한 돌봄으로 사람과 자원을 안정적으로 가꿉니다.', '자기 소홀, 물질 집착, 불균형', '남을 챙기느라 자신을 잃거나 안정에 대한 불안이 소유욕으로 나타날 수 있습니다.'],
  ['풍요, 신뢰, 경영 능력', '경험과 현실 감각을 바탕으로 자원과 책임을 안정적으로 이끕니다.', '탐욕, 경직, 물질만능', '성과와 소유에 집착해 사람과 가치보다 이익을 앞세울 수 있습니다.'],
] as const

const fieldLead = [
  ['연애에서는', '직업에서는', '금전에서는', '관계에서는'],
  ['감정 관계에서는', '업무에서는', '재정 흐름에서는', '주변 사람들과는'],
  ['사랑의 흐름에서는', '일과 성장에서는', '수입과 지출에서는', '인간관계에서는'],
] as const

const localizeMeaning = (core: KoreanCore, reversed: boolean, id: number): TarotMeaning => {
  const keywords = core[reversed ? 2 : 0].split(', ')
  const summary = core[reversed ? 3 : 1]
  const lead = fieldLead[id % fieldLead.length]
  const tendency = reversed ? '그림자 측면이 드러날 수 있으니' : '핵심 흐름을 살리려면'

  return {
    keywords,
    summary,
    love: `${lead[0]} ${summary}`,
    career: `${lead[1]} ${summary}`,
    money: `${lead[2]} ${summary}`,
    relationship: `${lead[3]} ${summary}`,
    advice: `${tendency} ${keywords[0]}에 주의를 기울이고 현재 선택을 차분히 점검하세요.`,
    shadow: reversed
      ? `${keywords.slice(0, 2).join('과 ')}이 과해지면 판단과 소통이 흐려질 수 있습니다.`
      : `${keywords[0]}을 지나치게 밀어붙이면 ${core[2].split(', ')[0]}의 모습으로 기울 수 있습니다.`,
  }
}

const localizeThemes = (core: KoreanCore, id: number): TarotThemes => {
  const keywords = core[0].split(', ')
  const timing = [
    '상황을 살피며 점진적으로 전개되는 흐름입니다.',
    '준비가 갖춰질수록 움직임이 또렷해지는 시기입니다.',
    '변화의 신호가 나타난 뒤 속도가 붙을 수 있습니다.',
    '서두르기보다 자연스러운 전환을 기다릴 필요가 있습니다.',
  ][id % 4]

  return {
    emotion: `${keywords[0]}을 중심으로 ${keywords[1]}의 감정이 함께 작용합니다.`,
    action: `${keywords[2]}을 현실적인 행동으로 옮기려는 경향이 나타납니다.`,
    subconscious: `내면에서는 ${keywords[0]}과 ${keywords[1]}을 통해 균형을 찾으려 합니다.`,
    outcome: `현재 흐름이 이어지면 ${core[1]}`,
    timing,
  }
}

export const tarotCards: TarotCard[] = [...majorCards, ...minorCards].map((card) => {
  const core = koreanCores[card.id]

  return {
    ...card,
    upright: localizeMeaning(core, false, card.id),
    reversed: localizeMeaning(core, true, card.id),
    themes: localizeThemes(core, card.id),
  }
})
