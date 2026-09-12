import type { TarotCard, TarotElement, TarotRank } from '../types/tarot'

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
  { id: 0, number: 0, name: 'The Fool', nameKo: '바보', slug: '00-the-fool', element: 'air', astrology: 'Aries', planet: 'Neptune' },
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
      nameKo: `${suit.ko} ${rawName}`,
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

export const tarotCards: TarotCard[] = [...majorCards, ...minorCards]
