(function (root) {
  "use strict";
  var checks = [
    {
      en: ["Have we taken steps to prevent possible harm?", "Consider who could be harmed and what safeguards are already in place.", "Identify possible harms with the people affected and put safeguards in place before using AI."],
      es: ["¿Hemos tomado medidas para prevenir posibles daños?", "Piensa en quién podría sufrir daños y qué medidas de protección ya existen.", "Identifica los posibles daños con las personas afectadas y establece medidas de protección antes de usar IA."]
    },
    {
      en: ["Does this use benefit learners in the intended age group?", "Look for evidence of a learning benefit that suits their age and needs.", "Check the intended age group and evidence of benefit; adapt the activity or choose another approach if it is not suitable."],
      es: ["¿Beneficia al grupo de edad destinatario?", "Busca evidencia de un beneficio para el aprendizaje adecuado a su edad y sus necesidades.", "Revisa el grupo de edad y la evidencia de beneficio; adapta la actividad o elige otra opción si no es adecuada."]
    },
    {
      en: ["Have we identified and reduced risks to learners’ development?", "Consider effects on independent thinking, social skills and emotional development.", "Adjust the activity and support to protect learners’ development, and check that the risks have been reduced."],
      es: ["¿Se han previsto y reducido los riesgos para el desarrollo?", "Considera los efectos en el pensamiento independiente, las habilidades sociales y el desarrollo emocional.", "Ajusta la actividad y el apoyo para proteger el desarrollo del alumnado y comprueba que los riesgos se han reducido."]
    },
    {
      en: ["Does this use follow the law and protect children’s privacy?", "Check local requirements, age restrictions and how learners’ data is used.", "Confirm the applicable rules and data protections with the responsible person before sharing learners’ data or using the tool."],
      es: ["¿Cumple la ley y protege la privacidad infantil?", "Revisa los requisitos locales, los límites de edad y cómo se usan los datos del alumnado.", "Confirma las normas aplicables y la protección de los datos con la persona responsable antes de compartir datos del alumnado o usar la herramienta."]
    },
    {
      en: ["Does it avoid risks to safety and wellbeing?", "Consider harmful content, unsafe advice and effects on learners’ wellbeing.", "Address safety and wellbeing risks and agree how an adult will respond if a problem arises."],
      es: ["¿Evita riesgos para la seguridad y el bienestar?", "Considera los contenidos dañinos, los consejos inseguros y los efectos en el bienestar del alumnado.", "Aborda los riesgos para la seguridad y el bienestar y acuerda cómo responderá una persona adulta si surge un problema."]
    },
    {
      en: ["Is AI necessary compared with an option without AI?", "Compare what AI adds with a simpler way to achieve the same learning goal.", "Compare both options; choose the approach without AI if it meets the learning goal just as well with fewer risks."],
      es: ["¿Es necesaria frente a una alternativa sin IA?", "Compara lo que aporta la IA con una forma más sencilla de alcanzar el mismo objetivo de aprendizaje.", "Compara ambas opciones; elige la alternativa sin IA si cumple igual de bien el objetivo de aprendizaje con menos riesgos."]
    },
    {
      en: ["Does it support teacher and student relationships and learning with peers?", "Consider whether AI strengthens human interaction rather than taking its place.", "Adjust the activity so teachers remain involved and learners still have meaningful opportunities to learn together."],
      es: ["¿Apoya la relación docente estudiante y el aprendizaje entre compañeros?", "Considera si la IA fortalece la interacción humana en lugar de sustituirla.", "Ajusta la actividad para que el profesorado siga participando y el alumnado tenga oportunidades significativas de aprender en compañía."]
    },
    {
      en: ["Have students, families and teachers been consulted?", "Include the views of those affected, with ways for younger learners to take part.", "Consult students, families and teachers in an accessible way and use their concerns to improve the proposal."],
      es: ["¿Se ha consultado a estudiantes, familias y docentes?", "Incluye las opiniones de las personas afectadas, con formas de participación para el alumnado más joven.", "Consulta a estudiantes, familias y docentes de forma accesible y utiliza sus inquietudes para mejorar la propuesta."]
    },
    {
      en: ["Has it been tested for local language, culture and accessibility needs?", "Use evidence from the setting and the learners who will actually use it.", "Test with the intended learners and address language, cultural and accessibility barriers before use."],
      es: ["¿Se ha probado en el idioma, la cultura y las necesidades de accesibilidad locales?", "Utiliza evidencia del entorno y del alumnado que realmente la usará.", "Prueba con el alumnado destinatario y resuelve las barreras de idioma, cultura y accesibilidad antes del uso."]
    }
  ];
  var publicationUrl = "https://unesdoc.unesco.org/ark:/48223/pf0000399343_eng";
  var topics = {
    en: ["Harm", "Age", "Development", "Privacy", "Wellbeing", "Necessity", "Relationships", "Consultation", "Local fit"],
    es: ["Daños", "Edad", "Desarrollo", "Privacidad", "Bienestar", "Necesidad", "Relaciones", "Consulta", "Contexto local"]
  };
  function validExplanation(value) {
    var text = String(value || "").replace(/[\u200b\u200c\u200d\ufeff]/g, "").trim().replace(/\s+/g, " ");
    return text.length >= 20 && /[\p{L}\p{N}]/u.test(text);
  }
  function initial() { return { step: 0, answers: [], paused: null, history: [], notes: Array(9).fill(""), use: "", position: "", completedAt: null }; }
  function transition(state, action) {
    if (action === "restart") return initial();
    if (action === "back" && state.step > 0) return Object.assign({}, state, { step: state.step - 1, answers: state.answers.slice(0, state.step - 1), paused: null, completedAt: null });
    if (action === "recheck" && state.paused) return Object.assign({}, state, { paused: null });
    if (state.step >= checks.length || state.paused) return state;
    if (action === "yes" && !validExplanation(state.notes[state.step])) return state;
    var history = state.history.concat({ step: state.step, answer: action, explanation: state.notes[state.step].trim() });
    if (action === "yes") return Object.assign({}, state, { step: state.step + 1, answers: state.answers.concat("yes"), paused: null, history: history, completedAt: state.step === 8 ? new Date().toISOString() : null });
    if (action === "no" || action === "unsure") return Object.assign({}, state, { paused: action, history: history });
    return state;
  }
  var copy = {
    en: {
      title: "Decision guide", intro: "Nine questions before using AI in the classroom. Answer for a specific use, based on the evidence you have.",
      step: "Question", of: "of", confirmed: "checks confirmed", yes: "Yes, continue", no: "No, pause", unsure: "Not sure", back: "Previous question", restart: "Start again",
      pause: "Pause and take action", uncertain: "Pause and check", pauseNote: "Do not proceed with this AI use until this concern has been addressed.", uncertainNote: "Find the evidence or advice you need before deciding whether to continue.",
      action: "What to do", recheck: "Reconsider this question", recheckNote: "Return to the same question after taking action. Only a confirmed Yes moves you forward.",
      complete: "Proceed with care", completeNote: "You have confirmed all nine checks for this use. Those responsible can now consider proceeding with the safeguards in place.",
      review: "Keep reviewing during use", ongoing: "Give students, families and teachers a clear way to report problems, and revisit the decision when concerns arise.", repeat: "Repeat these nine questions regularly and whenever the tool, learners or context changes.",
      record: "For a fuller review and an action record, use one of the assessments.", quick: "Quick assessment", thorough: "Thorough assessment", summary: "Review confirmed checks", note: "This guide supports a decision; it does not provide approval or change assessment scores.",
      privacy: "Choices stay on this page and are cleared when you reload it. No answers are submitted.",
      source: "Adapted from Livingstone et al. (2026), Is there a right age for AI in education? Deciding whether AI is age-appropriate and why, UNESCO, figure 1, page 13.",
      publication: "Read the original UNESCO publication", sourceLabel: "Based on UNESCO research", noteLabel: "Explain how or why", noteHint: "A brief sentence about how this condition is met is enough. Write at least 20 characters to continue.", noteReady: "Explanation added. You can continue.", topic: "Topic", topicSequence: "Topic progression", topicProgress: "Topics in this review",
      exportTitle: "Keep your decision record", exportIntro: "Save the nine answers, earlier pauses, your notes and the guidance for continued use.", useLabel: "AI use reviewed (optional)", useHint: "Name the tool, activity and intended learners.", positionLabel: "Your decision and conditions (optional)", positionHint: "Record your next step, safeguards or review date.",
      pdf: "Download decision record (PDF)", html: "Download accessible HTML", accessible: "For selectable text or screen reader access, use the HTML record.", downloaded: "Decision record downloaded.", downloadError: "The download could not be created. Try the HTML record or download again.",
      recordTitle: "AI classroom decision record", overview: "Review overview", useField: "AI use reviewed", dateField: "Completed on", outcome: "Guide outcome", positionField: "Your decision and conditions", notProvided: "Not provided", answer: "Final answer", answerYes: "Yes", answerNo: "No", answerUnsure: "Not sure", earlier: "Earlier answers and explanations", noteField: "Explanation", guidanceGiven: "Guidance shown when paused", nextSteps: "During use and future review", sourceTitle: "Source and scope", historyNote: "Earlier answers and guidance are recorded for context. This record does not verify that actions were completed.", footer: "Responsible AI in Education Compass"
    },
    es: {
      title: "Guía de decisiones", intro: "Nueve preguntas antes de usar IA en el aula. Responde para un uso concreto, según la evidencia disponible.",
      step: "Pregunta", of: "de", confirmed: "comprobaciones confirmadas", yes: "Sí, continuar", no: "No, pausar", unsure: "No estoy seguro", back: "Pregunta anterior", restart: "Empezar de nuevo",
      pause: "Pausa y toma medidas", uncertain: "Pausa y comprueba", pauseNote: "No continúes con este uso de IA hasta haber resuelto esta preocupación.", uncertainNote: "Busca la evidencia o el asesoramiento que necesitas antes de decidir si puedes continuar.",
      action: "Qué hacer", recheck: "Reconsiderar esta pregunta", recheckNote: "Vuelve a la misma pregunta después de tomar medidas. Solo un Sí confirmado permite avanzar.",
      complete: "Procede con criterio", completeNote: "Has confirmado las nueve comprobaciones para este uso. Las personas responsables pueden considerar continuar con las medidas de protección establecidas.",
      review: "Sigue revisando durante el uso", ongoing: "Ofrece a estudiantes, familias y docentes una forma clara de comunicar problemas y revisa la decisión cuando surjan inquietudes.", repeat: "Repite estas nueve preguntas de forma regular y cuando cambien la herramienta, el alumnado o el contexto.",
      record: "Para una revisión más completa y un registro de acciones, utiliza una de las evaluaciones.", quick: "Evaluación rápida", thorough: "Evaluación detallada", summary: "Revisar las comprobaciones confirmadas", note: "Esta guía apoya una decisión; no otorga aprobación ni modifica las puntuaciones de las evaluaciones.",
      privacy: "Las respuestas permanecen en esta página y se borran al recargarla. No se envía ninguna respuesta.",
      source: "Adaptado de Livingstone et al. (2026), Is there a right age for AI in education? Deciding whether AI is age-appropriate and why, UNESCO, figura 1, página 13.",
      publication: "Leer la publicación original de UNESCO", sourceLabel: "Basado en investigación de UNESCO", noteLabel: "Explica cómo o por qué", noteHint: "Basta una frase breve sobre cómo se cumple esta condición. Escribe al menos 20 caracteres para continuar.", noteReady: "Explicación añadida. Puedes continuar.", topic: "Tema", topicSequence: "Progresión de temas", topicProgress: "Temas de esta revisión",
      exportTitle: "Guarda el registro de tus decisiones", exportIntro: "Guarda las nueve respuestas, las pausas anteriores, tus notas y la orientación para el uso continuado.", useLabel: "Uso de IA revisado (opcional)", useHint: "Indica la herramienta, la actividad y el alumnado destinatario.", positionLabel: "Tu decisión y sus condiciones (opcional)", positionHint: "Registra tu siguiente paso, las medidas de protección o la fecha de revisión.",
      pdf: "Descargar registro de decisiones (PDF)", html: "Descargar HTML accesible", accessible: "Para texto seleccionable o acceso con lector de pantalla, utiliza el registro HTML.", downloaded: "Registro de decisiones descargado.", downloadError: "No se pudo crear la descarga. Prueba el registro HTML o vuelve a descargar.",
      recordTitle: "Registro de decisiones sobre IA en el aula", overview: "Resumen de la revisión", useField: "Uso de IA revisado", dateField: "Fecha de finalización", outcome: "Resultado de la guía", positionField: "Tu decisión y sus condiciones", notProvided: "No proporcionado", answer: "Respuesta final", answerYes: "Sí", answerNo: "No", answerUnsure: "No estoy seguro", earlier: "Respuestas y explicaciones anteriores", noteField: "Explicación", guidanceGiven: "Orientación mostrada durante la pausa", nextSteps: "Durante el uso y en futuras revisiones", sourceTitle: "Fuente y alcance", historyNote: "Las respuestas anteriores y la orientación se registran como contexto. Este registro no verifica que las acciones se hayan completado.", footer: "Brújula para una IA responsable en educación"
    }
  };
  function buildRecord(state, language) {
    if (state.step !== 9 || state.answers.length !== 9 || !state.answers.every(function (a) { return a === "yes"; }) || !state.notes.every(validExplanation)) throw new Error("Complete and explain all nine checks before exporting.");
    var lang = language === "es" ? "es" : "en", c = copy[lang];
    var answerLabels = { yes: c.answerYes, no: c.answerNo, unsure: c.answerUnsure };
    var sections = [{ title: c.overview, fields: [
      { label: c.useField, value: state.use.trim() || c.notProvided },
      { label: c.dateField, value: new Date(state.completedAt).toLocaleString(lang === "es" ? "es" : "en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }) + " UTC" },
      { label: c.outcome, value: c.complete + ". " + c.completeNote },
      { label: c.positionField, value: state.position.trim() || c.notProvided },
      { label: c.topicSequence, value: topics[lang].join(" · ") }
    ] }];
    checks.forEach(function (check, i) {
      var previous = state.history.filter(function (entry) { return entry.step === i; }).slice(0, -1);
      var fields = [{ label: c.topic, value: topics[lang][i] }, { label: c.answer, value: c.answerYes }, { label: c.noteField, value: state.notes[i].trim() }];
      if (previous.length) fields.push({ label: c.earlier, value: previous.map(function (entry) { return answerLabels[entry.answer] + (entry.explanation ? ": " + entry.explanation : ""); }).join("\n") });
      if (previous.some(function (entry) { return entry.answer !== "yes"; })) fields.push({ label: c.guidanceGiven, value: check[lang][2] });
      sections.push({ title: (i + 1) + ". " + check[lang][0], fields: fields });
    });
    sections.push({ title: c.nextSteps, paragraphs: [c.ongoing, c.repeat] });
    sections.push({ title: c.sourceTitle, paragraphs: [c.source, publicationUrl, c.note, c.historyNote] });
    return { kind: "decision-guide", language: lang, title: c.recordTitle, pathway: c.footer, footer: c.footer, sections: sections };
  }
  function recordHtml(record) {
    function escape(value) { return String(value).replace(/[&<>"']/g, function (char) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]; }); }
    var sections = record.sections.map(function (section) {
      return "<section><h2>" + escape(section.title) + "</h2>" + (section.fields || []).map(function (field) { return "<p><strong>" + escape(field.label) + "</strong><br>" + escape(field.value) + "</p>"; }).join("") + (section.paragraphs || []).map(function (p) { return p === publicationUrl ? '<p><a href="' + publicationUrl + '">' + escape(copy[record.language].publication) + '</a></p>' : "<p>" + escape(p) + "</p>"; }).join("") + "</section>";
    }).join("");
    return '<!doctype html><html lang="' + record.language + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escape(record.title) + '</title><style>body{font:16px/1.6 system-ui,sans-serif;color:#1a304a;margin:0;background:#f5f7fa}main{max-width:780px;margin:auto;padding:2rem}header{border-bottom:3px solid #146e68;padding-bottom:1rem}h1{line-height:1.2;font-size:2rem}h2{font-size:1.2rem;line-height:1.4}section{border-bottom:1px solid #dce4e9;padding:1rem 0}p{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#12645f}@media print{body{background:white}main{max-width:none;padding:0}h2{break-after:avoid}p{orphans:3;widows:3}}</style></head><body><main><header><p>' + escape(record.pathway) + '</p><h1>' + escape(record.title) + '</h1></header>' + sections + '</main></body></html>';
  }
  var flow = { checks: checks, topics: topics, validExplanation: validExplanation, initial: initial, transition: transition, buildRecord: buildRecord, recordHtml: recordHtml };
  if (typeof module !== "undefined" && module.exports) module.exports = flow;
  if (!root.document) return;
  function init() {
    var host = document.getElementById("decision-guide");
    if (!host) return;
    var state = initial();
    function element(tag, text, className) {
      var node = document.createElement(tag);
      if (text) node.textContent = text;
      if (className) node.className = className;
      return node;
    }
    function render(focus) {
      var language = root.civicLanguage && root.civicLanguage() === "es" ? "es" : "en";
      var c = copy[language];
      host.replaceChildren();
      document.getElementById("guide-title").textContent = c.title;
      document.getElementById("guide-intro").textContent = c.intro;
      document.title = c.title + " | Responsible AI in Education Compass";
      var provenance = element("div", null, "guide-provenance");
      var sourceLink = element("a", c.sourceLabel); sourceLink.href = publicationUrl;
      sourceLink.target = "_blank"; sourceLink.rel = "noopener noreferrer";
      provenance.append(sourceLink, element("span", "Livingstone et al. · 2026"));
      host.append(provenance);
      var progressRow = element("div", null, "guide-progress");
      var count = element("span", state.step < 9 ? c.step + " " + (state.step + 1) + " " + c.of + " 9" : "9 " + c.of + " 9");
      progressRow.append(count, element("span", state.answers.length + " / 9 " + c.confirmed));
      var progress = element("progress");
      progress.max = 9; progress.value = state.answers.length;
      progress.setAttribute("aria-label", state.answers.length + " / 9 " + c.confirmed);
      var topicList = element("ol", null, "guide-topic-progress");
      topicList.setAttribute("aria-label", c.topicProgress);
      topics[language].forEach(function (topic, index) {
        var item = element("li", null, index < state.step ? "is-done" : index === state.step ? "is-current" : "is-upcoming");
        if (index === state.step) item.setAttribute("aria-current", "step");
        var topicNumber = element("span", String(index + 1), "guide-topic-number"); topicNumber.setAttribute("aria-hidden", "true");
        item.append(topicNumber, element("span", topic)); topicList.append(item);
      });
      host.append(progressRow, topicList, progress);
      var panel = element("section", null, "guide-card" + (state.paused ? " is-paused" : ""));
      var heading;
      function input(label, hint, value, onInput, multiline) {
        var wrapper = element("label", null, "guide-field");
        wrapper.append(element("span", label, "guide-field-label"));
        var control = element(multiline ? "textarea" : "input");
        if (multiline) { control.rows = 3; control.maxLength = 1500; }
        else { control.type = "text"; control.maxLength = 300; }
        control.value = value;
        control.placeholder = hint;
        control.addEventListener("input", function () { onInput(control.value); });
        wrapper.append(control);
        return wrapper;
      }
      function button(label, action, className) {
        var node = element("button", label, className);
        node.type = "button";
        node.addEventListener("click", function () { state = transition(state, action); render(true); });
        return node;
      }
      function assessmentLinks() {
        var links = element("div", null, "guide-links");
        [["quick-assessment.html", c.quick], ["thorough-assessment.html", c.thorough]].forEach(function (pair) {
          var a = element("a", pair[1]); a.href = pair[0]; links.append(a);
        });
        return links;
      }
      if (state.step < 9) {
        var check = checks[state.step][language];
        heading = element("h2", check[0]);
        var questionHead = element("div", null, "guide-question-head");
        var number = element("span", String(state.step + 1).padStart(2, "0"), "guide-question-number"); number.setAttribute("aria-hidden", "true");
        questionHead.append(number, heading);
        panel.append(questionHead, element("p", check[1], "guide-context"));
        var yesButton, explanationControl;
        var note = element("div", null, "guide-note-entry");
        var explanationHint = element("p", validExplanation(state.notes[state.step]) ? c.noteReady : c.noteHint, "guide-small");
        explanationHint.id = "guide-explanation-hint";
        explanationHint.setAttribute("aria-live", "polite");
        var explanationField = input(c.noteLabel, check[1], state.notes[state.step], function (value) {
          state.notes[state.step] = value;
          var ready = validExplanation(value);
          if (yesButton) yesButton.disabled = !ready;
          var message = ready ? c.noteReady : c.noteHint;
          if (explanationHint.textContent !== message) explanationHint.textContent = message;
        }, true);
        explanationControl = explanationField.querySelector("textarea");
        explanationControl.required = true; explanationControl.minLength = 20; explanationControl.rows = 2;
        explanationControl.setAttribute("aria-describedby", "guide-explanation-hint");
        explanationControl.setAttribute("aria-required", "true");
        note.append(explanationField, explanationHint);
        panel.append(note);
        if (state.paused) {
          var pause = element("div", null, "guide-action");
          pause.append(element("h3", state.paused === "unsure" ? c.uncertain : c.pause), element("p", state.paused === "unsure" ? c.uncertainNote : c.pauseNote));
          pause.append(element("h4", c.action), element("p", check[2]));
          pause.append(button(c.recheck, "recheck", "guide-primary"), element("p", c.recheckNote, "guide-small"));
          panel.append(pause);
        } else {
          var answers = element("div", null, "guide-answers");
          answers.setAttribute("role", "group");
          heading.id = "guide-question";
          answers.setAttribute("aria-labelledby", "guide-question");
          yesButton = button(c.yes, "yes", "guide-primary");
          yesButton.disabled = !validExplanation(state.notes[state.step]);
          answers.append(yesButton, button(c.no, "no", "guide-secondary"), button(c.unsure, "unsure", "guide-secondary"));
          panel.append(answers);
        }
      } else {
        heading = element("h2", c.complete);
        panel.classList.add("is-complete");
        panel.append(heading, element("p", c.completeNote));
        var downloadPanel = element("div", null, "guide-download");
        downloadPanel.append(element("h3", c.exportTitle), element("p", c.exportIntro));
        var contextDetails = element("details", null, "guide-record-notes");
        contextDetails.append(element("summary", c.positionLabel));
        contextDetails.append(input(c.useLabel, c.useHint, state.use, function (value) { state.use = value; }));
        contextDetails.append(input(c.positionLabel, c.positionHint, state.position, function (value) { state.position = value; }, true));
        if (state.use || state.position) contextDetails.open = true;
        downloadPanel.append(contextDetails);
        var downloadActions = element("div", null, "guide-answers");
        var downloadStatus = element("p", null, "guide-small"); downloadStatus.setAttribute("role", "status");
        function download(format) {
          var node = element("button", format === "pdf" ? c.pdf : c.html, format === "pdf" ? "guide-primary" : "guide-secondary");
          node.type = "button";
          node.addEventListener("click", function () {
            try {
              var report = buildRecord(state, language);
              var filename = "ai-decision-record-" + language;
              if (format === "pdf") root.downloadAssessmentPdf(report, filename + ".pdf");
              else {
                var url = URL.createObjectURL(new Blob([recordHtml(report)], { type: "text/html;charset=utf-8" }));
                var a = document.createElement("a"); a.href = url; a.download = filename + ".html";
                document.body.appendChild(a); a.click(); a.remove();
                setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
              }
              downloadStatus.textContent = c.downloaded;
            } catch (error) { downloadStatus.textContent = c.downloadError; }
          });
          return node;
        }
        downloadActions.append(download("pdf"), download("html"));
        downloadPanel.append(downloadActions, element("p", c.accessible, "guide-small"), downloadStatus);
        panel.append(downloadPanel, element("h3", c.review), element("p", c.ongoing), element("p", c.repeat));
        var details = element("details", null, "guide-summary");
        details.append(element("summary", c.summary));
        var list = element("ol");
        checks.forEach(function (check) { list.append(element("li", check[language][0])); });
        details.append(list); panel.append(details, element("p", c.record), assessmentLinks());
      }
      heading.tabIndex = -1;
      host.append(panel);
      var controls = element("div", null, "guide-controls");
      if (state.step > 0) controls.append(button(c.back, "back", "guide-text-button"));
      if (state.step > 0 || state.paused) controls.append(button(c.restart, "restart", "guide-text-button"));
      host.append(controls);
      var notes = element("div", null, "guide-notes");
      notes.append(element("p", c.note), element("p", c.privacy));
      var source = element("div", null, "guide-source");
      var publication = element("a", c.publication); publication.href = publicationUrl;
      publication.target = "_blank"; publication.rel = "noopener noreferrer";
      source.append(element("p", c.source), publication); notes.append(source);
      host.append(notes);
      if (focus) heading.focus();
    }
    document.addEventListener("civiclanguagechange", function () { render(false); });
    render(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}(typeof window !== "undefined" ? window : globalThis));
