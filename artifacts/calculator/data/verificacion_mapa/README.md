# How the factor heat map was verified

Version 3 of the heat map in the "Lessons for deploying" tab, 20 Nov 2026.

## Why it was redone

Version 1 (19 Nov 2026) was coded from abstracts by a single pass of Claude. After a reader questioned the teacher support figure, Claude recoded it with a stricter rule (version 2). That correction was also made by a single pass without independent checking. Version 3 replaces both with a documented, blind, triple check.

## Steps

1. **Written protocol.** Before any coding, the rules were fixed in [PROTOCOLO.md](PROTOCOLO.md): eligibility criteria E1 to E5, definitions of the nine factors, what counts as "tested", the codes C, M and N, and the requirement to quote the source verbatim.
2. **Candidate pool (291).**
   - 252 articles from Consensus searches on 19 Nov 2026 (published 2025 or later): the 251 from the version 1 searches plus one trial found by title.
   - 39 trials from 2025 and 2026 in EvidencIA's verified base that were not already in the Consensus set. 8 EvidencIA records matched Consensus articles and were merged with them.
   - List: [candidatos.csv](candidatos.csv).
3. **Blind screening by three coders.**
   - Three Claude agents (A, B and C) each judged all 291 candidates against the protocol. None could see the others' work or the earlier map.
   - A study was included when at least 2 of the 3 included it.
   - Result: 127 included. Fleiss kappa 0.935. 14 decisions were split 2 to 1.
   - Files: [cribado.csv](cribado.csv).
4. **Source pack.**
   - For each included study, a file was built with the Consensus abstract and the EvidencIA record (where one existed).
   - Retrieval agents searched for open full text in two passes, plus a final pass for searches that had been cut short by tool limits. They copied verbatim passages on results and moderator analyses, and did not code anything.
   - Open full text was found for 45 of the 127 studies. For the rest, no open copy was found, or the site blocked the retrieval tool.
   - Per study status: [texto_completo.csv](texto_completo.csv).
   - The full text extracts are not republished here because of copyright. The short quotes used as evidence are in the coding files.
5. **Blind coding by three coders.**
   - Three new Claude agents per coder letter coded all 127 studies from the source pack only. They had no web access and no access to the earlier map or to each other's files.
   - For every factor they coded, they gave the code, a verbatim quote of 40 words or fewer and its location.
   - A separate script check found 744 of the 747 quotes word for word in the source files. The other 3 are one sentence (study c145) that the source file splits across two extract lines; coder A joined the lines and noted it.
   - Files: [codificacion_A.json](codificacion_A.json), [codificacion_B.json](codificacion_B.json), [codificacion_C.json](codificacion_C.json).
6. **Reconciliation by rule** ([conciliar_codigos.py](conciliar_codigos.py)).
   - A factor counts only if at least 2 of the 3 coders marked it as tested. The code is the majority code.
   - No factor lacked a majority, so nothing needed adjudication.
   - 11 codes given by a single coder were dropped.
   - 28 codes rest on 2 of 3 coders.
   - Agreement over 1,143 study by factor cells:
     - Fleiss kappa 0.938 on the code, with "not tested" as a category.
     - Fleiss kappa 0.967 on tested versus not tested.
   - 8 included studies had no factor tested by majority and were left out of the map.
   - Files: [codigos_conciliados.json](codigos_conciliados.json), [acuerdo.json](acuerdo.json).
7. **Lead reviewer check.**
   - Claude checked the 11 dropped single coder codes against the source and kept every majority decision. Reasons: [REVISION_LIDER.md](REVISION_LIDER.md).
8. **Rebuild.**
   - The map data was regenerated from the reconciled codes: 119 studies.
   - Each study records which text the majority used (full text 37, abstract 69, EvidencIA record 13) and how many coders agreed on each factor.
   - Plain language notes per study were then rewritten from the source files and the final codes. The hover summaries per factor were rewritten from the full list of quotes.

## Before and after (share of studies that find the factor critical)

| Factor | Version 1 (19 Nov) | Version 2 (strict recode, 19 Nov) | Version 3 (verified, 20 Nov) |
|---|---|---|---|
| Teacher support and human oversight | 30% of 10 | 57% of 7 | 50% of 8 |
| Tool design and how it is used | 77% of 47 | 78% of 49 | 52% of 64 |
| Education level and prior achievement | 67% of 36 | 67% of 36 | 55% of 49 |
| Subject and task type | 74% of 23 | 74% of 23 | 56% of 41 |
| Duration and dose | 58% of 24 | 58% of 24 | 58% of 36 |
| Training students to use AI | 60% of 5 | 75% of 4 | 71% of 7 |
| Access to devices and AI | 20% of 5 | 33% of 3 | 75% of 4 |
| Pedagogical integration | 81% of 26 | 85% of 26 | 77% of 30 |
| Socioeconomic and cultural context | 100% of 7 | 100% of 7 | 89% of 9 |

Version 1 had 85 studies, version 2 had 84 and version 3 has 119. The biggest change is in tool design, subject and learner level. Reading full texts and the EvidencIA trials added many tests that found no difference or mixed results.

## Limits

- **The coders are AI models.** They are independent instances of Claude following the same protocol, not human experts. High agreement shows they applied the rules consistently. It does not prove the rules capture everything a human reviewer would see.
- **Most codes come from abstracts.** 72 of the 127 included studies were coded from the abstract only (69 of the 119 in the map). Abstracts of meta analyses often list moderators without full results.
- **Retrieval was partial.** Some open full texts could not be read because publisher sites blocked the retrieval tool. Some extracts are fragments or table rows returned by that tool.
- **Counting is not effect size.** Meta analyses can include the same primary studies, and many effects are short term.
- **Possible duplicate publication.** One review (c133) also appears in another journal under a near identical title. The open copy used for its extracts is that other publication.
