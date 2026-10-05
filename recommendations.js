(function () {
  "use strict";
  const translations = {};
  function text(en, es) { translations[en] = es; return en; }
  const library = {};
  function entry(id, action, actionEs, check, checkEs, maintain, maintainEs) {
    library[id] = {action: text(action, actionEs), check: text(check, checkEs)};
    if (maintain) library[id].maintain = text(maintain, maintainEs);
  }
  entry("ages",
    "Test whether AI provides a clear benefit for the learners' ages and needs compared with completing the same task without AI.",
    "Comprueba si la IA ofrece un beneficio claro para las edades y necesidades del alumnado frente a realizar la misma tarea sin IA.",
    "Check and record evidence that the AI suits learners' ages and needs, including adult support where needed.",
    "Comprueba y registra evidencia de que la IA se adapta a las edades y necesidades del alumnado, incluido el apoyo adulto cuando sea necesario.",
    "Build on the recorded evidence of age suitability by checking it again when the tool, activities or learner groups change.",
    "Utiliza la evidencia registrada sobre la adecuación a la edad y revísala cuando cambien la herramienta, las actividades o el alumnado.");
  entry("fairness",
    "Compare results across relevant learner groups and languages, then address differences that could disadvantage some people.",
    "Compara los resultados entre los grupos de alumnado e idiomas pertinentes y corrige las diferencias que puedan perjudicar a algunas personas.",
    "Check and record whether results differ unfairly across relevant learner groups, languages and education settings.",
    "Comprueba y registra si los resultados presentan diferencias injustas entre los grupos de alumnado, idiomas y contextos educativos pertinentes.",
    "Repeat the documented fairness checks when the data, users or education setting change.",
    "Repite las comprobaciones de equidad documentadas cuando cambien los datos, las personas usuarias o el contexto educativo.");
  entry("oversight",
    "Give trained staff a clear way to check, change or stop an AI result before it affects anyone.",
    "Ofrece al personal capacitado una forma clara de comprobar, modificar o detener un resultado de la IA antes de que afecte a alguien.",
    "Confirm and record who can check, change or stop AI results and whether they have the training, time and authority to do so.",
    "Confirma y registra quién puede comprobar, modificar o detener los resultados de la IA y si dispone de capacitación, tiempo y autoridad para hacerlo.",
    "Keep the documented human review process effective by checking that staff can still question outputs and intervene when needed.",
    "Mantén eficaz el proceso documentado de revisión humana comprobando que el personal pueda seguir cuestionando los resultados e intervenir cuando sea necesario.");
  entry("accountability",
    "Assign clear responsibilities for the AI's educational purpose, operation, data protection and monitoring.",
    "Asigna responsabilidades claras sobre el propósito educativo de la IA, su funcionamiento, la protección de datos y el seguimiento.",
    "Confirm and record who is responsible for the AI's purpose, operation, data protection and monitoring.",
    "Confirma y registra quién es responsable del propósito de la IA, su funcionamiento, la protección de datos y el seguimiento.",
    "Use the assigned responsibilities to agree a review date and check that evidence and safeguards stay current.",
    "Utiliza las responsabilidades asignadas para acordar una fecha de revisión y comprobar que la evidencia y las medidas de protección sigan vigentes.");
  entry("data",
    "Check that the data reflect the people and education setting involved, and address outdated information or missing groups.",
    "Comprueba que los datos reflejen a las personas y el contexto educativo implicados y corrige la información desactualizada o los grupos ausentes.",
    "Record checks showing whether the data are current, suitable and representative of the people affected.",
    "Registra comprobaciones que indiquen si los datos son actuales, adecuados y representativos de las personas afectadas.");
  entry("transparency",
    "Explain in simple language what the AI does, its limits and who people can contact for help.",
    "Explica con palabras sencillas qué hace la IA, cuáles son sus límites y a quién se puede acudir para pedir ayuda.",
    "Check that affected people can find and understand information about the AI's purpose, limits and responsible team.",
    "Comprueba que las personas afectadas puedan encontrar y comprender información sobre el propósito de la IA, sus límites y el equipo responsable.",
    "Use the documented explanation to help new users understand the AI's limits and when to ask for human help.",
    "Utiliza la explicación documentada para ayudar a las nuevas personas usuarias a comprender los límites de la IA y cuándo pedir ayuda humana.");
  entry("independent",
    "Ask someone outside the development or purchasing team to review the main risks before use or expansion.",
    "Pide a alguien ajeno al equipo de desarrollo o compra que revise los principales riesgos antes del uso o la ampliación.",
    "Confirm and record whether someone outside development or purchasing has reviewed the main risks.",
    "Confirma y registra si alguien ajeno al desarrollo o la compra ha revisado los principales riesgos.");
  entry("harms",
    "Discuss possible harms with affected learners, families and staff, including people who may be overlooked in the data.",
    "Analiza los posibles daños con el alumnado, las familias y el personal afectados, incluidas las personas que puedan quedar fuera de los datos.",
    "Check and record who could be harmed or excluded, using input from the people affected.",
    "Comprueba y registra quién podría sufrir daños o quedar excluido, utilizando las aportaciones de las personas afectadas.");
  entry("access",
    "Provide an accessible alternative so learners can participate when language, disability, connectivity or cost prevents them from using AI.",
    "Ofrece una alternativa accesible para que el alumnado participe cuando el idioma, la discapacidad, la conectividad o el costo impidan utilizar la IA.",
    "Check with affected people whether language, disability, connectivity or cost limits access, and record the alternatives available.",
    "Comprueba con las personas afectadas si el idioma, la discapacidad, la conectividad o el costo limitan el acceso y registra las alternativas disponibles.",
    "Keep the accessible alternatives available and check them with new learner groups before expanding the use.",
    "Mantén disponibles las alternativas accesibles y compruébalas con nuevos grupos de alumnado antes de ampliar el uso.");
  entry("explanation",
    "Give people an understandable explanation of important AI results and a clear way to request human review.",
    "Ofrece a las personas una explicación comprensible de los resultados importantes de la IA y una forma clara de solicitar revisión humana.",
    "Check and record whether important AI results can be explained and reviewed by a responsible person.",
    "Comprueba y registra si una persona responsable puede explicar y revisar los resultados importantes de la IA.");
  entry("security",
    "Work with the responsible technical team to address unauthorised access, misuse and data leakage before use or expansion.",
    "Trabaja con el equipo técnico responsable para corregir el acceso no autorizado, el uso indebido y las filtraciones de datos antes del uso o la ampliación.",
    "Ask the responsible technical team to confirm and record protections against unauthorised access, misuse and data leakage.",
    "Pide al equipo técnico responsable que confirme y registre las medidas contra el acceso no autorizado, el uso indebido y las filtraciones de datos.");
  entry("recovery",
    "Agree who will respond to problems and how the education process will continue safely if the AI is stopped.",
    "Acuerda quién responderá a los problemas y cómo continuará el proceso educativo de forma segura si se detiene la IA.",
    "Confirm and record who responds to problems and what alternative process is available if the AI is stopped.",
    "Confirma y registra quién responde a los problemas y qué proceso alternativo está disponible si se detiene la IA.");
  entry("privacy",
    "Collect only the personal data needed for the task and agree clear rules for access, supplier use and deletion.",
    "Recopila solo los datos personales necesarios para la tarea y acuerda reglas claras de acceso, uso por proveedores y eliminación.",
    "Confirm what personal data the tool collects and how the institution and supplier protect it before use.",
    "Confirma qué datos personales recoge la herramienta y cómo los protegen la institución y el proveedor antes del uso.",
    "Keep the documented data protections current when the purpose, data collected or supplier arrangements change.",
    "Mantén vigentes las medidas documentadas de protección de datos cuando cambien el propósito, los datos recogidos o los acuerdos con proveedores.");
  entry("challenge",
    "Give learners, families and staff a simple way to report problems, challenge results and receive a timely human response.",
    "Ofrece al alumnado, las familias y el personal una forma sencilla de comunicar problemas, cuestionar resultados y recibir una respuesta humana oportuna.",
    "Check and record how people can report problems, challenge results and receive a timely human response.",
    "Comprueba y registra cómo pueden las personas comunicar problemas, cuestionar resultados y recibir una respuesta humana oportuna.");
  entry("agency",
    "Design activities that require learners to explain their own thinking and discuss ideas with teachers or peers when using AI.",
    "Diseña actividades que requieran que el alumnado explique su propio razonamiento y dialogue con docentes o compañeros al utilizar IA.",
    "Check and record how AI use affects learners' own thinking, human relationships and staff workload.",
    "Comprueba y registra cómo afecta el uso de IA al razonamiento propio del alumnado, las relaciones humanas y la carga de trabajo del personal.",
    "Build on the recorded wellbeing checks by asking learners and staff whether AI continues to support their thinking, relationships and work.",
    "Utiliza las comprobaciones registradas de bienestar para preguntar al alumnado y al personal si la IA sigue apoyando su razonamiento, sus relaciones y su trabajo.");
  entry("sustainability",
    "Compare the ongoing costs, energy needs and supplier dependence with the educational benefit before expanding the use.",
    "Compara los costos continuos, las necesidades energéticas y la dependencia del proveedor con el beneficio educativo antes de ampliar el uso.",
    "Check and record ongoing costs, energy needs and options for changing suppliers or stopping the use.",
    "Comprueba y registra los costos continuos, las necesidades energéticas y las opciones para cambiar de proveedor o dejar de utilizar la herramienta.");
  const messages = {
    pause: text("Pause this use and seek the appropriate specialist review before proceeding.", "Pausa este uso y solicita la revisión especializada correspondiente antes de continuar."),
    clarify: text("Clarify the possible serious harm or legal concern with the responsible specialist before proceeding.", "Aclara la posible preocupación sobre daños graves o legalidad con la persona especialista responsable antes de continuar."),
    stop: text("Keep the use on hold and record why the remaining risks are too serious to proceed.", "Mantén el uso detenido y registra por qué los riesgos restantes son demasiado graves para continuar."),
    thorough: text("Complete the Thorough assessment and agree the safeguards needed before deciding whether to proceed.", "Completa la evaluación detallada y acuerda las medidas de protección necesarias antes de decidir si continuar."),
    high: text("Arrange the appropriate education, rights, data and technical review before relying on this use.", "Organiza la revisión educativa, de derechos, datos y técnica correspondiente antes de confiar en este uso."),
    pilot: text("Run the planned pilot with clear limits, success criteria and a review date before expanding.", "Realiza el piloto previsto con límites claros, criterios de éxito y una fecha de revisión antes de ampliar el uso."),
    training: text("Give staff practical training, time and authority to question AI outputs and decide when another approach is more suitable.", "Ofrece al personal capacitación práctica, tiempo y autoridad para cuestionar los resultados de la IA y decidir cuándo conviene otro enfoque."),
    policy: text("Review the relevant policy, data arrangements or supplier contract with the responsible team before proceeding.", "Revisa la política, los acuerdos sobre datos o el contrato del proveedor pertinentes con el equipo responsable antes de continuar."),
    safeguards: text("Agree the additional safeguards and how their effectiveness will be checked before proceeding.", "Acuerda las medidas de protección adicionales y cómo se comprobará su eficacia antes de continuar."),
    riskRecord: text("Record the main remaining risks, who could be affected and the safeguards planned.", "Registra los principales riesgos restantes, quién podría verse afectado y las medidas de protección previstas."),
    plan: text("Give each priority action a responsible person and a target date in the action plan.", "Asigna a cada acción prioritaria una persona responsable y una fecha prevista en el plan de acción."),
    repeat: text("Repeat the review when the purpose, tool, data, supplier or people affected change.", "Repite la revisión cuando cambien el propósito, la herramienta, los datos, el proveedor o las personas afectadas."),
    discuss: text("Review the recorded risks and decision with the responsible team before expanding the use.", "Revisa los riesgos y la decisión registrados con el equipo responsable antes de ampliar el uso."),
    na: text("Review the reasons for safeguards marked not applicable when the purpose or users change.", "Revisa los motivos de las medidas marcadas como no aplicables cuando cambien el propósito o las personas usuarias."),
    decision: text("Record the next step with the responsible team after reviewing the risks and safeguards.", "Registra el próximo paso con el equipo responsable después de revisar los riesgos y las medidas de protección.")
  };
  text("Recommendations informed by UNESCO guidance and matched to your answers; agree responsibility and a target date for each priority action.", "Recomendaciones basadas en orientaciones de UNESCO y adaptadas a tus respuestas; acuerda responsabilidades y una fecha prevista para cada acción prioritaria.");
  text("All follow up actions", "Todas las acciones de seguimiento");
  text("Priority recommendations", "Recomendaciones prioritarias");
  text("Confirm the evidence", "Confirma la evidencia");
  text("Strengthen this safeguard", "Refuerza esta medida de protección");
  text("Maintain or build on this strength", "Mantén o aprovecha esta fortaleza");
  text("Review next steps", "Revisa los próximos pasos");
  for (let n = 1; n <= 6; n++) text("Risk " + String(n).padStart(2, "0"), "Riesgo " + String(n).padStart(2, "0"));
  for (let n = 1; n <= 4; n++) {
    text("Core " + String(n).padStart(2, "0"), "Salvaguarda " + String(n).padStart(2, "0"));
    text("Governance " + String(n).padStart(2, "0"), "Gobernanza " + String(n).padStart(2, "0"));
    text("Action " + String(n).padStart(2, "0"), "Acción " + String(n).padStart(2, "0"));
  }
  text("Risk screen", "Evaluación inicial del riesgo");
  text("Recorded decision", "Decisión registrada");
  function basis(refs) { return "Based on " + [...new Set(refs)].join(", "); }
  function select(path, d, states, refs) {
    const candidates = [], strengths = [];
    const add = (id, action, sources, priority, kind = "Review next steps") => candidates.push({id, action, basis: basis(sources), kind, priority});
    const definitions = path === "quick" ? [
      ["oversight", ["human_review"], 98], ["ages", ["basic_testing"], 97],
      ["fairness", ["non_discrimination"], 90], ["accountability", ["owner", "data_governance"], 83],
      ["data", ["data_curation"], 80], ["transparency", ["system_documentation"], 75],
      ["independent", ["independent_review"], 85]
    ] : [
      ["harms", ["hr1"], 90], ["fairness", ["hr2"], 89], ["access", ["hr3"], 88],
      ["transparency", ["tr1"], 75], ["explanation", ["tr2"], 84], ["ages", ["sr1"], 97],
      ["security", ["sr2"], 98], ["recovery", ["sr3"], 86], ["privacy", ["pr1", "pr2"], 99],
      ["accountability", ["ha1"], 83], ["oversight", ["ha2"], 98], ["challenge", ["ha3"], 87],
      ["agency", ["sw1"], 91], ["sustainability", ["sw2"], 78]
    ];
    for (const [id, ids, weight] of definitions) {
      const weak = ids.filter(q => !["good", "na"].includes(states[q]));
      const known = weak.filter(q => ["gap", "partial"].includes(states[q]));
      if (weak.length) add(id, path === "thorough" && id === "oversight" && known.length ? messages.training : library[id][known.length ? "action" : "check"], weak.map(q => refs[q]),
        weight + (weak.some(q => states[q] === "gap") ? 12 : known.length ? 6 : 0),
        known.length ? "Strengthen this safeguard" : "Confirm the evidence");
      else if (ids.some(q => states[q] === "good") && library[id].maintain)
        strengths.push({id, action: library[id].maintain, basis: basis(ids.filter(q => states[q] === "good").map(q => refs[q])), kind: "Maintain or build on this strength", priority: weight});
    }
    const decision = path === "quick" ? d.answers.review_outcome?.answer || "" : d.answers.synth4 || "";
    const decisionRef = path === "quick" ? "Action 04" : "8.3";
    const risk = path === "quick" ? Object.fromEntries(d.quickRisk.answers.filter(Boolean).map(x => [x.q.id, x.index])) : d.riskScreen;
    const severe = path === "quick" ? risk.severe === 2 : risk.severeUse === "Yes";
    const uncertainSevere = path === "quick" ? risk.severe === 1 : risk.severeUse === "Possibly or unsure";
    if (severe || decision.startsWith("Pause")) add("stop", messages.pause, [severe ? path === "quick" ? "Risk 04" : "Risk 06" : decisionRef], 1000);
    else if (decision.startsWith("Do not proceed") || path === "quick" && d.answers.residual_decision?.answer?.startsWith("No."))
      add("stop", messages.stop, [decision.startsWith("Do not proceed") ? decisionRef : "Action 03"], 1000);
    else if (uncertainSevere) add("stop", messages.clarify, [path === "quick" ? "Risk 04" : "Risk 06"], 950);
    if (path === "quick" && !severe && d.quickRisk.tier >= 1)
      add("route", messages.thorough, d.quickRisk.answers.filter(x => x && x.option.tier >= 1).map(x => "Risk " + String(["influence", "data", "reach", "severe"].indexOf(x.q.id) + 1).padStart(2, "0")), 200);
    if (path === "thorough" && d.screening.tier === "High") add("route", messages.high, ["Risk screen"], 200);
    if (path === "quick" && risk.influence === 3) add("oversight", library.oversight.action, ["Risk 01"], 180, "Strengthen this safeguard");
    if (path === "thorough" && ["Only after the decision or action", "No", "Unsure"].includes(risk.humanCheck))
      add("oversight", library.oversight[risk.humanCheck === "Unsure" ? "check" : "action"], ["Risk 02"], 180, risk.humanCheck === "Unsure" ? "Confirm the evidence" : "Strengthen this safeguard");
    const sensitive = path === "quick" ? risk.data === 1 || risk.data === 2 || risk.data === 3 : risk.dataSensitivity && risk.dataSensitivity !== "No personal or confidential institution level data";
    if (sensitive && (path === "quick" || !candidates.some(x => x.id === "privacy") && !["pr1", "pr2"].every(q => states[q] === "good")))
      add("privacy", library.privacy.check, [path === "quick" ? "Risk 02" : "Risk 03"], 105, "Confirm the evidence");
    if (!candidates.some(x => x.id === "stop")) {
      if (/staff capacity/i.test(decision)) add("oversight", messages.training, [decisionRef], 150);
      else if (/policy, data governance or procurement/i.test(decision)) add("accountability", messages.policy, [decisionRef], 150);
      else if (/pilot/i.test(decision)) add("pilot", messages.pilot, [decisionRef], 150);
      else if (/safeguards/i.test(decision) || path === "quick" && d.answers.residual_decision?.answer?.startsWith("Not yet."))
        add("plan", messages.safeguards, [decisionRef, ...(path === "quick" && d.answers.residual_decision?.answer?.startsWith("Not yet.") ? ["Action 03"] : [])], 130);
    }
    const riskText = path === "quick" ? d.answers.risk_summary?.answer : d.answers.synth1;
    const planText = path === "quick" ? d.answers.action_owner?.answer : d.answers.synth2;
    if (!riskText) add("riskRecord", messages.riskRecord, [path === "quick" ? "Action 01" : "8.1"], 92, "Confirm the evidence");
    if (!planText) add("plan", messages.plan, [path === "quick" ? "Action 02" : "8.2"], 93, "Confirm the evidence");
    if (!decision) add("decision", messages.decision, [decisionRef], 94, "Confirm the evidence");
    const selected = [], byId = new Map();
    for (const item of candidates.sort((a, b) => b.priority - a.priority)) {
      if (byId.has(item.id)) {
        const existing = byId.get(item.id);
        const merged = [existing.basis.slice(9), item.basis.slice(9)].join(", ").split(", ");
        existing.basis = basis(merged);
      } else { const copy = {...item}; byId.set(item.id, copy); selected.push(copy); }
    }
    for (const item of strengths.sort((a, b) => b.priority - a.priority)) if (selected.length < 3 && !byId.has(item.id)) { selected.push(item); byId.set(item.id, item); }
    if (selected.length < 3 && Object.values(states).includes("na")) selected.push({id:"applicability", action:messages.na, basis:basis(Object.keys(states).filter(q => states[q] === "na").map(q => refs[q])), kind:"Review next steps"});
    for (const [id, action, source] of [["repeat", messages.repeat, "Risk screen"], ["discuss", messages.discuss, "Recorded decision"]])
      if (selected.length < 3) selected.push({id, action, basis:basis([source]), kind:"Review next steps"});
    return selected.slice(0, 5).map(({priority, ...item}) => item);
  }
  function quick(d, scale) {
    const states = {}, refs = {};
    for (const [section, ids] of [["Core", ["non_discrimination", "human_review", "basic_testing", "owner"]], ["Governance", ["data_governance", "data_curation", "system_documentation", "independent_review"]]])
      ids.forEach((id, i) => { const index = scale.indexOf(d.answers[id]?.answer || ""); states[id] = ["good", "partial", "partial", "gap", "na"][index] || "unknown"; refs[id] = section + " " + String(i + 1).padStart(2, "0"); });
    return select("quick", d, states, refs);
  }
  function thorough(d, sections) {
    const states = {}, refs = {};
    sections.filter(s => s.id !== "residual").forEach((section, i) => section.questions.forEach((q, j) => {
      const index = q.options.findIndex(o => o.label === d.answers[q.id]);
      states[q.id] = ["good", "partial", "gap", "unknown", "na"][index] || "unknown";
      refs[q.id] = (i + 2) + "." + (j + 1);
    }));
    return select("thorough", d, states, refs);
  }
  window.assessmentRecommendations = {quick, thorough, translations, format: item => item.action + " " + item.basis};
})();
