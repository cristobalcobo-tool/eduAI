# Verification protocol for the factor heat map

Version 1, 19 Nov 2026. This protocol is applied identically by three independent coders (A, B, C). Coders do not see each other's work or any earlier coding. Work only from the texts provided in this folder (and, in the coding phase, the source pack files). Do not use memory about a study.

## Goal

For AI in education studies published in 2025 or later, record whether each of nine factors was tested and whether it was found to change learning.

## Phase 1: Screening (eligibility)

Include a candidate only if ALL of these hold:

- E1 AI in education: the intervention uses AI (generative AI, chatbots, LLM tutors, intelligent tutoring or adaptive systems, AI feedback, AI used by teachers) in a learning setting.
- E2 Rigorous design: randomized trial, quasi experiment with a comparison group, meta analysis, or a systematic review that synthesizes evidence on learning outcomes. Exclude: single group pre and post designs without a comparison group, surveys, correlational or observational studies, qualitative studies, scoping or mapping reviews that do not synthesize learning effects, conceptual papers, protocols, technical benchmarks.
- E3 Learning outcome: learning is measured with a test, exam, grade or performance task. Exclude studies whose outcomes are only motivation, self efficacy, engagement, perceptions, satisfaction, wellbeing or mental health.
- E4 Published 2025 or later.
- E5 At least one of the nine factors below is TESTED (see "What counts as tested").

Exclusion reason codes: NOAI, DESIGN, OUTCOME, YEAR, NOFACTOR, OTHER (explain). If the text is insufficient to judge, choose the most likely answer and set "unsure": true.

## The nine factors

- acceso (access): devices, connectivity, hardware, infrastructure, or whether each student has their own access or shares it (for example 1 to 1 versus shared). The basic contrast "AI versus no AI" is NOT this factor.
- pedagogia (pedagogical integration): how AI is embedded in instruction: in class versus out of class, blended versus fully online or classroom only, collaborative versus individual, learner centered versus teacher centered, project based, level of integration into lessons, structured activities or routines around the AI, pacing set by the learner versus the system.
- duracion (duration and dose): length of the intervention, number or frequency of sessions, amount of use.
- contexto (socioeconomic and cultural context): country income, region, culture, students' or schools' socioeconomic status, urban versus rural.
- docente (teacher support and human oversight): presence, amount or role of a teacher, tutor or other human who supports, supervises or orchestrates students while they learn with AI. NOT this factor: comparisons of AI versus a human teacher or tutor (AI replacing a human); AI tools that help teachers do their work, unless the study varies how much humans are involved with students' AI use; mentions of teacher training as a barrier without a measured effect.
- diseno (tool design and how it is used): features of the AI tool or how students are told to use it: hints versus full answers, tutor role, built in scaffolding, feedback type or timing, personalization or adaptivity, modality (voice, text, embodiment), model accuracy, restrictions on when it can be used, tool type compared as a moderator (for example chatbot versus intelligent tutoring system).
- formacion (training students to use AI): instruction or guidance given to students on how to use AI, or students' AI literacy analyzed as a moderator.
- estudiantes (learner level and prior achievement): education level or grade, prior achievement or knowledge, proficiency, self regulation, gender, other learner characteristics.
- materia (subject and task type): discipline, subject, skill type, knowledge type, task type.

## What counts as tested

A factor is TESTED in a study only if one of these is true:

1. The study randomly or deliberately varies the factor between arms (for example a tutor that gives hints versus one that gives answers).
2. The study analyzes the factor as a moderator or subgroup of the learning effect (meta analysis moderator, subgroup analysis, interaction).
3. A systematic review explicitly synthesizes how the factor relates to learning outcomes across studies.

NOT tested: the factor is only described, recommended, speculated about, listed as a barrier, or held constant. Results on motivation, engagement or perceptions only do not count; the factor must relate to a learning outcome.

## Codes for each tested factor

- C (critical): the factor changes learning: significant moderator, the arms differ on learning, or the review concludes it matters for learning. Direction does not matter.
- M (mixed or conditional): matters for some outcomes, subgroups or conditions but not others; marginal significance; conflicting findings; the review says effects are conditional or inconsistent.
- N (not decisive): tested, and no difference in learning was found.
- Leave the factor out if it was not tested.

## Evidence

For every code give a verbatim quote (40 words or fewer) from the source text and say where it comes from: "abstract", "full text" (with section or page if available) or "EvidencIA record". If you cannot quote support, do not code the factor.

## Output format

Phase 1 (screening): a JSON list, one object per candidate:
{"id": "...", "include": true|false, "reason": "NOAI|DESIGN|OUTCOME|YEAR|NOFACTOR|OTHER|", "design": "MA|SR|RCT|QE|", "unsure": false, "note": "short"}

Phase 2 (coding): a JSON list, one object per included study:
{"id": "...", "design": "MA|SR|RCT|QE", "source_used": "full text|abstract|EvidencIA record", "factors": {"diseno": {"code": "C", "quote": "...", "where": "abstract"}, ...}, "note": "short"}
