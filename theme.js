(function () {
  function addBrand() {
    document.querySelectorAll("header").forEach(function (header) {
      if (header.querySelector(".site-brand")) return;
      var link = document.createElement("a");
      link.className = "site-brand";
      link.href = "index.html";
      link.innerHTML = '<span class="site-brand-mark"></span><span>Responsible AI in Education Compass</span>';
      header.insertBefore(link, header.firstChild);
    });
  }
  function enhanceExport() {
    var summaryButton = document.getElementById("summaryBtn") || document.getElementById("buildBtn");
    var pdfButton = document.getElementById("pdfBtn");
    if (!summaryButton || !pdfButton) return;
    var panel = summaryButton.closest("section");
    if (!panel || panel.dataset.exportEnhanced) return;
    panel.dataset.exportEnhanced = "true";
    panel.classList.add("export-panel");
    var heading = panel.querySelector(":scope > h2");
    var intro = panel.querySelector(":scope > p.small");
    var progress = panel.querySelector(":scope > .bar");
    var actions = panel.querySelector(":scope > .actions");
    var ready = panel.querySelector("#summaryReady");
    var status = panel.querySelector("#status, #validation");
    if (!actions) return;
    var summaryDownload = document.getElementById("summaryDownloadBtn");
    var jsonButton = document.getElementById("jsonBtn");
    var textButton = document.getElementById("textBtn");
    var printButton = document.getElementById("printBtn");
    var clearButton = document.getElementById("clearBtn");
    if (textButton) textButton.textContent = "Download text report";
    var groups = document.createElement("div");
    groups.className = "export-groups";
    function makeGroup(number, title, description, extraClass) {
      var group = document.createElement("div");
      group.className = "export-group" + (extraClass ? " " + extraClass : "");
      var head = document.createElement("div");
      head.className = "export-group-head";
      head.innerHTML = '<span class="export-kicker">' + number + '</span><div><h3>' + title + '</h3><p>' + description + '</p></div>';
      group.appendChild(head);
      return group;
    }
    var summaryGroup = makeGroup("1", "Build the assessment review summary", "Create the readable findings view before downloading the record.", "summary");
    var summaryActions = document.createElement("div");
    summaryActions.className = "export-actions";
    summaryActions.append(summaryButton);
    if (summaryDownload) summaryActions.append(summaryDownload);
    summaryGroup.append(summaryActions);
    if (ready) summaryGroup.append(ready);
    var pdfGroup = makeGroup("2", "Download the full results PDF", "Save the results, final decision and all responses for your team records.", "pdf");
    var pdfActions = document.createElement("div");
    pdfActions.className = "export-actions";
    pdfActions.append(pdfButton);
    pdfGroup.append(pdfActions);
    var pdfNote = document.createElement("p");
    pdfNote.textContent = "The PDF includes the complete response record. For selectable text and screen reader access, download the HTML summary or text report.";
    pdfGroup.append(pdfNote);
    var toolsGroup = makeGroup("3", "Other formats and page controls", "Use these options for machine readable data, a text record, printing or a fresh start.", "tools");
    var toolsActions = document.createElement("div");
    toolsActions.className = "export-actions";
    [jsonButton, textButton, printButton, clearButton].forEach(function (button) { if (button) toolsActions.append(button); });
    toolsGroup.append(toolsActions);
    groups.append(summaryGroup, pdfGroup, toolsGroup);
    panel.replaceChildren();
    if (heading) panel.append(heading);
    if (intro) panel.append(intro);
    if (progress) panel.append(progress);
    panel.append(groups);
    if (status) { status.classList.add("export-status"); panel.append(status); }
  }
  function enhanceNavigation() {
    document.querySelectorAll(".package-nav, .policy-nav").forEach(function (nav) {
      if (nav.dataset.navEnhanced) return;
      var links = Array.from(nav.querySelectorAll("a"));
      var home = links.find(function (a) { return a.getAttribute("href") === "index.html"; });
      var instructions = links.find(function (a) { return a.getAttribute("href") === "instructions.html"; });
      var quick = links.find(function (a) { return a.getAttribute("href") === "quick-assessment.html"; });
      var thorough = links.find(function (a) { return a.getAttribute("href") === "thorough-assessment.html"; });
      var scoring = links.find(function (a) { return a.getAttribute("href") === "scoring.html"; });
      var policy = links.find(function (a) { return a.getAttribute("href") === "policy-and-data.html"; });
      if (!home || !instructions || !quick || !thorough || !scoring || !policy) return;
      quick.classList.add("assessment-nav-link", "assessment-nav-quick");
      thorough.classList.add("assessment-nav-link", "assessment-nav-thorough");
      nav.replaceChildren(home, instructions, quick, thorough, scoring, policy);
      nav.dataset.navEnhanced = "true";
    });
  }
  function addAssessmentStepper() {
    var nav = document.querySelector(".package-nav, .policy-nav");
    var quick = document.getElementById("quickRiskQuestions");
    var thorough = document.getElementById("assessment");
    if (!nav || (!quick && !thorough) || document.querySelector(".assessment-stepper")) return;
    function addStepAnchor(element, id) {
      if (!element || document.getElementById(id)) return;
      var anchor = document.createElement("span");
      anchor.id = id;
      anchor.className = "step-anchor";
      anchor.setAttribute("aria-hidden", "true");
      element.insertBefore(anchor, element.firstChild);
    }
    var steps;
    if (quick) {
      var record = document.querySelector(".record-panel");
      var risk = quick.closest("section");
      var core = document.getElementById("core");
      var governance = document.getElementById("governance");
      var summary = document.getElementById("summary");
      if (record) record.id = "step-context";
      if (risk) risk.id = "step-risk";
      if (core) core.closest("section").id = "step-safeguards";
      if (governance) governance.closest("section").id = "step-governance";
      addStepAnchor(summary, "step-summary");
      steps = [["Context", "#step-context"], ["Risk screen", "#step-risk"], ["Safeguards", "#step-safeguards"], ["Governance", "#step-governance"], ["Summary", "#step-summary"]];
    } else {
      var recordThorough = document.querySelector(".record-panel");
      var screen = document.querySelector(".screening");
      var practice = thorough.closest("section");
      var report = document.getElementById("report");
      if (recordThorough) recordThorough.id = "step-context";
      if (screen) screen.id = "step-risk";
      if (practice) practice.id = "step-practice";
      var exportPanel = document.querySelector(".export-panel") || document.getElementById("buildBtn")?.closest("section");
      if (exportPanel) exportPanel.id = "step-summary";
      addStepAnchor(report, "step-report");
      steps = [["Context", "#step-context"], ["Risk screen", "#step-risk"], ["Six principles", "#step-practice"], ["Summary and export", "#step-summary"]];
    }
    var stepper = document.createElement("nav");
    stepper.className = "assessment-stepper";
    stepper.setAttribute("aria-label", "Assessment progress");
    stepper.innerHTML = steps.map(function (step, index) { return '<a class="step-link" href="' + step[1] + '"><span>' + String(index + 1).padStart(2, "0") + '</span>' + step[0] + '</a>'; }).join("");
    nav.insertAdjacentElement("afterend", stepper);
  }
  function clarifyHome() {
    var hero = document.querySelector(".hero");
    if (!hero || document.querySelector(".hero-clarity")) return;
    var context = hero.querySelector(".eyebrow");
    var title = hero.querySelector("h1");
    var lead = hero.querySelector("p");
    var tags = hero.querySelector(".hero-tags");
    var actions = hero.querySelector(".hero-actions");
    if (context && lead) {
      context.classList.add("context-label");
      context.textContent = "Responsible AI self assessment for education";
      lead.textContent = "Review risk, governance and responsible use across the education system.";
      lead.insertAdjacentElement("afterend", context);
    }
    var clarity = document.createElement("div");
    clarity.className = "hero-clarity";
    clarity.innerHTML = '<div><strong>What it is</strong><span>Review impacts, safeguards and residual risk in education.</span></div><div><strong>Who it is for</strong><span>Education authorities, institutions and cross functional teams.</span></div><div><strong>How it works</strong><span>Discuss, choose a depth and export the agreed record.</span></div>';
    if (tags) tags.insertAdjacentElement("beforebegin", clarity);
    else if (title) title.insertAdjacentElement("afterend", clarity);
    if (tags) {
      tags.className = "hero-pathways";
      tags.innerHTML = '<a class="hero-pathway" href="instructions.html"><span class="pathway-label">Education context</span><strong>Agree the answers as a team</strong><small>Bring together the education, policy, technical and oversight functions relevant to the use.</small><span class="pathway-arrow" aria-hidden="true">↗</span></a><a class="hero-pathway" href="thorough-assessment.html"><span class="pathway-label">System review</span><strong>Run a thorough review</strong><small>Examine safeguards, governance and residual risk across six common categories.</small><span class="pathway-arrow" aria-hidden="true">↗</span></a><a class="hero-pathway" href="quick-assessment.html"><span class="pathway-label">Quick review</span><strong>Start with the main risk signals</strong><small>Identify priority gaps and the appropriate next step.</small><span class="pathway-arrow" aria-hidden="true">↗</span></a>';
    }
    if (actions) actions.remove();
  }
  function iconSvg(name) {
    var paths = {
      clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"></rect><path d="M9 4.5V3h6v1.5M9 12l2 2 4-4"></path>',
      gauge: '<path d="M4.5 17a8 8 0 1 1 15 0"></path><path d="M12 13l3.5-3.5"></path><path d="M7.5 17h9"></path>',
      scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"></path><circle cx="11" cy="11" r="3.5"></circle><path d="m14 14 3 3"></path>',
      alert: '<path d="M10.3 4.2 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.7 4.2a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4M12 17h.01"></path>',
      shield: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path>',
      landmark: '<path d="m3 9 9-5 9 5M5 10h14M6 10v7M10 10v7M14 10v7M18 10v7M4 20h16"></path>',
      scale: '<path d="M12 3v18M7 6h10M5 6l-3 6h6L5 6ZM19 6l-3 6h6l-3-6ZM8 21h8"></path>',
      export: '<path d="M14 3h-7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"></path><path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5"></path>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[name] + '</svg>';
  }
  function addSectionIcons() {
    var pathwayIcons = ["clipboard", "scan", "gauge"];
    var rules = [
      [/work through this review as a team/i, "clipboard"],
      [/quick risk screen|preliminary risk screen/i, "alert"],
      [/core safeguards/i, "shield"],
      [/governance and documentation/i, "landmark"],
      [/priority risks and next steps|residual risk decision/i, "scale"],
      [/thorough ethical practice assessment/i, "scan"],
      [/six principle assessment/i, "scan"],
      [/build and export|export and review/i, "export"],
      [/^who should take part$/i, "clipboard"],
      [/^choose one of two assessments$/i, "scan"],
      [/^how to complete a review$/i, "gauge"],
      [/^when to revisit the assessment$/i, "alert"],
      [/^understand the result$/i, "scale"],
      [/^browser and data handling$/i, "shield"],
      [/^1\. quick assessment route$/i, "gauge"],
      [/^2\. thorough assessment weighted screen$/i, "scan"],
      [/^2\. thorough assessment risk screen$/i, "scan"],
      [/^3\. practice indicators: what to improve$/i, "shield"],
      [/^3\. six principle indicators$/i, "shield"],
      [/^4\. residual risk after safeguards$/i, "scale"],
      [/^use the result to make a decision$/i, "clipboard"],
      [/^what this page clarifies$/i, "clipboard"],
      [/^follow the information flow$/i, "scan"],
      [/^what each pathway gives you$/i, "gauge"],
      [/^how information is handled$/i, "shield"],
      [/^how policymakers can use findings$/i, "landmark"],
      [/^primary references$/i, "landmark"],
      [/^standalone use and data handling$/i, "shield"],
      [/^how this english package was assembled$/i, "clipboard"],
      [/^limits and evidence distinctions$/i, "alert"],
      [/^reuse and attribution$/i, "export"],
      [/^2\. equity, non discrimination and reducing inequality$/i, "scale"],
      [/^3\. digital inclusion and accessibility$/i, "shield"],
      [/^4\. transparency and explainability$/i, "scan"],
      [/^5\. human oversight and accountability$/i, "clipboard"],
      [/^6\. privacy and personal data protection$/i, "shield"],
      [/^7\. technical robustness and security$/i, "shield"],
      [/^8\. accountability, contestability and remedy$/i, "landmark"],
      [/^9\. socio environmental sustainability$/i, "scale"],
      [/^10\. ai awareness, literacy and training$/i, "clipboard"],
      [/^11\. project and data governance$/i, "landmark"],
      [/^12\. additional legal and policy compliance$/i, "landmark"],
      [/^13\. ai lifecycle review$/i, "gauge"],
      [/^14\. risk synthesis, mitigation and residual risk$/i, "scale"]
      ,[/^2\. human rights, dignity and equity$/i, "scale"]
      ,[/^3\. transparency and explainability$/i, "scan"]
      ,[/^4\. security and robustness$/i, "shield"]
      ,[/^5\. privacy and data protection$/i, "shield"]
      ,[/^6\. human oversight and accountability$/i, "clipboard"]
      ,[/^7\. sustainability and wellbeing$/i, "scale"]
      ,[/^8\. risk synthesis, mitigation and residual risk$/i, "scale"]
    ];
    function decorate() {
      document.querySelectorAll(".hero-pathway .pathway-label").forEach(function (label, index) {
        if (pathwayIcons[index] && !label.querySelector(".section-icon")) label.insertAdjacentHTML("afterbegin", '<span class="section-icon pathway-icon">' + iconSvg(pathwayIcons[index]) + '</span>');
      });
      document.querySelectorAll("h2, h3").forEach(function (heading) {
        var text = heading.textContent.trim();
        var match = rules.find(function (rule) { return rule[0].test(text); });
        if (match && !heading.querySelector(".section-icon")) heading.insertAdjacentHTML("afterbegin", '<span class="section-icon">' + iconSvg(match[1]) + '</span>');
      });
    }
    decorate();
    if (!document.documentElement.dataset.iconObserver) {
      document.documentElement.dataset.iconObserver = "true";
      new MutationObserver(decorate).observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
    }
  }
  function enhanceFooters() {
    document.querySelectorAll(".footer").forEach(function (footer) {
      if (footer.querySelector(".footer-purpose")) return;
      var existing = footer.querySelector("span");
      if (!existing) return;
      var meta = document.createElement("span");
      meta.className = "footer-meta";
      meta.textContent = existing.textContent;
      var purpose = document.createElement("span");
      purpose.className = "footer-purpose";
      purpose.textContent = "Responsible AI self assessment for education systems · Review risk, governance and practical action.";
      existing.replaceChildren(purpose, meta);
    });
  }
  function refineRecommendations() {
    var text = {
      e1: "Identify affected groups, record the bias evidence and assign a corrective action.",
      e2: "Assign an owner and success measure to each selected fairness control.",
      e3: "Test relevant groups, record limitations and assign action for any material disparity.",
      e4: "Define the equity outcome, measure, owner and review date, or record why it is not an objective.",
      a1: "Test with disabled users, record the standard and gaps, and set remediation dates.",
      a2: "Provide an assisted route of comparable quality, publish how to request it and monitor delays.",
      t1: "Publish a plain language notice at the point of use and include it in service materials.",
      t2: "Set an explanation request route, response timeframe and human review contact.",
      t3: "Publish a plain language system summary and retain the detailed record for oversight.",
      h1: "Set human review before impact for high consequence decisions and document override authority.",
      h2: "Name trained intervention staff, set response times and test the fallback.",
      h3: "Name one accountable role and record responsibilities and escalation routes.",
      p1: "Map each purpose to lawful authority and record the approval and review trigger.",
      p2: "Remove unnecessary fields and retention, and record the minimisation decision.",
      p3: "Publish the rights route, service standard and escalation path.",
      p4: "Complete the impact assessment, track actions and obtain approval before deployment.",
      p5: "Record controls, owners, evidence and the incident response contact.",
      r1: "Keep test protocols, results and limitations, including misuse and failure cases.",
      r2: "Threat model the model, data, interfaces and suppliers; record mitigations and remaining threats.",
      r3: "Set monitoring indicators, thresholds, owners and escalation steps.",
      r4: "Test fallback and recovery under realistic failure conditions and record the result.",
      d1: "Maintain a responsibility matrix across the lifecycle and review it at each decision gate.",
      d2: "Publish a challenge process with response times and a route to human review.",
      d3: "Keep proportionate records that support audit, correction and accountability.",
      d4: "Schedule an appropriately independent review of technical and social effects and track actions.",
      s1: "Measure resource use, set an efficiency target and review it after major changes.",
      s2: "Consult affected staff, assess workforce effects and plan support or retraining.",
      l1: "Train operators for their actual decisions and refresh training after system changes.",
      l2: "Provide plain language information on use, limits, alternatives and how to seek help.",
      g1: "Document data decision rights, assign approval authority and record accountability.",
      g2: "Maintain a data inventory, quality checks, update schedule and named owner.",
      g3: "Give the oversight function authority, evidence access and a documented escalation route.",
      g4: "Approve and communicate policy for in house and procured AI, including roles.",
      g5: "Record who was consulted, the issues raised, the decision and what changed.",
      g6: "Put measurable duties, evidence rights, incident notice and exit support in the contract.",
      law1: "Maintain a legal register with an owner and update it when law or purpose changes.",
      c1: "Record selection criteria, trade offs and the approval decision.",
      c2: "Run a bounded pilot with success, harm and stop criteria; document the go or no go decision.",
      c3: "Set review frequency, measures, owners, escalation rules and improvement actions.",
      c4: "Plan retirement, data disposition, supplier exit and notice to affected people.",
      synth1: "List harms, affected groups, causes, evidence and remaining uncertainty.",
      synth2: "For each key risk, record the safeguard, owner, timing and residual rating with a brief reason.",
      synth4: "Record the decision, conditions, dissent and review date; send high or unresolved risk to the authorised body."
    };
    document.querySelectorAll("[data-qid]").forEach(function (field) {
      var note = field.querySelector(".hint-details > div");
      if (note && text[field.dataset.qid]) note.textContent = text[field.dataset.qid];
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addBrand);
  else addBrand();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhanceExport);
  else enhanceExport();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhanceNavigation);
  else enhanceNavigation();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addAssessmentStepper);
  else addAssessmentStepper();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", clarifyHome);
  else clarifyHome();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhanceFooters);
  else enhanceFooters();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", refineRecommendations);
  else refineRecommendations();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addSectionIcons);
  else addSectionIcons();
}());

(function () {
  "use strict";
  var ES = {
    "Civic AI Compass | Self assessment for public sector AI": "Civic AI Compass | Autoevaluación para IA del sector público",
    "Civic AI Compass | Instructions": "Civic AI Compass | Instrucciones",
    "Civic AI Compass | Policy and data": "Civic AI Compass | Políticas y datos",
    "Civic AI Compass | Quick assessment": "Civic AI Compass | Evaluación rápida",
    "Civic AI Compass | Scoring": "Civic AI Compass | Puntuación e interpretación",
    "Civic AI Compass | Sources and method": "Civic AI Compass | Fuentes y método",
    "Civic AI Compass | Thorough assessment": "Civic AI Compass | Evaluación detallada",
    "Civic AI Compass · concise first review": "Civic AI Compass · primera revisión breve",
    "A clear 24 question team review that does not require specialist knowledge.": "Una revisión clara de 24 preguntas para equipos que no requiere conocimientos especializados.",
    "24 questions": "24 preguntas",
    "Prepare for local use": "Preparar para el uso local",
    "Discuss each prompt with people who understand the system, its data, safeguards, affected groups and legal context. Compare evidence, resolve differences and agree the response before one person records the result.": "Conversen sobre cada pregunta con personas que conozcan el sistema, sus datos, salvaguardas, grupos afectados y contexto legal. Comparen la evidencia, resuelvan las diferencias y acuerden la respuesta antes de que alguien la registre.",
    "This thorough working form supports a structured review. It is not a certification, legal opinion or automated approval.": "Este formulario de trabajo detallado apoya una revisión estructurada. No es una certificación, opinión legal ni aprobación automatizada.",
    "Confirm local laws, risk thresholds, accessibility standards and institutional roles before relying on the assessment.": "Confirma las leyes locales, los umbrales de riesgo, las normas de accesibilidad y los roles institucionales antes de basarte en la evaluación.",
    "Answers stay in this browser, are not submitted to an assessment service and are cleared when the page closes. Export a report to keep a copy.": "Las respuestas permanecen en este navegador, no se envían a un servicio de evaluación y se borran al cerrar la página. Exporta un informe para conservar una copia.",
    "Preliminary risk screen": "Evaluación preliminar de riesgos",
    "Identify uses that may need stronger safeguards or specialist advice.": "Identifica usos que pueden necesitar salvaguardas más sólidas o asesoramiento especializado.",
    "Know what the system does, who checks it, what information it uses and what could happen if it is wrong.": "Conoce qué hace el sistema, quién lo revisa, qué información utiliza y qué podría ocurrir si se equivoca.",
    "A percentage based screening signal. It supports, but does not replace, the team’s final decision.": "Una señal de evaluación basada en porcentajes. Apoya, pero no sustituye, la decisión final del equipo.",
    "Six principle assessment": "Evaluación de los seis principios",
    "Review all six principles shown on the home page.": "Revisa los seis principios mostrados en la página de inicio.",
    "Bring any useful policies, test results, instructions and names of responsible people. Ask colleagues when you are unsure.": "Trae las políticas, resultados de pruebas, instrucciones y nombres de las personas responsables que sean útiles. Pregunta a tus colegas cuando tengas dudas.",
    "Six equally weighted principle indicators, practical actions and a final decision.": "Seis indicadores de principios con el mismo peso, acciones prácticas y una decisión final.",
    "Build and export": "Crear y exportar",
    "Download text report": "Descargar informe de texto",
    "Print or save as PDF": "Imprimir o guardar como PDF",
    "Download the full results PDF for dimension scores and findings.": "Descarga el PDF completo de resultados con las puntuaciones por dimensión y los hallazgos.",
    "Skip to content": "Ir al contenido",
    "Self assessment for public sector AI": "Autoevaluación para IA del sector público",
    "Navigate risk, governance, and responsible use.": "Navega los riesgos, la gobernanza y el uso responsable.",
    "What it is": "Qué es",
    "Review impacts, safeguards and residual risk.": "Revisa los impactos, las salvaguardas y el riesgo residual.",
    "Who it is for": "Para quién es",
    "Civil servants, public officers and review teams.": "Personal funcionario, autoridades públicas y equipos de revisión.",
    "How it works": "Cómo funciona",
    "Discuss, choose a depth and export the agreed record.": "Conversen, elijan una profundidad y exporten el registro acordado.",
    "Agree the answers as a team": "Acuerden las respuestas como equipo",
    "Use the toolkit as a shared review, not a solitary form.": "Usen la herramienta como una revisión compartida, no como un formulario individual.",
    "Run a thorough review": "Realiza una revisión detallada",
    "Examine safeguards, governance and residual risk.": "Examina las salvaguardas, la gobernanza y el riesgo residual.",
    "Start a quick review": "Inicia una revisión rápida",
    "Find priority gaps and practical next steps.": "Encuentra brechas prioritarias y próximos pasos prácticos.",
    "Self assessment": "Autoevaluación",
    "Complete individually or as a team": "Completa la evaluación individualmente o en equipo",
    "Quick or Thorough review": "Revisión rápida o detallada",
    "Start a Quick review": "Iniciar una revisión rápida",
    "How to use the toolkit": "Cómo usar la herramienta",
    "Assessment pages": "Páginas de evaluación",
    "Assessment overview": "Resumen de la evaluación",
    "Assessment options": "Opciones de evaluación",
    "Home": "Inicio",
    "Instructions": "Instrucciones",
    "Quick assessment": "Evaluación rápida",
    "Thorough assessment": "Evaluación detallada",
    "Scoring": "Puntuación",
    "Policy & data": "Políticas y datos",
    "What this is": "Qué es esto",
    "A structured way to ask the right questions before and during AI use": "Una forma estructurada de plantear las preguntas adecuadas antes y durante el uso de IA",
    "AI used in public services can influence access, safety, rights and trust. This assessment gives teams a shared structure for reviewing likely effects, recording evidence and deciding what safeguards or changes are needed.": "La IA utilizada en servicios públicos puede influir en el acceso, la seguridad, los derechos y la confianza. Esta evaluación ofrece a los equipos una estructura común para revisar los efectos probables, registrar evidencias y decidir qué salvaguardas o cambios se necesitan.",
    "A self assessment, by design": "Una autoevaluación, por diseño",
    "Public service AI": "IA en servicios públicos",
    "For teams that commission, design, procure, operate or oversee AI in public services.": "Para equipos que encargan, diseñan, adquieren, operan o supervisan IA en servicios públicos.",
    "Identify potential harms, examine safeguards and make uncertainty visible before it becomes harder to address.": "Identifica posibles daños, examina las salvaguardas y haz visible la incertidumbre antes de que sea más difícil abordarla.",
    "Record what is working, what needs improvement, who is responsible and when the team will review it.": "Registra qué funciona, qué necesita mejorar, quién es responsable y cuándo lo revisará el equipo.",
    "Find risks early": "Detecta los riesgos temprano",
    "Turn findings into action": "Convierte los hallazgos en acciones",
    "Ethical principles": "Principios éticos",
    "What the assessment helps teams consider": "Qué ayuda a considerar esta evaluación",
    "Human rights, dignity and equity": "Derechos humanos, dignidad y equidad",
    "Look for unequal effects, discrimination and impacts on people’s rights.": "Busca efectos desiguales, discriminación e impactos en los derechos de las personas.",
    "Transparency and explainability": "Transparencia y explicabilidad",
    "Make AI use understandable and decisions open to appropriate review.": "Haz comprensible el uso de la IA y permite una revisión adecuada de las decisiones.",
    "Security and robustness": "Seguridad y robustez",
    "Test safe operation, reliability, failure handling and misuse.": "Prueba la operación segura, la fiabilidad, la gestión de fallos y el uso indebido.",
    "Privacy and data protection": "Privacidad y protección de datos",
    "Limit data use, protect information and respect people’s rights.": "Limita el uso de datos, protege la información y respeta los derechos de las personas.",
    "Human oversight and accountability": "Supervisión humana y rendición de cuentas",
    "Keep responsible people able to intervene, explain and correct.": "Mantén la capacidad de las personas responsables para intervenir, explicar y corregir.",
    "Sustainability and wellbeing": "Sostenibilidad y bienestar",
    "Consider social and environmental effects across the system lifecycle.": "Considera los efectos sociales y ambientales durante todo el ciclo de vida del sistema.",
    "Choose your review depth": "Elige la profundidad de la revisión",
    "Two ways to assess a project": "Dos formas de evaluar un proyecto",
    "Start with the Quick assessment for a focused first review. Use Thorough when potential impact, uncertainty or gaps call for deeper examination.": "Comienza con la evaluación rápida para una primera revisión enfocada. Usa la evaluación detallada cuando el impacto potencial, la incertidumbre o las brechas requieran un examen más profundo.",
    "Focused first review": "Primera revisión enfocada",
    "Review core safeguards, basic governance and priority risks. Suitable for early review or a project with a bounded scope.": "Revisa las salvaguardas principales, la gobernanza básica y los riesgos prioritarios. Es adecuada para una revisión temprana o un proyecto de alcance limitado.",
    "Four brief risk prompts": "Cuatro preguntas breves sobre riesgos",
    "Eight core safeguard checks": "Ocho comprobaciones de salvaguardas principales",
    "Color coded route and next step": "Ruta y próximo paso por colores",
    "Detailed review": "Revisión detallada",
    "Use when AI may affect rights, essential services, safety, finances or reputation, or when the Quick review leaves important questions open.": "Úsala cuando la IA pueda afectar derechos, servicios esenciales, seguridad, finanzas o reputación, o cuando la revisión rápida deje preguntas importantes abiertas.",
    "Six plain language risk questions": "Seis preguntas de riesgo en lenguaje sencillo",
    "15 simple checks across all six principles": "15 comprobaciones sencillas sobre los seis principios",
    "Three prompts for risks, actions and decision": "Tres preguntas sobre riesgos, acciones y decisión",
    "Start Quick assessment": "Iniciar evaluación rápida",
    "Start Thorough assessment": "Iniciar evaluación detallada",
    "Risk route at a glance": "Ruta de riesgo de un vistazo",
    "Use impact to choose the level of review": "Usa el impacto para elegir el nivel de revisión",
    "These categories help teams select a path. They do not decide whether a system is lawful or safe.": "Estas categorías ayudan a los equipos a elegir una ruta. No determinan si un sistema es legal o seguro.",
    "Limited foreseeable impact. Begin with Quick and record the basis for that choice.": "Impacto previsible limitado. Comienza con la evaluación rápida y registra la base de esa elección.",
    "Meaningful impact or public interaction. Use Thorough when safeguards need specific review.": "Impacto significativo o interacción con el público. Usa la evaluación detallada cuando las salvaguardas necesiten una revisión específica.",
    "Potentially significant effects on people or rights. Use Thorough and obtain strong governance review.": "Efectos potencialmente significativos sobre las personas o sus derechos. Usa la evaluación detallada y obtén una revisión sólida de gobernanza.",
    "Potentially unlawful or severe harm. Pause routine progression and seek specialist review.": "Posible ilegalidad o daño grave. Pausa el avance normal y busca una revisión especializada.",
    "The team records its reasoning. A risk category is separate from the later rating of residual risk after safeguards.": "El equipo registra sus razones. La categoría de riesgo es independiente de la calificación posterior del riesgo residual después de las salvaguardas.",
    "Low": "Bajo",
    "Medium": "Medio",
    "High": "Alto",
    "Excessive or unresolved": "Excesivo o no resuelto",
    "What you take away": "Qué obtienes",
    "A clearer picture and practical next steps": "Una imagen más clara y próximos pasos prácticos",
    "Current practice and evidence": "Prácticas y evidencias actuales",
    "Gaps and improvement actions": "Brechas y acciones de mejora",
    "Owners, timing and review conditions": "Responsables, plazos y condiciones de revisión",
    "A shared working session.": "Una sesión de trabajo compartida.",
    "Use this site to guide a team discussion, organise the agreed answers and download a clear record of the assessment. The site does not retain or store the information you enter. Refreshing or closing the page clears the working form. Keep the downloaded file only where your organisation permits. The assessment supports team judgement and does not replace local review.": "Usa este sitio para guiar una conversación del equipo, organizar las respuestas acordadas y descargar un registro claro de la evaluación. El sitio no conserva ni almacena la información que introduces. Al actualizar o cerrar la página se borra el formulario de trabajo. Conserva el archivo descargado solo donde tu organización lo permita. La evaluación apoya el criterio del equipo y no sustituye la revisión local.",
    "English working package · Version 1.5. Review local legal and governance requirements.": "Paquete de trabajo en inglés · Versión 1.5. Revisa los requisitos legales y de gobernanza locales.",
    "Back to top": "Volver al inicio",
    "Sources": "Fuentes",
    "Instructions for use": "Instrucciones de uso",
    "Purpose": "Propósito",
    "Who should take part": "Quiénes deben participar",
    "Choose one of two assessments": "Elige una de las dos evaluaciones",
    "Assessment": "Evaluación",
    "Use it when": "Úsala cuando",
    "What it covers": "Qué cubre",
    "Open Quick assessment": "Abrir evaluación rápida",
    "Open Thorough assessment": "Abrir evaluación detallada",
    "How to complete a review": "Cómo completar una revisión",
    "When to revisit the assessment": "Cuándo volver a revisar la evaluación",
    "Understand the result": "Entiende el resultado",
    "Browser and data handling": "Navegador y tratamiento de datos",
    "Decision support and responsible use": "Apoyo a decisiones y uso responsable",
    "See the outputs": "Ver los resultados",
    "Policy use": "Uso para políticas públicas",
    "What this page clarifies": "Qué aclara esta página",
    "Scope": "Alcance",
    "One project at a time": "Un proyecto a la vez",
    "Working session": "Sesión de trabajo",
    "Organise and download": "Organiza y descarga",
    "Information retention": "Retención de información",
    "Nothing stored by the site": "El sitio no almacena nada",
    "Follow the information flow": "Sigue el flujo de información",
    "Assessment outputs": "Resultados de la evaluación",
    "What the team receives": "Qué recibe el equipo",
    "Data handling": "Tratamiento de datos",
    "What is kept and downloaded": "Qué se conserva y descarga",
    "How findings support decisions": "Cómo apoyan las conclusiones las decisiones",
    "Outputs are specific to the project under review": "Los resultados corresponden al proyecto revisado",
    "The site is a temporary working space": "El sitio es un espacio de trabajo temporal",
    "Findings support an authorised decision process": "Los hallazgos apoyan un proceso de decisión autorizado",
    "What each pathway gives you": "Qué ofrece cada ruta",
    "How information is handled": "Cómo se trata la información",
    "Entered": "Introducido",
    "Organised": "Organizado",
    "Downloaded": "Descargado",
    "How policymakers can use findings": "Cómo pueden usar los hallazgos quienes elaboran políticas",
    "Project decision": "Decisión sobre el proyecto",
    "Organisational learning": "Aprendizaje organizacional",
    "Accountability": "Rendición de cuentas",
    "Responsible interpretation": "Interpretación responsable",
    "Before you begin": "Antes de comenzar",
    "Work through this review as a team": "Realicen esta revisión como equipo",
    "About this form": "Sobre este formulario",
    "When to go further": "Cuándo profundizar",
    "Start with the basics": "Comienza por lo básico",
    "Tell us what is being assessed and who can answer follow up questions.": "Indica qué se evalúa y quién puede responder las preguntas de seguimiento.",
    "Step 1 · context": "Paso 1 · contexto",
    "What to prepare": "Qué preparar",
    "What you get": "Qué obtienes",
    "What should we call this system or service?": "¿Cómo debemos llamar a este sistema o servicio?",
    "Which organisation or team is responsible?": "¿Qué organización o equipo es responsable?",
    "What does it do, and where is it used?": "¿Qué hace y dónde se utiliza?",
    "Who is accountable for this review?": "¿Quién es responsable de esta revisión?",
    "When is this review being completed?": "¿Cuándo se completa esta revisión?",
    "When should it be reviewed again?": "¿Cuándo debe revisarse nuevamente?",
    "Quick risk screen": "Evaluación rápida de riesgos",
    "Discuss each prompt with people who understand the system, its safeguards and the people it may affect. Compare evidence, resolve differences and agree the answer before one person records the result.": "Conversen sobre cada pregunta con personas que conozcan el sistema, sus salvaguardas y a quienes puede afectar. Comparen la evidencia, resuelvan las diferencias y acuerden la respuesta antes de que alguien la registre.",
    "Use this concise self assessment for an early review or a system with a bounded scope. Four risk prompts suggest a Low, Medium or High route.": "Usa esta autoevaluación breve para una revisión temprana o un sistema de alcance limitado. Cuatro preguntas de riesgo sugieren una ruta Baja, Media o Alta.",
    "A severe harm or prohibited use concern means pause for specialist review. If effects may be significant, evidence is incomplete or safeguards need deeper review, continue to Thorough.": "Una preocupación por daño grave o uso prohibido exige pausar para una revisión especializada. Si los efectos pueden ser significativos, la evidencia está incompleta o las salvaguardas necesitan una revisión más profunda, continúa con la evaluación detallada.",
    "The result follows the highest concern selected, not an average. Answers stay in this browser and are cleared when the page closes; export a copy under your organisation’s records and privacy rules.": "El resultado sigue la preocupación más alta seleccionada, no un promedio. Las respuestas permanecen en este navegador y se borran al cerrar la página; exporta una copia conforme a las reglas de registros y privacidad de tu organización.",
    "Describe the system and the service it supports.": "Describe el sistema y el servicio que apoya.",
    "A plain language name, the responsible organisation, the use context and a review owner. Do not enter personal or sensitive case details.": "Un nombre en lenguaje sencillo, la organización responsable, el contexto de uso y una persona responsable de la revisión. No introduzcas datos personales ni detalles sensibles de casos.",
    "A clear cover sheet for the assessment summary and follow up.": "Una portada clara para el resumen de la evaluación y el seguimiento.",
    "Identify the strongest foreseeable impact signal before reviewing safeguards.": "Identifica la señal de impacto previsible más fuerte antes de revisar las salvaguardas.",
    "How the system influences decisions, the data and scale involved, and any severe harm or legality concern.": "Cómo influye el sistema en las decisiones, qué datos y escala intervienen, y cualquier preocupación por daño grave o legalidad.",
    "A color coded provisional route. The highest concern governs; uncertainty leads to deeper review.": "Una ruta provisional codificada por colores. La preocupación más alta prevalece; la incertidumbre conduce a una revisión más profunda.",
    "Check that basic protections are in place for the intended use.": "Comprueba que existan protecciones básicas para el uso previsto.",
    "Evidence about discrimination, human review, functional and safety checks, and an accountable owner.": "Evidencia sobre discriminación, revisión humana, comprobaciones funcionales y de seguridad, y una persona responsable.",
    "Safeguard status and a reason for any item marked not applicable.": "Estado de las salvaguardas y motivo de cada elemento marcado como no aplicable.",
    "Confirm basic data oversight, documentation and independent review.": "Confirma la supervisión básica de datos, la documentación y la revisión independiente.",
    "Roles, data-quality checks, system description and any pre-launch review.": "Roles, comprobaciones de calidad de datos, descripción del sistema y cualquier revisión previa al lanzamiento.",
    "Governance controls, missing documentation and follow-up actions.": "Controles de gobernanza, documentación faltante y acciones de seguimiento.",
    "Turn the main findings into tracked actions and a clear residual-risk decision.": "Convierte los hallazgos principales en acciones rastreables y en una decisión clara sobre el riesgo residual.",
    "Priority risks, mitigations, an accountable owner, target date and remaining uncertainty.": "Riesgos prioritarios, medidas de mitigación, una persona responsable, fecha objetivo e incertidumbre restante.",
    "Risk actions, review timing and whether to complete this review, continue to Thorough assessment or pause for review.": "Acciones sobre riesgos, momento de revisión y decisión de completar esta revisión, continuar con la evaluación detallada o pausar para revisar.",
    "Build the assessment review summary first, then download the summary or a two page results PDF. JSON and text exports remain available for records.": "Crea primero el resumen de revisión y luego descarga el resumen o un PDF completo de resultados. Las exportaciones JSON y de texto siguen disponibles para los registros.",
    "Provisional route": "Ruta provisional",
    "Core safeguards": "Salvaguardas principales",
    "Governance and documentation": "Gobernanza y documentación",
    "Priority risks and next steps": "Riesgos prioritarios y próximos pasos",
    "Export and review": "Exportar y revisar",
    "Build assessment review summary": "Crear resumen de revisión",
    "Download assessment review summary": "Descargar resumen de revisión",
    "Download two page results PDF": "Descargar PDF completo de resultados",
    "Download JSON": "Descargar JSON",
    "Download text": "Descargar texto",
    "Print / save as PDF": "Imprimir / guardar como PDF",
    "Clear form": "Borrar formulario",
    "Assessment review summary is ready": "El resumen de revisión está listo",
    "Response summary": "Resumen de respuestas",
    "Scoring and interpretation": "Puntuación e interpretación",
    "Two separate questions: how much harm could occur, and how well are safeguards in place?": "Dos preguntas separadas: ¿cuánto daño podría ocurrir y qué tan bien funcionan las salvaguardas?",
    "Read two results side by side.": "Lee los dos resultados lado a lado.",
    "Quick assessment route": "Ruta de evaluación rápida",
    "Thorough assessment risk screen": "Evaluación de riesgos detallada",
    "How the percentage is calculated": "Cómo se calcula el porcentaje",
    "Question": "Pregunta",
    "Points in answer order": "Puntos según el orden de respuesta",
    "High concern answer": "Respuesta de alta preocupación",
    "Six principle indicators": "Indicadores de los seis principios",
    "Equal principle weight": "Peso igual de los principios",
    "Indicator": "Indicador",
    "Meaning": "Significado",
    "Action": "Acción",
    "Residual risk after safeguards": "Riesgo residual después de las salvaguardas",
    "Residual level": "Nivel residual",
    "Color": "Color",
    "Interpretation and response": "Interpretación y respuesta",
    "Use the result to make a decision": "Usa el resultado para tomar una decisión",
    "Read the risk route": "Lee la ruta de riesgo",
    "Find the practice gaps": "Encuentra las brechas de práctica",
    "Assign action and review": "Asigna acciones y revisión",
    "Sources and method notes": "Fuentes y notas metodológicas",
    "Source lineage, verification boundaries and limitations": "Origen de las fuentes, límites de verificación y limitaciones",
    "Source hierarchy.": "Jerarquía de fuentes.",
    "Primary references": "Referencias principales",
    "Standalone use and data handling": "Uso independiente y tratamiento de datos",
    "How this English package was assembled": "Cómo se preparó este paquete en inglés",
    "Limits and evidence distinctions": "Límites y distinciones de evidencia",
    "Reuse and attribution": "Reutilización y atribución",
    "Plain language": "Lenguaje sencillo",
    "Six principles": "Seis principios",
    "Calculated route": "Ruta calculada",
    "Completion:": "Completado:",
    "Download the full results PDF for dimension scores and findings.": "Descarga el PDF completo de resultados con las puntuaciones y hallazgos.",
    "Assessment review summary": "Resumen de revisión de la evaluación",
    "English": "Inglés",
    "Spanish": "Español",
    "Assessments": "Evaluaciones",
    "Context": "Contexto",
    "Risk screen": "Evaluación de riesgos",
    "Safeguards": "Salvaguardas",
    "Governance": "Gobernanza",
    "Summary": "Resumen",
    "Six principles": "Seis principios",
    "Summary and export": "Resumen y exportación",
    "Review": "Revisión",
    "Incomplete": "Incompleto",
    "Not answered": "Sin responder",
    "Not provided": "No indicado",
    "Not applicable": "No aplica",
    "Needs strengthening": "Necesita refuerzo",
    "Gap to address": "Brecha por abordar",
    "Quick review complete": "Revisión rápida completada",
    "Continue to Thorough": "Continuar con la evaluación detallada",
    "Pause and escalate": "Pausar y escalar",
    "Why this route?": "¿Por qué esta ruta?",
    "How much can AI shape or make decisions that affect people?": "¿Cuánto puede la IA influir o tomar decisiones que afectan a las personas?",
    "Analysis only; no person specific or service decision follows from the output.": "Solo análisis; del resultado no se deriva ninguna decisión sobre una persona o servicio específico.",
    "Low impact advice; staff can readily disregard it.": "Orientación de bajo impacto; el personal puede ignorarla fácilmente.",
    "It could materially influence access to services, rights, safety, money or reputation.": "Podría influir materialmente en el acceso a servicios, derechos, seguridad, dinero o reputación.",
    "It can act on a consequential decision without meaningful human review before impact.": "Puede actuar sobre una decisión de consecuencias importantes sin una revisión humana significativa antes del impacto.",
    "What data does the system use about people?": "¿Qué datos utiliza el sistema sobre las personas?",
    "No personal data.": "No utiliza datos personales.",
    "Personal data, but no sensitive or specially protected data.": "Datos personales, pero no datos sensibles o especialmente protegidos.",
    "Sensitive, biometric or specially protected data.": "Datos sensibles, biométricos o especialmente protegidos.",
    "Not known yet.": "Todavía no se sabe.",
    "Who may be affected, and at what scale?": "¿A quién puede afectar y a qué escala?",
    "A small, bounded group; no known heightened vulnerability.": "Un grupo pequeño y limitado; no se conoce una vulnerabilidad elevada.",
    "Many people, or a group may face additional barriers or disadvantage.": "Muchas personas, o un grupo que puede enfrentar barreras o desventajas adicionales.",
    "Very large scale or a material effect concentrated on a vulnerable group.": "Escala muy grande o un efecto material concentrado en un grupo vulnerable.",
    "Is there a credible concern about prohibited use or severe, hard to reverse harm?": "¿Existe una preocupación creíble por un uso prohibido o un daño grave y difícil de revertir?",
    "No known concern after an initial review.": "No se conoce ninguna preocupación tras una revisión inicial.",
    "Unclear; local legal or specialist review is needed.": "No está claro; se necesita una revisión legal local o especializada.",
    "A credible concern has been identified.": "Se ha identificado una preocupación creíble.",
    "Was the system designed and tested to avoid unlawful or abusive discrimination against people or groups?": "¿Se diseñó y probó el sistema para evitar la discriminación ilegal o abusiva contra personas o grupos?",
    "Are AI outputs reviewed by a person before they affect a person or an external decision?": "¿Una persona revisa los resultados de la IA antes de que afecten a alguien o a una decisión externa?",
    "Have basic functional and safety checks been completed for the intended use?": "¿Se completaron las comprobaciones funcionales y de seguridad básicas para el uso previsto?",
    "Is a named person or role responsible for operating and maintaining the system?": "¿Hay una persona o rol identificado responsable de operar y mantener el sistema?",
    "Are responsibilities assigned for data quality, security, ethical use and legal compliance?": "¿Se asignaron responsabilidades sobre calidad de datos, seguridad, uso ético y cumplimiento legal?",
    "Are data sources, quality, freshness and consistency checked through a documented process?": "¿Se comprueban las fuentes, calidad, actualización y coherencia de los datos mediante un proceso documentado?",
    "Is a basic description available covering purpose, general operation and limitations?": "¿Existe una descripción básica que cubra el propósito, el funcionamiento general y las limitaciones?",
    "Has someone outside the direct development work reviewed risks before launch?": "¿Alguien ajeno al trabajo directo de desarrollo revisó los riesgos antes del lanzamiento?",
    "Identify the main ethical, legal or social risk(s) and mitigation actions planned or already in place.": "Identifica los principales riesgos éticos, legales o sociales y las medidas de mitigación previstas o ya implementadas.",
    "Who owns the mitigation follow-up, and by when?": "¿Quién es responsable del seguimiento de la mitigación y para cuándo?",
    "Does the team consider the overall residual risk acceptable in context?": "¿Considera el equipo aceptable el riesgo residual general en este contexto?",
    "What is the team’s recommended next step?": "¿Cuál es el próximo paso recomendado por el equipo?",
    "Yes. Residual risk is considered acceptable and manageable.": "Sí. El riesgo residual se considera aceptable y manejable.",
    "Partly. Some residual risk needs intensive monitoring or additional future measures.": "Parcialmente. Parte del riesgo residual necesita un seguimiento intensivo o medidas futuras adicionales.",
    "No. Risk remains too high to proceed without significant revision or further assurance.": "No. El riesgo sigue siendo demasiado alto para continuar sin una revisión importante o garantías adicionales.",
    "Quick review complete. No significant unresolved risk; continue with routine monitoring.": "Revisión rápida completada. No hay riesgos significativos sin resolver; continúa con el seguimiento habitual.",
    "Continue to Thorough assessment. Impacts, evidence or safeguards need further review.": "Continúa con la evaluación detallada. Los impactos, la evidencia o las salvaguardas necesitan más revisión.",
    "Pause and escalate. Seek specialist review for a potentially unlawful use or severe unresolved harm.": "Pausa y escala. Busca una revisión especializada por un posible uso ilegal o un daño grave sin resolver.",
    "Build the assessment review summary": "Crear el resumen de revisión de la evaluación",
    "Create the readable findings view before downloading the record.": "Crea una vista legible de los hallazgos antes de descargar el registro.",
    "Download the full results PDF": "Descargar el PDF completo de resultados",
    "Save the results, final decision and all responses for your team records.": "Guarda el cuadro visual de puntuaciones y los hallazgos para los registros de tu equipo.",
    "Other formats and page controls": "Otros formatos y controles de página",
    "Use these options for machine readable data, a text record, printing or a fresh start.": "Usa estas opciones para datos legibles por máquinas, un registro de texto, imprimir o empezar de nuevo.",
    "Download text report": "Descargar informe de texto",
    "Review it below or download an English HTML copy for your records.": "Revísalo abajo o descarga una copia HTML en español para tus registros.",
    "What role does the AI system have?": "¿Qué función cumple el sistema de IA?",
    "Provides information or drafts": "Proporciona información o borradores",
    "Makes recommendations": "Hace recomendaciones",
    "Influences important decisions": "Influye en decisiones importantes",
    "Makes or carries out decisions": "Toma o ejecuta decisiones",
    "Can a person check and change its output before someone is affected?": "¿Puede una persona revisar y cambiar el resultado antes de que alguien se vea afectado?",
    "What type of personal information does it use?": "¿Qué tipo de información personal utiliza?",
    "No personal information": "No utiliza información personal",
    "Ordinary personal information": "Información personal ordinaria",
    "Sensitive information, such as health, biometric or financial data": "Información sensible, como datos de salud, biométricos o financieros",
    "If the system makes a mistake, how widely could the effects spread?": "Si el sistema comete un error, ¿hasta dónde podrían extenderse sus efectos?",
    "One person or a small number of cases": "Una persona o un número reducido de casos",
    "One service or community": "Un servicio o una comunidad",
    "Many services, communities or members of the public": "Muchos servicios, comunidades o integrantes del público",
    "Could an incorrect or unfair result affect someone’s rights, safety, money, reputation or access to a public service?": "¿Podría un resultado incorrecto o injusto afectar los derechos, la seguridad, el dinero, la reputación o el acceso de alguien a un servicio público?",
    "No significant effect": "Sin efecto significativo",
    "A limited and reversible effect": "Un efecto limitado y reversible",
    "A serious effect": "Un efecto grave",
    "Could this use be unlawful or cause severe harm? Examples include manipulating people, exploiting vulnerable groups, disproportionate scoring or surveillance, and dangerous autonomous actions.": "¿Podría este uso ser ilegal o causar un daño grave? Algunos ejemplos son manipular a las personas, explotar a grupos vulnerables, realizar puntuaciones o vigilancia desproporcionadas y ejecutar acciones autónomas peligrosas.",
    "No concern identified": "No se identificó ninguna preocupación",
    "Possibly or unsure": "Posiblemente o no estoy seguro/a",
    "Have we identified who could be harmed or treated unfairly?": "¿Hemos identificado quién podría sufrir daños o recibir un trato injusto?",
    "Have we checked whether results differ unfairly between groups?": "¿Hemos comprobado si los resultados difieren injustamente entre grupos?",
    "Can people use the service regardless of disability, digital skills or internet access?": "¿Pueden las personas usar el servicio independientemente de su discapacidad, habilidades digitales o acceso a internet?",
    "Are people clearly told when AI is being used?": "¿Se informa claramente a las personas cuando se utiliza IA?",
    "Can people understand how an important result was reached and ask for a human review?": "¿Pueden las personas entender cómo se llegó a un resultado importante y solicitar una revisión humana?",
    "Has the system been tested in situations similar to how it will actually be used?": "¿Se probó el sistema en situaciones similares a su uso real?",
    "Is the system protected against misuse, unauthorised access and attacks?": "¿Está el sistema protegido contra el uso indebido, el acceso no autorizado y los ataques?",
    "Can the team detect problems and respond safely, including stopping the system or using another process?": "¿Puede el equipo detectar problemas y responder de forma segura, incluso deteniendo el sistema o usando otro proceso?",
    "Is there a clear and lawful reason for using each type of personal information?": "¿Existe un motivo claro y legal para utilizar cada tipo de información personal?",
    "Is personal information limited, protected and deleted when no longer needed?": "¿La información personal se limita, protege y elimina cuando ya no es necesaria?",
    "Is someone clearly responsible for the system and its effects?": "¿Hay alguien claramente responsable del sistema y sus efectos?",
    "Can trained staff stop, correct or override the system when necessary?": "¿Puede el personal capacitado detener, corregir o anular el sistema cuando sea necesario?",
    "Can people challenge a result, report a problem and receive a response?": "¿Pueden las personas impugnar un resultado, informar de un problema y recibir una respuesta?",
    "Have effects on staff, jobs and working conditions been considered?": "¿Se han considerado los efectos sobre el personal, los empleos y las condiciones de trabajo?",
    "Have significant environmental or computing costs been considered?": "¿Se han considerado los costos ambientales o informáticos significativos?",
    "No trigger selected": "No se seleccionó ningún activador",
    "Review signal": "Señal para revisar",
    "Needs specialist review": "Necesita revisión especializada",
    "Escalation signal": "Señal de escalamiento",
    "Team judgment recorded": "Criterio del equipo registrado",
    "Evidence or action to review": "Evidencia o acción por revisar",
    "Improvement action": "Acción de mejora",
    "No follow up prompt": "Sin pregunta de seguimiento",
    "Gap identified": "Brecha identificada",
    "In place": "En funcionamiento",
    "Answer the four screening prompts to see the route and suggested next step.": "Responde las cuatro preguntas de evaluación para ver la ruta y el próximo paso sugerido.",
    "Answer all six prompts.": "Responde las seis preguntas.",
    "Always": "Siempre",
    "Usually": "Generalmente",
    "Only after the decision": "Solo después de la decisión",
    "No": "No",
    "Unsure": "No estoy seguro/a",
    "No concern identified": "No se identificó ninguna preocupación",
    "Possibly or unsure": "Posiblemente o no estoy seguro/a",
    "Yes": "Sí",
    "No personal information": "Sin información personal",
    "Ordinary personal information": "Información personal ordinaria",
    "Sensitive information, such as health, biometric or financial data": "Información sensible, como datos de salud, biométricos o financieros",
    "Provides information or drafts": "Proporciona información o borradores",
    "Makes recommendations": "Hace recomendaciones",
    "Influences important decisions": "Influye en decisiones importantes",
    "Makes or carries out decisions": "Toma o ejecuta decisiones",
    "No significant effect": "Sin efecto significativo",
    "A limited and reversible effect": "Un efecto limitado y reversible",
    "A serious effect": "Un efecto grave",
    "One person or a small number of cases": "Una persona o un número reducido de casos",
    "One service or community": "Un servicio o una comunidad",
    "Many services, communities or members of the public": "Muchos servicios, comunidades o integrantes del público",
    "The team’s decision": "La decisión del equipo",
    "Proceed.": "Proceder.",
    "Proceed with conditions.": "Proceder con condiciones.",
    "Do not proceed yet.": "No proceder todavía.",
    "If not applicable, explain why": "Si no aplica, explica por qué",
    "Evidence / reason:": "Evidencia / motivo:",
    "In place and evidenced": "En funcionamiento y con evidencia",
    "Partly in place": "Parcialmente en funcionamiento",
    "Planned": "Planificado",
    "Absent": "Ausente",
    "Not applicable — give a reason": "No aplica — indica el motivo",
    "Example: Benefits eligibility assistant": "Ejemplo: asistente para determinar elegibilidad de beneficios",
    "Example: Department or service unit": "Ejemplo: departamento o unidad de servicio",
    "In one or two sentences, describe the decision or service it supports.": "En una o dos frases, describe la decisión o servicio que apoya.",
    "Role or team, not personal case details": "Rol o equipo, no datos personales de casos",
    "Date or event, for example before launch or after a major change": "Fecha o evento, por ejemplo antes del lanzamiento o después de un cambio importante"
  };
  Object.assign(ES, {
  "Use plain language and complete free text fields in English. This page is for system context, not for names, case files or other personal information.": "Usa un lenguaje claro y completa los campos de texto libre en español. Esta página describe el contexto del sistema; no introduzcas nombres, expedientes ni otros datos personales.",
  "This summarizes the team’s responses at one point in time. It does not validate evidence or monitor the operating system.": "Este resumen refleja las respuestas del equipo en un momento concreto. No verifica las pruebas ni supervisa el sistema en funcionamiento.",
  "Quick assessment · Version 1.6. See Instructions for facilitation and follow-up.": "Evaluación rápida · Versión 1.6. Consulta las instrucciones para facilitar la revisión y hacer el seguimiento.",
  "Civic AI Compass": "Civic AI Compass",
  "An individual can complete the first review, or a cross functional team can use it as a workshop. For consequential systems, bring together service, policy and technology leads with legal, privacy, security or ethics expertise. The result reflects the participants’ answers and evidence; it is not an independent audit.": "Una persona puede completar la primera revisión o un equipo interdisciplinario puede usarla en un taller. Para sistemas de consecuencias importantes, reúne a responsables del servicio, las políticas y la tecnología con especialistas en derecho, privacidad, seguridad o ética. El resultado refleja las respuestas y pruebas aportadas; no es una auditoría independiente.",
  "01 · CONTEXT": "01 · CONTEXTO",
  "02 · GOAL": "02 · OBJETIVO",
  "03 · PRACTICAL VALUE": "03 · VALOR PRÁCTICO",
  "Use evidence and the public service context to test whether the system respects people and remains accountable throughout its lifecycle.": "Usa las pruebas y el contexto del servicio público para comprobar si el sistema respeta a las personas y mantiene la rendición de cuentas durante todo su ciclo de vida.",
  "PATH 01": "RUTA 01",
  "PATH 02": "RUTA 02",
  "The report is a working record for the project team and authorised reviewers.": "El informe es un registro de trabajo para el equipo del proyecto y los revisores autorizados.",
  "Risk indicates how serious the system’s potential effects may be. Practice indicators show whether safeguards are evidenced or need improvement. Strong safeguards do not make a high impact system low risk.": "El riesgo indica la gravedad de los posibles efectos del sistema. Los indicadores de práctica muestran si existen pruebas de las salvaguardas o si deben mejorarse. Unas salvaguardas sólidas no convierten un sistema de gran impacto en uno de bajo riesgo.",
  "1. Quick assessment route": "1. Ruta de la evaluación rápida",
  "Quick uses four short prompts. It returns the highest concern indicated; answers are never averaged. A credible severe harm or potentially prohibited use concern turns the route red and calls for specialist review.": "La evaluación rápida utiliza cuatro preguntas breves. Devuelve la preocupación más alta indicada; nunca promedia las respuestas. Una preocupación creíble por daños graves o usos posiblemente prohibidos marca la ruta en rojo y requiere revisión especializada.",
  "Route": "Ruta",
  "Typical signal": "Señal habitual",
  "Suggested next step": "Siguiente paso recomendado",
  "Low · green": "Bajo · verde",
  "Small, bounded use; little direct influence on people; no sensitive data or serious unresolved concern.": "Uso limitado y acotado; escasa influencia directa sobre las personas; sin datos sensibles ni preocupaciones graves sin resolver.",
  "Complete the Quick safeguards. Close the review only when evidence and residual risk support it.": "Completa las comprobaciones de salvaguardas de la evaluación rápida. Cierra la revisión solo si las pruebas y el riesgo residual lo permiten.",
  "Medium · amber": "Medio · ámbar",
  "Personal data, wider reach, some uncertainty, or a meaningful but manageable effect.": "Datos personales, mayor alcance, cierta incertidumbre o un efecto importante pero manejable.",
  "Continue to Thorough and define safeguards, owners and review points.": "Continúa con la evaluación detallada y define salvaguardas, responsables y puntos de revisión.",
  "High · orange": "Alto · naranja",
  "Potential effect on rights, essential services, safety, money or reputation; sensitive data; very large scale; or limited human review.": "Posible efecto sobre derechos, servicios esenciales, seguridad, dinero o reputación; datos sensibles; escala muy amplia; o revisión humana limitada.",
  "Complete Thorough and obtain strong governance or specialist oversight.": "Completa la evaluación detallada y solicita una supervisión sólida de gobernanza o especializada.",
  "Pause · red": "Pausa · rojo",
  "A credible concern about prohibited use or severe, hard to reverse harm.": "Preocupación creíble por un uso prohibido o un daño grave difícil de revertir.",
  "Pause routine progression and seek local legal, rights, safety and ethics review.": "Detén el avance habitual y solicita una revisión jurídica, de derechos, seguridad y ética según el contexto local.",
  "If a prompt is unclear, use the more cautious route and investigate. A route is a starting point for human review, not a legal finding.": "Si una pregunta no está clara, elige la ruta más prudente e investiga. La ruta inicia una revisión humana; no constituye una conclusión jurídica.",
  "2. Thorough assessment risk screen": "2. Evaluación inicial del riesgo en la evaluación detallada",
  "Five questions contribute points. The sixth checks for possible unlawful use or severe harm and can override the score. The result is a screening signal for discussion, not an automatic decision.": "Cinco preguntas aportan puntos. La sexta detecta posibles usos ilícitos o daños graves y puede prevalecer sobre la puntuación. El resultado es una señal para debatir, no una decisión automática.",
  "Below 25%, with no high concern answer or uncertainty. Complete the six principle sections and record the final decision.": "Menos del 25 %, sin respuestas de alta preocupación ni incertidumbre. Completa las seis secciones de principios y registra la decisión final.",
  "25% to 49%, one high concern answer, or any “Unsure” answer. Define safeguards, owners and review points.": "Del 25 % al 49 %, una respuesta de alta preocupación o cualquier respuesta «No estoy seguro». Define salvaguardas, responsables y puntos de revisión.",
  "50% or more, two high concern answers, or sensitive information combined with a serious effect. Seek strong governance or specialist review.": "50 % o más, dos respuestas de alta preocupación o información sensible combinada con un efecto grave. Solicita una revisión sólida de gobernanza o especializada.",
  "“Yes” to possible unlawful use or severe harm overrides the percentage. Pause and seek specialist review.": "Una respuesta «Sí» sobre un posible uso ilícito o daño grave prevalece sobre el porcentaje. Detén el avance y solicita una revisión especializada.",
  "Role of the AI system": "Función del sistema de IA",
  "Human check before impact": "Revisión humana antes de producir efectos",
  "Personal information": "Información personal",
  "Sensitive information": "Información sensible",
  "How widely a mistake could spread": "Alcance posible de un error",
  "Effect of an incorrect or unfair result": "Efecto de un resultado incorrecto o injusto",
  "Possible unlawful use or severe harm": "Posible uso ilícito o daño grave",
  "Not scored": "Sin puntuación",
  "“Possibly or unsure” raises the route to at least Medium. “Yes” produces the red Pause route.": "«Posiblemente o no estoy seguro» eleva la ruta al menos a Medio. «Sí» produce la ruta roja de Pausa.",
  "The five scored questions have a maximum total of 15 points. The total is divided by 15 and rounded to a whole percentage. One high concern answer raises the route to at least Medium; two raise it to High.": "Las cinco preguntas puntuadas suman un máximo de 15 puntos. El total se divide entre 15 y se redondea a un porcentaje entero. Una respuesta de alta preocupación eleva la ruta al menos a Medio; dos la elevan a Alto.",
  "3. Six principle indicators": "3. Indicadores de los seis principios",
  "The 15 practice questions are grouped under the six principles on the home page. “Yes, with evidence” scores 2, “Partly or in progress” scores 1, and “No or unsure” scores 0. “Not applicable, with a reason” is excluded.": "Las 15 preguntas sobre prácticas se agrupan bajo los seis principios de la página principal. «Sí, con pruebas» vale 2 puntos, «Parcialmente o en curso» vale 1 y «No o no estoy seguro» vale 0. «No aplica, con una razón» se excluye.",
  "Each principle percentage is calculated from its applicable questions. The overall practice indicator is the simple average of the six percentages, so sections with more questions do not dominate.": "El porcentaje de cada principio se calcula con sus preguntas aplicables. El indicador general de prácticas es el promedio simple de los seis porcentajes, de modo que las secciones con más preguntas no predominan.",
  "Green · In place": "Verde · Implantada",
  "The safeguard is operating and the team has evidence.": "La salvaguarda funciona y el equipo dispone de pruebas.",
  "Keep evidence current and set a review trigger.": "Mantén las pruebas actualizadas y establece cuándo revisarlas.",
  "Amber · Strengthen": "Ámbar · Reforzar",
  "Work is partial, planned, or the answer generated a follow up prompt.": "El trabajo es parcial, está previsto o la respuesta generó una acción de seguimiento.",
  "Define the missing work, owner, due date and completion evidence.": "Define el trabajo pendiente, la persona responsable, la fecha límite y las pruebas de finalización.",
  "Red · Gap": "Rojo · Deficiencia",
  "A safeguard is absent or a critical concern remains.": "Falta una salvaguarda o persiste una preocupación crítica.",
  "Prioritise corrective action. Pause where serious harm could occur.": "Prioriza las medidas correctivas. Detén el avance cuando pueda producirse un daño grave.",
  "Grey · Not applicable": "Gris · No aplica",
  "The team considers an item irrelevant to this context.": "El equipo considera que este punto no es pertinente en este contexto.",
  "Record a short reason. Do not use this to hide missing evidence.": "Registra brevemente el motivo. No utilices esta opción para ocultar la falta de pruebas.",
  "Quick counts statuses across eight core checks. Thorough reports six principle percentages and answer level follow up prompts. Practice status is never added to the risk screen percentage.": "La evaluación rápida cuenta los estados de ocho comprobaciones básicas. La evaluación detallada presenta los porcentajes de los seis principios y las acciones de seguimiento por respuesta. El estado de las prácticas nunca se suma al porcentaje de riesgo.",
  "4. Residual risk after safeguards": "4. Riesgo residual tras aplicar salvaguardas",
  "In the final three questions, rate each priority risk after considering safeguards already in place. Keep separate risks separate; do not average away a serious one.": "En las tres preguntas finales, valora cada riesgo prioritario teniendo en cuenta las salvaguardas existentes. Mantén los riesgos separados; no diluyas uno grave en un promedio.",
  "Green": "Verde",
  "Limited effects remain plausible, controls are evidenced and little uncertainty remains. Keep routine monitoring.": "Persisten efectos limitados plausibles, los controles están respaldados por pruebas y queda poca incertidumbre. Mantén la supervisión habitual.",
  "Amber": "Ámbar",
  "Meaningful effects remain possible or safeguards need strengthening. Assign actions, owners, dates and monitoring.": "Siguen siendo posibles efectos importantes o las salvaguardas deben reforzarse. Asigna medidas, responsables, fechas y seguimiento.",
  "Red": "Rojo",
  "Serious effects remain plausible, controls are inadequate or uncertainty is material. Revise or pause for an authorised decision.": "Persisten posibles efectos graves, los controles son insuficientes o la incertidumbre es importante. Revisa o detén el proyecto para obtener una decisión autorizada.",
  "Explain each rating using severity, likelihood, who may be affected, evidence and uncertainty. Record whether the overall residual risk is acceptable, conditional or too high to proceed.": "Justifica cada valoración según la gravedad, la probabilidad, las personas afectadas, las pruebas y la incertidumbre. Registra si el riesgo residual general es aceptable, condicional o demasiado alto para continuar.",
  "Confirm why the screen suggested that category. Add evidence and note uncertainty.": "Confirma por qué la evaluación inicial sugirió esa categoría. Añade pruebas y señala la incertidumbre.",
  "Use amber and red safeguards and their follow up prompts to identify work that is missing.": "Usa las salvaguardas ámbar y rojas y sus preguntas de seguimiento para detectar el trabajo pendiente.",
  "Name an owner, due date, evidence of completion and a review trigger. Escalate residual High or unresolved concerns.": "Asigna una persona responsable, una fecha límite, pruebas de finalización y un motivo para revisar. Eleva los riesgos residuales altos o no resueltos.",
  "These are adapted working rules for the English toolkit. They are not a validated predictive model or a substitute for local law, sector rules or authorised governance decisions.": "Estas reglas de trabajo se han adaptado para este conjunto de herramientas. No son un modelo predictivo validado ni sustituyen la legislación local, las normas sectoriales o las decisiones de gobernanza autorizadas.",
  "Scoring guide · Version 2.1. Apply local risk and approval rules.": "Guía de puntuación · Versión 2.1. Aplica las normas locales sobre riesgos y aprobación.",
  "The Brazilian government framework and application are the primary references. This package is a separately authored English working adaptation. It is not an official translation, endorsed replica, or substitute for checking the current official service.": "El marco y la aplicación del Gobierno de Brasil son las referencias principales. Este conjunto de herramientas es una adaptación de trabajo redactada por separado. No es una traducción oficial, una réplica avalada ni un sustituto de consultar el servicio oficial vigente.",
  "Brazilian Government Digital Services — AI Ethical Impact Assessment (AIE) Framework": "Servicios Digitales del Gobierno de Brasil — Marco de Evaluación de Impacto Ético de la IA (AIE)",
  "Open official AIE framework page": "Abrir la página oficial del marco AIE",
  "Basis for the instrument’s purpose, risk-based routes, questionnaire/scoring structure, reporting and implementation guidance. The publications page lists the AIE 2.40 downloadable implementation, dated 26 June 2026, alongside supporting guides and governance resources.": "Fuente de referencia para el propósito del instrumento, las rutas según el riesgo, la estructura del cuestionario y la puntuación, los informes y las orientaciones de aplicación. La página de publicaciones incluye la versión descargable AIE 2.40, fechada el 26 de junio de 2026, junto con guías y recursos de gobernanza.",
  "Framework overview PDF supplied for this adaptation": "Documento general del marco facilitado para esta adaptación",
  "Find the framework overview and supporting files": "Buscar el documento general del marco y los archivos complementarios",
  "Used to review the framework’s purpose, ethical principles, actors and risk routes. The English toolkit uses its structure as a reference and applies a separately documented scoring approach.": "Se utilizó para revisar el propósito del marco, los principios éticos, los actores y las rutas de riesgo. Este conjunto de herramientas toma su estructura como referencia y aplica un método de puntuación documentado por separado.",
  "Brazil AIE assessment application": "Aplicación brasileña de evaluación AIE",
  "Open AIE app sign-in / anonymous access": "Abrir el acceso a la aplicación AIE, con o sin cuenta",
  "Live application reference. Check the current interface, questionnaire version and available export options before operational use.": "Referencia de la aplicación en funcionamiento. Comprueba la interfaz, la versión del cuestionario y las opciones de exportación actuales antes de utilizarla operativamente.",
  "AIE application legal and privacy notice": "Aviso legal y de privacidad de la aplicación AIE",
  "Open current legal/privacy notice": "Abrir el aviso legal y de privacidad vigente",
  "Reference for the anonymous workflow’s stated browser-side processing and data handling. This notice may change and may not apply to signed-in or other use modes.": "Referencia sobre el tratamiento en el navegador y la gestión de datos descritos para el uso anónimo. El aviso puede cambiar y quizá no se aplique a las sesiones con cuenta u otros modos de uso.",
  "Each English form is a separate HTML page with its styling and assessment logic embedded. It can be opened directly in a browser and does not require a hosted assessment service. Answers remain in the current page session, are not submitted and are cleared when the page closes. Export JSON or text, or print to PDF, to keep a record under local rules.": "Cada formulario es una página HTML independiente con su diseño y lógica de evaluación integrados. Puede abrirse directamente en un navegador sin un servicio de evaluación alojado. Las respuestas permanecen en la sesión de la página, no se envían y se borran al cerrarla. Exporta un archivo JSON o de texto, o imprime un PDF, para conservar un registro conforme a las normas locales.",
  "The downloadable source AIE 2.40 package is a single HTML file intended for local application. It references Tailwind and Chart.js libraries from public CDNs, so those resources may require an internet connection unless already cached by the browser.": "El paquete original descargable AIE 2.40 es un único archivo HTML pensado para uso local. Carga las bibliotecas Tailwind y Chart.js desde redes públicas de distribución, por lo que estos recursos pueden requerir conexión a internet si el navegador no los ha almacenado.",
  "The Thorough assessment is an English-language adaptation based on the public framework, the downloadable AIE 2.40 implementation and the anonymous application path reviewed with synthetic answers.": "La evaluación detallada es una adaptación basada en el marco público, la implementación descargable AIE 2.40 y la ruta de uso anónimo examinada con respuestas ficticias.",
  "The Thorough assessment contains the user-provided residual risk topics: key risks, mitigations with owners/timing, residual risk ratings and overall acceptability.": "La evaluación detallada incluye los temas de riesgo residual aportados por el usuario: riesgos principales, medidas de mitigación con responsables y plazos, valoraciones del riesgo residual y aceptabilidad general.",
  "The Quick assessment is a concise 16 question first review; the Thorough assessment contains 24 plain language questions covering the risk screen, six principles and the final decision. English wording is paraphrased for independent reuse and requires local review.": "La evaluación rápida ofrece una primera revisión de 16 preguntas; la detallada contiene 24 preguntas en lenguaje claro sobre la evaluación inicial del riesgo, seis principios y la decisión final. Su redacción se ha reformulado para un uso independiente y requiere revisión local.",
  "The instructions and policy/data discussion combine the framework’s stated purpose and outputs with the direct limitations noted below.": "Las instrucciones y el apartado de políticas y datos combinan el propósito y los resultados descritos por el marco con las limitaciones señaladas más adelante.",
  "The downloadable AIE 2.40 implementation and the supplied overview PDF inform the risk based structure. This English package uses a short highest signal route in Quick and a normalized screening percentage in Thorough. The point mapping and thresholds are transparent but are not the official formula; practice quality is reported separately.": "La implementación descargable AIE 2.40 y el documento general facilitado sustentan la estructura basada en el riesgo. Esta adaptación usa la señal más alta para la ruta rápida y un porcentaje normalizado para la evaluación detallada. Los puntos y umbrales son transparentes, pero no reproducen la fórmula oficial; la calidad de las prácticas se presenta por separado.",
  "Officially described:": "Descrito oficialmente:",
  "the AIE is consultative and project-focused; the public framework describes a weighted assessment, risk-based questionnaire depth, critical triggers, a five-level result and project report.": "la AIE es consultiva y se centra en cada proyecto; el marco público describe una evaluación ponderada, un cuestionario cuya profundidad depende del riesgo, señales críticas, un resultado de cinco niveles y un informe del proyecto.",
  "Observed for anonymous use:": "Observado para el uso anónimo:",
  "the app’s legal notice says answers/results are processed in the browser and not transmitted or stored by the platform; leaving/reloading loses the anonymous assessment. This should be rechecked against the current notice.": "el aviso legal de la aplicación indica que las respuestas y los resultados se procesan en el navegador y no se transmiten ni almacenan en la plataforma; al salir o recargar se pierde la evaluación anónima. Conviene volver a comprobarlo en el aviso vigente.",
  "Not established by reviewed public material:": "No acreditado por los materiales públicos examinados:",
  "an official public aggregate analytics dashboard, centralized pooling of anonymous reports, automatic policy analytics, or continuous real-time monitoring.": "un panel público oficial de análisis agregado, la centralización de informes anónimos, análisis automáticos para políticas o la supervisión continua en tiempo real.",
  "In this adaptation:": "En esta adaptación:",
  "forms run locally and do not send or persist answers. Quick returns a provisional route from its highest concern signal. Thorough calculates a normalized screening percentage and asks the team to record its final residual risk decision. Neither is an official result; safeguard practice is not combined into the risk score.": "los formularios funcionan localmente y no envían ni conservan respuestas. La evaluación rápida devuelve una ruta provisional según la señal de mayor preocupación. La detallada calcula un porcentaje normalizado de riesgo y pide al equipo que registre su decisión final sobre el riesgo residual. Ninguno es un resultado oficial; las prácticas de salvaguarda no se combinan con la puntuación de riesgo.",
  "Distinguish source facts from inference: because the reviewed anonymous workflow does not submit reports, it cannot itself create a central anonymous aggregate through that route. This is an inference limited to that route, not a claim about every possible signed-in or government deployment.": "Distingue los hechos de las fuentes de las inferencias: dado que la ruta anónima examinada no envía informes, esa misma ruta no puede crear un conjunto central de datos anónimos. La inferencia se limita a esa ruta y no abarca todos los posibles usos con cuenta o implementaciones gubernamentales.",
  "This package is intended to support review and repurposing. Before publication, identify the original Brazilian framework as the source of inspiration, retain its official URL, state that the English version is an adaptation, and identify the local authority responsible for its content. Check the original site’s applicable reuse terms and any third-party content before redistributing official text, logos or resources.": "Este conjunto de herramientas sirve para apoyar la revisión y la adaptación. Antes de publicarlo, identifica el marco brasileño original como inspiración, conserva su URL oficial, declara que esta versión es una adaptación e identifica a la autoridad local responsable del contenido. Comprueba las condiciones de reutilización del sitio original y el contenido de terceros antes de redistribuir textos, logotipos o recursos oficiales.",
  "Package version: 1.5 · Prepared 21 September 2026.": "Versión del paquete: 1.5 · Preparado el 21 de septiembre de 2026.",
  "Sources and method notes · Version 1.5.": "Notas sobre fuentes y método · Versión 1.5.",
  "Policy and data": "Políticas y datos",
  "Understand what each assessment produces, how information is handled and how authorised policymakers can use findings responsibly.": "Comprende qué produce cada evaluación, cómo se trata la información y cómo pueden usar los resultados de forma responsable quienes elaboran políticas y están autorizados para ello.",
  "The toolkit helps a team discuss the assessment questions, organise agreed answers and download a clear project record.": "El conjunto de herramientas ayuda al equipo a debatir las preguntas de la evaluación, organizar las respuestas acordadas y descargar un registro claro del proyecto.",
  "Use the assessment as a team conversation rather than a solitary form. Discuss the prompts, compare evidence and agree the submission together.": "Usa la evaluación como una conversación de equipo. Debate las preguntas, compara las pruebas y acuerda las respuestas antes de registrarlas.",
  "The site does not retain or store the information entered. It is a self assessment aid, not an independent audit, approval or live monitoring service.": "El sitio no conserva ni almacena la información introducida. Es una ayuda para la autoevaluación, no una auditoría independiente, una aprobación ni un servicio de supervisión en tiempo real.",
  "Each report reflects one system, service context and set of answers.": "Cada informe corresponde a un sistema, un contexto de servicio y un conjunto de respuestas.",
  "The team can review its answers, see the findings and download a copy.": "El equipo puede revisar sus respuestas, consultar los resultados y descargar una copia.",
  "The site does not retain or store the answers after the working session.": "El sitio no conserva ni almacena las respuestas después de la sesión de trabajo.",
  "Use the three views below to understand what the team discusses, what the site organises and how an authorised policymaker can use the result.": "Usa las tres vistas siguientes para comprender qué debate el equipo, qué organiza el sitio y cómo puede aprovechar el resultado una persona autorizada para elaborar políticas.",
  "After the team agrees its answers, select Build assessment review summary. The page reveals the summary and enables an English HTML download. You can also download the two page results PDF, which summarises the selected pathway, colour coded dimensions, risk route, main findings and three to five takeaways.": "Una vez acordadas las respuestas, selecciona «Crear resumen de la evaluación». La página muestra el resumen y permite descargar una copia HTML en español. También puedes descargar un PDF completo de resultados que resume la ruta elegida, las dimensiones por colores, la ruta de riesgo, los hallazgos principales y entre tres y cinco conclusiones.",
  "The team uses the page to discuss and organise its answers. The site does not retain or store the information entered. Refreshing or closing the page clears the working form, so download a copy if your organisation needs a record.": "El equipo utiliza la página para debatir y organizar sus respuestas. El sitio no conserva ni almacena la información introducida. Al recargar o cerrar la página se borra el formulario, así que descarga una copia si tu organización necesita conservarlo.",
  "Reviewers can use the report to assign actions, set conditions, change a use case or procurement, focus monitoring, request further assurance or pause a deployment. Cross project analysis requires a separately governed collection process.": "Los revisores pueden usar el informe para asignar medidas, establecer condiciones, modificar un caso de uso o una compra, orientar el seguimiento, solicitar más garantías o detener un despliegue. El análisis entre proyectos requiere un proceso de recopilación independiente y gobernado.",
  "A focused first review for a bounded use. It returns a highest signal route in Low, Medium, High or Pause colours and shows which core safeguards need strengthening.": "Una primera revisión centrada en usos acotados. Devuelve la ruta de mayor señal, con los colores Bajo, Medio, Alto o Pausa, y muestra qué salvaguardas básicas necesitan refuerzo.",
  "A 24 question plain language review for important or uncertain uses. It returns a risk screen, six principle indicators, practical follow up prompts and a final decision record.": "Una revisión de 24 preguntas claras para usos importantes o inciertos. Devuelve una evaluación inicial del riesgo, seis indicadores de principios, acciones prácticas de seguimiento y un registro de la decisión final.",
  "The team describes the system, purpose, data use, affected people, safeguards, evidence and remaining uncertainty. Avoid personal case details.": "El equipo describe el sistema, su propósito, los datos utilizados, las personas afectadas, las salvaguardas, las pruebas y la incertidumbre restante. Evita los datos personales de casos.",
  "The site organises the agreed answers into a review summary and colour coded findings during the working session.": "Durante la sesión, el sitio organiza las respuestas acordadas en un resumen de revisión y resultados señalados con colores.",
  "The team can download the assessment review summary, the two page results PDF or JSON and text for local records. The site does not retain the information.": "El equipo puede descargar el resumen de la evaluación, el PDF completo de resultados o archivos JSON y de texto para sus registros locales. El sitio no conserva la información.",
  "Set conditions before use": "Establece condiciones antes del uso",
  "Use the risk route and unresolved practice gaps to define launch conditions, additional tests, human review or a pause.": "Usa la ruta de riesgo y las deficiencias pendientes para definir condiciones de lanzamiento, pruebas adicionales, revisión humana o una pausa.",
  "Target support": "Orienta los apoyos",
  "Recurring themes can inform training, procurement language, templates and oversight capacity when collected through a separate governed process.": "Los temas recurrentes pueden orientar la formación, las condiciones de compra, las plantillas y la capacidad de supervisión cuando se recopilan mediante un proceso independiente y gobernado.",
  "Keep judgement visible": "Haz visible el criterio aplicado",
  "Record the evidence, owner, date, uncertainty and authorised decision. Treat self reported answers as a review input, not proof that controls work.": "Registra las pruebas, el responsable, la fecha, la incertidumbre y la decisión autorizada. Considera las respuestas del propio equipo como material para la revisión, no como prueba de que los controles funcionan.",
  "A strong response does not prove that a safeguard works. Do not average away a severe unresolved risk. An acceptable residual risk response is a team recommendation, with the authorised decision maker and any conditions recorded separately.": "Una respuesta sólida no demuestra que una salvaguarda funcione. No diluyas un riesgo grave sin resolver en un promedio. La respuesta de que el riesgo residual es aceptable es una recomendación del equipo; registra por separado la decisión de la autoridad competente y sus condiciones.",
  "Policy and data notes · Version 1.6.": "Notas sobre políticas y datos · Versión 1.6.",
  "A clear cover sheet for the assessment report and follow up.": "Una portada clara para el informe de evaluación y su seguimiento.",
  "Complete the risk screen to see its provisional color coded result.": "Completa la evaluación inicial del riesgo para ver el resultado provisional indicado con colores.",
  "0 of 0 required items answered": "0 de 0 elementos obligatorios respondidos",
  ". Download the full results PDF for dimension scores and findings.": ". Descarga el PDF completo de resultados para consultar las puntuaciones por dimensión y los hallazgos.",
  "The screen calculates an adapted risk score and colored route. Practice responses remain separate. The summary does not certify compliance or approve the system.": "La evaluación inicial calcula una puntuación y una ruta de riesgo adaptadas. Las respuestas sobre prácticas se presentan por separado. El resumen no certifica el cumplimiento ni aprueba el sistema.",
  "Thorough assessment · Version 2.1 · 24 questions. Export or print a copy before closing the page.": "Evaluación detallada · Versión 2.1 · 24 preguntas. Exporta o imprime una copia antes de cerrar la página.",
  "What this toolkit is for, how to choose a path and how to use the assessment results.": "Para qué sirve este conjunto de herramientas, cómo elegir una ruta y cómo utilizar los resultados de la evaluación.",
  "This toolkit helps public sector teams identify ethical, legal, social and operational concerns in an AI project, document safeguards and agree on actions. It supports a structured discussion. It is not a certification, legal opinion or automated approval.": "Este conjunto de herramientas ayuda a los equipos del sector público a identificar preocupaciones éticas, jurídicas, sociales y operativas de un proyecto de IA, documentar salvaguardas y acordar medidas. Facilita un debate estructurado. No constituye una certificación, un dictamen jurídico ni una aprobación automática.",
  "Use a cross functional team that includes the accountable service owner, technical and operational leads, data governance, privacy, legal, cybersecurity, procurement and accessibility expertise. Include affected service representatives where appropriate. Record who participated and note important perspectives that were unavailable.": "Forma un equipo interdisciplinario con la persona responsable del servicio, líderes técnicos y operativos, y especialistas en gobernanza de datos, privacidad, derecho, ciberseguridad, compras y accesibilidad. Incluye representantes de las personas afectadas cuando corresponda. Registra quién participó y qué perspectivas importantes faltaron.",
  "You need a concise first review, the system’s scope is bounded, and there is no clear signal of significant or uncertain harm.": "Necesitas una primera revisión breve, el alcance del sistema es limitado y no hay señales claras de daños importantes o inciertos.",
  "16 questions: four risk prompts, eight core safeguard checks, three synthesis prompts and one decision.": "16 preguntas: cuatro sobre riesgos, ocho comprobaciones básicas de salvaguardas, tres preguntas de síntesis y una decisión.",
  "The system may affect rights, public services, safety, money or reputation; uses sensitive information; makes or influences important decisions; or the Quick assessment leaves important questions open.": "El sistema puede afectar derechos, servicios públicos, seguridad, dinero o reputación; usa información sensible; toma o influye en decisiones importantes; o la evaluación rápida deja preguntas importantes abiertas.",
  "24 plain language questions: six risk prompts, 15 checks across six principles, and three final prompts.": "24 preguntas claras: seis sobre riesgos, 15 comprobaciones de seis principios y tres preguntas finales.",
  "If the use may be unlawful or prohibited, or an unresolved risk could cause severe or irreversible harm, pause the ordinary review and seek appropriate legal, ethics, human rights and technical advice.": "Si el uso puede ser ilícito o estar prohibido, o un riesgo sin resolver puede causar daños graves o irreversibles, detén la revisión habitual y solicita asesoramiento jurídico, ético, de derechos humanos y técnico adecuado.",
  "Define the project.": "Define el proyecto.",
  "Describe what the system does, where it is used and who may be affected.": "Describe qué hace el sistema, dónde se utiliza y a quién puede afectar.",
  "Choose the path.": "Elige la ruta.",
  "Start with Quick when the possible effects are limited. Move to Thorough when the system makes important recommendations or decisions, uses sensitive information, or leaves important risks unclear.": "Empieza con la evaluación rápida cuando los posibles efectos sean limitados. Pasa a la detallada cuando el sistema haga recomendaciones o tome decisiones importantes, use información sensible o deje riesgos importantes sin aclarar.",
  "Complete the risk screen.": "Completa la evaluación inicial del riesgo.",
  "Answer all six prompts. Read the percentage together with any uncertainty or high concern answer.": "Responde las seis preguntas. Interpreta el porcentaje junto con las respuestas inciertas o de alta preocupación.",
  "Review all six principles.": "Revisa los seis principios.",
  "Choose “Yes, with evidence”, “Partly or in progress”, “No or unsure”, or “Not applicable, with a reason”. Ask a specialist for help when the team cannot confirm a technical or legal point.": "Elige «Sí, con pruebas», «Parcialmente o en curso», «No o no estoy seguro» o «No aplica, con una razón». Solicita ayuda especializada cuando el equipo no pueda confirmar un aspecto técnico o jurídico.",
  "Agree on actions.": "Acuerda las medidas.",
  "Record the main risks, what will reduce them, who is responsible and when the work will be done.": "Registra los riesgos principales, cómo se reducirán, quién se encargará y cuándo se realizará el trabajo.",
  "Record the decision.": "Registra la decisión.",
  "Choose Proceed, Proceed with conditions or Do not proceed yet.": "Elige «Continuar», «Continuar con condiciones» o «No continuar todavía».",
  "Export and store.": "Exporta y conserva.",
  "Build and download the summary or save it as a PDF under your organisation’s records rules.": "Crea y descarga el resumen o guárdalo como PDF siguiendo las normas de archivo de tu organización.",
  "Begin early, before procurement or model selection where possible. Review again before a pilot, production use or material change. Reopen it after an incident, complaint, change in data or supplier, change to the service context, or unexpected outcomes. Set a review date while the system is operating.": "Comienza pronto, si es posible antes de comprar o elegir un modelo. Revisa de nuevo antes de una prueba piloto, el uso en producción o un cambio importante. Reabre la evaluación tras un incidente, una reclamación, un cambio de datos o proveedor, un cambio en el contexto del servicio o resultados imprevistos. Fija una fecha de revisión mientras el sistema esté en uso.",
  "The forms record team responses and decisions. They do not test the live system or confirm that every answer is correct. Quick suggests a route from the highest concern selected. Thorough reports a risk percentage and six separate principle indicators. These results are kept separate. The final section records the main risks, actions and team decision. See": "Los formularios registran las respuestas y decisiones del equipo. No prueban el sistema en funcionamiento ni confirman que cada respuesta sea correcta. La evaluación rápida sugiere una ruta según la preocupación más alta seleccionada. La detallada presenta un porcentaje de riesgo y seis indicadores de principios separados. Estos resultados no se combinan. La sección final recoge los riesgos principales, las medidas y la decisión del equipo. Consulta",
  "for the calculation.": "para conocer el cálculo.",
  "A recommendation to proceed is not approval by itself. The person or group with authority must consider the evidence, conditions, affected people and local requirements.": "Una recomendación de continuar no constituye por sí sola una aprobación. La persona o el grupo competente debe considerar las pruebas, las condiciones, las personas afectadas y los requisitos locales.",
  "Answers are processed in the browser and are not submitted to an assessment service. They are cleared when the page closes. The forms do not connect to AI system telemetry, service databases or operational case data, so they do not provide real time monitoring. Do not enter unnecessary personal data, case details, security secrets or confidential information.": "Las respuestas se procesan en el navegador y no se envían a un servicio de evaluación. Se borran al cerrar la página. Los formularios no se conectan a la telemetría del sistema de IA, bases de datos del servicio ni expedientes operativos, por lo que no ofrecen supervisión en tiempo real. No introduzcas datos personales innecesarios, detalles de expedientes, secretos de seguridad ni información confidencial.",
  "Facilitation guide · Version 2.1. Review local requirements before operational use.": "Guía de facilitación · Versión 2.1. Revisa los requisitos locales antes de su uso operativo."
});
  Object.assign(ES, {
  "A clear decision and conditions for the next review.": "Una decisión clara y las condiciones para la próxima revisión.",
  "Accountable owner: ": "Responsable de la revisión: ",
  "Accountable review owner": "Responsable de la revisión",
  "Actions to reduce and protect personal information.": "Medidas para reducir y proteger la información personal.",
  "Address the unresolved risks and complete the assessment again.": "Resuelve los riesgos pendientes y repite la evaluación.",
  "Ask the responsible team to address the main security risks.": "Pide al equipo responsable que aborde los principales riesgos de seguridad.",
  "Ask the technical or supplier team about major energy and computing needs.": "Consulta al equipo técnico o al proveedor sobre las principales necesidades energéticas y de cómputo.",
  "Assess workforce effects and agree any training or support needed.": "Evalúa los efectos en el personal y acuerda la formación o el apoyo necesarios.",
  "Assessment date": "Fecha de evaluación",
  "Assessment date: ": "Fecha de evaluación: ",
  "Assessment question": "Pregunta de evaluación",
  "Assessment review summary is ready. Review it before exporting.": "El resumen de la evaluación está listo. Revísalo antes de exportarlo.",
  "Assessment review summary is ready. Review it below or download a copy.": "El resumen de la evaluación está listo. Revísalo abajo o descarga una copia.",
  "Assessment snapshot": "Resumen de la evaluación",
  "Assign a clear accountable owner before the system is used.": "Asigna una persona claramente responsable antes de utilizar el sistema.",
  "Check accessibility and provide an assisted or non digital option when needed.": "Comprueba la accesibilidad y ofrece una opción con asistencia o no digital cuando sea necesario.",
  "Check whether people know AI is being used and can understand important results.": "Comprueba si las personas saben que se utiliza IA y pueden comprender los resultados importantes.",
  "Check whether personal information is necessary and protected.": "Comprueba si la información personal es necesaria y está protegida.",
  "Check whether the system could harm, exclude or unfairly treat people.": "Comprueba si el sistema podría perjudicar, excluir o tratar injustamente a las personas.",
  "Check whether the system works safely and can recover from problems.": "Comprueba si el sistema funciona de forma segura y puede recuperarse de los problemas.",
  "Clear actions to reduce unfairness or access barriers.": "Medidas claras para reducir la injusticia o las barreras de acceso.",
  "Clear all answers in this page? This cannot be undone.": "¿Borrar todas las respuestas de esta página? Esta acción no se puede deshacer.",
  "Clear all answers on this page?": "¿Borrar todas las respuestas de esta página?",
  "Clear ownership and ways to intervene or correct results.": "Responsabilidades claras y formas de intervenir o corregir resultados.",
  "Clearer information and review routes where needed.": "Información más clara y vías de revisión cuando sean necesarias.",
  "Collect only what is needed and set clear protection, access and deletion rules.": "Recopila solo lo necesario y establece reglas claras de protección, acceso y eliminación.",
  "Compare results for relevant groups and act on important differences.": "Compara los resultados de los grupos pertinentes y actúa ante diferencias importantes.",
  "Complete Thorough and obtain stronger governance or specialist review before a deployment decision.": "Completa la evaluación detallada y solicita una revisión más sólida de gobernanza o especializada antes de decidir el despliegue.",
  "Complete all four prompts before relying on a route.": "Responde las cuatro preguntas antes de confiar en la ruta indicada.",
  "Complete the Thorough review and obtain strong governance or specialist oversight.": "Completa la evaluación detallada y solicita una supervisión sólida de gobernanza o especializada.",
  "Complete the residual risk synthesis with the main ethical, legal or social risks and who may be affected.": "Completa la síntesis del riesgo residual con los principales riesgos éticos, jurídicos o sociales y las personas que pueden verse afectadas.",
  "Complete the risk screen before relying on the route.": "Completa la evaluación inicial del riesgo antes de confiar en la ruta.",
  "Complete this risk record.": "Completa este registro de riesgos.",
  "Confirm the main security controls with the technical or security team.": "Confirma los principales controles de seguridad con el equipo técnico o de seguridad.",
  "Consider effects on staff and major resource use.": "Considera los efectos en el personal y el uso importante de recursos.",
  "Continue to Thorough to review tailored safeguards, evidence and affected groups.": "Continúa con la evaluación detallada para revisar salvaguardas específicas, pruebas y grupos afectados.",
  "Create a clear process for complaints, review and correction.": "Establece un proceso claro de quejas, revisión y corrección.",
  "Define who can intervene and how they should do it.": "Define quién puede intervenir y cómo debe hacerlo.",
  "Define who monitors problems, who acts and what safe alternative will be used.": "Define quién supervisa los problemas, quién actúa y qué alternativa segura se utilizará.",
  "Dimension results": "Resultados por dimensión",
  "Dimension results continued": "Resultados por dimensión, continuación",
  "Discuss likely changes with affected staff and plan training or support.": "Debate los posibles cambios con el personal afectado y planifica la formación o el apoyo.",
  "Do not proceed": "No continuar",
  "English working version of a concise first review for public-sector AI projects.": "Versión de trabajo de una primera revisión breve para proyectos de IA del sector público.",
  "Explain the main reasons in plain language and provide a clear review route.": "Explica las razones principales con claridad y ofrece una vía de revisión.",
  "Feedback and action plan": "Hallazgos y plan de acción",
  "Focus on the few risks that matter most.": "Concéntrate en los riesgos más importantes.",
  "Follow up prompts:": "Preguntas de seguimiento:",
  "Form cleared.": "Formulario borrado.",
  "Give every important action an owner and date.": "Asigna una persona responsable y una fecha a cada medida importante.",
  "Give staff clear authority, instructions and a safe alternative process.": "Da al personal autoridad e instrucciones claras y un proceso alternativo seguro.",
  "Green shows a strength. Orange shows an area needing attention. Red shows a priority action. Grey means incomplete.": "El verde indica una fortaleza. El naranja señala un aspecto que requiere atención. El rojo indica una medida prioritaria. El gris significa que falta información.",
  "Identify affected people and check how the system could harm or disadvantage them.": "Identifica a las personas afectadas y comprueba cómo podría perjudicarlas o desfavorecerlas el sistema.",
  "Identify significant resource costs and practical ways to reduce them.": "Identifica los costes importantes de recursos y formas prácticas de reducirlos.",
  "Incomplete risk screen": "Evaluación inicial del riesgo incompleta",
  "Information about affected people, accessibility and differences in results.": "Información sobre las personas afectadas, la accesibilidad y las diferencias entre resultados.",
  "Keep simple records of tests, results, limits and any problems still open.": "Conserva registros sencillos de las pruebas, resultados, limitaciones y problemas pendientes.",
  "Key risk register:": "Registro de riesgos principales:",
  "List the key ethical, legal or social risks and the mitigation actions that need follow through.": "Enumera los principales riesgos éticos, jurídicos o sociales y las medidas de mitigación que requieren seguimiento.",
  "List the people or groups who could be affected and the main possible harms.": "Enumera las personas o grupos que podrían verse afectados y los principales daños posibles.",
  "Low initial signal. Continue the practice review and document why routine safeguards are sufficient.": "Señal inicial baja. Continúa la revisión de las prácticas y documenta por qué bastan las salvaguardas habituales.",
  "Main findings": "Hallazgos principales",
  "Main risks are not yet recorded": "Los riesgos principales aún no se han registrado",
  "Main risks recorded": "Riesgos principales registrados",
  "Make responsibility, human control and challenge routes clear.": "Aclara las responsabilidades, el control humano y las vías para impugnar resultados.",
  "Name one accountable owner and the people who support them.": "Nombra a una persona responsable y a quienes la apoyan.",
  "Named owners, staff instructions and the complaints process.": "Responsables designados, instrucciones para el personal y proceso de quejas.",
  "Needs attention": "Requiere atención",
  "Next review: ": "Próxima revisión: ",
  "Next step not selected": "No se ha seleccionado el siguiente paso",
  "No automatic priority finding was triggered. Review the evidence before closing the assessment.": "No se detectó automáticamente ningún hallazgo prioritario. Revisa las pruebas antes de cerrar la evaluación.",
  "No or unsure.": "No o no estoy seguro.",
  "Not applicable, with a reason.": "No aplica, con una razón.",
  "Not provided.": "No indicado.",
  "Offline English adaptation of a public sector ethical impact self assessment for AI systems.": "Adaptación para uso sin conexión de una autoevaluación del impacto ético de los sistemas de IA del sector público.",
  "Partly or in progress.": "Parcialmente o en curso.",
  "Pause for specialist review": "Detener para revisión especializada",
  "Pause routine progression and obtain local legal, rights, safety and ethics review. This is a review signal, not a finding of illegality.": "Detén el avance habitual y solicita una revisión jurídica, de derechos, seguridad y ética según el contexto local. Es una señal de revisión, no una conclusión de ilegalidad.",
  "Pause routine progression and seek local legal, rights, safety and ethics review before proceeding.": "Detén el avance habitual y solicita una revisión jurídica, de derechos, seguridad y ética según el contexto local antes de continuar.",
  "Practical actions for testing, protection and safe response.": "Medidas prácticas de prueba, protección y respuesta segura.",
  "Priority action": "Medida prioritaria",
  "Priority dimension: ": "Dimensión prioritaria: ",
  "Provide an accessible contact route, response time and correction process.": "Ofrece una vía de contacto accesible, un plazo de respuesta y un proceso de corrección.",
  "Provide understandable explanations and a way to request human review.": "Ofrece explicaciones comprensibles y una forma de solicitar revisión humana.",
  "Provisional risk route: ": "Ruta provisional de riesgo: ",
  "Public body: ": "Organismo público: ",
  "Purpose and use": "Propósito y uso",
  "Quick can be completed if the safeguard checks are evidenced and no material gaps remain.": "La evaluación rápida puede darse por terminada si hay pruebas de las salvaguardas y no quedan deficiencias importantes.",
  "Quick risk screen responses:": "Respuestas de la evaluación inicial rápida del riesgo:",
  "Recommendation": "Recomendación",
  "Record any conditions and when the assessment must be reviewed again.": "Registra las condiciones y cuándo debe revisarse de nuevo la evaluación.",
  "Record the applicable safeguards or state that none are in place.": "Registra las salvaguardas aplicables o indica que no existe ninguna.",
  "Record the conditions, owners and dates.": "Registra las condiciones, los responsables y las fechas.",
  "Record why each type of personal information is needed and confirm the legal basis.": "Registra por qué se necesita cada tipo de información personal y confirma la base jurídica.",
  "Reduce unnecessary information and put protection and deletion rules in place.": "Reduce la información innecesaria y establece reglas de protección y eliminación.",
  "Remove access barriers and provide a practical alternative route.": "Elimina las barreras de acceso y ofrece una vía alternativa práctica.",
  "Responsible organisation": "Organización responsable",
  "Review the evidence recorded in this assessment.": "Revisa las pruebas registradas en esta evaluación.",
  "Review the purpose and legal basis before using personal information.": "Revisa el propósito y la base jurídica antes de utilizar información personal.",
  "Revisit the assessment when the purpose, data, model, scale or affected population changes.": "Repite la evaluación cuando cambien el propósito, los datos, el modelo, la escala o la población afectada.",
  "Risk follow through": "Seguimiento del riesgo",
  "Risk record, ownership, residual decision and next step": "Registro de riesgos, responsables, decisión residual y siguiente paso",
  "Risk route requires escalation": "La ruta de riesgo requiere elevar la revisión",
  "Risk route requires stronger review": "La ruta de riesgo requiere una revisión más rigurosa",
  "Safeguards and residual risk": "Salvaguardas y riesgo residual",
  "Scores describe the evidence recorded in this self assessment.": "Las puntuaciones describen las pruebas registradas en esta autoevaluación.",
  "Section guidance": "Orientaciones de la sección",
  "Set up monitoring, a response process and a safe backup option.": "Establece supervisión, un proceso de respuesta y una alternativa segura.",
  "Strongest dimension: ": "Dimensión más sólida: ",
  "Suggested next step: ": "Siguiente paso recomendado: ",
  "Support for staff and actions to reduce unnecessary resource use.": "Apoyo al personal y medidas para reducir el uso innecesario de recursos.",
  "System or service": "Sistema o servicio",
  "Tell people clearly when and why AI is being used.": "Explica claramente a las personas cuándo y por qué se utiliza IA.",
  "Test results across relevant groups and address unfair differences.": "Comprueba los resultados de los grupos pertinentes y corrige las diferencias injustas.",
  "Test results, security checks, monitoring and the backup process.": "Pruebas de resultados, controles de seguridad, supervisión y proceso alternativo.",
  "Test the system with realistic cases before relying on it.": "Prueba el sistema con casos realistas antes de confiar en él.",
  "The assessment could not start correctly in this browser. Refresh the page and try again.": "La evaluación no pudo iniciarse correctamente en este navegador. Recarga la página e inténtalo de nuevo.",
  "The current route is ": "La ruta actual es ",
  "The main risks, actions, owners and dates.": "Los riesgos principales, las medidas, los responsables y las fechas.",
  "The public notice, explanation and human review process.": "El aviso público, la explicación y el proceso de revisión humana.",
  "The purpose for using information and the rules for access and deletion.": "El propósito del uso de la información y las reglas de acceso y eliminación.",
  "The risk screen is a normalized percentage signal; it is not an official classification, legal opinion or combined measure of practice quality.": "El porcentaje de la evaluación inicial es una señal de riesgo normalizada; no es una clasificación oficial, un dictamen jurídico ni una medida conjunta de la calidad de las prácticas.",
  "The screen is incomplete; no category was calculated.": "La evaluación inicial está incompleta; no se calculó ninguna categoría.",
  "This is a structured self assessment. Scores describe evidence recorded in the form and are not a certification, legal opinion or approval.": "Esta es una autoevaluación estructurada. Las puntuaciones describen las pruebas registradas en el formulario y no constituyen una certificación, un dictamen jurídico ni una aprobación.",
  "This is a structured self assessment. Scores show the evidence recorded in the form and are not a legal classification or approval.": "Esta es una autoevaluación estructurada. Las puntuaciones muestran las pruebas registradas en el formulario y no constituyen una clasificación jurídica ni una aprobación.",
  "This response summary uses a preliminary highest signal route. It is not a legal opinion or an official result.": "Este resumen de respuestas utiliza una ruta preliminar basada en la señal más alta. No es un dictamen jurídico ni un resultado oficial.",
  "Thorough questionnaire responses:": "Respuestas del cuestionario detallado:",
  "Three to five takeaways": "Entre tres y cinco conclusiones",
  "Turn every orange or red result into an owned action with a date and evidence of completion.": "Convierte cada resultado naranja o rojo en una medida con responsable, fecha y pruebas de finalización.",
  "Turn the review into a short action and decision record.": "Convierte la revisión en un breve registro de medidas y decisiones.",
  "Two page results PDF downloaded.": "Se descargó el PDF completo de resultados.",
  "Use a short, accessible notice that explains the role of AI.": "Usa un aviso breve y accesible que explique la función de la IA.",
  "Use each orange or red result to assign an owner, date and evidence of completion.": "Usa cada resultado naranja o rojo para asignar responsable, fecha y pruebas de finalización.",
  "Use the Thorough pathway and define tailored safeguards, owners and review points.": "Usa la ruta detallada y define salvaguardas específicas, responsables y puntos de revisión.",
  "What are the most important remaining risks, and who could be affected?": "¿Cuáles son los riesgos restantes más importantes y a quién podrían afectar?",
  "What is the team’s decision?": "¿Cuál es la decisión del equipo?",
  "What will reduce each risk, who is responsible, and when will it be done?": "¿Qué reducirá cada riesgo, quién será responsable y cuándo se hará?",
  "Workforce feedback, training needs and information about computing costs.": "Opiniones del personal, necesidades de formación e información sobre los costes de cómputo.",
  "Write a response": "Escribe una respuesta",
  "Yes, with evidence.": "Sí, con pruebas."
});
  var ATTR_ES = {
    "Assessment pages": "Páginas de evaluación",
    "Assessment overview": "Resumen de la evaluación",
    "Assessment options": "Opciones de evaluación",
    "Policy and data views": "Vistas de políticas y datos",
    "Example: Benefits eligibility assistant": "Ejemplo: asistente para determinar elegibilidad de beneficios",
    "Example: Department or service unit": "Ejemplo: departamento o unidad de servicio",
    "In one or two sentences, describe the decision or service it supports.": "En una o dos frases, describe la decisión o servicio que apoya.",
    "Role or team, not personal case details": "Rol o equipo, no datos personales de casos",
    "Date or event, for example before launch or after a major change": "Fecha o evento, por ejemplo antes del lanzamiento o después de un cambio importante"
  };
  var originals = new WeakMap();
  var attrOriginals = new WeakMap();
  var current = "en";
  var WORD_ES = {
    the:"el", a:"un", an:"un", and:"y", or:"o", of:"de", to:"a", for:"para", with:"con", without:"sin", from:"de", before:"antes", after:"después", during:"durante", in:"en", on:"en", at:"en", by:"por", as:"como", is:"es", are:"son", be:"ser", can:"puede", could:"podría", may:"puede", should:"debe", what:"qué", when:"cuándo", where:"dónde", who:"quién", how:"cómo", why:"por qué", this:"esta", that:"esa", these:"estas", those:"esas", your:"tu", their:"su", its:"su", it:"ello", people:"personas", person:"persona", team:"equipo", teams:"equipos", system:"sistema", service:"servicio", project:"proyecto", review:"revisión", assessment:"evaluación", question:"pregunta", questions:"preguntas", answer:"respuesta", answers:"respuestas", use:"uso", used:"utilizada", using:"usando", data:"datos", information:"información", risk:"riesgo", risks:"riesgos", impact:"impacto", effects:"efectos", harm:"daño", harms:"daños", rights:"derechos", safety:"seguridad", security:"seguridad", privacy:"privacidad", legal:"legal", lawful:"legal", governance:"gobernanza", responsible:"responsable", responsibility:"responsabilidad", evidence:"evidencia", safeguards:"salvaguardas", safeguard:"salvaguarda", action:"acción", actions:"acciones", owner:"responsable", owners:"responsables", date:"fecha", dates:"fechas", decision:"decisión", decisions:"decisiones", result:"resultado", results:"resultados", route:"ruta", routes:"rutas", next:"próximo", step:"paso", steps:"pasos", start:"inicia", startwith:"comienza con", complete:"completa", completed:"completada", continue:"continúa", pause:"pausa", seek:"busca", find:"encuentra", identify:"identifica", reviewable:"revisable", clear:"claro", clearer:"más claro", important:"importante", significant:"significativo", possible:"posible", potential:"potencial", practical:"práctico", simple:"sencillo", plain:"sencillo", language:"lenguaje", all:"todas", four:"cuatro", five:"cinco", six:"seis", eight:"ocho", one:"uno", two:"dos", three:"tres", first:"primero", second:"segundo", high:"alto", medium:"medio", low:"bajo", excessive:"excesivo", unresolved:"no resuelto", complete:"completa", incomplete:"incompleto", provided:"indicado", not:"no", applicable:"aplicable", yes:"sí", no:"no", unsure:"no estoy seguro/a", always:"siempre", usually:"generalmente", only:"solo", decision:"decisión", public:"público", services:"servicios", organisation:"organización", organization:"organización", department:"departamento", details:"detalles", records:"registros", record:"registro", download:"descargar", downloaded:"descargado", build:"crear", save:"guardar", print:"imprimir", clear:"borrar", summary:"resumen", text:"texto", page:"página", pages:"páginas", table:"tabla", purpose:"propósito", prepare:"preparar", get:"obtener", about:"sobre", begin:"comenzar", work:"trabajo", working:"trabajo", through:"a través de", affects:"afecta", affected:"afectadas", check:"comprobar", checks:"comprobaciones", checked:"comprobado", choose:"elige", chosen:"elegido", follow:"seguimiento", followup:"seguimiento", support:"apoyar", supports:"apoya", appropriate:"adecuado", available:"disponible", current:"actual", main:"principal", remaining:"restante", separate:"separado", overall:"general", systems:"sistemas", does:"hace", make:"hacer", makes:"hace", made:"hecho", affect:"afectar", influence:"influir", enter:"introducir", entered:"introducido", organised:"organizado", retained:"conservada", stored:"almacenada", store:"almacenar", explains:"explica", explain:"explicar", explanation:"explicación", open:"abierto", closed:"cerrado", close:"cerrar", requires:"requiere", need:"necesita", needs:"necesita", specialist:"especialista", local:"local", official:"oficial", version:"versión", overview:"resumen", sources:"fuentes", method:"método", notes:"notas", principles:"principios", human:"humana", oversight:"supervisión", accountability:"rendición de cuentas", transparency:"transparencia", explainability:"explicabilidad", robustness:"robustez", sustainability:"sostenibilidad", wellbeing:"bienestar", financial:"financiera", financials:"finanzas", sensitive:"sensible", personal:"personal", serious:"grave", severe:"grave", routine:"normal", progression:"avance", concern:"preocupación", concerns:"preocupaciones", identified:"identificado", meaningful:"significativo", limited:"limitado", foreseeable:"previsible", broad:"amplio", basic:"básico", core:"principal", detailed:"detallada", focused:"enfocada", color:"color", coded:"codificada", priority:"prioridad", practice:"práctica", practices:"prácticas", gaps:"brechas", improvement:"mejora", conditions:"condiciones", timing:"plazos", pathway:"ruta", pathways:"rutas", report:"informe", reports:"informes", "team’s":"del equipo", "organisation’s":"de la organización"
  };
  function key(value) { return String(value || "").replace(/\s+/g, " ").trim(); }
  function translateFallback(value) {
    return String(value).replace(/[A-Za-z][A-Za-z’'-]*/g, function (word) {
      var lower = word.toLowerCase();
      var result = WORD_ES[lower];
      if (!result) return word;
      if (word === word.toUpperCase()) return result.toUpperCase();
      if (/^[A-Z]/.test(word)) return result.charAt(0).toUpperCase() + result.slice(1);
      return result;
    });
  }
  Object.assign(ES, {
    "A count of the team’s responses, separate from the risk route.": "Recuento de las respuestas del equipo, separado de la ruta de riesgo.",
    "Practice indicators": "Indicadores de prácticas",
    "Preliminary risk route": "Ruta provisional de riesgo",
    "Project:": "Proyecto:", "Body:": "Organismo:", "Owner:": "Responsable:", "Next review:": "Próxima revisión:",
    "Quick risk screen responses": "Respuestas de la evaluación inicial rápida del riesgo",
    "Team recommended next step:": "Siguiente paso recomendado por el equipo:",
    "This route follows the highest signal, not an average. The Thorough screen uses five scored questions and one override question.": "Esta ruta sigue la señal más alta, no un promedio. La evaluación detallada utiliza cinco preguntas puntuadas y una pregunta que puede prevalecer sobre la puntuación.",
    "Generated from the English team self assessment.": "Generado a partir de la autoevaluación del equipo en español.",
    "If not applicable, explain why": "Si no aplica, explica por qué",
    "Complete all four prompts to calculate a route.": "Responde las cuatro preguntas para calcular una ruta.",
    "Core safeguards": "Salvaguardas básicas", "Governance and documentation": "Gobernanza y documentación", "Priority risks and next steps": "Riesgos prioritarios y siguientes pasos",
    "System context": "Contexto del sistema", "Risk screen responses": "Respuestas de la evaluación inicial del riesgo", "Residual risk decision": "Decisión sobre el riesgo residual", "Responses by section": "Respuestas por sección", "Follow up prompts": "Preguntas de seguimiento",
    "Name:": "Nombre:", "Responsible organisation or team:": "Organización o equipo responsable:", "Calculated risk screen:": "Evaluación inicial del riesgo calculada:",
    "Key risks and affected people:": "Riesgos principales y personas afectadas:", "Actions, owners, dates and remaining risk:": "Medidas, responsables, fechas y riesgo restante:",
    "No screening responses provided.": "No se han indicado respuestas para la evaluación inicial del riesgo.",
    "No automatic follow up prompts were triggered by the selected answers. The team should still review the evidence and residual risk.": "Las respuestas seleccionadas no generaron automáticamente preguntas de seguimiento. Aun así, el equipo debe revisar las pruebas y el riesgo residual.",
    "One or more severe harm or potentially prohibited use concerns were selected. Pause routine progression and seek local legal, rights, safety and ethics review. This is a screening prompt, not a legal determination.": "Se seleccionaron preocupaciones por daños graves o usos posiblemente prohibidos. Detén el avance habitual y solicita una revisión jurídica, de derechos, seguridad y ética según el contexto local. Esta señal de evaluación no constituye una conclusión jurídica.",
    "This summary reflects team responses at one point in time. It does not validate evidence, determine legal compliance or monitor a live system.": "Este resumen refleja las respuestas del equipo en un momento concreto. No verifica las pruebas, determina el cumplimiento legal ni supervisa un sistema en funcionamiento.",
    "thresholds and interpretation": "umbrales e interpretación", "Calculated route": "Ruta calculada",
    "Quick review complete": "Evaluación rápida terminada", "Continue to Thorough": "Continuar con la evaluación detallada", "Pause and escalate": "Detener y elevar la revisión",
    "In place": "Implantada", "Needs strengthening": "Debe reforzarse", "Gap to address": "Deficiencia por resolver", "Not answered": "Sin responder",
    "Download text report": "Descargar informe de texto", "Assessments": "Evaluaciones", "Choose an assessment": "Elige una evaluación",
    "Assessment progress": "Progreso de la evaluación", "Context": "Contexto", "Risk screen": "Evaluación inicial del riesgo", "Safeguards": "Salvaguardas", "Governance": "Gobernanza", "Summary": "Resumen", "Six principles": "Seis principios", "Summary and export": "Resumen y exportación",
    "Self assessment for public sector AI": "Autoevaluación de IA para el sector público", "Navigate risk, governance, and responsible use.": "Examina el riesgo, la gobernanza y el uso responsable.",
    "2. Human rights, dignity and equity": "2. Derechos humanos, dignidad y equidad", "3. Transparency and explainability": "3. Transparencia y explicabilidad", "4. Security and robustness": "4. Seguridad y robustez", "5. Privacy and data protection": "5. Privacidad y protección de datos", "6. Human oversight and accountability": "6. Supervisión humana y rendición de cuentas", "7. Sustainability and wellbeing": "7. Sostenibilidad y bienestar", "8. Risk synthesis, mitigation and residual risk": "8. Síntesis, mitigación y riesgo residual",
    "Color coded interpretation of risk levels, practice indicators and residual risk for the two assessment paths.": "Interpretación por colores de niveles de riesgo, indicadores de prácticas y riesgo residual para las dos rutas de evaluación.", "How the assessment reports are handled and how policymakers can use project findings responsibly.": "Cómo se gestionan los informes de evaluación y cómo pueden utilizar sus resultados de forma responsable quienes elaboran políticas.", "A self assessment for public sector AI teams to identify ethical risks, review safeguards and agree practical next steps.": "Una autoevaluación para que los equipos de IA del sector público identifiquen riesgos éticos, revisen salvaguardas y acuerden medidas prácticas.", "Instructions for choosing and completing a quick or thorough AI governance assessment.": "Instrucciones para elegir y completar una evaluación rápida o detallada de la gobernanza de la IA.",
    "Quick actions": "Acciones rápidas", "Team AI readiness": "Preparación del equipo para la IA",
    "Strong": "Sólido", "Pending": "Pendiente", "Page": "Página", "Not provided": "No indicado", "No follow up prompt": "Sin preguntas de seguimiento", "not enough data": "datos insuficientes", "Provisional route": "Ruta provisional", "Why this route?": "¿Por qué esta ruta?", "Evidence / reason:": "Pruebas o motivo:", "Answer:": "Respuesta:", "Project:": "Proyecto:", "Public body:": "Organismo público:", "Purpose:": "Propósito:", "Screening route:": "Ruta de evaluación inicial:", "Screening result:": "Resultado de la evaluación inicial:", "Quick assessment · team review": "Evaluación rápida · revisión del equipo", "Civic AI Compass — Quick assessment": "Civic AI Compass — Evaluación rápida", "Risk screen:": "Evaluación inicial del riesgo:", "Provisional risk route:": "Ruta provisional de riesgo:", "Suggested next step:": "Siguiente paso recomendado:", "Assessment date:": "Fecha de evaluación:", "Next review:": "Próxima revisión:", "Accountable owner:": "Responsable de la revisión:", "Public body:": "Organismo público:", "Follow up prompts:": "Preguntas de seguimiento:", "Prompt:": "Pregunta:", "Completion:": "Completado:", "Accountable owner:": "Responsable de la revisión:", "Date:": "Fecha:", "Key risk register:": "Registro de riesgos principales:", "Acceptability:": "Aceptabilidad:", "Risks and affected people:": "Riesgos y personas afectadas:",
    "Quick assessment results": "Resultados de la evaluación rápida", "Thorough assessment results": "Resultados de la evaluación detallada",
    "Feedback and action plan": "Hallazgos y plan de acción", "Risk route": "Ruta de riesgo", "Assessment date": "Fecha de evaluación",
    "The current route is": "La ruta actual es", "Priority dimension:": "Dimensión prioritaria:", "Strongest dimension:": "Dimensión más sólida:",
    "No automatic priority finding was triggered. Review the evidence before closing the assessment.": "No se detectó automáticamente ningún hallazgo prioritario. Revisa las pruebas antes de cerrar la evaluación.",
    "Scores describe the evidence recorded in this self assessment.": "Las puntuaciones describen las pruebas registradas en esta autoevaluación."
  });
  Object.assign(ES, {
    "Self assessment for public sector AI · Navigate risk, governance, and responsible use.": "Autoevaluación de IA para el sector público · Examina el riesgo, la gobernanza y el uso responsable.",
    "English working package · Version 1.5. Review local legal and governance requirements.": "Versión de trabajo · Versión 1.5. Revisa los requisitos legales y de gobernanza locales.",
    "Discuss, choose a depth and export the agreed record.": "Debate, elige el nivel de detalle y exporta el registro acordado.",
    "Agree the answers as a team": "Acuerda las respuestas con el equipo",
    "Use the toolkit as a shared review, not a solitary form.": "Usa la herramienta para una revisión compartida en equipo.",
    "Work through this review as a team": "Completa esta revisión en equipo",
    "Discuss each prompt with people who understand the system, its data, safeguards, affected groups and legal context. Compare evidence, resolve differences and agree the response before one person records the result.": "Debate cada pregunta con personas que conozcan el sistema, sus datos, salvaguardas, grupos afectados y contexto jurídico. Compara las pruebas, resuelve las diferencias y acuerda la respuesta con el equipo antes de registrarla.",
    "Discuss each prompt with people who understand the system, its safeguards and the people it may affect. Compare evidence, resolve differences and agree the answer before one person records the result.": "Debate cada pregunta con personas que conozcan el sistema, sus salvaguardas y a quienes puede afectar. Compara las pruebas, resuelve las diferencias y acuerda la respuesta con el equipo antes de registrarla.",
    "Risk | people affected | what is still uncertain": "Riesgo | personas afectadas | dudas pendientes",
    "Risk | action | owner | date | remaining level": "Riesgo | medida | responsable | fecha | nivel restante"
  });
  Object.assign(ES, {
    "Responsible AI in Education Compass | Sources and method": "Brújula para una IA responsable en educación | Fuentes y método",
    "Education use context": "Contexto del uso educativo",
    "Priority risks and affected people or institutions:": "Riesgos prioritarios y personas o instituciones afectadas:",
    "Actions, responsible roles, dates and remaining risk:": "Acciones, responsables, fechas y riesgo restante:",
    "This summary records the team’s responses at one point in time. It does not verify the evidence, confirm compliance or monitor the system in operation.": "Este resumen recoge las respuestas del equipo en un momento concreto. No verifica las evidencias, confirma el cumplimiento ni supervisa el sistema mientras está en funcionamiento.",
    "Generated from the education AI self assessment.": "Generado a partir de la autoevaluación sobre IA en educación.",
    "Responsible AI in Education Compass — Quick assessment": "Brújula para una IA responsable en educación — Evaluación rápida",
    "Responsible AI in Education Compass — Thorough assessment": "Brújula para una IA responsable en educación — Evaluación detallada",
    "AI system or use:": "Sistema o uso de IA:",
    "Responsible education authority or institution:": "Autoridad o institución educativa responsable:",
    "Education purpose, context and affected groups:": "Propósito educativo, contexto y grupos afectados:",
    "Responsible review lead:": "Responsable de coordinar la revisión:",
    "Priority risks and affected people or institutions": "Riesgos prioritarios y personas o instituciones afectadas",
    "Actions, responsible roles, dates and remaining risk": "Acciones, responsables, fechas y riesgo restante",
    "This response summary uses the highest preliminary signal. It supports team discussion but is not a legal opinion, an official approval or a measure of educational quality.": "Este resumen toma como referencia la señal preliminar más alta. Sirve para orientar la conversación del equipo, pero no constituye un dictamen jurídico, una aprobación oficial ni una medida de la calidad educativa.",
    "The risk screen is a normalized percentage signal. It supports team discussion but is not an official classification, legal opinion or measure of educational quality.": "La evaluación inicial del riesgo ofrece una señal porcentual normalizada. Sirve para orientar la conversación del equipo, pero no constituye una clasificación oficial, un dictamen jurídico ni una medida de la calidad educativa."
  });
  Object.assign(ES, {
    "A self assessment, by design": "Una autoevaluación pensada para el equipo",
    "How this education edition was assembled": "Cómo se elaboró esta edición para educación",
    "Each assessment is a separate HTML page with its styling and logic embedded. It can be opened directly in a browser and does not require a hosted assessment service. Answers remain in the current page session, are not submitted and are cleared when the page closes. Export JSON, text or PDF to keep a record under the rules that apply in your education system or institution.": "Cada evaluación es una página HTML independiente que incorpora su diseño y su lógica. Puede abrirse directamente en un navegador y no necesita un servicio de evaluación alojado. Las respuestas permanecen en la sesión actual, no se envían y se eliminan al cerrar la página. Exporta un archivo JSON, de texto o PDF para conservar un registro conforme a las normas de tu sistema educativo o institución.",
    "This package is intended to support review and repurposing. Before publication, identify the original Brazilian framework as the source of inspiration, retain its official URL, state that this education edition is an adaptation, and identify the local authority responsible for its content. Check the original site’s applicable reuse terms and any third-party content before redistributing official text, logos or resources.": "Este paquete está pensado para facilitar la revisión y la adaptación. Antes de publicarlo, identifica el marco brasileño original como fuente de inspiración, conserva su URL oficial, indica que esta edición para educación es una adaptación e identifica la autoridad local responsable de su contenido. Revisa las condiciones de reutilización del sitio original y cualquier contenido de terceros antes de redistribuir textos, logotipos o recursos oficiales.",
    "Package version: 2.0 · Prepared 24 September 2026.": "Versión del paquete: 2.0 · Preparada el 24 de septiembre de 2026.",
    "Sources and method notes · Version 2.0.": "Notas sobre fuentes y método · Versión 2.0.",
    "The general categories and risk structure remain aligned with the source framework and the earlier working adaptation.": "Las categorías generales y la estructura de riesgos mantienen la coherencia con el marco de origen y con la adaptación de trabajo anterior.",
    "Questions, examples, guidance and recommendations address education system uses, including policy, planning, administration, data processing, procurement, inspection, institutional management, learner services and teaching.": "Las preguntas, los ejemplos, las orientaciones y las recomendaciones abordan usos de la IA en el sistema educativo, como políticas, planificación, administración, tratamiento de datos, compras, supervisión, gestión institucional, servicios al estudiantado y enseñanza.",
    "The wording does not assume a particular country, administrative structure, education level, curriculum, pedagogical model or legal framework. Each team must identify the local requirements and responsibilities that apply.": "La redacción no presupone un país, una estructura administrativa, un nivel educativo, un currículo, un modelo pedagógico ni un marco jurídico determinados. Cada equipo debe identificar los requisitos y las responsabilidades aplicables en su contexto.",
    "The Quick assessment has 16 questions for an initial review. The Thorough assessment has 24 plain language questions covering the risk screen, six principles and the final decision.": "La evaluación rápida contiene 16 preguntas para una primera revisión. La evaluación detallada contiene 24 preguntas en lenguaje claro que abarcan la evaluación inicial del riesgo, seis principios y la decisión final.",
    "The scoring structure is unchanged: the Quick assessment follows the highest signal; the Thorough assessment uses a normalized screening percentage; and practice quality remains separate from the risk route.": "La estructura de puntuación no cambia: la evaluación rápida sigue la señal más alta; la evaluación detallada utiliza un porcentaje normalizado; y la calidad de las prácticas se mantiene separada de la ruta de riesgo.",
    "Find risks early": "Detecta los riesgos a tiempo",
    "Focused first review": "Primera revisión centrada",
    "Color coded route and next step": "Ruta de riesgo y siguiente paso señalados con colores",
    "Pause and escalate. Seek specialist review for a potentially unlawful use or severe unresolved harm.": "Detén la revisión y eleva el caso. Solicita asesoramiento especializado ante un posible uso ilícito o un daño grave sin resolver."
  });
  Object.assign(ES, {
    "Responsible AI in Education Compass": "Brújula para una IA responsable en educación",
    "Responsible AI in Education Compass | Quick assessment": "Brújula para una IA responsable en educación | Evaluación rápida",
    "Responsible AI in Education Compass | Thorough assessment": "Brújula para una IA responsable en educación | Evaluación detallada",
    "Responsible AI in Education Compass | Self assessment": "Brújula para una IA responsable en educación | Autoevaluación",
    "Responsible AI in Education Compass | Instructions": "Brújula para una IA responsable en educación | Instrucciones",
    "Responsible AI in Education Compass | Scoring": "Brújula para una IA responsable en educación | Puntuación e interpretación",
    "Responsible AI in Education Compass | Policy and data": "Brújula para una IA responsable en educación | Políticas y datos",
    "Responsible AI self assessment for education": "Autoevaluación de IA responsable para la educación",
    "Responsible AI self assessment for education systems · Review risk, governance and practical action.": "Autoevaluación de IA responsable para sistemas educativos · Revisa los riesgos, la gobernanza y las acciones prácticas.",
    "Review risk, governance and responsible use across the education system.": "Revisa los riesgos, la gobernanza y el uso responsable en todo el sistema educativo.",
    "Review impacts, safeguards and residual risk in education.": "Revisa los impactos, las salvaguardas y el riesgo residual en educación.",
    "Education authorities, institutions and cross functional teams.": "Autoridades educativas, instituciones y equipos interfuncionales.",
    "Education context": "Contexto educativo",
    "Bring together the education, policy, technical and oversight functions relevant to the use.": "Reúne las funciones educativas, de política, técnicas y de supervisión pertinentes para el uso.",
    "System review": "Revisión del sistema",
    "Examine safeguards, governance and residual risk across six common categories.": "Examina las salvaguardas, la gobernanza y el riesgo residual en seis categorías comunes.",
    "Quick review": "Revisión rápida",
    "Start with the main risk signals": "Comienza con las principales señales de riesgo",
    "Identify priority gaps and the appropriate next step.": "Identifica las brechas prioritarias y el siguiente paso adecuado.",
    "A clear 24 question team review for AI use across education systems.": "Una revisión clara de 24 preguntas para equipos sobre el uso de IA en los sistemas educativos.",
    "Start with the education context": "Comienza con el contexto educativo",
    "Describe the use, the level of the education system and who may be affected.": "Describe el uso, el nivel del sistema educativo y quiénes pueden verse afectados.",
    "Place the AI use within its education, institutional and territorial context.": "Sitúa el uso de la IA en su contexto educativo, institucional y territorial.",
    "The intended purpose, responsible authority or institution, affected groups, data involved and an accountable review owner.": "El propósito previsto, la autoridad o institución responsable, los grupos afectados, los datos utilizados y una persona o unidad responsable de la revisión.",
    "A context record that helps teams interpret the same questions across different education systems.": "Un registro del contexto que ayuda a interpretar las mismas preguntas en distintos sistemas educativos.",
    "A context record that supports interpretation across different education systems.": "Un registro del contexto que facilita la interpretación en distintos sistemas educativos.",
    "What should we call this AI system or use?": "¿Cómo debemos llamar a este sistema o uso de IA?",
    "Example: Student support case triage tool": "Ejemplo: herramienta de clasificación de casos de apoyo estudiantil",
    "Example: Education planning data assistant": "Ejemplo: asistente de datos para la planificación educativa",
    "Which education authority, institution or team is responsible?": "¿Qué autoridad educativa, institución o equipo es responsable?",
    "Example: National authority, local office, institution or service unit": "Ejemplo: autoridad nacional, oficina local, institución o unidad de servicio",
    "What does it do, where is it used and who may be affected?": "¿Qué hace, dónde se utiliza y quiénes pueden verse afectados?",
    "Describe the education process, system level, intended users, affected groups and decisions or services it may influence.": "Describe el proceso educativo, el nivel del sistema, los usuarios previstos, los grupos afectados y las decisiones o servicios en los que puede influir.",
    "Responsible role or team": "Rol o equipo responsable",
    "Date or trigger, such as before procurement, pilot, expansion or a material change": "Fecha o condición, por ejemplo antes de la compra, el piloto, la ampliación o un cambio sustancial",
    "Use the terminology of your education system. Do not enter names, individual records, security secrets or other unnecessary sensitive information.": "Usa la terminología de tu sistema educativo. No introduzcas nombres, expedientes individuales, secretos de seguridad ni otra información sensible innecesaria.",
    "How much can AI shape decisions, services or opportunities in education?": "¿En qué medida puede la IA determinar decisiones, servicios u oportunidades en educación?",
    "It supports general analysis or drafting; no decision about a person or institution follows from the output.": "Apoya análisis generales o la redacción; de su resultado no se deriva una decisión sobre una persona o institución.",
    "It provides low impact advice that qualified staff can readily question or disregard.": "Ofrece recomendaciones de bajo impacto que el personal cualificado puede cuestionar o descartar fácilmente.",
    "It could materially influence learning opportunities, assessment, support, access, resource allocation, inspection, employment, rights, safety or reputation.": "Podría influir de forma sustancial en oportunidades de aprendizaje, evaluación, apoyo, acceso, asignación de recursos, inspección, empleo, derechos, seguridad o reputación.",
    "It can make or carry out a consequential decision without meaningful human review before impact.": "Puede tomar o ejecutar una decisión relevante sin una revisión humana efectiva antes de que produzca efectos.",
    "What data does the system use about learners, education staff or institutions?": "¿Qué datos utiliza el sistema sobre estudiantes, personal educativo o instituciones?",
    "No personal or confidential institution level data.": "No utiliza datos personales ni datos institucionales confidenciales.",
    "Personal or institution level data, but no sensitive or specially protected data.": "Utiliza datos personales o institucionales, pero no datos sensibles ni especialmente protegidos.",
    "Sensitive or specially protected data, including records about children or vulnerable groups where applicable.": "Utiliza datos sensibles o especialmente protegidos, incluidos datos sobre menores o grupos vulnerables cuando corresponda.",
    "Who or what part of the education system may be affected, and at what scale?": "¿Quién o qué parte del sistema educativo puede verse afectada y a qué escala?",
    "A small, bounded use involving few people or institutions, with no known heightened vulnerability.": "Un uso reducido y delimitado que afecta a pocas personas o instituciones, sin vulnerabilidad agravada conocida.",
    "One or more institutions or communities, or a group that may face additional barriers or disadvantage.": "Una o más instituciones o comunidades, o un grupo que puede enfrentar barreras o desventajas adicionales.",
    "A large part of the education system, or a material effect concentrated on children or another vulnerable group.": "Una parte amplia del sistema educativo, o un efecto sustancial concentrado en menores u otro grupo vulnerable.",
    "Is there a credible concern about unlawful use or severe, hard to reverse harm in the education context?": "¿Existe una preocupación fundada sobre un uso ilícito o un daño grave y difícil de revertir en el contexto educativo?",
    "Has the system been designed and tested to identify unfair effects across relevant learners, staff, institutions, languages, disabilities, locations or social groups?": "¿Se ha diseñado y probado el sistema para identificar efectos injustos entre estudiantes, personal, instituciones, idiomas, discapacidades, territorios o grupos sociales pertinentes?",
    "Are AI outputs meaningfully reviewed by trained and authorised staff before they affect a person, institution or important education decision?": "¿El personal formado y autorizado revisa de forma efectiva los resultados de la IA antes de que afecten a una persona, institución o decisión educativa importante?",
    "Has the system been tested for accuracy, safety and fitness in the education settings where it will be used?": "¿Se ha probado la precisión, seguridad y adecuación del sistema en los entornos educativos donde se utilizará?",
    "Is a person or unit accountable for operating, maintaining and monitoring the system and its effects?": "¿Existe una persona o unidad responsable de operar, mantener y supervisar el sistema y sus efectos?",
    "Are responsibilities assigned for educational purpose, data quality, security, accessibility, procurement, ethical use and compliance with applicable rules?": "¿Se han asignado responsabilidades sobre el propósito educativo, la calidad de los datos, la seguridad, la accesibilidad, las compras, el uso ético y el cumplimiento de las normas aplicables?",
    "Are data sources, quality, representativeness, freshness, consistency and interoperability checked through a documented process?": "¿Se comprueban mediante un proceso documentado las fuentes, calidad, representatividad, actualización, coherencia e interoperabilidad de los datos?",
    "Does documentation explain the education purpose, intended users, affected groups, data, operation, supplier responsibilities and limitations?": "¿La documentación explica el propósito educativo, los usuarios previstos, los grupos afectados, los datos, el funcionamiento, las responsabilidades del proveedor y las limitaciones?",
    "Have people outside the direct development or procurement work reviewed the risks before use, pilot or expansion?": "¿Personas ajenas al desarrollo o la compra directa han revisado los riesgos antes del uso, el piloto o la ampliación?",
    "Identify the main educational, ethical, legal, social, operational or technical risks and the mitigation actions planned or in place.": "Identifica los principales riesgos educativos, éticos, jurídicos, sociales, operativos o técnicos y las medidas de mitigación previstas o existentes.",
    "What role does the AI system have in the education process?": "¿Qué función cumple el sistema de IA en el proceso educativo?",
    "Provides general information or drafts": "Proporciona información general o borradores",
    "Makes recommendations to staff": "Formula recomendaciones al personal",
    "Influences important decisions about people, institutions, services or resources": "Influye en decisiones importantes sobre personas, instituciones, servicios o recursos",
    "Makes or carries out important decisions": "Toma o ejecuta decisiones importantes",
    "Can trained and authorised staff check and change the output before a person or institution is affected?": "¿El personal formado y autorizado puede revisar y modificar el resultado antes de que afecte a una persona o institución?",
    "Only after the decision or action": "Solo después de la decisión o acción",
    "What type of data about learners, education staff or institutions does it use?": "¿Qué tipo de datos utiliza sobre estudiantes, personal educativo o instituciones?",
    "No personal or confidential institution level data": "No utiliza datos personales ni datos institucionales confidenciales",
    "Personal or institution level data with limited sensitivity": "Utiliza datos personales o institucionales de sensibilidad limitada",
    "Sensitive or specially protected data, including records about children or vulnerable groups where applicable": "Utiliza datos sensibles o especialmente protegidos, incluidos datos sobre menores o grupos vulnerables cuando corresponda",
    "If the system makes a mistake, how widely could the effects spread across the education system?": "Si el sistema se equivoca, ¿hasta dónde podrían extenderse los efectos en el sistema educativo?",
    "One person, institution or a small number of cases": "Una persona, una institución o un número reducido de casos",
    "One service, institution, locality or community": "Un servicio, institución, territorio o comunidad",
    "Many institutions, services, communities or a large population": "Muchas instituciones, servicios, comunidades o una población amplia",
    "Could an incorrect or unfair result affect learning opportunities, assessment, support, access, resource allocation, inspection, employment, rights, safety or reputation?": "¿Un resultado incorrecto o injusto podría afectar oportunidades de aprendizaje, evaluación, apoyo, acceso, asignación de recursos, inspección, empleo, derechos, seguridad o reputación?",
    "Could this use be unlawful or cause severe harm in education? Examples include manipulation, exploitation, disproportionate profiling or surveillance, denial of opportunity, or unsafe autonomous action.": "¿Este uso podría ser ilícito o causar daños graves en educación? Algunos ejemplos son la manipulación, la explotación, la elaboración desproporcionada de perfiles o la vigilancia, la negación de oportunidades o una acción autónoma insegura.",
    "Have we identified how learners, families, education staff, institutions or communities could be harmed, excluded or treated unfairly?": "¿Hemos identificado cómo estudiantes, familias, personal educativo, instituciones o comunidades podrían sufrir daños, quedar excluidos o recibir un trato injusto?",
    "Have we checked whether performance or outcomes differ unfairly across relevant groups and education contexts?": "¿Hemos comprobado si el rendimiento o los resultados difieren injustamente entre grupos y contextos educativos pertinentes?",
    "Can people participate or receive the service regardless of disability, language, location, income, digital skills, connectivity or device access?": "¿Las personas pueden participar o recibir el servicio independientemente de su discapacidad, idioma, ubicación, ingresos, competencias digitales, conectividad o acceso a dispositivos?",
    "Are affected people and responsible staff clearly told when, why and how AI is being used in the education process?": "¿Se informa claramente a las personas afectadas y al personal responsable de cuándo, por qué y cómo se utiliza la IA en el proceso educativo?",
    "Can an important result be explained in understandable terms and reviewed or challenged by a person with authority?": "¿Un resultado importante puede explicarse de forma comprensible y ser revisado o impugnado ante una persona con autoridad?",
    "Has the system been tested in education settings that reflect its intended users, languages, data, workflows, infrastructure and scale?": "¿Se ha probado el sistema en entornos educativos que reflejen los usuarios, idiomas, datos, procesos, infraestructura y escala previstos?",
    "Is the system protected against misuse, unauthorised access, data leakage and attacks?": "¿El sistema está protegido contra el uso indebido, el acceso no autorizado, las filtraciones de datos y los ataques?",
    "Can responsible teams detect problems, correct or stop the system and continue the education process safely?": "¿Los equipos responsables pueden detectar problemas, corregir o detener el sistema y continuar el proceso educativo de forma segura?",
    "Is there a clear, necessary and valid reason under applicable rules for using each type of learner, staff or other personal data?": "¿Existe un motivo claro, necesario y válido conforme a las normas aplicables para utilizar cada tipo de dato personal de estudiantes, personal u otras personas?",
    "Are personal data limited, accurate, protected, appropriately shared and deleted when no longer needed?": "¿Los datos personales son limitados, exactos, protegidos, compartidos adecuadamente y eliminados cuando dejan de ser necesarios?",
    "Are responsibilities clear across procurement, deployment, operation, oversight and the effects of the system?": "¿Están claras las responsabilidades en la compra, implantación, operación, supervisión y efectos del sistema?",
    "Do trained staff have the time, information and authority to question, stop, correct or override the system?": "¿El personal formado dispone del tiempo, la información y la autoridad necesarios para cuestionar, detener, corregir o invalidar el sistema?",
    "Can learners, families, staff or institutions challenge a result, report a problem and receive a timely response?": "¿Estudiantes, familias, personal o instituciones pueden impugnar un resultado, informar de un problema y recibir una respuesta oportuna?",
    "Have effects on learner wellbeing and on education roles, workload, skills, professional judgement and working conditions been considered?": "¿Se han considerado los efectos sobre el bienestar estudiantil y sobre las funciones, carga de trabajo, capacidades, juicio profesional y condiciones laborales del personal educativo?",
    "Have long term financial, infrastructure, supplier dependency, environmental and computing costs been considered?": "¿Se han considerado los costos financieros, de infraestructura, dependencia de proveedores, ambientales y computacionales a largo plazo?",
    "What are the most important remaining education, rights, data, operational, technical or supplier risks, and who could be affected?": "¿Cuáles son los riesgos restantes más importantes en materia educativa, de derechos, datos, operación, tecnología o proveedores, y quiénes podrían verse afectados?",
    "Risk | people or institutions affected | what is still uncertain": "Riesgo | personas o instituciones afectadas | dudas pendientes"
  });
  Object.assign(ES, {
    "Include people who understand the education purpose, affected groups, data, technology, operations, procurement and applicable rules. This may involve education authorities, institutions, technical teams, school leaders, inspectors, educators, students or families, depending on the use.": "Incluye a personas que conozcan el propósito educativo, los grupos afectados, los datos, la tecnología, las operaciones, las compras y las normas aplicables. Según el uso, pueden participar autoridades educativas, instituciones, equipos técnicos, directivos, inspectores, educadores, estudiantes o familias.",
    "Use this concise self assessment for an early review or a bounded use of AI anywhere in an education system. Four risk prompts suggest a Low, Medium or High route.": "Usa esta autoevaluación breve para una revisión inicial o un uso delimitado de IA en cualquier parte del sistema educativo. Cuatro preguntas de riesgo sugieren una ruta baja, media o alta.",
    "Continue to Thorough when the use may influence learning opportunities, assessment, access, resource allocation, inspection, employment or another important education process.": "Continúa con la evaluación detallada cuando el uso pueda influir en oportunidades de aprendizaje, evaluación, acceso, asignación de recursos, inspección, empleo u otro proceso educativo importante.",
    "The result follows the highest concern selected, not an average. Interpret each answer within the applicable national or local education, legal and institutional context.": "El resultado sigue la preocupación más alta seleccionada y no un promedio. Interpreta cada respuesta según el contexto educativo, jurídico e institucional nacional o local aplicable.",
    "Check that basic protections are in place for the intended education use.": "Comprueba que existan protecciones básicas para el uso educativo previsto.",
    "Evidence about equity, meaningful human review, testing in the intended context and accountable ownership.": "Evidencia sobre equidad, revisión humana efectiva, pruebas en el contexto previsto y responsabilidad definida.",
    "Confirm oversight of educational purpose, data, technology, procurement and applicable rules.": "Confirma la supervisión del propósito educativo, los datos, la tecnología, las compras y las normas aplicables.",
    "Assigned roles, data checks, system and supplier documentation, and review before use or expansion.": "Funciones asignadas, controles de datos, documentación del sistema y del proveedor, y revisión antes del uso o la ampliación.",
    "Bring together the functions needed for this use, such as education policy, operations, data, technology, procurement, legal, privacy, security, accessibility and professional practice. Include representatives of affected groups when appropriate.": "Reúne las funciones necesarias para este uso, como política educativa, operaciones, datos, tecnología, compras, asuntos jurídicos, privacidad, seguridad, accesibilidad y práctica profesional. Incluye representantes de los grupos afectados cuando corresponda.",
    "This form supports structured review of AI used in teaching, administration, planning, inspection, assessment, research, learner services and other education functions.": "Este formulario apoya una revisión estructurada de la IA utilizada en enseñanza, administración, planificación, inspección, evaluación, investigación, servicios estudiantiles y otras funciones educativas.",
    "Interpret the questions using the laws, institutional responsibilities, education policies, languages, infrastructure and social conditions of the relevant country or jurisdiction.": "Interpreta las preguntas según las leyes, responsabilidades institucionales, políticas educativas, idiomas, infraestructura y condiciones sociales del país o jurisdicción correspondiente.",
    "The categories remain consistent across contexts. Evidence and examples should reflect the education setting, system level and people affected by the use.": "Las categorías se mantienen constantes entre contextos. Las evidencias y los ejemplos deben reflejar el entorno educativo, el nivel del sistema y las personas afectadas por el uso.",
    "Identify education uses that may need stronger safeguards or specialist advice.": "Identifica usos educativos que pueden necesitar salvaguardas más sólidas o asesoramiento especializado.",
    "Know the education process, decisions, data, affected groups, scale, human review and possible consequences.": "Conoce el proceso educativo, las decisiones, los datos, los grupos afectados, la escala, la revisión humana y las posibles consecuencias.",
    "A percentage based screening signal that supports the team’s final decision.": "Una señal de evaluación porcentual que apoya la decisión final del equipo.",
    "Review the same six principles across any education use or system level.": "Revisa los mismos seis principios en cualquier uso educativo o nivel del sistema.",
    "Bring relevant education policies, data documentation, test results, contracts, instructions, incident records and assigned responsibilities.": "Aporta políticas educativas pertinentes, documentación de datos, resultados de pruebas, contratos, instrucciones, registros de incidentes y responsabilidades asignadas.",
    "Check for harm, exclusion and unfair treatment across the education system.": "Comprueba posibles daños, exclusión y trato injusto en el sistema educativo.",
    "Affected groups, languages, disabilities, locations, institution types, access conditions and outcome differences.": "Grupos afectados, idiomas, discapacidades, territorios, tipos de institución, condiciones de acceso y diferencias en los resultados.",
    "Check whether AI use, responsibility and important results are understandable.": "Comprueba si el uso de la IA, la responsabilidad y los resultados importantes son comprensibles.",
    "Check whether the system works safely in its intended education context and can recover from problems.": "Comprueba si el sistema funciona de forma segura en el contexto educativo previsto y puede recuperarse de los problemas.",
    "Check whether learner, staff and other personal data are necessary and protected.": "Comprueba si los datos personales de estudiantes, personal y otras personas son necesarios y están protegidos.",
    "Make lifecycle responsibility, meaningful human control and remedy routes clear.": "Aclara la responsabilidad durante todo el ciclo de vida, el control humano efectivo y las vías de reparación.",
    "Consider wellbeing, workforce, infrastructure, financial, supplier and environmental effects.": "Considera los efectos sobre el bienestar, el personal, la infraestructura, las finanzas, los proveedores y el medio ambiente.",
    "Turn the review into an education risk and decision record.": "Convierte la revisión en un registro de riesgos y decisiones educativas."
  });
  Object.assign(ES, {
    "Map the affected groups and institutions, including those who may be less visible in the data or decision process.": "Identifica los grupos y las instituciones afectadas, incluidos aquellos que pueden estar poco representados en los datos o en el proceso de decisión.",
    "Identify affected groups and check how the use could harm, exclude or disadvantage them.": "Identifica los grupos afectados y analiza de qué manera el uso podría perjudicarlos, excluirlos o ponerlos en desventaja.",
    "Compare results across relevant languages, disabilities, locations, genders, socioeconomic conditions, institution types and other locally relevant factors.": "Compara los resultados según los idiomas, las discapacidades, los territorios, el género, las condiciones socioeconómicas, los tipos de institución y otros factores pertinentes en el contexto local.",
    "Test performance and outcomes across relevant groups and contexts, then address material differences.": "Evalúa el desempeño y los resultados en los grupos y contextos pertinentes y corrige las diferencias importantes.",
    "Check accessibility and provide assisted, offline or non digital routes where needed.": "Comprueba la accesibilidad y ofrece alternativas con apoyo, sin conexión o no digitales cuando sean necesarias.",
    "Use accessible information suited to the audience, including learners and families where relevant.": "Ofrece información accesible y adecuada para cada público, incluidos los estudiantes y las familias cuando corresponda.",
    "Explain when and why AI is used, what role it plays and who is responsible.": "Explica cuándo y por qué se utiliza la IA, qué función cumple y quién es responsable.",
    "Explain the main reasons, evidence and limits, and provide a clear human review route.": "Explica las razones principales, la evidencia y las limitaciones, y ofrece una vía clara de revisión humana.",
    "Provide understandable explanations and an effective route for human review or challenge.": "Ofrece explicaciones comprensibles y una vía efectiva para solicitar una revisión humana o impugnar el resultado.",
    "Record tests, results, limits and open problems across representative operating conditions.": "Documenta las pruebas, los resultados, las limitaciones y los problemas pendientes en condiciones representativas de uso.",
    "Test the system in realistic education contexts before relying on it.": "Prueba el sistema en contextos educativos reales antes de utilizar sus resultados.",
    "Confirm security controls, supplier responsibilities and access arrangements with the technical or security team.": "Confirma con el equipo técnico o de seguridad los controles, las responsabilidades del proveedor y las condiciones de acceso.",
    "Address the main security risks for education data, users and infrastructure.": "Atiende los principales riesgos de seguridad para los datos, las personas usuarias y la infraestructura educativa.",
    "Define monitoring, incident response, communication and a workable alternative process.": "Define cómo se supervisará el sistema, cómo se responderá a incidentes, cómo se comunicarán los problemas y qué alternativa se utilizará.",
    "Set up monitoring, response responsibilities and a safe continuity option.": "Establece mecanismos de supervisión, responsabilidades de respuesta y una alternativa segura para mantener la continuidad.",
    "Record why each data type is needed, who may use it and the applicable authority or legal basis.": "Documenta por qué se necesita cada tipo de dato, quién puede utilizarlo y cuál es la autorización o base jurídica aplicable.",
    "Review necessity, purpose and applicable rules before using personal data.": "Revisa la necesidad, el propósito y las normas aplicables antes de utilizar datos personales.",
    "Set rules for collection, access, correction, retention, deletion and supplier use.": "Establece reglas para la recopilación, el acceso, la corrección, la conservación, la eliminación y el uso de datos por parte de proveedores.",
    "Reduce unnecessary data and strengthen protection, access, sharing and deletion controls.": "Reduce los datos innecesarios y refuerza los controles de protección, acceso, intercambio y eliminación.",
    "Assign accountable authorities and supporting roles across the full lifecycle.": "Asigna autoridades responsables y funciones de apoyo durante todo el ciclo de vida.",
    "Clarify who is accountable for the use, supplier relationship, operation and outcomes.": "Aclara quién responde por el uso, la relación con el proveedor, la operación y los resultados.",
    "Provide training, clear authority, usable instructions and an alternative process.": "Ofrece formación, atribuciones claras, instrucciones prácticas y un proceso alternativo.",
    "Ensure human oversight is practical and staff can intervene effectively.": "Asegura que la supervisión humana sea viable y que el personal pueda intervenir de manera efectiva.",
    "Provide accessible reporting, review, response and correction processes.": "Ofrece procesos accesibles para informar problemas, revisar decisiones, responder y corregir resultados.",
    "Create effective routes for complaints, review, remedy and correction.": "Establece vías efectivas para presentar reclamos, revisar decisiones, reparar daños y corregir resultados.",
    "Consult affected people and plan changes, training, support and workload protections.": "Consulta a las personas afectadas y planifica los cambios, la formación, el apoyo y las medidas para proteger la carga de trabajo.",
    "Assess effects on wellbeing and work, then agree the support and safeguards needed.": "Evalúa los efectos sobre el bienestar y el trabajo, y acuerda el apoyo y las salvaguardas necesarias.",
    "Review total costs, required infrastructure, exit options, energy use and supplier dependency.": "Revisa los costos totales, la infraestructura necesaria, las opciones de salida, el consumo de energía y la dependencia del proveedor.",
    "Identify long term resource and dependency risks and practical ways to reduce them.": "Identifica los riesgos de recursos y dependencia a largo plazo y define medidas viables para reducirlos.",
    "Focus on the few risks that matter most in this education context.": "Concéntrate en los riesgos más importantes para este contexto educativo."
  });
  Object.assign(ES, {
    "Responsible AI in Education Compass · concise first review": "Brújula para una IA responsable en educación · primera revisión breve",
    "A common structure for reviewing AI across diverse education systems": "Una estructura común para revisar la IA en distintos sistemas educativos",
    "AI can influence teaching, administration, planning, assessment, inspection, allocation of resources, employment and services for learners and families. This assessment helps teams examine the purpose, evidence, safeguards and consequences of a specific use.": "La IA puede influir en la enseñanza, la administración, la planificación, la evaluación, la inspección, la asignación de recursos, el empleo y los servicios para estudiantes y familias. Esta evaluación ayuda a examinar el propósito, la evidencia, las salvaguardas y las consecuencias de un uso concreto.",
    "A team self assessment": "Una autoevaluación en equipo",
    "Use the functions relevant to the case, including education policy, operations, data, technology, procurement, legal, privacy, security, accessibility and professional practice. Include affected groups where appropriate. The result reflects the team’s evidence and judgement.": "Reúne las funciones pertinentes para el caso, entre ellas política educativa, operaciones, datos, tecnología, compras, asuntos jurídicos, privacidad, seguridad, accesibilidad y práctica profesional. Incluye a los grupos afectados cuando corresponda. El resultado refleja la evidencia y el criterio del equipo.",
    "Education system AI": "IA en el sistema educativo",
    "For authorities, institutions and teams that commission, design, procure, operate or oversee AI inside and outside the classroom.": "Para autoridades, instituciones y equipos que encargan, diseñan, adquieren, operan o supervisan sistemas de IA dentro y fuera del aula.",
    "Identify possible harm, examine safeguards and make uncertainty visible before procurement, pilot, deployment or expansion.": "Identifica posibles daños, revisa las salvaguardas y deja constancia de las incertidumbres antes de la compra, el piloto, la implementación o la ampliación.",
    "Responsible AI principles": "Principios para una IA responsable",
    "Common categories, interpreted for education": "Categorías comunes, aplicadas al sector educativo",
    "Apply the same categories at system, authority, institution, programme and classroom levels, using evidence relevant to the country and use.": "Aplica las mismas categorías a nivel del sistema, la autoridad, la institución, el programa o el aula, con evidencia pertinente para el país y el uso evaluado.",
    "Examine unequal effects across learners, staff, institutions, languages, locations and social groups.": "Examina los efectos desiguales entre estudiantes, personal, instituciones, idiomas, territorios y grupos sociales.",
    "Make AI use, responsibility and important results understandable and open to review.": "Asegura que el uso de la IA, las responsabilidades y los resultados importantes sean comprensibles y puedan revisarse.",
    "Test the system in representative education settings and prepare for failure, misuse and incidents.": "Prueba el sistema en entornos educativos representativos y prepárate para fallas, usos indebidos e incidentes.",
    "Limit and protect learner, staff and other personal data throughout its lifecycle.": "Limita y protege los datos personales de estudiantes, personal y otras personas durante todo su ciclo de vida.",
    "Give responsible people the authority, information and time to intervene, explain and correct.": "Da a las personas responsables la autoridad, la información y el tiempo necesarios para intervenir, explicar y corregir.",
    "Consider wellbeing, professional roles, costs, infrastructure, supplier dependency and environmental effects.": "Considera el bienestar, las funciones profesionales, los costos, la infraestructura, la dependencia de proveedores y los efectos ambientales.",
    "Review core safeguards, basic governance and priority risks for an early or bounded education use.": "Revisa las salvaguardas básicas, la gobernanza y los riesgos prioritarios de un uso educativo inicial o delimitado.",
    "15 checks across all six principles": "15 comprobaciones en los seis principios",
    "Use when AI may influence important education decisions, services, opportunities, data, resources or working conditions, or when evidence remains uncertain.": "Úsala cuando la IA pueda influir en decisiones, servicios, oportunidades, datos, recursos o condiciones de trabajo importantes en educación, o cuando la evidencia siga siendo insuficiente.",
    "Interpret the route in the applicable education, legal and institutional context.": "Interpreta la ruta según el contexto educativo, jurídico e institucional aplicable.",
    "Limited foreseeable impact and a bounded use. Begin with Quick and record the basis.": "Impacto previsible limitado y uso acotado. Comienza con la evaluación rápida y documenta la justificación.",
    "Meaningful interaction, personal data, wider reach or uncertainty. Use Thorough when safeguards need specific review.": "Interacción relevante, datos personales, mayor alcance o incertidumbre. Usa la evaluación detallada cuando las salvaguardas requieran una revisión específica.",
    "Potentially significant effects on opportunities, services, resources, rights, safety or reputation. Use Thorough and strong governance review.": "Posibles efectos importantes sobre oportunidades, servicios, recursos, derechos, seguridad o reputación. Usa la evaluación detallada y una revisión sólida de la gobernanza.",
    "Potentially unlawful or severe harm. Pause routine progression and seek appropriate specialist review.": "Posible uso ilícito o daño grave. Detén el avance habitual y solicita la revisión especializada que corresponda.",
    "Education system perspective": "Perspectiva del sistema educativo",
    "Team based self assessment": "Autoevaluación en equipo",
    "This toolkit helps education authorities, institutions and teams identify educational, ethical, legal, social, operational and technical concerns in a specific AI use, document safeguards and agree actions. It can be used across countries without assuming one administrative structure, curriculum, pedagogical model or legal framework.": "Esta herramienta ayuda a autoridades educativas, instituciones y equipos a identificar aspectos educativos, éticos, jurídicos, sociales, operativos y técnicos de un uso concreto de IA, documentar salvaguardas y acordar acciones. Puede utilizarse en distintos países sin presuponer una estructura administrativa, un currículo, un modelo pedagógico ni un marco jurídico determinados.",
    "Include the functions relevant to the use. These may include education policy and programme owners, technical and operational teams, data governance, legal, privacy, cybersecurity, procurement, accessibility, inspection, school or institution leadership, pedagogical expertise and representatives of affected learners, families or staff. Record who participated and which important perspectives were unavailable.": "Incluye las funciones pertinentes para el uso. Pueden participar responsables de política y programas educativos, equipos técnicos y operativos, gobernanza de datos, asuntos jurídicos, privacidad, ciberseguridad, compras, accesibilidad, inspección, dirección de centros o instituciones, especialistas pedagógicos y representantes de estudiantes, familias o personal afectados. Registra quiénes participaron y qué perspectivas importantes no estuvieron disponibles.",
    "You need a concise first review, the education use is bounded, and there is no clear signal of significant or uncertain harm.": "Necesitas una primera revisión breve, el uso educativo está delimitado y no hay señales claras de un daño importante o incierto.",
    "The system may influence important education decisions, opportunities, services, resources, data, safety, rights, reputation or working conditions, or the Quick assessment leaves important questions open.": "El sistema puede influir en decisiones, oportunidades, servicios, recursos, datos, seguridad, derechos, reputación o condiciones de trabajo importantes en educación, o la evaluación rápida deja preguntas relevantes sin resolver.",
    "Define the education context.": "Define el contexto educativo.",
    "Describe the purpose, system level, responsible authority or institution, users, affected groups, data and decisions or services involved.": "Describe el propósito, el nivel del sistema, la autoridad o institución responsable, las personas usuarias, los grupos afectados, los datos y las decisiones o servicios involucrados.",
    "Start with Quick when possible effects are limited. Move to Thorough when the system influences important recommendations or decisions, uses sensitive data, operates at scale or leaves risks unclear.": "Comienza con la evaluación rápida cuando los posibles efectos sean limitados. Pasa a la evaluación detallada cuando el sistema influya en recomendaciones o decisiones importantes, utilice datos sensibles, opere a gran escala o deje riesgos sin aclarar.",
    "Answer every prompt and consider uncertainty, scale, human review and possible consequences together.": "Responde todas las preguntas y analiza en conjunto la incertidumbre, la escala, la revisión humana y las posibles consecuencias.",
    "Use evidence from the applicable education, institutional and country context. Seek specialist input when the team cannot confirm a technical, educational or legal point.": "Usa evidencia del contexto educativo, institucional y nacional aplicable. Solicita apoyo especializado cuando el equipo no pueda confirmar un aspecto técnico, educativo o jurídico.",
    "Record the main risks, what will reduce them, who is responsible, when the work will be completed and what evidence will show completion.": "Registra los principales riesgos, las medidas para reducirlos, la persona o unidad responsable, la fecha de finalización y la evidencia que demostrará el cumplimiento.",
    "Choose Proceed, Proceed with conditions or Do not proceed yet, and record the authority responsible for the decision.": "Elige entre continuar, continuar con condiciones o no continuar todavía, y registra la autoridad responsable de la decisión.",
    "Save the agreed record under the applicable information management and privacy rules.": "Guarda el registro acordado de acuerdo con las normas aplicables de gestión de la información y privacidad.",
    "Begin before procurement, model selection or data sharing where possible. Review again before a pilot, operational use, expansion to new groups or institutions, or a material change. Reopen it after an incident, complaint, change in data, supplier, policy, infrastructure or education context, or unexpected outcomes.": "Comienza antes de la compra, la selección del modelo o el intercambio de datos, cuando sea posible. Revisa nuevamente antes de un piloto, del uso operativo, de una ampliación a nuevos grupos o instituciones, o de un cambio importante. Reabre la evaluación después de un incidente, reclamo, cambio de datos, proveedor, política, infraestructura o contexto educativo, o ante resultados inesperados.",
    "Governance controls, missing documentation and follow up actions.": "Controles de gobernanza, documentación pendiente y acciones de seguimiento.",
    "Role of AI in the education process": "Función de la IA en el proceso educativo",
    "Data about learners, staff or institutions": "Datos sobre estudiantes, personal o instituciones",
    "Sensitive or specially protected data": "Datos sensibles o especialmente protegidos",
    "Potentially significant effect on education opportunities, services, resources, rights, safety, employment or reputation; sensitive data; large scale; or limited human review.": "Posible efecto importante sobre oportunidades educativas, servicios, recursos, derechos, seguridad, empleo o reputación; uso de datos sensibles; gran escala; o revisión humana limitada.",
    "These are working rules for an international education self assessment. Apply the relevant national or local laws, education policies, institutional responsibilities and authorised decision processes.": "Estas reglas orientan una autoevaluación educativa de alcance internacional. Aplica las leyes nacionales o locales, las políticas educativas, las responsabilidades institucionales y los procesos de decisión autorizados que correspondan.",
    "Education system decision support": "Apoyo a decisiones del sistema educativo",
    "Understand what each assessment produces, how information is handled and how authorised education decision makers can use findings responsibly.": "Comprende qué produce cada evaluación, cómo se maneja la información y cómo las autoridades educativas pueden utilizar los resultados de manera responsable.",
    "The toolkit helps a team discuss one AI use in its education context, organise agreed answers and download a clear review record.": "La herramienta ayuda al equipo a analizar un uso de IA en su contexto educativo, organizar las respuestas acordadas y descargar un registro claro de la revisión.",
    "Use it with the education, policy, data, technical, operational, procurement and oversight functions relevant to the case.": "Úsala con las funciones educativas, de política, datos, tecnología, operaciones, compras y supervisión pertinentes para el caso.",
    "The instrument uses common categories across countries. The team supplies the applicable laws, policies, institutional responsibilities, evidence and local context.": "El instrumento utiliza categorías comunes para distintos países. El equipo incorpora las leyes, las políticas, las responsabilidades institucionales, la evidencia y el contexto local aplicables.",
    "One use at a time": "Un uso a la vez",
    "Each report reflects one AI system or use, its education context and one set of agreed answers.": "Cada informe corresponde a un sistema o uso de IA, su contexto educativo y un conjunto de respuestas acordadas.",
    "Use the three views below to understand what the team discusses, what the site organises and how an authorised education decision maker can use the result.": "Consulta las tres secciones siguientes para entender qué analiza el equipo, qué organiza el sitio y cómo una autoridad educativa puede utilizar el resultado.",
    "Outputs are specific to the education use under review": "Los resultados corresponden al uso educativo evaluado",
    "The summary records the context, risk route, six category indicators, findings, actions and decision. It can support review at system, authority, institution, programme or classroom level.": "El resumen registra el contexto, la ruta de riesgo, los indicadores de las seis categorías, los hallazgos, las acciones y la decisión. Puede apoyar revisiones a nivel del sistema, la autoridad, la institución, el programa o el aula.",
    "Reviewers can use the report to assign actions, set conditions, change a use case or procurement, focus monitoring, request further assurance or pause deployment. Analysis across uses or institutions requires a separately governed collection process.": "Quienes revisan el uso pueden emplear el informe para asignar acciones, establecer condiciones, modificar el caso de uso o la compra, orientar la supervisión, solicitar garantías adicionales o detener la implementación. El análisis conjunto de varios usos o instituciones requiere un proceso de recopilación con gobernanza propia.",
    "How education decision makers can use findings": "Cómo pueden utilizar los resultados las autoridades educativas",
    "Use decision": "Decisión sobre el uso",
    "Use the risk route and unresolved gaps to define procurement, pilot or deployment conditions, additional tests, human review or a pause.": "Usa la ruta de riesgo y las brechas pendientes para definir condiciones de compra, piloto o implementación, pruebas adicionales, revisión humana o una pausa.",
    "System capacity": "Capacidad del sistema",
    "Recurring themes can inform workforce development, procurement language, data governance, infrastructure, templates and oversight capacity when collected through a governed process.": "Cuando se recopilan mediante un proceso con gobernanza, los temas recurrentes pueden orientar el desarrollo de capacidades, las condiciones de compra, la gobernanza de datos, la infraestructura, las plantillas y la capacidad de supervisión.",
    "Record the evidence, responsible authority, date, uncertainty and authorised decision. Treat self reported answers as a review input, not proof that controls work.": "Registra la evidencia, la autoridad responsable, la fecha, las incertidumbres y la decisión autorizada. Considera las respuestas del equipo como un insumo para la revisión, no como prueba de que los controles funcionan."
  });
  Object.assign(ES, {
    "Assessment overview": "Resumen de la evaluación",
    "Evidence or explanation (optional)": "Evidencia o explicación (opcional)",
    "Review it below or download an HTML copy for your records.": "Revísalo a continuación o descarga una copia en formato HTML para tus registros.",
    "What to check": "Qué revisar",
    "Open one section at a time. The counter shows how many questions have been answered.": "Abre una sección a la vez. El contador muestra cuántas preguntas se han respondido.",
    "Information not yet available.": "Información aún no disponible.",
    "Confirm the answer with the responsible team and record the missing evidence.": "Confirma la respuesta con el equipo responsable y registra la evidencia que falta.",
    "Information needed": "Falta información",
    "This is a screening score, not a probability or grade.": "Esta es una puntuación inicial de riesgo, no una probabilidad ni una calificación.",
    "Choose the most suitable next step, from proceeding as planned to adding safeguards, running a pilot, strengthening capacity, reviewing policy or procurement, seeking specialist review or not proceeding.": "Elige el siguiente paso más adecuado: continuar según lo previsto, añadir salvaguardas, realizar un piloto, fortalecer capacidades, revisar las políticas o la contratación, solicitar una revisión especializada o no continuar.",
    "The 15 practice questions are grouped under the six principles on the home page. “Yes, with evidence” scores 2, “Partly or in progress” scores 1, and both “No” and “Information not yet available” score 0. “Not applicable, with a reason” is excluded.": "Las 15 preguntas sobre prácticas se agrupan en los seis principios de la página principal. «Sí, con evidencia» vale 2 puntos; «Parcialmente o en proceso» vale 1; y tanto «No» como «Información aún no disponible» valen 0. «No aplica, con una justificación» se excluye del cálculo.",
    "The final three prompts record the priority risks, the actions needed and the team’s decision. When the team records a remaining risk level, keep separate risks separate and do not average away a serious one.": "Las tres preguntas finales registran los riesgos prioritarios, las acciones necesarias y la decisión del equipo. Cuando se registre el nivel de riesgo restante, mantén separados los distintos riesgos y no diluyas un riesgo grave mediante un promedio.",
    "Short name for the AI system or use": "Nombre breve del sistema o uso de IA",
    "Before acting on an AI result, can trained staff review and change it?": "Antes de actuar sobre un resultado de la IA, ¿el personal capacitado puede revisarlo y cambiarlo?",
    "Do we check that the data are suitable, current and representative, and record the result?": "¿Comprobamos que los datos sean adecuados, actuales y representativos, y dejamos registro de la revisión?",
    "Is there clear documentation on what the system does, who it is for, what data it uses, who is responsible and what its limits are?": "¿Hay documentación clara sobre qué hace el sistema, para quién es, qué datos usa, quién es responsable y cuáles son sus límites?",
    "Has someone outside the development or purchasing team reviewed the risks before the system is used or expanded?": "¿Alguien que no participó en el desarrollo o la compra revisó los riesgos antes de usar o ampliar el sistema?",
    "Before an AI result affects a person or institution, can staff review and change it?": "Antes de que un resultado de la IA afecte a una persona o institución, ¿el personal puede revisarlo y cambiarlo?",
    "Could a wrong or unfair result have serious consequences for a person or institution?": "¿Un resultado incorrecto o injusto podría tener consecuencias graves para una persona o institución?",
    "Is there a serious concern that this use may break the law or cause severe harm?": "¿Existe un riesgo serio de que este uso incumpla la ley o cause un daño grave?",
    "Can everyone access the service, including people who face disability, language, location, connectivity or cost barriers?": "¿Todas las personas pueden acceder al servicio, incluidas aquellas que enfrentan barreras por discapacidad, idioma, ubicación, conectividad o costo?",
    "Can we explain an important result and provide a way to have it reviewed by a responsible person?": "¿Podemos explicar un resultado importante y ofrecer una forma de que una persona responsable lo revise?",
    "Has the system been tested in realistic conditions for its intended education use?": "¿Se ha probado el sistema en condiciones realistas para el uso educativo previsto?",
    "Do we have a clear and valid reason to use each type of personal data?": "¿Tenemos un motivo claro y válido para usar cada tipo de dato personal?",
    "Do we collect only the personal data we need and protect, correct and delete them properly?": "¿Recopilamos solo los datos personales necesarios y los protegemos, corregimos y eliminamos adecuadamente?",
    "Is it clear who is responsible for the system at each stage?": "¿Está claro quién es responsable del sistema en cada etapa?",
    "Have we assessed how the system could affect learner wellbeing and staff roles, workload and working conditions?": "¿Hemos evaluado cómo podría afectar el sistema al bienestar estudiantil y a las funciones, la carga de trabajo y las condiciones laborales del personal?",
    "What should happen next?": "¿Qué debería hacerse a continuación?",
    "Choose the option that best reflects the team’s decision and record any actions, responsible roles and review dates.": "Elige la opción que mejor refleje la decisión del equipo y registra las acciones, las personas o unidades responsables y las fechas de revisión.",
    "Proceed as planned.": "Continuar según lo previsto.",
    "Proceed with safeguards and monitoring.": "Continuar con salvaguardas y seguimiento.",
    "Record the safeguards, responsible roles, dates and monitoring plan.": "Registra las salvaguardas, las personas o unidades responsables, las fechas y el plan de seguimiento.",
    "Run a limited pilot and reassess before expanding.": "Realizar un piloto limitado y volver a evaluar antes de ampliar.",
    "Define the pilot scope, success criteria, safeguards and review date.": "Define el alcance del piloto, los criterios de éxito, las salvaguardas y la fecha de revisión.",
    "Build staff capacity before proceeding.": "Fortalecer las capacidades del personal antes de continuar.",
    "Provide the training, time, guidance and authority needed for safe use.": "Proporciona la formación, el tiempo, la orientación y la autoridad necesarios para un uso seguro.",
    "Review policy, data governance or procurement before proceeding.": "Revisar las políticas, la gobernanza de datos o la contratación antes de continuar.",
    "Update the relevant rules, responsibilities, data arrangements or contract conditions.": "Actualiza las normas, las responsabilidades, los acuerdos sobre datos o las condiciones contractuales pertinentes.",
    "Pause for specialist review.": "Pausar para una revisión especializada.",
    "Seek the appropriate legal, rights, privacy, security, ethics or technical review.": "Solicita la revisión jurídica, de derechos, privacidad, seguridad, ética o técnica que corresponda.",
    "Do not proceed.": "No continuar.",
    "Record why the use is not acceptable and whether a different approach should be considered.": "Registra por qué el uso no es aceptable y si debe considerarse otro enfoque.",
    "AI system or use": "Sistema o uso de IA",
    "Responsible education authority or institution": "Autoridad educativa o institución responsable",
    "Responsible review lead": "Responsable de la revisión",
    "Education purpose, context and affected groups": "Propósito educativo, contexto y grupos afectados",
    "Results by category": "Resultados por categoría",
    "Results by category continued": "Continuación de resultados por categoría",
    "Green indicates evidence of a safeguard. Orange indicates work to strengthen. Red indicates priority action. Grey indicates missing information.": "El verde indica que existe evidencia de la salvaguarda. El naranja señala aspectos por reforzar. El rojo identifica acciones prioritarias. El gris indica información pendiente.",
    "Findings and action plan": "Hallazgos y plan de acción",
    "Preliminary risk route": "Ruta preliminar de riesgo",
    "Key findings": "Hallazgos principales",
    "No priority issue was generated automatically. Review the evidence and remaining uncertainty before closing the assessment.": "No se generó automáticamente ningún hallazgo prioritario. Revisa la evidencia y las incertidumbres pendientes antes de cerrar la evaluación.",
    "Agreed next steps": "Próximos pasos acordados",
    "Risk management and follow up": "Gestión de riesgos y seguimiento",
    "Priority risks, responsible lead, decision and next review": "Riesgos prioritarios, responsable, decisión y próxima revisión",
    "The preliminary route requires stronger review": "La ruta preliminar requiere una revisión más profunda",
    "Priority risks recorded": "Riesgos prioritarios registrados",
    "Priority risks have not been recorded": "Aún no se han registrado los riesgos prioritarios",
    "Record the main education, rights, data, operational, technical and supplier risks, together with the planned response.": "Registra los principales riesgos educativos, de derechos, datos, operación, tecnología y proveedores, junto con la respuesta prevista.",
    "Record the main education, rights, data, operational, technical and supplier risks and who or what could be affected.": "Registra los principales riesgos educativos, de derechos, datos, operación, tecnología y proveedores, y señala quién o qué podría verse afectado.",
    "Actions and remaining risk": "Acciones y riesgo restante",
    "This self assessment records the team’s evidence and judgement. It does not verify compliance or authorise the use.": "Esta autoevaluación registra la evidencia y el criterio del equipo. No verifica el cumplimiento ni autoriza el uso.",
    "Complete the risk screen before using the route.": "Completa la evaluación inicial de riesgos antes de utilizar la ruta.",
    "Area with the strongest evidence: ": "Área con la evidencia más sólida: ",
    "Area requiring the most attention: ": "Área que requiere mayor atención: ",
    "Assign a responsible role, date and completion evidence to every orange or red result.": "Asigna una persona o unidad responsable, una fecha y evidencia de cumplimiento a cada resultado naranja o rojo.",
    "Repeat the assessment when the purpose, data, supplier, model, scale, context or affected groups change.": "Repite la evaluación cuando cambien el propósito, los datos, el proveedor, el modelo, la escala, el contexto o los grupos afectados."
  });

  Object.assign(ES, {
  "Short name of the AI system or type of use": "Nombre breve del sistema de IA o tipo de uso",
  "Person, role or unit responsible for this review": "Persona, cargo o unidad responsable de esta revisión",
  "Person, role, unit or group": "Persona, cargo, unidad o grupo",
  "Complete this review with the people and evidence available": "Completa esta revisión con las personas y la evidencia disponibles",
  "The form can be completed by one person or used in a group. When possible, check important answers with the people or units that understand the education purpose, affected groups, data, technology, operations, procurement and applicable rules.": "El formulario puede completarlo una persona o utilizarse en grupo. Cuando sea posible, verifica las respuestas importantes con las personas o unidades que conozcan el propósito educativo, los grupos afectados, los datos, la tecnología, la operación, las compras y las normas aplicables.",
  "The form can be completed by one person or used in a group. When possible, check important answers with the people or units responsible for education policy, operations, data, technology, procurement, legal matters, privacy, security, accessibility or professional practice.": "El formulario puede completarlo una persona o utilizarse en grupo. Cuando sea posible, verifica las respuestas importantes con las personas o unidades responsables de política educativa, operación, datos, tecnología, compras, asuntos jurídicos, privacidad, seguridad, accesibilidad o práctica profesional.",
  "A context record that helps interpret the same questions across different education systems.": "Un registro del contexto que ayuda a interpretar las mismas preguntas en distintos sistemas educativos.",
  "This summarizes the responses recorded at one point in time. It does not validate evidence or monitor the operating system.": "Este resumen refleja las respuestas registradas en un momento concreto. No verifica la evidencia ni supervisa el sistema en funcionamiento.",
  "Are the data suitable, current and representative, and is the result of the check recorded?": "¿Los datos son adecuados, actuales y representativos, y queda registrada esta revisión?",
  "What are the main risks, what will reduce them, and who could be affected?": "¿Cuáles son los principales riesgos, qué permitirá reducirlos y quién podría verse afectado?",
  "Who is responsible for each action, and when should it be completed?": "¿Quién es responsable de cada acción y cuándo debería completarse?",
  "After the planned safeguards, are the risks that remain manageable?": "Después de aplicar las medidas previstas, ¿se pueden gestionar los riesgos que aún quedan?",
  "Yes. They can be managed with the planned safeguards.": "Sí. Pueden gestionarse con las medidas previstas.",
  "Not yet. Add safeguards or stronger monitoring.": "Todavía no. Hay que añadir medidas o reforzar el seguimiento.",
  "No. They are too serious to continue.": "No. Son demasiado graves para continuar.",
  "Continue with routine monitoring.": "Continuar con el seguimiento habitual.",
  "Continue only with added safeguards and monitoring.": "Continuar solo con medidas adicionales y seguimiento.",
  "Complete the Thorough assessment before deciding.": "Completar la evaluación detallada antes de decidir.",
  "Strengthen staff capacity before proceeding.": "Reforzar las capacidades del personal antes de continuar.",
  "Review policy, data governance or procurement before proceeding.": "Revisar la política, la gobernanza de datos o las compras antes de continuar.",
  "Pause and seek specialist review.": "Pausar y solicitar una revisión especializada.",
  "Do not proceed.": "No continuar.",
  "Continue with routine monitoring": "Continuar con el seguimiento habitual",
  "Next step not selected": "No se ha seleccionado el siguiente paso",
  "Recommended next step:": "Siguiente paso recomendado:",
  "A count of the responses recorded, separate from the risk route.": "Un recuento de las respuestas registradas, separado de la ruta de riesgo.",
  "Priority actions from this review": "Acciones prioritarias derivadas de esta revisión",
  "These actions come from answers that are incomplete or need strengthening. Confirm the priorities, assign responsibility and add a target date.": "Estas acciones se generan a partir de respuestas incompletas o que requieren mejoras. Confirma las prioridades, asigna la responsabilidad y añade una fecha prevista.",
  "No urgent action was generated. Keep the evidence current and repeat the review when the use, data, supplier, scale or context changes.": "No se generó ninguna acción urgente. Mantén actualizada la evidencia y repite la revisión cuando cambien el uso, los datos, el proveedor, la escala o el contexto.",
  "Compare results across relevant groups and education contexts, then document and address important differences.": "Compara los resultados entre los grupos y contextos educativos pertinentes; documenta y corrige las diferencias importantes.",
  "Define who can review, change or stop an AI result before it affects a person or institution.": "Define quién puede revisar, modificar o detener un resultado de la IA antes de que afecte a una persona o institución.",
  "Test accuracy, safety and usefulness in the intended education settings and record the results and limits.": "Prueba la precisión, la seguridad y la utilidad en los entornos educativos previstos, y registra los resultados y límites.",
  "Assign a person or unit to operate, maintain and monitor the system and its effects.": "Asigna a una persona o unidad la operación, el mantenimiento y el seguimiento del sistema y sus efectos.",
  "Assign responsibilities for purpose, data, security, accessibility, procurement, ethical use and compliance.": "Asigna responsabilidades sobre el propósito, los datos, la seguridad, la accesibilidad, las compras, el uso ético y el cumplimiento.",
  "Document checks for data suitability, currency and representativeness, including known gaps.": "Documenta las revisiones de idoneidad, actualización y representatividad de los datos, incluidas las carencias conocidas.",
  "Complete the documentation on purpose, users, data, responsibilities, limits and supplier duties.": "Completa la documentación sobre el propósito, las personas usuarias, los datos, las responsabilidades, los límites y las obligaciones del proveedor.",
  "Arrange a risk review by someone outside development or purchasing before use or expansion.": "Solicita que alguien ajeno al desarrollo o a la compra revise los riesgos antes del uso o de su ampliación.",
  "Record the main risks, who could be affected and the safeguards planned.": "Registra los principales riesgos, quién podría verse afectado y las medidas previstas.",
  "Assign a responsible person or unit and a target date to each priority action.": "Asigna una persona o unidad responsable y una fecha prevista a cada acción prioritaria.",
  "Keep the evidence current and repeat the review when the use, data, supplier, scale or context changes.": "Mantén actualizada la evidencia y repite la revisión cuando cambien el uso, los datos, el proveedor, la escala o el contexto.",
  "This self assessment records the evidence and judgement provided. It does not verify compliance or authorise the use.": "Esta autoevaluación registra la evidencia y el criterio aportados. No verifica el cumplimiento ni autoriza el uso.",
  "Have possible harms, exclusion or unfair treatment for learners, families, education staff, institutions or communities been identified?": "¿Se han identificado posibles daños, exclusión o trato injusto para estudiantes, familias, personal educativo, instituciones o comunidades?",
  "Have unfair differences in performance or outcomes across relevant groups and education contexts been checked?": "¿Se han comprobado posibles diferencias injustas en el desempeño o los resultados entre los grupos y contextos educativos pertinentes?",
  "Can an important result be explained clearly and reviewed by a responsible person?": "¿Un resultado importante puede explicarse con claridad y ser revisado por una persona responsable?",
  "Is there a clear and valid reason to use each type of personal data?": "¿Existe una razón clara y válida para utilizar cada tipo de dato personal?",
  "Are only the necessary personal data collected, protected, corrected and deleted properly?": "¿Se recopilan solo los datos personales necesarios y se protegen, corrigen y eliminan adecuadamente?",
  "Have possible effects on learner wellbeing and staff roles, workload and working conditions been assessed?": "¿Se han evaluado los posibles efectos sobre el bienestar estudiantil y sobre las funciones, la carga de trabajo y las condiciones laborales del personal?",
  "Confirm the answer with the responsible person or unit and record the missing evidence.": "Confirma la respuesta con la persona o unidad responsable y registra la evidencia que falta.",
  "8. Main risks, actions and decision": "8. Principales riesgos, acciones y decisión",
  "Choose the option that best reflects the decision and record any actions, responsible roles and review dates.": "Elige la opción que mejor refleje la decisión y registra las acciones, las personas o unidades responsables y las fechas de revisión.",
  "Response recorded": "Respuesta registrada",
  "Decision and conditions": "Decisión y condiciones",
  "These actions come from answers marked Partly, No or Information not yet available. Confirm the priorities, assign a responsible person or unit and add a target date in the action plan.": "Estas acciones se generan a partir de respuestas marcadas como «En parte», «No» o «Información aún no disponible». Confirma las prioridades, asigna una persona o unidad responsable y añade una fecha prevista al plan de acción.",
  "This summary records the responses provided at one point in time. It does not verify the evidence, confirm compliance or monitor the system in operation.": "Este resumen registra las respuestas aportadas en un momento concreto. No verifica la evidencia, el cumplimiento ni supervisa el sistema en funcionamiento.",
  "Priority actions": "Acciones prioritarias",
  "Who should be consulted": "A quién consultar",
  "The form may be completed by one person or used in a group. In either case, consult the functions relevant to the use when an answer requires their evidence or authority. These may include education policy and programme owners, technical and operational teams, data governance, legal, privacy, cybersecurity, procurement, accessibility, inspection, school or institution leadership, pedagogical expertise and representatives of affected learners, families or staff. Record who contributed and which important perspectives were unavailable.": "El formulario puede completarlo una persona o utilizarse en grupo. En ambos casos, consulta a las funciones pertinentes cuando una respuesta requiera su evidencia o autoridad. Estas pueden incluir responsables de política y programas educativos, equipos técnicos y operativos, gobernanza de datos, asuntos jurídicos, privacidad, ciberseguridad, compras, accesibilidad, inspección, dirección escolar o institucional, especialistas pedagógicos y representantes de estudiantes, familias o personal afectado. Registra quién contribuyó y qué perspectivas importantes no estuvieron disponibles.",
  "Seek specialist input when a technical, educational or legal point cannot be confirmed.": "Solicita apoyo especializado cuando no pueda confirmarse un aspecto técnico, educativo o jurídico.",
  "Define priority actions.": "Define las acciones prioritarias.",
  "Use the recommendations generated from incomplete or weak answers. Record what will be done, who is responsible, the target date and the evidence that will show completion.": "Utiliza las recomendaciones generadas a partir de respuestas incompletas o débiles. Registra qué se hará, quién es responsable, la fecha prevista y la evidencia que demostrará su cumplimiento.",
  "The forms record the responses and decisions provided.": "Los formularios registran las respuestas y decisiones aportadas.",
  "The final section records the main risks, actions and decision.": "La sección final registra los principales riesgos, las acciones y la decisión.",
  "This assessment helps individuals and groups examine the purpose, evidence, safeguards and consequences of a specific use.": "Esta evaluación ayuda a personas y grupos a examinar el propósito, la evidencia, las medidas de protección y las consecuencias de un uso concreto.",
  "A self assessment for individual or group use": "Una autoevaluación para uso individual o grupal",
  "One person may complete the form, or it may be used in a group. When possible, check important answers with the people or units that hold the relevant evidence or authority. The result reflects the evidence and judgement recorded.": "El formulario puede completarlo una persona o utilizarse en grupo. Cuando sea posible, verifica las respuestas importantes con las personas o unidades que tengan la evidencia o la autoridad correspondiente. El resultado refleja la evidencia y el criterio registrados.",
  "Record what is working, what needs improvement, who is responsible and when the review should be repeated.": "Registra qué funciona, qué debe mejorarse, quién es responsable y cuándo debe repetirse la revisión.",
  "Record the reasoning behind the result. The initial risk category is separate from the later review of risks that remain after safeguards.": "Registra el razonamiento que sustenta el resultado. La categoría inicial de riesgo se mantiene separada de la revisión posterior de los riesgos que quedan tras aplicar las medidas."
});

  Object.assign(ES, {
  "Individual or group self assessment": "Autoevaluación individual o grupal",
  "The report is a working record for the person or group responsible and authorised reviewers.": "El informe es un registro de trabajo para la persona o el grupo responsable y para quienes tengan autorización para revisarlo.",
  "A guided working review.": "Una revisión de trabajo guiada.",
  "Use this site individually or in a group to organise the answers and download a clear record of the assessment. The site does not retain or store the information you enter. Refreshing or closing the page clears the working form. Keep the downloaded file only where your organisation permits. The assessment supports informed judgement and does not replace local review.": "Utiliza este sitio de forma individual o en grupo para organizar las respuestas y descargar un registro claro de la evaluación. El sitio no conserva ni almacena la información que introduces. Al actualizar o cerrar la página se borra el formulario. Guarda el archivo descargado solo donde lo permita tu organización. La evaluación apoya un criterio informado y no sustituye la revisión local.",
  "It supports review and discussion but is not a legal opinion, an official approval or a measure of educational quality.": "Sirve de apoyo para la revisión y el diálogo, pero no constituye una opinión jurídica, una aprobación oficial ni una medida de la calidad educativa.",
  "A clear 24 question review for AI use across education systems.": "Una revisión clara de 24 preguntas sobre el uso de la IA en los sistemas educativos.",
  "A percentage based screening signal that supports the final decision.": "Una señal porcentual de evaluación inicial que sirve de apoyo para la decisión final.",
  "Priority actions:": "Acciones prioritarias:",
  "It supports review and discussion but is not an official classification, legal opinion or measure of educational quality.": "Sirve de apoyo para la revisión y el diálogo, pero no constituye una clasificación oficial, una opinión jurídica ni una medida de la calidad educativa."
});

  Object.assign(ES, {
  "Interpretation of risk routes, practice indicators and risks that remain after safeguards for education AI uses.": "Interpretación de las rutas de riesgo, los indicadores de práctica y los riesgos que quedan después de aplicar medidas en los usos educativos de la IA.",
  "Close the review only when the evidence is sufficient and the risks that remain can be managed.": "Cierra la revisión solo cuando la evidencia sea suficiente y los riesgos que quedan puedan gestionarse.",
  "The safeguard is operating and evidence is available.": "La medida de protección está funcionando y hay evidencia disponible.",
  "The reviewer considers an item irrelevant to this context.": "Quien realiza la revisión considera que el elemento no es pertinente en este contexto.",
  "4. Risks that remain after safeguards": "4. Riesgos que quedan después de aplicar las medidas",
  "These are the risks that still exist after the planned measures are applied. Some technical frameworks call this residual risk. The final questions record the priority risks, the actions needed and the decision. Assess each important risk separately so that a serious risk is not hidden by an average.": "Son los riesgos que todavía existen después de aplicar las medidas previstas. Algunos marcos técnicos los denominan «riesgo residual». Las preguntas finales registran los riesgos prioritarios, las acciones necesarias y la decisión. Evalúa por separado cada riesgo importante para que un riesgo grave no quede oculto en un promedio.",
  "Level of risk that remains": "Nivel del riesgo que queda",
  "Record whether the risks that remain can be managed, require additional conditions, or are too high to proceed.": "Registra si los riesgos que quedan pueden gestionarse, requieren condiciones adicionales o son demasiado altos para continuar.",
  "The toolkit helps one person or a group review an AI use in its education context, organise the answers and download a clear record.": "El instrumento ayuda a una persona o a un grupo a revisar un uso de IA en su contexto educativo, organizar las respuestas y descargar un registro claro.",
  "The person or group completing the review supplies the applicable laws, policies, institutional responsibilities, evidence and local context.": "La persona o el grupo que completa la revisión aporta las leyes, políticas, responsabilidades institucionales, evidencias y contexto local aplicables.",
  "The answers and findings can be reviewed before downloading a copy.": "Las respuestas y los hallazgos pueden revisarse antes de descargar una copia.",
  "Use the three views below to understand what is reviewed, what the site organises and how an authorised education decision maker can use the result.": "Utiliza las tres vistas siguientes para comprender qué se revisa, qué organiza el sitio y cómo puede utilizar el resultado una autoridad educativa con capacidad de decisión.",
  "What the reviewer receives": "Qué recibe quien realiza la revisión",
  "The page can be used individually or in a group to organise the answers.": "La página puede utilizarse de forma individual o en grupo para organizar las respuestas.",
  "The reviewer describes the system, purpose, data use, affected people, safeguards, evidence and remaining uncertainty.": "Quien realiza la revisión describe el sistema, el propósito, el uso de datos, las personas afectadas, las medidas de protección, la evidencia y las incertidumbres pendientes.",
  "The assessment review summary, the two page results PDF, JSON or text can be downloaded for local records.": "El resumen de la revisión, el PDF completo de resultados, el archivo JSON o el texto pueden descargarse para los registros locales.",
  "A response that the remaining risks can be managed is a recommendation, not an approval. Record the authorised decision maker and any conditions separately.": "Indicar que los riesgos que quedan pueden gestionarse es una recomendación, no una aprobación. Registra por separado quién tiene la autoridad para decidir y las condiciones aplicables.",
  "The person or group completing the review must identify the local requirements and responsibilities that apply.": "La persona o el grupo que completa la revisión debe identificar los requisitos y las responsabilidades locales aplicables.",
  "Thorough calculates a normalized screening percentage and asks whether the risks that remain can be managed.": "La evaluación detallada calcula un porcentaje normalizado de evaluación inicial y pregunta si pueden gestionarse los riesgos que quedan."
});

  Object.assign(ES, {
  "The wording does not assume a particular country, administrative structure, education level, curriculum, pedagogical model or legal framework. The person or group completing the review must identify the local requirements and responsibilities that apply.": "La redacción no presupone un país, una estructura administrativa, un nivel educativo, un currículo, un modelo pedagógico ni un marco jurídico determinados. Quien complete la revisión debe identificar los requisitos y responsabilidades locales aplicables.",
  "forms run locally and do not send or persist answers. Quick returns a provisional route from its highest concern signal. Thorough calculates a normalized screening percentage and asks whether the risks that remain can be managed. Neither is an official result; safeguard practice is not combined into the risk score.": "Los formularios funcionan localmente y no envían ni guardan las respuestas. La evaluación rápida indica una ruta preliminar según la señal de mayor preocupación. La evaluación detallada calcula un porcentaje normalizado de evaluación inicial y pregunta si los riesgos que quedan pueden gestionarse. Ninguno de los resultados es oficial; la calidad de las salvaguardas se evalúa por separado de la ruta de riesgo."
});
  Object.assign(ES, {
  "Download full results PDF": "Descargar el PDF completo de resultados",
  "Download the full results PDF": "Descargar el PDF completo de resultados",
  "Full results PDF downloaded.": "PDF completo de resultados descargado.",
  "Save the results, final decision and all responses for your team records.": "Guarda los resultados, la decisión final y todas las respuestas para los registros de tu equipo.",
  "Incomplete assessment.": "Evaluación incompleta.",
  "Incomplete assessment. Complete all required questions before relying on the findings.": "Evaluación incompleta. Completa todas las preguntas obligatorias antes de utilizar los hallazgos.",
  "Complete all required questions before relying on the findings. Unanswered questions do not establish that safeguards are in place.": "Completa todas las preguntas obligatorias antes de utilizar los hallazgos. Las preguntas sin responder no demuestran que existan medidas de protección.",
  "Possible unlawful use or severe harm was selected. Pause and seek specialist review, even while other answers remain incomplete.": "Se ha indicado un posible uso ilegal o daño grave. Detén el proceso y solicita una revisión especializada, aunque todavía falten respuestas.",
  "Assessment answers stay in this page and are not sent or saved by the site. The browser saves your language preference only.": "Las respuestas permanecen en esta página y el sitio no las envía ni las guarda. El navegador guarda únicamente tu preferencia de idioma.",
  "Assessment answers are not stored": "Las respuestas de la evaluación no se guardan",
  "Final decision": "Decisión final",
  "Full response record": "Registro completo de respuestas",
  "Version 2.2": "Versión 2.2",
  "Answers changed. Rebuild the summary to review the latest responses.": "Las respuestas han cambiado. Vuelve a generar el resumen para revisar las respuestas actuales.",
  "The PDF includes the complete response record. For selectable text and screen reader access, download the HTML summary or text report.": "El PDF incluye el registro completo de respuestas. Para obtener texto seleccionable y acceso mediante un lector de pantalla, descarga el resumen HTML o el informe de texto.",
  "English working package · Version 2.2. Review local legal and governance requirements.": "Versión de trabajo · Versión 2.2. Revisa los requisitos legales y de gobernanza locales.",
  "Quick assessment · Version 2.2. See Instructions for facilitation and follow-up.": "Evaluación rápida · Versión 2.2. Consulta las instrucciones para facilitar la revisión y hacer el seguimiento.",
  "Scoring guide · Version 2.2. Apply local risk and approval rules.": "Guía de puntuación · Versión 2.2. Aplica las normas locales sobre riesgos y aprobación.",
  "Package version: 2.2 · Prepared 21 September 2026.": "Versión del paquete: 2.2 · Preparado el 21 de septiembre de 2026.",
  "Sources and method notes · Version 2.2.": "Notas sobre fuentes y método · Versión 2.2.",
  "Policy and data notes · Version 2.2.": "Notas sobre políticas y datos · Versión 2.2.",
  "Thorough assessment · Version 2.2 · 24 questions. Export or print a copy before closing the page.": "Evaluación detallada · Versión 2.2 · 24 preguntas. Exporta o imprime una copia antes de cerrar la página.",
  "Facilitation guide · Version 2.2. Review local requirements before operational use.": "Guía de facilitación · Versión 2.2. Revisa los requisitos locales antes de su uso operativo.",
  "Package version: 2.2 · Prepared 24 September 2026.": "Versión del paquete: 2.2 · Preparada el 24 de septiembre de 2026.",
  "Package version: 2.2 · Updated 5 October 2026.": "Versión del paquete: 2.2 · Actualizada el 5 de octubre de 2026."
});
  Object.assign(ES, {
  "Build the assessment review summary first, then download the summary or a full results PDF. JSON and text exports remain available for records.": "Crea primero el resumen de revisión y luego descarga el resumen o un PDF de resultados completo. Las exportaciones JSON y de texto siguen disponibles para los registros.",
  "Download full results PDF": "Descargar PDF de resultados completo",
  "After the team agrees its answers, select Build assessment review summary. The page reveals the summary and enables an English HTML download. You can also download the full results PDF, which summarises the selected pathway, colour coded dimensions, risk route, main findings and three to five takeaways.": "Una vez acordadas las respuestas, selecciona «Crear resumen de la evaluación». La página muestra el resumen y permite descargar una copia HTML en español. También puedes descargar un PDF de resultados completo que resume la ruta elegida, las dimensiones por colores, la ruta de riesgo, los hallazgos principales y entre tres y cinco conclusiones.",
  "The team can download the assessment review summary, the full results PDF or JSON and text for local records. The site does not retain the information.": "El equipo puede descargar el resumen de la evaluación, el PDF de resultados completo o archivos JSON y de texto para sus registros locales. El sitio no conserva la información.",
  "The assessment review summary, the full results PDF, JSON or text can be downloaded for local records.": "El resumen de la revisión, el PDF de resultados completo, el archivo JSON o el texto pueden descargarse para los registros locales.",
  "The screening answers are incomplete. Any severe harm warning still applies.": "Las respuestas de evaluación inicial están incompletas. Cualquier advertencia de daño grave sigue siendo válida."
});

  Object.assign(ES, {
  "Example: Use AI to prepare teaching lesson materials": "Ejemplo: usar IA para preparar materiales para una clase"
});
  Object.assign(ES, {
    "Does the evidence show that AI offers a clear benefit suited to learners' ages and needs?": "¿La evidencia muestra que la IA ofrece un beneficio claro y adecuado para las edades y necesidades del alumnado?",
    "Consider accuracy, safety and the benefit compared with doing the same task without AI.": "Considera la precisión, la seguridad y el beneficio frente a hacer la misma tarea sin IA.",
    "Record evidence of benefit suited to learners' ages and needs, compared with doing the task without AI. Check accuracy and safety.": "Registra evidencia de un beneficio adecuado para las edades y necesidades del alumnado, frente a hacer la tarea sin IA. Comprueba la precisión y la seguridad.",
    "Does the evidence show that the AI is suitable for the learners' ages and needs?": "¿La evidencia muestra que la IA es adecuada para las edades y necesidades del alumnado?",
    "Check accuracy, safety and learning benefit in the intended setting, including adult support where needed. For other uses, consider the intended users.": "Comprueba la precisión, la seguridad y el beneficio para el aprendizaje en el contexto previsto, con apoyo de una persona adulta cuando sea necesario. Para otros usos, considera a las personas que utilizarán la IA.",
    "Test suitability for learners' ages and needs before use, including accuracy, safety and benefit.": "Antes de usar la IA, comprueba que sea adecuada para las edades y necesidades del alumnado, incluida la precisión, la seguridad y el beneficio.",
    "Have risks to learners' own thinking and relationships with other people been assessed?": "¿Se han evaluado los riesgos para la capacidad del alumnado de pensar por sí mismo y sus relaciones con otras personas?",
    "Consider excessive reliance on AI, less interaction with teachers or peers, learner wellbeing, and staff roles, workload and working conditions. Take learners' ages into account.": "Considera la dependencia excesiva de la IA, una menor interacción con docentes o compañeros, el bienestar del alumnado y las funciones, la carga de trabajo y las condiciones laborales del personal. Ten en cuenta las edades del alumnado.",
    "Assess effects on independent thinking, human relationships, wellbeing and staff working conditions, then agree support and safeguards.": "Evalúa los efectos sobre el pensamiento propio, las relaciones humanas, el bienestar y las condiciones laborales del personal, y acuerda el apoyo y las medidas de protección."
  });
  Object.assign(ES, {
    "Actions to reduce unfair effects and barriers.": "Medidas para reducir los efectos injustos y las barreras.",
    "Information for affected groups, explanations, records and human review routes.": "Información para los grupos afectados, explicaciones, registros y vías de revisión humana.",
    "Clear information and effective review or challenge routes.": "Información clara y vías eficaces de revisión o reclamación.",
    "Representative tests, security checks, monitoring, incident response and continuity arrangements.": "Pruebas en situaciones habituales, controles de seguridad, seguimiento, respuesta a incidentes y planes para continuar el servicio.",
    "Actions for testing, protection, response and safe continuity.": "Medidas para realizar pruebas, proteger el sistema, responder a problemas y continuar el servicio de forma segura.",
    "Purpose, authority, access, accuracy, sharing, retention, deletion and supplier arrangements.": "Propósito, autorización, acceso, precisión, intercambio, conservación y eliminación de datos, y acuerdos con proveedores.",
    "Actions to reduce data use and strengthen protection.": "Medidas para reducir el uso de datos y reforzar su protección.",
    "Accountable authorities, trained staff, instructions, oversight and complaint processes.": "Responsables, personal capacitado, instrucciones, supervisión y procesos de reclamación.",
    "Clear ownership and practical ways to intervene, review and correct.": "Responsabilidades claras y formas prácticas de intervenir, revisar y corregir.",
    "Feedback from affected people, skills and workload needs, total costs, infrastructure and exit options.": "Opiniones de las personas afectadas, capacidades y carga de trabajo, costos totales, infraestructura y opciones para dejar de usar el sistema.",
    "Support for people and actions to manage long term resource and dependency risks.": "Apoyo a las personas y medidas para gestionar los recursos y la dependencia a largo plazo.",
    "The main risks, affected groups or institutions, actions, owners, dates and review triggers.": "Principales riesgos, grupos o instituciones afectados, acciones, responsables, fechas y motivos para repetir la revisión.",
    "A clear decision, conditions and next review point.": "Una decisión clara, sus condiciones y el momento de la próxima revisión.",
    "Yes, with evidence.": "Sí, con evidencia.",
    "Partly or in progress.": "Parcialmente o en proceso.",
    "Not applicable, with a reason.": "No aplica, con una justificación.",
    "Incomplete assessment": "Evaluación incompleta",
    "Incomplete assessment. Complete all required questions before relying on the findings.": "Evaluación incompleta. Responde todas las preguntas obligatorias antes de utilizar los hallazgos.",
    "Each assessment uses an HTML page together with shared styling, language and PDF files. Keep these files together for local use. The forms run in the browser without an assessment service.": "Cada evaluación utiliza una página HTML junto con archivos compartidos de estilos, idiomas y PDF. Mantén estos archivos juntos para el uso local. Los formularios funcionan en el navegador sin un servicio de evaluación.",
    "Each principle percentage is calculated from its applicable questions. The overall practice indicator averages the applicable principle percentages equally. A principle with no applicable questions is excluded, so sections with more questions do not dominate.": "El porcentaje de cada principio se calcula con sus preguntas aplicables. El indicador general es el promedio de los principios aplicables, todos con el mismo peso. Si un principio no tiene preguntas aplicables, se excluye. Así, las secciones con más preguntas no predominan.",
    "Review the safeguards.": "Revisa las medidas de protección.",
    "Complete the checks in your chosen assessment. Thorough covers all six principles. Use evidence from the relevant education setting. Seek specialist input when a technical, educational or legal point cannot be confirmed.": "Completa las preguntas de la evaluación elegida. La evaluación detallada abarca los seis principios. Utiliza evidencia del contexto educativo correspondiente. Solicita apoyo especializado cuando no puedas confirmar un aspecto técnico, educativo o legal."
});
  Object.assign(ES, {
    "Open one section at a time. For 'Not applicable', record the question number and reason in the final notes.": "Abre una sección a la vez. Si eliges «No aplica», indica el número de la pregunta y el motivo en las notas finales.",
    "Each assessment uses an HTML page together with shared styling, language and PDF files. Keep these files together for local use. The forms run in the browser without an assessment service. Answers remain in the current page session, are not submitted and are cleared when the page closes. Export JSON, text or PDF to keep a record under the rules that apply in your education system or institution.": "Cada evaluación utiliza una página HTML junto con archivos compartidos de estilos, idiomas y PDF. Mantén estos archivos juntos para el uso local. Los formularios funcionan en el navegador sin un servicio de evaluación. Las respuestas permanecen en la sesión actual, no se envían y se borran al cerrar la página. Exporta JSON, texto o PDF para conservar un registro según las normas de tu sistema educativo o institución."
});
  function translated(value) {
    var source = key(value), exact = ES[source];
    if (exact) return exact;
    var match = source.match(/^(\d+) of (\d+) required (?:questions|items) answered(\.)?$/);
    if (match) return match[1] + " de " + match[2] + " preguntas obligatorias respondidas" + (match[3] || "");
    match = source.match(/^(Risk|Core|Governance|Action) (\d+)$/);
    if (match) return ({Risk:"Riesgo",Core:"Salvaguarda",Governance:"Gobernanza",Action:"Acción"})[match[1]] + " " + match[2];
    if (source.startsWith(". ")) return ". " + translated(source.slice(2));
    if (source.endsWith(" ·")) {
      var beforeSeparator = translated(source.slice(0, -2));
      if (beforeSeparator !== source.slice(0, -2)) return beforeSeparator + " ·";
    }
    match = source.match(/^(.+) Prompt: (.+)$/);
    if (match) return translated(match[1]) + " Pregunta: " + translated(match[2]);
    if (source.startsWith("Prompt: ")) return "Pregunta: " + translated(source.slice(8));
    if (source.endsWith(":")) {
      var label = translated(source.slice(0, -1));
      if (label !== source.slice(0, -1)) return label + ":";
    }
    if (source.endsWith(" *")) {
      var required = translated(source.slice(0, -2));
      if (required !== source.slice(0, -2)) return required + " *";
    }
    match = source.match(/^(\d+) (in place|to strengthen|gaps|not applicable|unanswered)$/);
    if (match) return match[1] + " " + ({"in place":"implantadas","to strengthen":"por reforzar","gaps":"deficiencias","not applicable":"no aplicables","unanswered":"sin responder"})[match[2]];
    match = source.match(/^Answer (\d+) more screening prompt\(s\) to calculate the route\.$/);
    if (match) return "Responde " + match[1] + " preguntas más para calcular la ruta.";
    match = source.match(/^(\d+) high concern trigger\(s\)(; uncertainty raises the route to at least Medium)?\. Scoring guide:$/);
    if (match) return match[1] + " señales de alta preocupación" + (match[2] ? "; la incertidumbre eleva la ruta al menos a Medio" : "") + ". Guía de puntuación:";
    match = source.match(/^(\d+)% screening signal$/);
    if (match) return "Señal inicial de riesgo del " + match[1] + " %";
    match = source.match(/^Page (\d+) of (\d+)$/);
    if (match) return "Página " + match[1] + " de " + match[2];
    match = source.match(/^(\d+) of (\d+)$/);
    if (match) return match[1] + " de " + match[2];
    match = source.match(/^(\d+) additional dimensions continue on page 2\.$/);
    if (match) return match[1] + " dimensiones adicionales continúan en la página 2.";
    match = source.match(/^(\d+)% screening signal and (\d+) high concern trigger\(s\)\.$/);
    if (match) return "Señal inicial del " + match[1] + " % y " + match[2] + " señales de alta preocupación.";
    match = source.match(/^(\d+)% screening signal and (\d+) high concern answer(?:s)?\.$/);
    if (match) return "Señal inicial del " + match[1] + " % y " + match[2] + (match[2] === "1" ? " respuesta de alta preocupación." : " respuestas de alta preocupación.");
    if (source.indexOf("The current route is ") === 0) {
      var route = source.slice(21).split(";");
      return "Ruta actual: " + translated(route[0]) + (route.length > 1 ? "; " + (route.slice(1).join(";").trim().indexOf("it follows") === 0 ? "sigue la señal de mayor preocupación seleccionada, no un promedio." : "la evaluación inicial orienta la revisión humana y no es una clasificación jurídica.") : "");
    }
    match = source.match(/^(Strongest|Priority) dimension: (.+)\.$/);
    if (match) return (match[1] === "Strongest" ? "Dimensión más sólida: " : "Dimensión prioritaria: ") + translated(match[2]) + ".";
    match = source.match(/^(\d+) high concern trigger\(s\)\.$/);
    if (match) return match[1] + " señales de alta preocupación.";
    match = source.match(/^(Low|Medium|High|Excessive or unresolved) route\. Complete governance, legal, rights and technical review before relying on the system\.$/);
    if (match) return "Ruta " + translated(match[1]) + ". Completa la revisión de gobernanza, derecho, derechos y aspectos técnicos antes de confiar en el sistema.";
    if (source.endsWith(". Add evidence, an owner or a dated improvement action before relying on this control."))
      return translated(source.slice(0, source.indexOf(". Add evidence"))) + ". Añade pruebas, una persona responsable o una medida de mejora con fecha antes de confiar en este control.";
    match = source.match(/^(\d+) strength(?:s)?, (\d+) item(?:s)? needing attention$/);
    if (match) return match[1] + " fortalezas, " + match[2] + " aspectos que requieren atención";
    match = source.match(/^(\d+) item(?:s)? supported by evidence, (\d+) requiring attention$/);
    if (match) return match[1] + (match[1] === "1" ? " aspecto respaldado" : " aspectos respaldados") + " por evidencia, " + match[2] + " que requieren atención";
    match = source.match(/^Preliminary route: (.+)\. It reflects the highest concern selected\.$/);
    if (match) return "Ruta preliminar: " + translated(match[1]) + ". Refleja la señal de mayor preocupación seleccionada.";
    match = source.match(/^Preliminary route: (.+)\. The screening result supports human judgement\.$/);
    if (match) return "Ruta preliminar: " + translated(match[1]) + ". El resultado orienta el criterio del equipo.";
    match = source.match(/^Area with the strongest evidence: (.+)\.$/);
    if (match) return "Área con la evidencia más sólida: " + translated(match[1]) + ".";
    match = source.match(/^Area requiring the most attention: (.+)\.$/);
    if (match) return "Área que requiere mayor atención: " + translated(match[1]) + ".";
    match = source.match(/^(Low|Medium|High|Excessive or unresolved) route\. Complete the appropriate education, governance, legal, rights, data and technical review before relying on the system\.$/);
    if (match) return "Ruta " + translated(match[1]) + ". Completa la revisión educativa, de gobernanza, jurídica, de derechos, datos y técnica que corresponda antes de utilizar los resultados del sistema.";
    if (source.endsWith(". Add evidence, assign a responsible role and set a completion date."))
      return translated(source.slice(0, source.indexOf(". Add evidence"))) + ". Añade evidencia, asigna una persona o unidad responsable y establece una fecha de cumplimiento.";
    return source;
  }
  window.civicTranslate = function (value) { return current === "es" ? translated(value) : value; };
  window.civicLanguage = function () { return current; };
  function swapText(node) {
    if (!node.nodeValue || node.parentElement?.closest(".language-toggle,[data-i18n-ignore]")) return;
    if (!originals.has(node)) originals.set(node, node.nodeValue);
    var source = originals.get(node);
    var trimmed = key(source);
    var replacement = translated(trimmed);
    if (current === "es" && replacement !== trimmed) {
      var start = source.search(/\S/), end = source.search(/\s*$/);
      node.nodeValue = (start > 0 ? source.slice(0, start) : "") + replacement + (end > start ? source.slice(end) : "");
    } else if (current === "en") node.nodeValue = source;
  }
  function swapAttributes(element) {
    if (element.closest && element.closest(".language-toggle")) return;
    ["placeholder", "aria-label", "title", "alt"].forEach(function (name) {
      if (!element.hasAttribute(name)) return;
      var original = attrOriginals.get(element) || {};
      if (!(name in original)) original[name] = element.getAttribute(name);
      attrOriginals.set(element, original);
      var source = original[name];
      element.setAttribute(name, current === "es" ? (ATTR_ES[key(source)] || translated(source)) : source);
    });
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) swapText(root);
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1) swapAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) swapText(node);
    if (root.querySelectorAll) root.querySelectorAll("*").forEach(swapAttributes);
  }
  window.civicTranslateHtml = function (element) {
    var copy = element.cloneNode(true);
    if (current === "es") walk(copy);
    return copy.innerHTML;
  };
  window.civicTranslateExport = function (content, type) {
    if (current !== "es") return content;
    if (type.indexOf("application/json") === 0) {
      try {
        var convert = function (item) {
          if (typeof item === "string") return translated(item);
          if (Array.isArray(item)) return item.map(convert);
          if (item && typeof item === "object") return Object.fromEntries(Object.entries(item).map(function (pair) { return [pair[0], convert(pair[1])]; }));
          return item;
        };
        return JSON.stringify(convert(JSON.parse(content)), null, 2);
      } catch (error) { return content; }
    }
    if (type.indexOf("text/html") === 0) {
      var doc = new DOMParser().parseFromString(content, "text/html");
      doc.documentElement.lang = "es";
      walk(doc.documentElement);
      return "<!doctype html>\n" + doc.documentElement.outerHTML;
    }
    if (type.indexOf("text/plain") === 0) {
      return content.split("\n").map(function (line) {
        var direct = translated(line);
        if (direct !== line) return direct;
        if (line.indexOf(" | ") >= 0) return line.split(" | ").map(function (part) {
          var separator = part.indexOf(": ");
          return separator > 0 ? translated(part.slice(0, separator + 1)) + " " + translated(part.slice(separator + 2)) : translated(part);
        }).join(" | ");
        var colon = line.indexOf(": ");
        if (colon > 0) return translated(line.slice(0, colon + 1)) + " " + translated(line.slice(colon + 2));
        return line;
      }).join("\n");
    }
    return content;
  };
  function ensureToggle() {
    document.querySelectorAll("header").forEach(function (header) {
      if (header.querySelector(".language-toggle")) return;
      var button = document.createElement("button");
      button.type = "button";
      button.className = "language-toggle";
      button.setAttribute("aria-label", "Switch language / Cambiar idioma");
      button.innerHTML = '<span class="language-current">English</span><span aria-hidden="true"> / </span><span>Español</span>';
      button.addEventListener("click", function () { setLanguage(current === "en" ? "es" : "en"); });
      header.appendChild(button);
    });
  }
  function setLanguage(language) {
    current = language === "es" ? "es" : "en";
    document.documentElement.lang = current;
    document.querySelectorAll('meta[name="description"]').forEach(function (meta) {
      if (!meta.dataset.originalDescription) meta.dataset.originalDescription = meta.content;
      meta.content = current === "es" ? translated(meta.dataset.originalDescription) : meta.dataset.originalDescription;
    });
    try { localStorage.setItem("civic-ai-compass-language", current); } catch (e) {}
    document.querySelectorAll(".language-toggle").forEach(function (button) {
      button.setAttribute("aria-pressed", String(current === "es"));
      button.setAttribute("aria-label", current === "es" ? "Cambiar idioma / Switch language" : "Switch language / Cambiar idioma");
    });
    walk(document.documentElement);
  }
  function init() {
    ensureToggle();
    var saved = "en";
    try { saved = localStorage.getItem("civic-ai-compass-language") || saved; } catch (e) {}
    setLanguage(saved);
    new MutationObserver(function (records) {
      if (current !== "es") return;
      records.forEach(function (record) { record.addedNodes.forEach(function (node) { walk(node); }); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}());
