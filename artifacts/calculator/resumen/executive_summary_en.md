# Executive summary: AI and tutoring in education

AI tutoring can improve learning, but what matters most is how it is implemented: protected time in the timetable, someone in charge of making it happen, and tools that demand effort. Open access to chatbots worsens what students learn without them, and generative AI does not yet show a clear advantage over cheaper adaptive practice. Cost evidence is scarce (8 of 247 verified studies report cost per student) and there are almost no rigorous trials from low income countries or Latin America, so pilot with independent evaluation before scaling.

This summary accompanies the [AI Education Impact and Investment Lab](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/), an exploratory site that brings together EvidencIA, the Stanford SCALE AI Hub and the AI and Human Skill Atlas.

## Five conclusions for deciding

1. **Structure pays off more than the tool.** In India, what was randomized was staff who guaranteed two Khan Academy sessions a week, not the platform: math rose 0.33 to 0.44 standard deviations (SD), at USD 14 per student over seven months ([Oreopoulos et al., 2026](https://www.nber.org/papers/w34683)). In Tennessee, with the AI tutor one click away, the gain was 0.04 SD per term and the authors attribute it to structured practice, not to the chat ([Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620)).
2. **The open chatbot does not teach.** In Turkey, open access to GPT 4 improved practice, but the exam without AI fell 17%; with hints instead of answers the harm disappeared, with no gain ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)). EvidencIA rates this lesson as consistent.
3. **Generative AI does not yet beat adaptive practice.** A meta analysis of 14 trials finds 0.125 SD on average for adaptive and AI technology, with no detectable advantage for generative AI ([Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf), from EvidencIA's own network). Human tutoring achieves 0.37 SD on average and 0.25 in large studies ([Nickow et al., 2020](https://doi.org/10.3386/w27476)).
4. **Cost is poorly known.** Only 8 of the 247 studies in the verified core report cost per student, and each computes it differently (licenses, total pilot or projection). Treat it as an order of magnitude, not a price.
5. **The evidence comes from few places, and much of it is produced by the developers themselves.** Of 247 verified studies, 161 are from high income countries and 3 from low income countries; the developer took part in 110 of 161 tool evaluations, and only 25 measure learning two or more weeks later.

## The 8 lessons

Evidence strength separates what causal trials show from what descriptive studies only suggest or guides and policies recommend. Each lesson's detail and sources are in the site's Lessons tab.

| Theme | Lesson | Evidence | What to do first |
| --- | --- | --- | --- |
| Design and dose | Avoid open chatbots for learning: choose tools that demand effort. | Consistent causal | Require the tool to give hints and steps, not the final answer. |
| Implementation, cost and scale | Pay for the structure, not only the tool. | Moderate causal | Reserve fixed sessions in the timetable and budget for someone to ensure them. |
| Teachers | Support teachers to teach better, not only to prepare faster. | Moderate causal | Train them to judge AI output and protect data; pair the tool with coaching. |
| Students | Teach students to use AI as a tutor: ask for explanations and steps, not answers. | Moderate causal | Give concrete usage instructions and ask them to try before consulting. |
| Infrastructure | Diagnose first and design for the connectivity you actually have. | Partial, mostly descriptive | Run a readiness diagnostic and budget for devices and technical support. |
| Setting | Prefer the school timetable with supervision: outside school, attendance drops. | Partial, mostly descriptive | Build sessions into the timetable; outside school, measure attendance. |
| Inclusion and equity | Do not assume AI closes gaps: measure who gains from the start. | Partial, mostly descriptive | Break down results by starting level, gender, disability, area and language. |
| Privacy and governance | Protect data before deploying: no study tests it, but almost every policy requires it. | Guides and policies only | Run a data protection impact assessment before buying. |

## Effect and cost

The cheapest programs are not the ones with the smallest effect, but each cost was computed differently, so they should not be ranked by “effect per dollar” without saying what each figure covers. Effects use EvidencIA's common rule (coefficient divided by the control group SD).

| Program | Effect (SD) | Cost per student | Keep in mind |
| --- | --- | --- | --- |
| [Supervised Khan Academy practice, India](https://www.nber.org/papers/w34683) | +0.44 | USD 14 over seven months, mostly staff | 44.5% without endline test; not generative AI |
| [Rori over WhatsApp, Ghana](https://doi.org/10.1007/978-3-031-64315-6_34) | +0.37 | USD 5, authors' projection | Level 2: 11 schools, 25% attrition; not generative AI |
| [Gemini Guided Learning, Sierra Leone](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) | +0.30 | Not reported | Developer report, not peer reviewed |
| [Copilot as English tutor, Nigeria](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) | +0.24 | USD 48, total pilot cost | 42.8% without endline test; adds extra time and supervision |
| [ShaIA for teachers, Bogotá](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) | +0.21 | USD 9.14, licenses and coaching | Preliminary result in 29 of 158 schools |
| [Saga tutoring with software, Chicago and New York](https://www.nber.org/papers/w32510) | +0.19 | USD 2,200, human tutors included | External standardized test; no high risk of bias |
| [Khanmigo, Tennessee](https://www.nber.org/papers/w35620) | +0.05 | USD 15 a year, licenses only | External test; authors attribute the effect to practice, not the chat |

The Harvard trial ([Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6), +0.63) is left out of this table: EvidencIA takes its effect from the paper because the data to apply the common rule are missing, and it was measured in the same session after a single lesson.

## How solid the evidence is

There is a real causal base, but a narrow one: it can guide decisions, not promise an effect in a specific country. Figures from EvidencIA (database cutoff 16 Oct 2026; consulted 18 Nov 2026).

| Indicator | Value |
| --- | --- |
| Verified level 1 trials (randomized, measure learning without AI) | 99 studies: 70 on AI, 29 without AI; 71 field and 28 lab |
| Verified core studies that report cost per student | 8 of 247 |
| Core studies that measure two or more weeks later | 25 of 247 |
| Tool evaluations with the developer's involvement | 110 of 161 (31 independent) |
| Core studies by country income | high 161, upper middle 36, lower middle 15, low 3 |
| Core studies in Latin America and the Caribbean | 19 of 247 |

Still unknown: whether effects last months later; how much of the effect comes from the tool and how much from the structure around it; what happens in low income countries and public schools in the region; whether AI closes or widens gaps (the trials point both ways); and whether the data protections that policies require change the risks. No verified study measured critical thinking separately with a test.

## Recommendations

These recommendations are our own synthesis of the evidence above; they do not come from any single study.

**For ministries**

1. Fund the structure along with the tool: fixed sessions in the timetable, one person in charge per school, and monitoring of actual use.
2. In procurement, require tools that give hints and steps instead of answers, with practice adapted to each level; avoid the open chatbot as a learning tool.
3. Compare with cheaper options (adaptive practice, small group tutoring) and compute the all in cost per student: devices, connectivity, staff and training.
4. Pilot before scaling, with a randomized and independent evaluation, a test without AI and a measurement months later, and results broken down by starting level, gender, area and disability.
5. Before adopting a tool, run a data protection impact assessment and sign agreements that keep data with the school.

**For research**

1. Report cost per student with a common method and say what it covers.
2. Measure with tests without AI, external and delayed, not only at the end of the session.
3. Separate the contribution of the tool from that of the structure (extra time, supervision, training), with arms that allow it.
4. Increase independent evaluations and trials in low income countries and Latin America.
5. Report results by subgroup and measure skills that are not measured today, such as critical thinking.

## Sources and method

Figures come from the [EvidencIA](https://mcp.redevidencia.org/) connector (Latin American network on AI and learning science; database cutoff 16 Oct 2026, consulted 18 Nov 2026), which includes the Stanford SCALE AI Hub collection, and from the [AI and Human Skill Atlas](https://aiskillatlas.org/) (release 2026-11-11.1), used with attribution for exploratory purposes. Effects are in standard deviations under EvidencIA's common rule; they may differ from each paper's published figure. The lessons and recommendations were distilled by Claude; EvidencIA's curated lessons are a prototype (version 0.2.0) pending review by its committee. They are inputs for deciding and should be corroborated in the local context.

Studies cited: [Oreopoulos et al., 2026](https://www.nber.org/papers/w34683) · [Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620) · [Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122) · [Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf) · [Nickow et al., 2020](https://doi.org/10.3386/w27476) · [Henkel et al., 2024](https://doi.org/10.1007/978-3-031-64315-6_34) · [LearnLM Team & Fab AI, 2026](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) · [De Simone et al., 2025](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) · [Barrera-Osorio & Muñoz-Morales, 2026](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) · [Bhatt et al., 2024](https://www.nber.org/papers/w32510) · [Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6)

Site with the detail, the explorer of 99 trials and the calculator: [AI Education Impact and Investment Lab](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/).
