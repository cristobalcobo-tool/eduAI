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
  function initial() { return { step: 0, answers: [], paused: null }; }
  function transition(state, action) {
    if (action === "restart") return initial();
    if (action === "back" && state.step > 0) return { step: state.step - 1, answers: state.answers.slice(0, state.step - 1), paused: null };
    if (action === "recheck" && state.paused) return { step: state.step, answers: state.answers.slice(), paused: null };
    if (state.step >= checks.length || state.paused) return state;
    if (action === "yes") return { step: state.step + 1, answers: state.answers.concat("yes"), paused: null };
    if (action === "no" || action === "unsure") return { step: state.step, answers: state.answers.slice(), paused: action };
    return state;
  }
  var flow = { checks: checks, initial: initial, transition: transition };
  if (typeof module !== "undefined" && module.exports) module.exports = flow;
  if (!root.document) return;
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
      source: "Decision sequence adapted from Livingstone et al. (2026), Is there a right age for AI in education? Deciding whether AI is age-appropriate and why, UNESCO, figure 1, page 13."
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
      source: "Secuencia de decisiones adaptada de Livingstone et al. (2026), Is there a right age for AI in education? Deciding whether AI is age-appropriate and why, UNESCO, figura 1, página 13."
    }
  };
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
      var progressRow = element("div", null, "guide-progress");
      var count = element("span", state.step < 9 ? c.step + " " + (state.step + 1) + " " + c.of + " 9" : "9 " + c.of + " 9");
      progressRow.append(count, element("span", state.answers.length + " / 9 " + c.confirmed));
      var progress = element("progress");
      progress.max = 9; progress.value = state.answers.length;
      progress.setAttribute("aria-label", state.answers.length + " / 9 " + c.confirmed);
      host.append(progressRow, progress);
      var panel = element("section", null, "guide-card" + (state.paused ? " is-paused" : ""));
      var heading;
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
        panel.append(heading, element("p", check[1], "guide-context"));
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
          answers.append(button(c.yes, "yes", "guide-primary"), button(c.no, "no", "guide-secondary"), button(c.unsure, "unsure", "guide-secondary"));
          panel.append(answers);
        }
      } else {
        heading = element("h2", c.complete);
        panel.append(heading, element("p", c.completeNote), element("h3", c.review), element("p", c.ongoing), element("p", c.repeat));
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
      notes.append(element("p", c.note), element("p", c.privacy), element("p", c.source, "guide-source"));
      host.append(notes);
      if (focus) heading.focus();
    }
    document.addEventListener("civiclanguagechange", function () { render(false); });
    render(false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
}(typeof window !== "undefined" ? window : globalThis));
