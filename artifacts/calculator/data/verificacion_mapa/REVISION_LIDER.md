# Lead reviewer check (Claude, 20 Nov 2026)

The protocol gives the lead reviewer two jobs: adjudicate any factor where the three coders gave no majority code, and check the split decisions against the source text.

## Adjudications

No factor needed adjudication. Wherever at least two coders marked a factor as tested, at least two of them also gave the same code. The file adjudicaciones.json is therefore empty.

## Single coder codes that the majority rule dropped (11)

Each one was checked against its source file. In all 11 the majority decision was kept. Reasons:

| Study | Factor | Coder and code | Why the drop stands |
|---|---|---|---|
| c12 | docente | B: C | The quote compares teacher directed with self directed learning. The protocol lists teacher centered versus learner centered under pedagogia, and all three coders coded pedagogia C for this study. |
| c14 | diseno | C: M | The quote says gains from generative tools are "limited". It does not compare tool designs. |
| c23 | materia | A: M | The quote compares types of outcome (problem solving, critical thinking, creativity). Two coders did not read this as a subject or task moderator. |
| c41 | diseno, estudiantes | C: M | A single sentence lists several conditions in general terms. It does not report a learning test for each factor. |
| c113 | formacion | A: C | "Users with prior experience benefited more" is about prior experience. The other two coders coded it under estudiantes (C, 2 of 3). |
| c128 | diseno | C: C | The arms differ in a pedagogical routine (decomposition or collaborative planning). Two coders coded it as pedagogia C. |
| c166 | pedagogia | C: C | The review recommends pedagogical integration. It does not report a synthesis of learning effects by type of integration. |
| c238 | diseno | A: C | The quote describes how much AI feedback the teaching assistants adopted. Two coders coded this as dose (duracion C). |
| e:eeuu guia instruccional | pedagogia | C: M | Guided versus unguided AI use. Two coders coded this as guidance to students (formacion M). |
| e:gemini sierra leona | duracion | C: C | "Completing the planned 12 hours" is an effect estimate for students who completed the course. It does not compare different doses. |

## Codes accepted with 2 of 3 coders (28)

These are listed in codigos_conciliados.json under "log" or with "agree": "2/3". They were accepted by the majority rule and were not changed.

## Spot check

Quotes for every factor were read in one list per factor. No code was changed. Some codes rest on general sentences from review abstracts, for example c45 (access, "institutional digital readiness") and c166 (learner characteristics, "unequal benefits across student groups"). They meet rule 3 of the protocol because a review synthesizes the factor, but they are weak evidence. The page says that codes from abstracts of reviews are less precise than codes from full text.
