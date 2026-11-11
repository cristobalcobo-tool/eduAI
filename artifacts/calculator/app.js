/* ============ Fuentes en vivo de EvidencIA: cómo la respuesta se vuelve filas ============ */

const tablaEvidencia = ({ answer }) => {
  const texto = (a) => {
    if (typeof a === 'string') return a;
    if (Array.isArray(a)) return a.map(texto).join('\n');
    if (a && typeof a === 'object') return typeof a.text === 'string' ? a.text : Object.values(a).map(texto).join('\n');
    return '';
  };
  const t = texto(answer);
  const lineas = t.split('\n').filter((l) => l.startsWith('| ['));
  if (!lineas.length) throw new Error(t.slice(0, 400) || 'EvidencIA no devolvió la tabla comparativa');
  const num = (s) => { const m = String(s).replace('−', '-').match(/^[+-]?\d+(?:\.\d+)?/); return m ? Number(m[0]) : null; };
  const rows = lineas.map((l) => {
    const c = l.replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '').split(' | ').map((x) => x.trim());
    const enlace = c[0].match(/\[([^\]]+)\]\(([^)]+)\)/) || [];
    const id = (c[0].match(/id: ([^;)]+)/) || [])[1] || '';
    const n = (c[0].match(/n = ([\d.,]+)/) || [])[1];
    const ic = (c[1] || '').match(/\[(-?[\d.]+); (-?[\d.]+)\]/);
    const costo = /^\d+(\.\d+)?$/.test(c[6] || '') ? Number(c[6]) : null;
    const por = (c[7] || '').match(/^(\d+(?:\.\d+)?)(?: \((.+)\))?$/);
    return {
      id: id.trim(), estudio: enlace[1] || c[0], enlace: enlace[2] || '',
      n: n ? Number(n.replace(/[.,]/g, '')) : null,
      noGenerativa: /no IA generativa|not generative AI/.test(c[0]),
      efecto: num(c[1]), icInf: ic ? Number(ic[1]) : null, icSup: ic ? Number(ic[2]) : null,
      efectoTexto: c[1] || '', queMidio: c[2] || '', nivel: num(c[3]), nivelTexto: c[3] || '',
      fuenteEfecto: c[4] || '', medicion: c[5] || '', costo, costoTexto: c[6] || '',
      dePor100: por ? Number(por[1]) : null, basePor100: por && por[2] ? por[2] : '',
      independencia: c[8] || '', riesgoAlto: c[9] || '',
    };
  });
  return { rows, columns: ['id', 'estudio', 'enlace', 'n', 'noGenerativa', 'efecto', 'icInf', 'icSup', 'efectoTexto', 'queMidio', 'nivel', 'nivelTexto', 'fuenteEfecto', 'medicion', 'costo', 'costoTexto', 'dePor100', 'basePor100', 'independencia', 'riesgoAlto'] };
};
dash.loader('evidencia_es', { description: 'Lee la tabla Markdown de compare_studies y devuelve una fila por estudio, sin cambiar cifras.', fn: tablaEvidencia });
dash.loader('evidencia_en', { description: 'Reads the compare_studies Markdown table and returns one row per study, without changing any figure.', fn: tablaEvidencia });

const lineasPanorama = ({ answer }) => {
  const texto = (a) => {
    if (typeof a === 'string') return a;
    if (Array.isArray(a)) return a.map(texto).join('\n');
    if (a && typeof a === 'object') return typeof a.text === 'string' ? a.text : Object.values(a).map(texto).join('\n');
    return '';
  };
  const t = texto(answer);
  const corte = t.search(/\n(Para escribir la respuesta|Writing the answer)/);
  const cuerpo = (corte > 0 ? t.slice(0, corte) : t).split('\n').map((l) => l.trim()).filter((l) => l && !/^\((Answer|EvidencIA notes)/.test(l));
  if (!cuerpo.length) throw new Error(t.slice(0, 300) || 'EvidencIA no devolvió el panorama');
  return { rows: cuerpo.map((linea, i) => ({ orden: i + 1, linea })), columns: ['orden', 'linea'] };
};
dash.loader('panorama_es', { description: 'Divide en líneas el texto de evidence_overview, sin las notas de redacción del final.', fn: lineasPanorama });
dash.loader('panorama_en', { description: 'Splits the evidence_overview text into lines, dropping the writing notes at the end.', fn: lineasPanorama });

/* ===================== Cálculos declarados ===================== */

dash.calc('resumen', {
  inputs: ['estudios', 'resultados'],
  title: 'Resumen de disponibilidad de evidencia (lote 1)',
  description: 'Conteos de estudios por verificación y por disponibilidad de efecto en DE y de costo por estudiante.',
  fn: (estudios, resultados) => {
    const individuales = estudios.filter((e) => !String(e.nivelEvidencia).startsWith('Nivel 3'));
    const conDE = new Set(resultados.filter((r) => r.unidad === 'DE').map((r) => r.estudio));
    const conCosto = individuales.filter((e) => typeof e.costoPorEstudiante === 'number');
    return [{
      nEstudios: estudios.length, nIndividuales: individuales.length, nSintesis: estudios.length - individuales.length,
      nVerificados: estudios.filter((e) => e.verificacion === 'Verificado').length,
      nProvisionales: estudios.filter((e) => e.verificacion === 'Provisional').length,
      nConDE: individuales.filter((e) => conDE.has(e.id)).length, nConCosto: conCosto.length,
      nAmbos: conCosto.filter((e) => conDE.has(e.id)).length,
    }];
  },
});

dash.calc('efectosIC', {
  inputs: ['resultados', 'estudios'],
  title: 'Efectos en DE con intervalo al 95% (lote 1)',
  description: 'Resultados en desviaciones estándar; intervalo = efecto ± 1,96 × EE cuando el estudio reporta el error estándar.',
  fn: (resultados, estudios) => {
    const porId = new Map(estudios.map((e) => [e.id, e]));
    return resultados.filter((r) => r.unidad === 'DE' || r.unidad === 'DE (agrupado)').map((r) => {
      const e = porId.get(r.estudio) || {};
      const tieneEE = typeof r.ee === 'number';
      return {
        id: r.id, estudio: r.estudio, etiqueta: String(e.autores || '').split(',')[0] + ' (' + e.anio + ')',
        efecto: r.efecto, ee: tieneEE ? r.ee : null,
        icInf: tieneEE ? Math.round((r.efecto - 1.96 * r.ee) * 1000) / 1000 : null,
        icSup: tieneEE ? Math.round((r.efecto + 1.96 * r.ee) * 1000) / 1000 : null,
        agrupado: r.unidad === 'DE (agrupado)', verificacion: r.verificacion,
        costoPorEstudiante: typeof e.costoPorEstudiante === 'number' ? e.costoPorEstudiante : null,
      };
    });
  },
});

dash.calc('cobertura', {
  inputs: ['estudios'],
  title: 'Estudios individuales por país (lote 1)',
  description: 'Número de estudios de nivel 1 o 2 por país.',
  fn: (estudios) => {
    const m = new Map();
    estudios.filter((e) => !String(e.nivelEvidencia).startsWith('Nivel 3')).forEach((e) => m.set(e.pais, (m.get(e.pais) || 0) + 1));
    return Array.from(m, ([pais, n]) => ({ pais, n })).sort((a, b) => b.n - a.n);
  },
});

dash.calc('mapeo', {
  inputs: ['estudios'],
  title: 'Mapeo entre EvidencIA y Stanford SCALE',
  description: 'Un registro canónico por estudio con su presencia en cada fuente (códigos).',
  fn: (estudios) => estudios.map((e) => {
    const ev = String(e.enEvidencia || ''), sc = String(e.enScale || '');
    const evidencia = ev.startsWith('Sí') ? 'confirmado' : 'no_verificado';
    const scale = sc.startsWith('Incluido') ? 'revision' : sc.startsWith('Solo en el repositorio') ? 'repositorio' : 'no_verificado';
    const categoria = evidencia === 'confirmado' ? (scale === 'revision' ? 'ambas_revision' : scale === 'repositorio' ? 'evidencia_repo' : 'solo_evidencia') : (scale === 'revision' ? 'solo_scale' : 'sin_confirmar');
    return { id: e.id, estudio: String(e.autores).split(',')[0] + ' (' + e.anio + ')', evidencia, scale, categoria };
  }),
});

dash.calc('brechas', {
  inputs: ['estudios', 'resultados'],
  title: 'Brechas de investigación en el lote 1',
  description: 'Conteo de estudios individuales que presentan cada brecha (por código).',
  fn: (estudios, resultados) => {
    const ind = estudios.filter((e) => !String(e.nivelEvidencia).startsWith('Nivel 3'));
    const N = ind.length;
    const res = (id) => resultados.filter((r) => r.estudio === id);
    const lista = (arr) => arr.map((e) => String(e.autores).split(',')[0] + ' ' + e.anio).join('; ');
    const g = (clave, arr) => ({ clave, nEstudios: arr.length, nBase: N, lista: lista(arr) });
    return [
      g('sinCosto', ind.filter((e) => typeof e.costoPorEstudiante !== 'number')),
      g('sinDiferido', ind.filter((e) => !res(e.id).some((r) => r.diferido === 'Sí'))),
      g('sinIndep', ind.filter((e) => !res(e.id).some((r) => String(r.sinIA).startsWith('Sí')))),
      g('sinDE', ind.filter((e) => !res(e.id).some((r) => r.unidad === 'DE'))),
      g('compActiva', ind.filter((e) => e.tipoComparacion === 'Otra intervención sin IA')),
      g('latam', ind.filter((e) => e.region === 'América Latina y el Caribe')),
      g('primaria', ind.filter((e) => /Primaria/.test(e.nivelEducativo))),
      g('provisional', ind.filter((e) => e.verificacion !== 'Verificado')),
    ];
  },
});

/* ===================== Idioma ===================== */

let L = 'es';
const SUF = { es: '', en: 'En', pt: 'Pt' };
const tr = (row, f) => (row ? (row[f + SUF[L]] ?? row[f] ?? '') : '');
const D = {
  todos: ['Todos', 'All', 'Todos'], todas: ['Todas', 'All', 'Todas'],
  fuenteEv: ['EvidencIA (confirmado)', 'EvidencIA (confirmed)', 'EvidencIA (confirmado)'],
  fuenteRev: ['SCALE, revisión causal', 'SCALE, causal review', 'SCALE, revisão causal'],
  fuenteRepo: ['SCALE, solo repositorio', 'SCALE, repository only', 'SCALE, só repositório'],
  conCosto: ['Con costo reportado', 'With reported cost', 'Com custo reportado'], sinCosto: ['Sin costo reportado', 'No reported cost', 'Sem custo reportado'],
  deTotal: [(n, t) => n + ' de ' + t + ' registros', (n, t) => n + ' of ' + t + ' records', (n, t) => n + ' de ' + t + ' registros'],
  faltante: ['Faltante', 'Missing', 'Ausente'], fuente: ['Fuente', 'Source', 'Fonte'], abrir: ['Abrir publicación', 'Open publication', 'Abrir publicação'],
  sinIC: ['sin IC', 'no CI', 'sem IC'], noRep: ['No reportado', 'Not reported', 'Não reportado'], noAplica: ['no aplica', 'not applicable', 'não se aplica'],
  DE: ['DE', 'SD', 'DP'], failed: ['No se pudo cargar', 'Could not load', 'Não foi possível carregar'],
  campos: [['Diseño', 'Muestra', 'País y región', 'Nivel y población', 'Intervención', 'Taxonomía', 'Comparación', 'Costo', 'En EvidencIA', 'En Stanford SCALE', 'Limitaciones', 'Extracción'],
    ['Design', 'Sample', 'Country and region', 'Level and population', 'Intervention', 'Taxonomy', 'Comparison', 'Cost', 'In EvidencIA', 'In Stanford SCALE', 'Limitations', 'Extraction'],
    ['Desenho', 'Amostra', 'País e região', 'Nível e população', 'Intervenção', 'Taxonomia', 'Comparação', 'Custo', 'Na EvidencIA', 'No Stanford SCALE', 'Limitações', 'Extração']],
  colsRes: [['Resultado', 'Materia', 'Efecto', 'Unidad', 'EE', 'Seguimiento', 'Sin IA', 'Significancia', 'Ubicación'],
    ['Outcome', 'Subject', 'Effect', 'Unit', 'SE', 'Follow up', 'Without AI', 'Significance', 'Location'],
    ['Resultado', 'Disciplina', 'Efeito', 'Unidade', 'EP', 'Acompanhamento', 'Sem IA', 'Significância', 'Localização']],
  resAprend: ['Resultados de aprendizaje', 'Learning outcomes', 'Resultados de aprendizagem'],
  usuario: ['usuario', 'user', 'usuário'], porEst: ['por estudiante', 'per student', 'por estudante'], fuenteCosto: ['Fuente', 'Source', 'Fonte'], anioPrecios: ['Año de precios', 'Price year', 'Ano dos preços'],
  nRes: [(n) => 'n = ' + n + ' resultados', (n) => 'n = ' + n + ' outcomes', (n) => 'n = ' + n + ' resultados'],
  efecto: ['Efecto', 'Effect', 'Efeito'], ic: ['IC 95%', '95% CI', 'IC 95%'], sinEE: ['Sin error estándar reportado', 'No standard error reported', 'Sem erro padrão reportado'],
  tipo_ia_generativa: ['IA generativa', 'Generative AI', 'IA generativa'], tipo_ia_docentes: ['IA para docentes', 'AI for teachers', 'IA para professores'],
  tipo_ia_adaptativa: ['IA adaptativa, no generativa', 'Adaptive AI, not generative', 'IA adaptativa, não generativa'],
  tipo_sin_ia: ['Sin IA generativa: apoyo humano', 'No generative AI: human support', 'Sem IA generativa: apoio humano'],
  tipo_tutoria: ['Tutoría humana con software adaptativo', 'Human tutoring with adaptive software', 'Tutoria humana com software adaptativo'],
  tipo_sintesis: ['Promedio de una síntesis', 'Synthesis average', 'Média de uma síntese'], tipo_hipotetica: ['Supuesto hipotético', 'Hypothetical assumption', 'Suposição hipotética'],
  sintesis: ['Promedio de 14 ensayos (Burneo et al., 2026)', 'Average of 14 trials (Burneo et al., 2026)', 'Média de 14 ensaios (Burneo et al., 2026)'],
  hipotetica: ['Alternativa hipotética', 'Hypothetical alternative', 'Alternativa hipotética'],
  sinCostoCorto: ['costo no reportado', 'cost not reported', 'custo não reportado'],
  delEstudio: ['Valor del estudio', 'Study value', 'Valor do estudo'], tuSupuesto: ['Tu supuesto', 'Your assumption', 'Sua suposição'],
  hipot: ['Supuesto hipotético', 'Hypothetical assumption', 'Suposição hipotética'], volver: ['volver al valor del estudio', 'back to the study value', 'voltar ao valor do estudo'],
  sinCostoSup: ['El estudio no reporta costo: el control muestra un supuesto tuyo.', 'The study reports no cost: the slider shows your own assumption.', 'O estudo não reporta custo: o controle mostra uma suposição sua.'],
  cargando: ['Cargando datos de EvidencIA…', 'Loading EvidencIA data…', 'Carregando dados da EvidencIA…'],
  midio: ['Qué midió', 'What it measured', 'O que mediu'], nivelEv: ['Nivel EvidencIA', 'EvidencIA level', 'Nível EvidencIA'], baseCosto: ['Base del costo', 'Cost basis', 'Base do custo'],
  verFicha: ['Ver estudio', 'Open study', 'Ver estudo'], textoConector: ['(texto del conector en español)', '', '(texto do conector em espanhol)'],
  por100: ['DE por USD 100', 'SD per USD 100', 'DP por USD 100'], hoy: ['hoy', 'now', 'hoje'], maximo: ['máximo para competir', 'maximum to compete', 'máximo para competir'],
  zonaComp: ['zona en que A rinde igual o más que B', 'zone where A does as well as or better than B', 'zona em que A rende igual ou mais que B'],
  estudiantes: ['estudiantes', 'students', 'estudantes'],
  ojoT: ['Antes de sacar conclusiones', 'Before drawing conclusions', 'Antes de tirar conclusões'],
  ojoMidio: [(a, b) => 'Miden cosas distintas. A: ' + a + '. B: ' + b + '. La misma DE no es la misma ganancia.', (a, b) => 'They measure different things. A: ' + a + '. B: ' + b + '. The same SD is not the same gain.', (a, b) => 'Medem coisas diferentes. A: ' + a + '. B: ' + b + '. O mesmo DP não é o mesmo ganho.'],
  ojoBase: [(a, b) => 'Los costos tienen bases distintas. A: ' + a + '. B: ' + b + '.', (a, b) => 'The costs have different bases. A: ' + a + '. B: ' + b + '.', (a, b) => 'Os custos têm bases diferentes. A: ' + a + '. B: ' + b + '.'],
  ojoRiesgo: [(n, r) => n + ': riesgo de sesgo alto en ' + r + '.', (n, r) => n + ': high risk of bias in ' + r + '.', (n, r) => n + ': risco de viés alto em ' + r + '.'],
  ojoNoGen: [(n) => n + ' no usa IA generativa.', (n) => n + ' does not use generative AI.', (n) => n + ' não usa IA generativa.'],
  ojoSup: ['Hay valores que son supuestos, no datos de un estudio.', 'Some values are assumptions, not study data.', 'Há valores que são suposições, não dados de um estudo.'],
  ojoSint: ['El promedio de una síntesis no es el efecto de un programa concreto.', 'A synthesis average is not the effect of a specific program.', 'A média de uma síntese não é o efeito de um programa específico.'],
  ojoNeg: ['Con una ganancia nula o negativa, dividir efecto por costo no ordena bien las opciones: compara los efectos directamente.', 'With a zero or negative gain, dividing effect by cost does not rank options sensibly: compare the effects directly.', 'Com ganho nulo ou negativo, dividir efeito por custo não ordena bem as opções: compare os efeitos diretamente.'],
  ojoContexto: ['Son estudios de países, edades y duraciones distintas. Que una opción rinda más por dólar allí no garantiza lo mismo en tu contexto.', 'These studies come from different countries, ages and durations. An option doing better per dollar there does not guarantee the same in your context.', 'São estudos de países, idades e durações diferentes. Uma opção render mais por dólar lá não garante o mesmo no seu contexto.'],
  verdNoInterp: ['Con estos valores el cociente no se interpreta. Ajusta las ganancias a valores positivos para comparar costo efectividad.', 'With these values the ratio cannot be interpreted. Set positive gains to compare cost effectiveness.', 'Com estes valores a razão não se interpreta. Ajuste os ganhos para valores positivos para comparar custo efetividade.'],
  verd: [
    (a, b, ea, eb, mejor, veces, th, ca) => [['Por cada USD 100, ', null], [a, 'b'], [' produce ', null], [ea, 'b'], [' DE y ', null], [b, 'b'], [' produce ', null], [eb, 'b'], [' DE. ', null], [mejor === 'a' ? 'A' : 'B', 'b'], [' compra ' + veces + ' veces más aprendizaje por dólar. ', null], ...(th ? [['Para igualar a B, A tendría que costar como máximo ', null], [th, 'b'], [' por estudiante (hoy: ' + ca + ').', null]] : [])],
    (a, b, ea, eb, mejor, veces, th, ca) => [['For every USD 100, ', null], [a, 'b'], [' produces ', null], [ea, 'b'], [' SD and ', null], [b, 'b'], [' produces ', null], [eb, 'b'], [' SD. ', null], [mejor === 'a' ? 'A' : 'B', 'b'], [' buys ' + veces + ' times more learning per dollar. ', null], ...(th ? [['To match B, A would have to cost at most ', null], [th, 'b'], [' per student (now: ' + ca + ').', null]] : [])],
    (a, b, ea, eb, mejor, veces, th, ca) => [['A cada USD 100, ', null], [a, 'b'], [' produz ', null], [ea, 'b'], [' DP e ', null], [b, 'b'], [' produz ', null], [eb, 'b'], [' DP. ', null], [mejor === 'a' ? 'A' : 'B', 'b'], [' compra ' + veces + ' vezes mais aprendizado por dólar. ', null], ...(th ? [['Para igualar B, A teria de custar no máximo ', null], [th, 'b'], [' por estudante (hoje: ' + ca + ').', null]] : [])],
  ],
  escA: ['Escenario ilustrativo (ganancia de síntesis y costo hipotético)', 'Illustrative scenario (synthesis gain and hypothetical cost)', 'Cenário ilustrativo (ganho de síntese e custo hipotético)'],
  escB: ['Escenario ilustrativo (valores hipotéticos)', 'Illustrative scenario (hypothetical values)', 'Cenário ilustrativo (valores hipotéticos)'],
  usuarioB: ['Valores definidos por mí (supuestos)', 'Values I define (assumptions)', 'Valores definidos por mim (suposições)'],
  grpLote: ['Lote 1 (publicaciones originales)', 'Batch 1 (original publications)', 'Lote 1 (publicações originais)'], grpEv: ['EvidencIA (copia del 11 nov 2026)', 'EvidencIA (copy of 11 Nov 2026)', 'EvidencIA (cópia de 11 nov 2026)'],
  st_Verificado: ['Extraído y verificado', 'Extracted and verified', 'Extraído e verificado'], st_Provisional: ['Extraído, provisional', 'Extracted, provisional', 'Extraído, provisório'],
  st_EvidencIA: ['EvidencIA (núcleo verificado)', 'EvidencIA (verified core)', 'EvidencIA (núcleo verificado)'],
  st_IlusGain: ['Síntesis (agrupado), ilustrativo', 'Synthesis (pooled), illustrative', 'Síntese (agrupado), ilustrativo'], st_Ilus: ['Hipotético, ilustrativo', 'Hypothetical, illustrative', 'Hipotético, ilustrativo'],
  st_Usuario: ['Supuesto del usuario', 'User assumption', 'Suposição do usuário'], st_Faltante: ['Faltante: ingresa un supuesto explícito', 'Missing: enter an explicit assumption', 'Ausente: insira uma suposição explícita'],
  tg_incompleto: ['incompleto', 'incomplete', 'incompleto'], tg_ilustrativo: ['ilustrativo', 'illustrative', 'ilustrativo'], tg_supuestos: ['escenario con supuestos', 'scenario with assumptions', 'cenário com suposições'],
  tg_provisional: ['empírico provisional', 'empirical, provisional', 'empírico provisório'], tg_verificado: ['empírico verificado', 'empirical, verified', 'empírico verificado'],
  noInterp: ['No interpretable', 'Not interpretable', 'Não interpretável'], noDef: ['No definido', 'Not defined', 'Não definido'], si: ['Sí', 'Yes', 'Sim'], no: ['No', 'No', 'Não'],
  fGainA: ['Falta la ganancia de la IA.', 'The AI gain is missing.', 'Falta o ganho da IA.'], fCostA: ['Falta el costo de la IA: el estudio no lo reporta. Ingresa un supuesto explícito.', 'The AI cost is missing: the study does not report it. Enter an explicit assumption.', 'Falta o custo da IA: o estudo não o reporta. Insira uma suposição explícita.'],
  fGainB: ['Falta la ganancia del comparador.', 'The comparator gain is missing.', 'Falta o ganho do comparador.'], fCostB: ['Falta el costo del comparador: ingresa un supuesto explícito.', 'The comparator cost is missing: enter an explicit assumption.', 'Falta o custo do comparador: insira uma suposição explícita.'],
  costoCero: ['Los costos deben ser mayores que cero.', 'Costs must be greater than zero.', 'Os custos devem ser maiores que zero.'],
  ilusNota: ['Resultado ilustrativo: combina una estimación agrupada con supuestos hipotéticos. No es una conclusión empírica.', 'Illustrative result: it combines a pooled estimate with hypothetical assumptions. It is not an empirical conclusion.', 'Resultado ilustrativo: combina uma estimativa agrupada com suposições hipotéticas. Não é uma conclusão empírica.'],
  completa: ['Completa los cuatro valores con costos mayores que cero para ver el gráfico.', 'Fill in all four values with costs above zero to see the chart.', 'Preencha os quatro valores com custos maiores que zero para ver o gráfico.'],
  iaA: ['IA (A)', 'AI (A)', 'IA (A)'], compB: ['Comparador (B)', 'Comparator (B)', 'Comparador (B)'],
  ejeCosto: ['Costo de la IA por estudiante (USD)', 'AI cost per student (USD)', 'Custo da IA por estudante (USD)'], ejeCostoC: ['Costo por estudiante (USD)', 'Cost per student (USD)', 'Custo por estudante (USD)'],
  ejeGan: ['Ganancia (DE)', 'Gain (SD)', 'Ganho (DP)'], equilibrio: ['Equilibrio', 'Break even', 'Equilíbrio'], costoActual: ['Costo actual', 'Current cost', 'Custo atual'],
  ganComp: ['Ganancia del comparador (DE)', 'Comparator gain (SD)', 'Ganho do comparador (DP)'], ganIA: ['Ganancia IA (DE)', 'AI gain (SD)', 'Ganho IA (DP)'],
  sinIntervalo: ['La ganancia seleccionada no tiene intervalo reportado (o es un supuesto): no hay intervalo estadístico.', 'The selected gain has no reported interval (or is an assumption): no statistical interval.', 'O ganho selecionado não tem intervalo reportado (ou é uma suposição): não há intervalo estatístico.'],
  eGan: ['Ganancia IA (IC 95%)', 'AI gain (95% CI)', 'Ganho IA (IC 95%)'], eTh: ['Costo máximo competitivo según IC', 'Maximum competitive cost by CI', 'Custo máximo competitivo segundo IC'],
  eCosto: [(p) => 'DE por USD 100 de la IA con costo ± ' + p + '%', (p) => 'AI SD per USD 100 with cost ± ' + p + '%', (p) => 'DP por USD 100 da IA com custo ± ' + p + '%'],
  esc: ['escenario, no estadístico', 'scenario, not statistical', 'cenário, não estatístico'], est: ['estadístico', 'statistical', 'estatístico'],
  bajo: ['Bajo', 'Low', 'Baixo'], central: ['central', 'central', 'central'], alto: ['alto', 'high', 'alto'],
  tn: [['Ganancia IA', 'Costo IA', 'Ganancia comparador', 'Costo comparador'], ['AI gain', 'AI cost', 'Comparator gain', 'Comparator cost'], ['Ganho IA', 'Custo IA', 'Ganho comparador', 'Custo comparador']],
  base: ['Base', 'Base', 'Base'],
  costosFijos: ['costos fijos', 'fixed costs', 'custos fixos'], costosVar: ['costos variables', 'variable costs', 'custos variáveis'], costoTot: ['costo total proyectado', 'projected total cost', 'custo total projetado'], costoPE: ['costo por estudiante proyectado', 'projected cost per student', 'custo por estudante projetado'],
  presCols: [['Opción', 'Estudiantes atendidos', 'Gasto total', 'Presupuesto restante', 'Cobertura', 'DE por USD 100'], ['Option', 'Students served', 'Total spend', 'Remaining budget', 'Coverage', 'SD per USD 100'], ['Opção', 'Estudantes atendidos', 'Gasto total', 'Orçamento restante', 'Cobertura', 'DP por USD 100']],
  presIA: ['IA', 'AI', 'IA'], presComp: ['Comparador', 'Comparator', 'Comparador'], presFalta: ['Ingresa costo mayor que cero, presupuesto y población.', 'Enter a cost above zero, a budget and a population.', 'Insira custo maior que zero, orçamento e população.'],
  presUmbral: ['Costo máximo competitivo de la IA frente al comparador: ', 'Maximum competitive AI cost versus the comparator: ', 'Custo máximo competitivo da IA frente ao comparador: '], presSup: ['. Todos los valores son supuestos del usuario.', '. All values are user assumptions.', '. Todos os valores são suposições do usuário.'],
  br_sinCosto: ['Sin costo por estudiante reportado', 'No reported cost per student', 'Sem custo por estudante reportado'],
  br_sinDiferido: ['Sin resultado medido después de terminar el acceso', 'No outcome measured after access ended', 'Sem resultado medido depois do fim do acesso'],
  br_sinIndep: ['Sin prueba declarada como tomada sin IA', 'No test declared as taken without AI', 'Sem teste declarado como feito sem IA'],
  br_sinDE: ['Sin efecto en desviaciones estándar', 'No effect in standard deviations', 'Sem efeito em desvios padrão'],
  br_compActiva: ['Comparan IA contra otra intervención activa sin IA (la comparación más útil para invertir)', 'Compare AI against another active non AI intervention (the most useful comparison for investment)', 'Comparam IA com outra intervenção ativa sem IA (a comparação mais útil para investir)'],
  br_latam: ['Evaluaciones en América Latina y el Caribe en el lote (EvidencIA tiene 17 en su núcleo verificado)', 'Evaluations in Latin America and the Caribbean in the batch (EvidencIA has 17 in its verified core)', 'Avaliações na América Latina e Caribe no lote (a EvidencIA tem 17 no núcleo verificado)'],
  br_primaria: ['Estudios que incluyen educación primaria', 'Studies that include primary education', 'Estudos que incluem os anos iniciais do fundamental'],
  br_provisional: ['Registros aún provisionales', 'Records still provisional', 'Registros ainda provisórios'],
  ev_confirmado: ['Confirmado', 'Confirmed', 'Confirmado'], ev_no_verificado: ['No verificado', 'Not verified', 'Não verificado'],
  sc_revision: ['En revisión causal', 'In causal review', 'Em revisão causal'], sc_repositorio: ['Solo repositorio', 'Repository only', 'Só repositório'], sc_no_verificado: ['No verificado', 'Not verified', 'Não verificado'],
  cat_ambas_revision: ['En ambas fuentes (revisión SCALE)', 'In both sources (SCALE review)', 'Em ambas as fontes (revisão SCALE)'],
  cat_evidencia_repo: ['EvidencIA y repositorio SCALE', 'EvidencIA and SCALE repository', 'EvidencIA e repositório SCALE'],
  cat_solo_evidencia: ['Solo EvidencIA', 'EvidencIA only', 'Só EvidencIA'], cat_solo_scale: ['Solo SCALE', 'SCALE only', 'Só SCALE'], cat_sin_confirmar: ['Sin confirmar', 'Unconfirmed', 'Sem confirmar'],
  totalSinDup: ['Total sin duplicar', 'Total without duplicates', 'Total sem duplicar'],
  cercaT: [(l) => 'Estudios con resultados parecidos: ' + l, (l) => 'Studies with similar results: ' + l, (l) => 'Estudos com resultados parecidos: ' + l],
  cercaNada: ['Ningún estudio de la lista tiene valores parecidos: estos valores no tienen respaldo en la evidencia del simulador.', 'No study in the list has similar values: these values are not backed by the simulator\'s evidence.', 'Nenhum estudo da lista tem valores parecidos: estes valores não têm respaldo na evidência do simulador.'],
  cercaRegla: ['(±0,06 DE y costo entre la mitad y el doble)', '(±0.06 SD and cost between half and double)', '(±0,06 DP e custo entre a metade e o dobro)'],
  cercaTag: ['cerca', 'close', 'perto'],
  pct: [(n) => '≈ del puesto 50 al ' + n + ' de 100*', (n) => '≈ from rank 50 to ' + n + ' out of 100*', (n) => '≈ da posição 50 à ' + n + ' de 100*'],
  sinCostoCol: ['sin costo', 'no cost', 'sem custo'], ejeMapaX: ['Costo por estudiante (USD, escala logarítmica)', 'Cost per student (USD, log scale)', 'Custo por estudante (USD, escala logarítmica)'],
  isoB: ['igual rendimiento por dólar que B', 'same learning per dollar as B', 'mesmo rendimento por dólar que B'],
  zonaMejor: ['más aprendizaje por dólar que B', 'more learning per dollar than B', 'mais aprendizado por dólar que B'],
  clicA: ['Clic: usar como A', 'Click: use as A', 'Clique: usar como A'],
  expA: [['ECA', 'ECA (ensayo controlado aleatorizado)'], ['RCT', 'RCT (randomized controlled trial)'], ['ECR', 'ECR (ensaio controlado randomizado)']],
  cl_dosis: ['Intensidad y uso real', 'Intensity and actual use', 'Intensidade e uso real'],
  cl_personas: ['Docentes, apoyo e infraestructura', 'Teachers, support and infrastructure', 'Professores, apoio e infraestrutura'],
  cl_clave: ['Qué explica el resultado', 'What explains the result', 'O que explica o resultado'],
  cl_sup: ['es un promedio o un supuesto: no tiene contexto de implementación.', 'is an average or an assumption: it has no implementation context.', 'é uma média ou uma suposição: não tem contexto de implementação.'],
  cl_fuente: ['Resumido de las fichas de EvidencIA de cada estudio. Sirve para ver si las condiciones se parecen a las tuyas.', 'Summarized from each study\'s EvidencIA record. Use it to judge whether the conditions resemble yours.', 'Resumido das fichas da EvidencIA de cada estudo. Serve para ver se as condições se parecem com as suas.'],
  resumen: [(g, v, a, b) => g + ' compra ' + v + ' veces más aprendizaje por dólar (' + a + ' frente a ' + b + ' DE por USD 100). Pero el costo no lo es todo:', (g, v, a, b) => g + ' buys ' + v + ' times more learning per dollar (' + a + ' versus ' + b + ' SD per USD 100). But cost is not everything:', (g, v, a, b) => g + ' compra ' + v + ' vezes mais aprendizado por dólar (' + a + ' versus ' + b + ' DP por USD 100). Mas o custo não é tudo:'],
  resumenNo: ['Elige A y B para comparar.', 'Pick A and B to compare.', 'Escolha A e B para comparar.'],
  fCampos: [['Conector', 'Estado', 'Cobertura declarada', 'Consultada'], ['Connector', 'Status', 'Declared coverage', 'Consulted'], ['Conector', 'Status', 'Cobertura declarada', 'Consultada']],
};
const T = (k, ...a) => { const e = D[k]; if (!e) return k; const v = e[{ es: 0, en: 1, pt: 2 }[L]] ?? e[0]; return typeof v === 'function' ? v(...a) : v; };

let LOC = null;
const fmt = {};
function setLocale() {
  LOC = L === 'en' ? d3.formatLocale({ decimal: '.', thousands: ',', grouping: [3], currency: ['USD ', ''] }) : d3.formatLocale({ decimal: ',', thousands: '.', grouping: [3], currency: ['USD ', ''] });
  fmt.f3 = LOC.format(',.3f'); fmt.f2 = LOC.format(',.2f'); fmt.f0 = LOC.format(',.0f'); fmt.g = LOC.format(','); fmt.pct = LOC.format('.1%');
}
const f3 = (v) => fmt.f3(v), f2 = (v) => fmt.f2(v), f0 = (v) => fmt.f0(v);
const usd = (v) => 'USD ' + (Math.abs(v) < 10 ? fmt.f2(v) : fmt.f0(v));
const usd2 = (v) => 'USD ' + fmt.f2(v);

const DRAWS = [];
const reg = (name, fn) => { if (!DRAWS.includes(name)) DRAWS.push(name); dash.draw(name, fn); };
const redibujarTodo = () => DRAWS.forEach((n) => dash.draw(n));

function setLang(l) {
  L = ['es', 'en', 'pt'].includes(l) ? l : 'es';
  setLocale();
  document.querySelectorAll('#lab').forEach((r) => { r.classList.remove('l-es', 'l-en', 'l-pt'); r.classList.add('l-' + L); });
  document.querySelectorAll('.lab-langs [data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === L)));
}
const nav = (navigator.language || 'es').slice(0, 2);
setLang(nav === 'pt' ? 'pt' : nav === 'en' ? 'en' : 'es');
document.querySelectorAll('.lab-langs [data-lang]').forEach((b) => b.addEventListener('click', () => { setLang(b.dataset.lang); redibujarTodo(); }));
const evId = () => (L === 'en' ? 'evidencia_en' : 'evidencia_es');
const panId = () => (L === 'en' ? 'panorama_en' : 'panorama_es');

/* ===================== Utilidades ===================== */

const AZUL = '#2a78d6', VERDE = '#2e8b57', LILA = '#8a6fd1';
const ok = (id) => dash.data(id).status === 'ok';
const rows = (id) => (ok(id) ? dash.data(id).data || [] : []);
const corto = (e) => String(e.autores || '').split(',')[0] + ' (' + e.anio + ')';
const el = (tag, attrs, text) => {
  const n = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => { if (v != null) n.setAttribute(k, v); });
  if (text != null) n.textContent = text;
  return n;
};
const pill = (cls, txt) => el('span', { class: 'lab-pill ' + cls }, txt);
const TIPO_COL = { ia_generativa: '#7b61c9', ia_docentes: '#c15b9a', ia_adaptativa: '#d08a1e', sin_ia: '#5f7a8f', tutoria: '#5f7a8f', sintesis: '#9a9a9a', hipotetica: '#9a9a9a' };
const TEC_COL = { 'IA generativa (LLM)': '#7b61c9', 'Adaptativa y con IA (agrupado)': '#9a9a9a' };
const tag = (txt, col) => { const t = el('span', { class: 'lab-tag' }, txt); t.style.setProperty('--tc', col || '#888'); return t; };
const phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const pillVer = (row) => pill(row.verificacion === 'Verificado' ? 'ver' : row.verificacion === 'Provisional' ? 'pro' : '', tr(row, 'verificacion'));
const failMsg = (box, st) => { box.replaceChildren(); box.textContent = st === 'error' ? T('failed') : st === 'loading' ? '' : '—'; };
function recortar(node, max) { let t = node.textContent; while (t.length > 8 && node.getComputedTextLength() > max) { t = t.slice(0, -2); node.textContent = t + '…'; } }
function tip(box) {
  let t = box.querySelector(':scope > .lab-tip');
  if (!t) { t = el('div', { class: 'lab-tip' }); t.hidden = true; box.appendChild(t); }
  return {
    show(evt, lines) {
      t.replaceChildren(...lines.filter(Boolean).map((l, i) => { const d = el('div', null, l); if (i === 0) d.style.fontWeight = '600'; return d; }));
      t.hidden = false;
      const r = box.getBoundingClientRect();
      const x = evt.clientX - r.left, y = evt.clientY - r.top, w = t.offsetWidth || 200;
      t.style.left = Math.max(0, Math.min(x + 12, box.clientWidth - w)) + 'px';
      t.style.top = Math.max(0, y - 10 - t.offsetHeight) + 'px';
    },
    hide() { t.hidden = true; },
  };
}
const axisFmt = (d) => (v) => LOC.format(d)(v);

/* ===================== Navegación ===================== */

function abrir(id) {
  const secs = document.querySelectorAll('.lab-section');
  if (!Array.from(secs).some((s) => s.id === id)) return;
  secs.forEach((s) => { s.hidden = s.id !== id; });
  document.querySelectorAll('.lab-tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
  dash.setLink(id);
}
document.querySelectorAll('.lab-tab').forEach((b) => b.addEventListener('click', () => abrir(b.dataset.tab)));
if (location.hash) abrir(location.hash.slice(1));

function verGlosario(key) {
  document.querySelectorAll('#glosario').forEach((d) => { d.open = true; });
  document.querySelectorAll('#glosario .g').forEach((g) => g.classList.toggle('on', g.id === 'g-' + key));
  const g = document.getElementById('g-' + key);
  if (g && g.scrollIntoView) g.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
document.querySelectorAll('.lab-q[data-glos]').forEach((b) => b.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); verGlosario(b.dataset.glos); }));
const GLOS_REGLAS = [[/ECA|RCT|ECR|aleatoriz/i, 'eca'], [/conglomerado|por escuela|por tutor|individual/i, 'conglomerados'], [/cruzado/i, 'cruzado'], [/factorial/i, 'factorial'], [/meta an[aá]lisis|RVE/i, 'meta'],
  [/agrupado/i, 'agrupado'], [/generativa/i, 'generativa'], [/adaptativa/i, 'adaptativa'], [/humano/i, 'humano'], [/guiada|andamiad|directa/i, 'guiada'], [/^Nivel/i, 'nivel'], [/^Verificado|^Provisional/i, 'verificacion']];
const glosDe = (v) => Array.from(new Set(GLOS_REGLAS.filter(([re]) => re.test(v)).map(([, k]) => k)));

reg('tNum', (box) => {
  const d = dash.data('resumen');
  box.textContent = d.status === 'ok' && d.data && d.data[0] ? f0(d.data[0][box.dataset.f]) : '—';
});

/* ===================== Portada: simulador ===================== */

const SIM = {
  a: { id: null, gain: NaN, cost: NaN, gSrc: '', cSrc: '' },
  b: { id: null, gain: NaN, cost: NaN, gSrc: '', cSrc: '' },
  budget: 100000, init: false,
};
const DEF = { a: 'khanmigo-tennessee-2026', b: 'khan-academy-uttar-pradesh-2026' };
const COSTO_MAX = 5000;
const pos2cost = (p) => Math.round(Math.exp((p / 1000) * Math.log(COSTO_MAX)) * 100) / 100;
const cost2pos = (c) => Math.round((Math.log(Math.max(1, c)) / Math.log(COSTO_MAX)) * 1000);

function opcionesSim() {
  const ev = new Map(rows(evId()).map((r) => [r.id, r]));
  const sel = rows('simulador').slice().sort((a, b) => a.orden - b.orden);
  const out = [];
  sel.forEach((s) => {
    const r = ev.get(s.id);
    if (!r || r.efecto == null) return;
    out.push({ id: s.id, nombre: tr(s, 'nombre'), corto: tr(s, 'corto'), tipo: s.tipo, gain: r.efecto, cost: r.costo, ev: r });
  });
  const esc = new Map(rows('escenario').map((r) => [r.parametro, r]));
  if (esc.get('aiGain')) out.push({ id: 'sintesis', nombre: T('sintesis'), corto: 'Burneo et al. 2026', tipo: 'sintesis', gain: Number(esc.get('aiGain').valor), cost: esc.get('aiCost') ? Number(esc.get('aiCost').valor) : null, costHip: true });
  if (esc.get('alternativeGain')) out.push({ id: 'hipotetica', nombre: T('hipotetica'), corto: T('hipotetica'), tipo: 'hipotetica', gain: Number(esc.get('alternativeGain').valor), cost: esc.get('alternativeCost') ? Number(esc.get('alternativeCost').valor) : null, costHip: true, gainHip: true });
  return out;
}
function setSlider(side, k, v) {
  document.querySelectorAll('#inicio input[data-side="' + side + '"][data-k="' + k + '"]').forEach((i) => { i.value = String(k === 'cost' ? cost2pos(v) : v); });
}
function elegir(side, id) {
  const o = opcionesSim().find((x) => x.id === id);
  if (!o) return;
  const s = SIM[side];
  s.id = id;
  s.gain = o.gain; s.gSrc = o.gainHip ? 'hip' : o.tipo === 'sintesis' ? 'sint' : 'estudio';
  if (typeof o.cost === 'number') { s.cost = o.cost; s.cSrc = o.costHip ? 'hip' : 'estudio'; }
  else { s.cost = Number.isFinite(s.cost) ? s.cost : 20; s.cSrc = 'usuario'; }
  setSlider(side, 'gain', s.gain); setSlider(side, 'cost', s.cost);
}
const SIM_DRAWS = ['simResumen', 'chips', 'simVal', 'simOrigen', 'simPct', 'simCerca', 'simNota', 'simVeredicto', 'simClaves', 'simBarras', 'simUmbral', 'simAlcance', 'simOjo'];
const redibujarSim = () => { SIM_DRAWS.forEach((n) => dash.draw(n)); dash.draw('simMapa'); };
const esCerca = (o, s) => Number.isFinite(s.gain) && Math.abs(o.gain - s.gain) <= 0.06 && (typeof o.cost !== 'number' || !Number.isFinite(s.cost) || Math.abs(Math.log(o.cost / s.cost)) <= Math.log(2));

dash.onData(() => {
  if (SIM.init) return;
  const ops = opcionesSim();
  if (!ops.some((o) => o.id === DEF.a) || !ops.some((o) => o.id === DEF.b)) return;
  SIM.init = true;
  elegir('a', DEF.a); elegir('b', DEF.b);
});

document.querySelectorAll('#inicio input[type=range]').forEach((inp) => inp.addEventListener('input', () => {
  const s = SIM[inp.dataset.side];
  if (inp.dataset.k === 'gain') { s.gain = Number(inp.value); s.gSrc = 'usuario'; }
  else { s.cost = pos2cost(Number(inp.value)); s.cSrc = 'usuario'; }
  redibujarSim();
}));
document.querySelectorAll('#sim-presupuestos [data-budget]').forEach((b) => b.addEventListener('click', () => {
  SIM.budget = Number(b.dataset.budget);
  document.querySelectorAll('#sim-presupuestos [data-budget]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  dash.draw('simAlcance');
}));
document.querySelectorAll('#sim-intercambiar').forEach((b) => b.addEventListener('click', () => {
  const t = SIM.a; SIM.a = SIM.b; SIM.b = t;
  ['a', 'b'].forEach((s) => { setSlider(s, 'gain', SIM[s].gain); setSlider(s, 'cost', SIM[s].cost); });
  redibujarSim();
}));

reg('chips', (box) => {
  const side = box.dataset.side;
  const d = dash.data(evId());
  if (d.status === 'loading' && !rows(evId()).length) { box.replaceChildren(el('span', { class: 'lab-small lab-muted' }, T('cargando'))); return; }
  const ops = opcionesSim().filter((o) => !(side === 'a' && o.id === 'hipotetica') && !(side === 'b' && o.id === 'sintesis'));
  if (!ops.length) { failMsg(box, d.status); return; }
  box.replaceChildren(...ops.map((o) => {
    const esta = SIM[side].id === o.id, cerca = !esta && esCerca(o, SIM[side]);
    const btn = el('button', { type: 'button', class: 'sim-chip' + (cerca ? ' cerca' : ''), 'aria-pressed': String(esta), title: T('tipo_' + o.tipo) });
    btn.style.setProperty('--tc', TIPO_COL[o.tipo] || '#999');
    btn.append(document.createTextNode(o.nombre));
    if (cerca) btn.append(el('span', { class: 'near' }, '≈ ' + T('cercaTag')));
    btn.append(el('small', null, (o.gain > 0 ? '+' : '') + fmt.g(o.gain) + ' ' + T('DE') + ' · ' + (typeof o.cost === 'number' ? usd(o.cost) : T('sinCostoCorto'))));
    btn.onclick = () => { elegir(side, o.id); redibujarSim(); };
    return btn;
  }));
});

reg('simVal', (b) => {
  const s = SIM[b.dataset.side];
  const v = b.dataset.k === 'gain' ? s.gain : s.cost;
  b.textContent = Number.isFinite(v) ? (b.dataset.k === 'gain' ? (v > 0 ? '+' : '') + f2(v) + ' ' + T('DE') : usd(v)) : '—';
});

reg('simOrigen', (span) => {
  const side = span.dataset.side, k = span.dataset.k, s = SIM[side];
  const src = k === 'gain' ? s.gSrc : s.cSrc;
  span.replaceChildren();
  if (!s.id) return;
  const map = { estudio: ['ver', T('delEstudio')], sint: ['sup', T('tipo_sintesis')], hip: ['sup', T('hipot')], usuario: ['sup', T('tuSupuesto')] };
  const [cls, txt] = map[src] || ['', ''];
  span.append(pill(cls, txt));
  const o = opcionesSim().find((x) => x.id === s.id);
  const tieneValor = o && (k === 'gain' ? true : typeof o.cost === 'number');
  if (src === 'usuario' && tieneValor) {
    const r = el('button', { type: 'button', class: 'sim-reset' }, ' ↺ ' + T('volver'));
    r.onclick = () => {
      if (k === 'gain') { s.gain = o.gain; s.gSrc = o.gainHip ? 'hip' : o.tipo === 'sintesis' ? 'sint' : 'estudio'; } else { s.cost = o.cost; s.cSrc = o.costHip ? 'hip' : 'estudio'; }
      setSlider(side, k, k === 'gain' ? s.gain : s.cost); redibujarSim();
    };
    span.append(r);
  }
  if (k === 'cost' && o && typeof o.cost !== 'number') span.append(el('div', { class: 'lab-small lab-muted' }, T('sinCostoSup')));
});

reg('simNota', (box) => {
  const s = SIM[box.dataset.side];
  box.replaceChildren();
  const o = opcionesSim().find((x) => x.id === s.id);
  if (!o) return;
  if (!o.ev) { box.append(el('div', null, o.tipo === 'sintesis' ? T('ojoSint') : T('ojoSup'))); return; }
  const r = o.ev;
  const linea = (k, v) => { const d = el('div'); d.append(el('b', null, k + ': '), document.createTextNode(v)); return d; };
  box.append(linea(T('midio'), r.queMidio), linea(T('nivelEv'), r.nivelTexto));
  if (r.costo != null && r.basePor100) box.append(linea(T('baseCosto'), r.basePor100));
  const d = el('div'); d.append(document.createTextNode(T('verFicha') + ': '), el('a', { href: r.enlace, target: '_blank', rel: 'noopener' }, r.estudio)); box.append(d);
  if (L === 'pt') box.append(el('div', { class: 'lab-muted' }, T('textoConector')));
});

function simCalc() {
  const a = SIM.a, b = SIM.b;
  if (![a.gain, a.cost, b.gain, b.cost].every(Number.isFinite) || a.cost <= 0 || b.cost <= 0) return null;
  try { return calculateInvestment({ aiGain: a.gain, alternativeGain: b.gain, aiCost: a.cost, alternativeCost: b.cost }); } catch (e) { return null; }
}
const nombreDe = (side) => { const o = opcionesSim().find((x) => x.id === SIM[side].id); return side.toUpperCase() + (o ? ' (' + o.nombre + ')' : ''); };

reg('simVeredicto', (p) => {
  const r = simCalc();
  p.replaceChildren();
  if (!r) { p.textContent = rows(evId()).length ? '—' : T('cargando'); return; }
  if (!(SIM.a.gain > 0 && SIM.b.gain > 0)) { p.textContent = T('verdNoInterp'); return; }
  const mejor = r.aiEffectiveness >= r.alternativeEffectiveness ? 'a' : 'b';
  const veces = LOC.format(',.1f')(mejor === 'a' ? r.aiEffectiveness / r.alternativeEffectiveness : r.alternativeEffectiveness / r.aiEffectiveness);
  const th = mejor === 'b' && r.threshold != null ? usd(r.threshold) : null;
  T('verd', nombreDe('a'), nombreDe('b'), f2(r.aiEffectiveness), f2(r.alternativeEffectiveness), mejor, veces, th, usd(SIM.a.cost))
    .forEach(([t, tag]) => p.append(tag ? el(tag, null, t) : document.createTextNode(t)));
});

reg('simResumen', (p) => {
  const r = simCalc();
  if (!r || !(SIM.a.gain > 0 && SIM.b.gain > 0)) { p.textContent = r ? T('verdNoInterp') : T('resumenNo'); return; }
  const aGana = r.aiEffectiveness >= r.alternativeEffectiveness;
  const v = LOC.format(',.1f')(aGana ? r.aiEffectiveness / r.alternativeEffectiveness : r.alternativeEffectiveness / r.aiEffectiveness);
  p.replaceChildren(el('b', null, aGana ? 'A' : 'B'), document.createTextNode(' ' + T('resumen', '', v, f2(aGana ? r.aiEffectiveness : r.alternativeEffectiveness), f2(aGana ? r.alternativeEffectiveness : r.aiEffectiveness)).trim()));
});
let ORIGEN = null;
const flash = (t) => { t.classList.remove('sim-flash'); void t.offsetWidth; t.classList.add('sim-flash'); setTimeout(() => t.classList.remove('sim-flash'), 1700); };
const marcarOrigen = (on) => document.querySelectorAll('.btn-volver').forEach((b) => b.classList.toggle('con-origen', on));
document.querySelectorAll('.btn-volver').forEach((b) => b.addEventListener('click', () => {
  const destino = ORIGEN && ORIGEN.isConnected ? ORIGEN : document.getElementById('sim-atajo');
  if (!destino) return;
  if (destino.scrollIntoView) destino.scrollIntoView({ behavior: 'smooth', block: 'center' });
  flash(destino.closest('.sim-atajo, .lab-card') || destino);
  ORIGEN = null; marcarOrigen(false);
}));
(() => {
  const atajo = document.getElementById('sim-atajo');
  if (!atajo || !('IntersectionObserver' in window)) return;
  let io;
  try { io = new IntersectionObserver((es) => es.forEach((e) => {
    const abajo = !e.isIntersecting && e.boundingClientRect.top < 0 && e.boundingClientRect.height > 0;
    document.querySelectorAll('#sim-volver').forEach((v) => { v.hidden = !abajo; });
    if (e.isIntersecting && !ORIGEN) marcarOrigen(false);
  }), { root: document }); } catch (err) { io = new IntersectionObserver((es) => es.forEach((e) => { document.querySelectorAll('#sim-volver').forEach((v) => { v.hidden = !(!e.isIntersecting && e.boundingClientRect.top < 0 && e.boundingClientRect.height > 0); }); })); }
  io.observe(atajo);
})();
document.querySelectorAll('.sim-ir[data-ir]').forEach((b) => b.addEventListener('click', () => {
  const t = document.getElementById(b.dataset.ir);
  if (!t) return;
  ORIGEN = b; marcarOrigen(true);
  if (t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  flash(t);
}));

reg('simClaves', (box) => {
  const ctx = new Map(rows('contexto').map((r) => [r.id, r]));
  const ca = ctx.get(SIM.a.id), cb = ctx.get(SIM.b.id);
  box.replaceChildren();
  if (!ca && !cb) return;
  const ul = el('ul');
  [['dosis', 'uso', 'cl_dosis'], ['personas', null, 'cl_personas'], ['clave', null, 'cl_clave']].forEach(([f1, f2, k]) => {
    const li = el('li');
    li.append(el('b', null, T(k)));
    [['a', ca], ['b', cb]].forEach(([side, c]) => {
      const d = el('div', { class: 'cl-lado' });
      const letra = el('span', { class: 'sim-badge ' + side }, side.toUpperCase());
      d.append(letra, document.createTextNode(c ? tr(c, f1) + (f2 ? '. ' + tr(c, f2) : '') + '.' : T('cl_sup')));
      li.append(d);
    });
    ul.append(li);
  });
  box.append(ul, el('p', { class: 'lab-small lab-muted', style: 'margin:6px 0 0' }, T('cl_fuente')));
});

reg('simBarras', (box) => {
  const r = simCalc();
  box.replaceChildren();
  if (!r) return;
  const data = [{ n: 'A', v: r.aiEffectiveness, c: AZUL }, { n: 'B', v: r.alternativeEffectiveness, c: VERDE }];
  const W = Math.max(240, box.clientWidth), m = { t: 4, r: 70, b: 4, l: 24 }, rowH = 38, H = m.t + m.b + data.length * rowH;
  const lo = Math.min(0, d3.min(data, (d) => d.v)), hi = Math.max(0.0001, d3.max(data, (d) => d.v));
  const x = d3.scaleLinear().domain([lo, hi]).range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('por100'));
  const tt = tip(box);
  const motion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  data.forEach((d, i) => {
    const y = m.t + i * rowH;
    svg.append('text').attr('x', 2).attr('y', y + 22).style('font-size', '13px').style('font-weight', '600').style('fill', d.c).text(d.n);
    svg.append('rect').attr('x', m.l).attr('y', y + 6).attr('height', 24).attr('width', W - m.r - m.l).style('fill', 'var(--color-bg)').attr('rx', 4);
    const w = Math.max(2, Math.abs(x(d.v) - x(0)));
    const bar = svg.append('rect').attr('x', Math.min(x(0), x(d.v))).attr('y', y + 6).attr('height', 24).attr('rx', 4).style('fill', d.c)
      .on('mousemove', (ev) => tt.show(ev, [nombreDe(d.n.toLowerCase()), f3(d.v) + ' ' + T('por100')])).on('mouseleave', () => tt.hide());
    if (motion) bar.attr('width', 0).transition().duration(350).attr('width', w); else bar.attr('width', w);
    svg.append('text').attr('x', W - m.r + 8).attr('y', y + 23).style('font-size', '13px').style('fill', 'var(--color-fg)').style('font-variant-numeric', 'tabular-nums').text(f2(d.v));
  });
});

reg('simUmbral', (box) => {
  const r = simCalc();
  box.replaceChildren();
  if (!r) return;
  if (r.threshold == null) { box.append(el('p', { class: 'lab-small lab-muted' }, T('verdNoInterp'))); return; }
  const W = Math.max(240, box.clientWidth), H = 74, m = { l: 8, r: 8 };
  const x = d3.scaleLinear().domain([0, Math.max(SIM.a.cost, r.threshold) * 1.3]).range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('maximo') + ': ' + usd(r.threshold));
  svg.append('rect').attr('x', m.l).attr('y', 30).attr('width', W - m.l - m.r).attr('height', 12).attr('rx', 6).style('fill', 'var(--color-bg)');
  svg.append('rect').attr('x', m.l).attr('y', 30).attr('width', Math.max(0, x(r.threshold) - m.l)).attr('height', 12).attr('rx', 6).style('fill', VERDE).style('fill-opacity', 0.35);
  svg.append('line').attr('x1', x(r.threshold)).attr('x2', x(r.threshold)).attr('y1', 24).attr('y2', 48).style('stroke', VERDE).style('stroke-width', 2);
  const lt = svg.append('text').attr('x', x(r.threshold)).attr('y', 64).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--color-fg)').text(T('maximo') + ': ' + usd(r.threshold));
  svg.append('circle').attr('cx', x(SIM.a.cost)).attr('cy', 36).attr('r', 8).style('fill', AZUL).style('stroke', 'var(--color-panel)').style('stroke-width', 2);
  const ct = svg.append('text').attr('x', x(SIM.a.cost)).attr('y', 16).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--color-fg)').text('A ' + T('hoy') + ': ' + usd(SIM.a.cost));
  [lt, ct].forEach((t) => { const w = t.node().getComputedTextLength(), cx = +t.attr('x'); if (cx - w / 2 < 0) t.attr('x', w / 2 + 2); if (cx + w / 2 > W) t.attr('x', W - w / 2 - 2); });
  const leg = el('div', { class: 'lab-small lab-muted' });
  const sw = el('span', { style: 'display:inline-block;width:12px;height:8px;border-radius:4px;margin-right:6px;background:' + VERDE + ';opacity:.35' });
  leg.append(sw, document.createTextNode(T('zonaComp')));
  box.append(leg);
});

reg('simAlcance', (box) => {
  box.replaceChildren();
  const filas = ['a', 'b'].filter((sd) => Number.isFinite(SIM[sd].cost) && SIM[sd].cost > 0);
  if (!filas.length) return;
  const W = Math.max(240, box.clientWidth), rowH = 40, H = filas.length * rowH + 4;
  const n = filas.map((sd) => Math.floor(SIM.budget / SIM[sd].cost));
  const x = d3.scaleLinear().domain([0, d3.max(n) || 1]).range([24, W - 130]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('estudiantes'));
  filas.forEach((sd, i) => {
    const y = i * rowH, c = sd === 'a' ? AZUL : VERDE;
    svg.append('text').attr('x', 2).attr('y', y + 24).style('font-size', '13px').style('font-weight', '600').style('fill', c).text(sd.toUpperCase());
    svg.append('rect').attr('x', 24).attr('y', y + 8).attr('height', 22).attr('rx', 4).attr('width', Math.max(2, x(n[i]) - 24)).style('fill', c).style('fill-opacity', 0.75);
    svg.append('text').attr('x', x(n[i]) + 8).attr('y', y + 24).style('font-size', '13px').style('fill', 'var(--color-fg)').style('font-variant-numeric', 'tabular-nums').text(f0(n[i]) + ' ' + T('estudiantes'));
  });
});

reg('simOjo', (box) => {
  box.replaceChildren();
  const ops = opcionesSim();
  const oa = ops.find((x) => x.id === SIM.a.id), ob = ops.find((x) => x.id === SIM.b.id);
  if (!oa || !ob) return;
  const items = [];
  if (oa.ev && ob.ev && oa.ev.queMidio !== ob.ev.queMidio) items.push(T('ojoMidio', oa.ev.queMidio, ob.ev.queMidio));
  if (oa.ev && ob.ev && oa.ev.costo != null && ob.ev.costo != null && (oa.ev.basePor100 || oa.ev.costoTexto) !== (ob.ev.basePor100 || ob.ev.costoTexto)) items.push(T('ojoBase', oa.ev.basePor100 || '—', ob.ev.basePor100 || '—'));
  [oa, ob].forEach((o) => { if (o.ev && o.ev.riesgoAlto && !/^(ninguno|none)$/i.test(o.ev.riesgoAlto)) items.push(T('ojoRiesgo', o.nombre, o.ev.riesgoAlto)); });
  [oa, ob].forEach((o) => { if (o.ev && o.ev.noGenerativa) items.push(T('ojoNoGen', o.nombre)); });
  if ([SIM.a.gSrc, SIM.a.cSrc, SIM.b.gSrc, SIM.b.cSrc].some((s) => s === 'usuario' || s === 'hip')) items.push(T('ojoSup'));
  if (SIM.a.gSrc === 'sint' || SIM.b.gSrc === 'sint') items.push(T('ojoSint'));
  if (!(SIM.a.gain > 0 && SIM.b.gain > 0)) items.push(T('ojoNeg'));
  items.push(T('ojoContexto'));
  const ul = el('ul');
  items.forEach((t) => ul.append(el('li', null, t)));
  box.append(el('b', null, T('ojoT')), ul);
});

document.querySelectorAll('#sim-a-calc').forEach((b) => b.addEventListener('click', () => {
  [['aiGain', SIM.a.gain], ['aiCost', SIM.a.cost], ['altGain', SIM.b.gain], ['altCost', SIM.b.cost]].forEach(([k, v]) => { C.v[k] = v; C.st[k] = Number.isFinite(v) ? 'Usuario' : 'Faltante'; setInput(k, v); });
  C.selA = 'usuario'; C.selB = 'usuario'; C.meta.a = null; C.meta.b = null;
  redibujarCalc(); dash.draw('selCalc');
  abrir('calculadora');
}));

reg('simPct', (span) => {
  const s = SIM[span.dataset.side];
  span.textContent = Number.isFinite(s.gain) && s.gain !== 0 ? T('pct', Math.round(phi(s.gain) * 100)) : '';
});
reg('simCerca', (box) => {
  const side = box.dataset.side, s = SIM[side];
  box.replaceChildren();
  if (!s.id) return;
  const cerca = opcionesSim().filter((o) => o.id !== s.id && o.ev && esCerca(o, s));
  const propio = opcionesSim().find((o) => o.id === s.id);
  const enValor = propio && propio.ev && esCerca(propio, s);
  if (!cerca.length && !enValor) { box.append(document.createTextNode(T('cercaNada') + ' ')); box.append(el('span', { class: 'lab-muted' }, T('cercaRegla'))); return; }
  if (!cerca.length) return;
  box.append(el('b', null, T('cercaT', '')));
  cerca.forEach((o, i) => {
    const b = el('button', { type: 'button', class: 'sim-reset' }, o.nombre);
    b.onclick = () => { elegir(side, o.id); redibujarSim(); };
    box.append(b, document.createTextNode(i < cerca.length - 1 ? ' · ' : ' '));
  });
  box.append(el('span', { class: 'lab-muted' }, T('cercaRegla')));
});
reg('simMapa', (box) => {
  const ops = opcionesSim();
  if (!ops.length) { failMsg(box, dash.data(evId()).status); return; }
  box.replaceChildren();
  const W = Math.max(280, box.clientWidth), H = W < 500 ? 300 : 340, m = { t: 14, r: 64, b: 42, l: 44 }, colX = W - 30;
  const x = d3.scaleLog().domain([1, COSTO_MAX]).range([m.l, W - m.r]).clamp(true);
  const y = d3.scaleLinear().domain([-0.3, 0.8]).range([H - m.b, m.t]).clamp(true);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('ejeGan') + ' / ' + T('ejeMapaX'));
  const ticksX = [1, 5, 10, 50, 100, 500, 1000].filter((v) => W > 620 || [1, 10, 100, 1000].includes(v));
  svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues(ticksX).tickSize(-(H - m.b - m.t)).tickFormat('')).call((g) => g.select('.domain').remove());
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues(ticksX).tickFormat(axisFmt(',.0f')));
  svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(6).tickFormat(axisFmt(',.1f')));
  svg.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', y(0)).attr('y2', y(0)).style('stroke', 'var(--cds-chart-reference)').style('stroke-dasharray', '3 3');
  svg.append('line').attr('x1', colX - 18).attr('x2', colX + 18).attr('y1', H - m.b).attr('y2', H - m.b).style('stroke', 'var(--cds-chart-axis)');
  svg.append('text').attr('x', colX).attr('y', H - m.b + 16).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('sinCostoCol'));
  svg.append('text').attr('x', (m.l + W - m.r) / 2).attr('y', H - 4).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ejeMapaX'));
  svg.append('text').attr('transform', `translate(10,${(H - m.b + m.t) / 2}) rotate(-90)`).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ejeGan'));
  svg.append('line').attr('x1', colX - 22).attr('x2', colX - 22).attr('y1', m.t).attr('y2', H - m.b).style('stroke', 'var(--cds-chart-grid)');
  const iso = svg.append('g');
  const dibujarIso = () => {
    iso.selectAll('*').remove();
    const b = SIM.b;
    if (!(b.gain > 0 && b.cost > 0)) return;
    const ef = b.gain / b.cost;
    const pts = d3.range(0, 101).map((i) => Math.exp((i / 100) * Math.log(COSTO_MAX))).map((c) => ({ c, g: ef * c })).filter((p) => p.g <= 0.8);
    if (pts.length < 2) return;
    iso.append('path').datum(pts).attr('d', d3.area().x((p) => x(p.c)).y0(m.t).y1((p) => y(p.g))).style('fill', VERDE).style('fill-opacity', 0.06);
    iso.append('path').datum(pts).attr('d', d3.line().x((p) => x(p.c)).y((p) => y(p.g))).style('fill', 'none').style('stroke', VERDE).style('stroke-dasharray', '5 4').style('stroke-width', 1.5);
    const last = pts[Math.max(0, Math.floor(pts.length * 0.15))];
    iso.append('text').attr('x', x(last.c) + 6).attr('y', m.t + 12).style('font-size', '11px').style('fill', VERDE).text('↖ ' + T('zonaMejor'));
  };
  dibujarIso();
  const tt = tip(box);
  const px = (o) => (typeof o.cost === 'number' ? x(o.cost) : colX);
  const dots = svg.append('g').selectAll('g').data(ops).join('g').attr('transform', (o) => `translate(${px(o)},${y(o.gain)})`).style('cursor', 'pointer');
  dots.append('circle').attr('r', 6).style('fill', (o) => TIPO_COL[o.tipo] || '#999').style('fill-opacity', (o) => (o.ev ? 0.9 : 0.5));
  dots.append('circle').attr('class', 'halo').attr('r', 10).style('fill', 'none').style('stroke-width', 2.5);
  dots.append('text').style('font-size', '10.5px').style('fill', 'var(--color-fg)').text((o) => o.corto || String(o.nombre).split(' (')[0]).each(function () { recortar(this, Math.max(70, W / 4)); });
  // Etiquetas sin superposición: se prueba a la derecha, izquierda, arriba y abajo; si no cabe, se oculta (queda el detalle al pasar el cursor)
  const cajas = [];
  ['a', 'b'].forEach((sd) => { const s = SIM[sd]; if (Number.isFinite(s.gain) && Number.isFinite(s.cost)) { const cx = x(Math.max(1, s.cost)), cy = y(s.gain); cajas.push({ x: cx - 16, y: cy - 16, w: 32, h: 32 }, { x: cx + (sd === 'a' ? -30 : 12), y: cy - 26, w: 18, h: 16 }); } });
  ops.forEach((o) => cajas.push({ x: px(o) - 7, y: y(o.gain) - 7, w: 14, h: 14 }));
  const choca = (b) => cajas.some((c) => b.x < c.x + c.w && b.x + b.w > c.x && b.y < c.y + c.h && b.y + b.h > c.y);
  const prioridad = (o) => (o.id === SIM.a.id || o.id === SIM.b.id ? 0 : o.ev ? 1 : 2);
  dots.nodes().map((n) => [n, d3.select(n).datum()]).sort((p, q) => prioridad(p[1]) - prioridad(q[1])).forEach(([n, o]) => {
    const t = d3.select(n).select('text'), w = t.node().getComputedTextLength(), cx = px(o), cy = y(o.gain);
    const cands = [[9, 4, 'start'], [-9, 4, 'end'], [9, -9, 'start'], [9, 17, 'start'], [-9, -9, 'end'], [-9, 17, 'end']];
    let elegido = null;
    for (const [dx, dy, an] of cands) {
      const bx = an === 'start' ? cx + dx : cx + dx - w, b = { x: bx, y: cy + dy - 10, w, h: 13 };
      if (bx < 2 || bx + w > W - 2 || b.y < 0 || b.y + b.h > H - m.b + 6) continue;
      if (!choca(b)) { elegido = [dx, dy, an, b]; break; }
    }
    if (elegido) { t.attr('x', elegido[0]).attr('y', elegido[1]).attr('text-anchor', elegido[2]); cajas.push(elegido[3]); } else t.style('display', 'none');
  });
  const marcar = () => dots.select('.halo').style('stroke', (o) => (esCerca(o, SIM.a) && o.id !== SIM.a.id ? AZUL : esCerca(o, SIM.b) && o.id !== SIM.b.id ? VERDE : 'none')).style('stroke-opacity', 0.8);
  marcar();
  dots.on('mousemove', (ev, o) => tt.show(ev, [o.nombre, (o.gain > 0 ? '+' : '') + f2(o.gain) + ' ' + T('DE') + ' · ' + (typeof o.cost === 'number' ? usd(o.cost) : T('sinCostoCorto')), T('tipo_' + o.tipo), T('clicA')]))
    .on('mouseleave', () => tt.hide())
    .on('click', (ev, o) => { tt.hide(); elegir('a', o.id); redibujarSim(); });
  ['b', 'a'].forEach((side) => {
    const s = SIM[side], c = side === 'a' ? AZUL : VERDE;
    if (!Number.isFinite(s.gain) || !Number.isFinite(s.cost)) return;
    const g = svg.append('g').attr('class', 'sim-mapa-' + side).attr('transform', `translate(${x(Math.max(1, s.cost))},${y(s.gain)})`);
    g.append('circle').attr('r', 14).style('fill', c).style('fill-opacity', 0.15).style('stroke', c).style('stroke-width', 3);
    g.append('text').attr('text-anchor', 'middle').attr('x', side === 'a' ? -21 : 21).attr('y', -13).style('font-size', '13px').style('font-weight', '700').style('fill', c)
      .style('paint-order', 'stroke').style('stroke', 'var(--color-panel)').style('stroke-width', '3px').text(side.toUpperCase());
    g.call(d3.drag()
      .on('start', () => tt.hide())
      .on('drag', (ev) => {
        const cx = Math.max(m.l, Math.min(W - m.r, ev.x)), cy = Math.max(m.t, Math.min(H - m.b, ev.y));
        s.cost = Math.round(x.invert(cx) * 100) / 100; s.gain = Math.round(y.invert(cy) * 100) / 100;
        s.cSrc = 'usuario'; s.gSrc = 'usuario';
        g.attr('transform', `translate(${cx},${cy})`);
        setSlider(side, 'gain', s.gain); setSlider(side, 'cost', s.cost);
        marcar(); if (side === 'b') dibujarIso();
        SIM_DRAWS.forEach((n) => dash.draw(n));
      })
      .on('end', () => dash.draw('simMapa')));
  });
});

/* ===================== Explorador ===================== */

const FLT = { texto: '', fuente: '', costo: '' };
const fuenteDe = (e) => {
  const ev = String(e.enEvidencia || ''), sc = String(e.enScale || ''), out = [];
  if (ev.startsWith('Sí')) out.push('evidencia');
  if (sc.startsWith('Incluido')) out.push('scaleRev');
  if (sc.startsWith('Solo en el repositorio')) out.push('scaleRepo');
  return out;
};
function filtrar(estudios) {
  return estudios.filter((e) => {
    for (const k of ['nivelEvidencia', 'pais', 'region', 'nivelEducativo', 'tecnologia', 'disenoPedagogico', 'diseno', 'verificacion']) if (FLT[k] && e[k] !== FLT[k]) return false;
    if (FLT.fuente && !fuenteDe(e).includes(FLT.fuente)) return false;
    if (FLT.costo === 'con' && typeof e.costoPorEstudiante !== 'number') return false;
    if (FLT.costo === 'sin' && typeof e.costoPorEstudiante === 'number') return false;
    if (FLT.texto && ![e.titulo, e.autores, e.herramienta, e.pais, tr(e, 'pais')].join(' ').toLowerCase().includes(FLT.texto.toLowerCase())) return false;
    return true;
  });
}
const redibujarTabla = () => { dash.draw('tablaEstudios'); dash.draw('nFiltrados'); };
reg('fExplica', (box) => {
  const keys = [];
  ['nivelEvidencia', 'tecnologia', 'disenoPedagogico', 'diseno', 'verificacion'].forEach((k) => { if (FLT[k]) glosDe(FLT[k]).forEach((g) => { if (!keys.includes(g)) keys.push(g); }); });
  box.replaceChildren(...keys.map((k) => { const src = document.getElementById('g-' + k); return src ? src.cloneNode(true) : null; }).filter(Boolean).map((n) => { n.removeAttribute('id'); n.classList.remove('on'); return n; }));
});
reg('fOpc', (sel) => {
  const k = sel.dataset.f;
  const vals = new Map();
  rows('estudios').forEach((e) => { if (e[k]) vals.set(e[k], tr(e, k)); });
  const [sig, larga] = T('expA');
  const expand = (t) => t.replace(new RegExp('\\b' + sig + '\\b'), larga);
  sel.replaceChildren(new Option(T('todos'), ''), ...Array.from(vals).sort((a, b) => a[1].localeCompare(b[1])).map(([v, t]) => new Option(expand(t), v)));
  sel.value = FLT[k] || '';
  sel.onchange = () => { FLT[k] = sel.value; redibujarTabla(); dash.draw('fExplica'); };
});
reg('fFuente', (sel) => {
  sel.replaceChildren(new Option(T('todas'), ''), new Option(T('fuenteEv'), 'evidencia'), new Option(T('fuenteRev'), 'scaleRev'), new Option(T('fuenteRepo'), 'scaleRepo'));
  sel.value = FLT.fuente; sel.onchange = () => { FLT.fuente = sel.value; redibujarTabla(); };
});
reg('fCosto', (sel) => {
  sel.replaceChildren(new Option(T('todos'), ''), new Option(T('conCosto'), 'con'), new Option(T('sinCosto'), 'sin'));
  sel.value = FLT.costo; sel.onchange = () => { FLT.costo = sel.value; redibujarTabla(); };
});
document.querySelectorAll('#fTexto').forEach((i) => i.addEventListener('input', () => { FLT.texto = i.value; redibujarTabla(); }));

let SEL = null;
reg('nFiltrados', (box) => { box.textContent = ok('estudios') ? T('deTotal', filtrar(rows('estudios')).length, rows('estudios').length) : '—'; });
reg('tablaEstudios', (tb) => {
  const d = dash.data('estudios');
  if (d.status !== 'ok') { tb.replaceChildren(); return; }
  const res = rows('resultados');
  tb.replaceChildren(...filtrar(d.data).map((e) => {
    const row = el('tr', { class: 'lab-click' + (SEL === e.id ? ' lab-sel' : ''), 'data-key': encodeURIComponent(e.id) });
    const td1 = el('td'); td1.append(el('div', null, corto(e)), el('div', { class: 'lab-muted' }, tr(e, 'nivelEvidencia') + ' · ' + tr(e, 'diseno')));
    const td2 = el('td'); td2.append(el('div', null, tr(e, 'herramienta')));
    const tg = el('div'); tg.append(tag(tr(e, 'tecnologia'), TEC_COL[e.tecnologia]), tag(tr(e, 'funcion'), '#2a78d6'), tag(tr(e, 'disenoPedagogico'), '#2e8b57')); td2.append(tg);
    const td3 = el('td', null, tr(e, 'pais'));
    const p = res.find((r) => r.estudio === e.id && r.principal);
    const td4 = el('td');
    if (p) {
      const esDE = String(p.unidad).startsWith('DE');
      const ic = typeof p.ee === 'number' ? ' [' + f2(p.efecto - 1.96 * p.ee) + '; ' + f2(p.efecto + 1.96 * p.ee) + ']' : ' (' + T('sinIC') + ')';
      td4.append(el('div', { class: 'lab-num' }, esDE ? f3(p.efecto) + ' ' + T('DE') + ic : fmt.g(p.efecto) + ' ' + tr(p, 'unidad')), el('div', { class: 'lab-muted' }, tr(p, 'resultado')));
    } else td4.textContent = T('faltante');
    const td5 = el('td', { class: 'lab-num' });
    if (typeof e.costoPorEstudiante === 'number') td5.textContent = f0(e.costoPorEstudiante); else td5.append(pill('fal', T('faltante')));
    const td6 = el('td');
    const a = el('a', { href: e.enlace, target: '_blank', rel: 'noopener' }, T('fuente'));
    a.onclick = (ev) => ev.stopPropagation();
    td6.append(pillVer(e), document.createTextNode(' '), a);
    row.append(td1, td2, td3, td4, td5, td6);
    row.onclick = () => {
      SEL = e.id;
      document.querySelectorAll('#ficha-vacia').forEach((x) => { x.hidden = true; });
      dash.draw('tablaEstudios'); dash.draw('detalle');
      const f = document.getElementById('ficha'); if (f && f.scrollIntoView) f.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    return row;
  }));
});
reg('detalle', (box) => {
  box.replaceChildren();
  if (!SEL || !ok('estudios')) return;
  const e = rows('estudios').find((x) => x.id === SEL);
  if (!e) return;
  const link = el('p', { class: 'lab-small' });
  link.append(pillVer(e), document.createTextNode(' ' + tr(e, 'fuenteConsultada') + ' · '), el('a', { href: e.enlace, target: '_blank', rel: 'noopener' }, T('abrir')));
  const dl = el('dl');
  const K = T('campos');
  const costo = (typeof e.costoPorEstudiante === 'number' ? usd2(e.costoPorEstudiante) + ' ' + T('porEst') + '. ' : T('faltante') + '. ') + tr(e, 'costoPerspectiva') + '. ' + T('fuenteCosto') + ': ' + tr(e, 'costoFuente') + '. ' + T('anioPrecios') + ': ' + (tr(e, 'costoAnio') || T('noAplica'));
  [[K[0], tr(e, 'diseno') + ' (' + tr(e, 'nivelEvidencia') + ')'], [K[1], tr(e, 'muestra')], [K[2], tr(e, 'pais') + ' · ' + tr(e, 'region')],
   [K[3], tr(e, 'nivelEducativo') + ' · ' + tr(e, 'poblacion')], [K[4], tr(e, 'herramienta') + '. ' + tr(e, 'intensidad')],
   [K[5], tr(e, 'tecnologia') + ' · ' + tr(e, 'funcion') + ' · ' + T('usuario') + ': ' + tr(e, 'usuario') + ' · ' + tr(e, 'disenoPedagogico')],
   [K[6], tr(e, 'comparacion') + ' (' + tr(e, 'tipoComparacion') + ')'], [K[7], costo], [K[8], tr(e, 'enEvidencia')], [K[9], tr(e, 'enScale')],
   [K[10], tr(e, 'limitaciones')], [K[11], tr(e, 'metodo') + ' · ' + e.fechaExtraccion]].forEach(([k, v]) => dl.append(el('dt', null, k), el('dd', null, v)));
  const t = el('table'), thead = el('thead'), trh = el('tr');
  T('colsRes').forEach((c) => trh.append(el('th', null, c)));
  thead.append(trh);
  const tb = el('tbody');
  rows('resultados').filter((r) => r.estudio === e.id).forEach((r) => {
    const row = el('tr');
    [tr(r, 'resultado'), tr(r, 'materia'), fmt.g(r.efecto), tr(r, 'unidad'), typeof r.ee === 'number' ? fmt.g(r.ee) : T('noRep'), tr(r, 'seguimiento'), tr(r, 'sinIA'), tr(r, 'significancia'), tr(r, 'ubicacion')].forEach((v) => row.append(el('td', null, v)));
    tb.append(row);
  });
  t.append(thead, tb);
  const wrap = el('div', { class: 'lab-tablewrap' }); wrap.append(t);
  box.append(el('h3', null, e.titulo), el('p', { class: 'lab-small lab-muted' }, e.autores + ' · ' + e.anio + ' · ' + tr(e, 'publicacion')), link, dl, el('h3', null, T('resAprend')), wrap);
});

/* ===================== Impacto ===================== */

const efectosCompletos = () => {
  const res = new Map(rows('resultados').map((r) => [r.id, r]));
  const est = new Map(rows('estudios').map((e) => [e.id, e]));
  return rows('efectosIC').map((r) => ({ ...r, R: res.get(r.id) || {}, E: est.get(r.estudio) || {} }));
};
reg('forestPlot', (box) => {
  const d = dash.data('efectosIC');
  if (d.status !== 'ok' || !d.data) { failMsg(box, d.status); return; }
  box.replaceChildren();
  const data = efectosCompletos().sort((a, b) => (a.agrupado - b.agrupado) || (b.efecto - a.efecto));
  const W = Math.max(280, box.clientWidth), rowH = 40, m = { t: 8, r: 16, b: 30, l: 12 };
  const H = m.t + m.b + data.length * rowH + 10;
  const lo = Math.min(0, d3.min(data, (r) => r.icInf ?? r.efecto)) - 0.05, hi = d3.max(data, (r) => r.icSup ?? r.efecto) + 0.05;
  const x = d3.scaleLinear().domain([lo, hi]).nice().range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Forest plot');
  const nt = Math.max(3, Math.floor(W / 90));
  svg.append('g').attr('class', 'grid').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(nt).tickSize(-(H - m.b - m.t)).tickFormat('')).call((g) => g.select('.domain').remove());
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(nt).tickFormat(axisFmt(',.2~f')));
  svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', m.t).attr('y2', H - m.b).style('stroke', 'var(--cds-chart-reference)').style('stroke-dasharray', '3 3');
  const tt = tip(box);
  data.forEach((r, i) => {
    const g = svg.append('g').attr('transform', `translate(0,${m.t + i * rowH + (r.agrupado ? 10 : 0)})`);
    g.append('text').attr('x', m.l).attr('y', 12).style('font-size', '12px').style('fill', 'var(--color-fg)').text(r.etiqueta + ' · ' + tr(r.R, 'resultado') + (r.icInf == null ? ' (' + T('sinIC') + ')' : '')).each(function () { recortar(this, W - m.l - m.r); });
    const cy = 27;
    if (r.icInf != null) g.append('line').attr('x1', x(r.icInf)).attr('x2', x(r.icSup)).attr('y1', cy).attr('y2', cy).style('stroke', r.agrupado ? LILA : AZUL).style('stroke-width', 2);
    if (r.agrupado) g.append('path').attr('d', d3.symbol(d3.symbolDiamond, 110)()).attr('transform', `translate(${x(r.efecto)},${cy})`).style('fill', LILA);
    else g.append('circle').attr('cx', x(r.efecto)).attr('cy', cy).attr('r', 5).style('fill', r.verificacion === 'Verificado' ? AZUL : 'var(--color-panel)').style('stroke', AZUL).style('stroke-width', 2);
    g.append('text').attr('x', x(r.icSup ?? r.efecto) + 9).attr('y', cy + 4).style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(f3(r.efecto))
      .each(function () { if (x(r.icSup ?? r.efecto) + 9 + this.getComputedTextLength() > W) d3.select(this).attr('x', x(r.icInf ?? r.efecto) - 9).attr('text-anchor', 'end'); });
    g.append('rect').attr('width', W).attr('height', rowH).style('fill', 'transparent')
      .on('mousemove', (ev) => tt.show(ev, [r.etiqueta, tr(r.R, 'resultado'), T('efecto') + ': ' + f3(r.efecto) + ' ' + T('DE'), r.icInf != null ? T('ic') + ': ' + f3(r.icInf) + ' – ' + f3(r.icSup) : T('sinEE'), tr(r.E, 'tipoComparacion'), tr(r.R, 'verificacion')]))
      .on('mouseleave', () => tt.hide());
  });
});
reg('strip', (box) => {
  const d = dash.data('efectosIC');
  if (d.status !== 'ok' || !d.data) { failMsg(box, d.status); return; }
  box.replaceChildren();
  const key = box.dataset.g;
  const data = efectosCompletos().filter((r) => !r.agrupado);
  const val = (r) => (key === 'sinIA' || key === 'diferido' ? tr(r.R, key) : tr(r.E, key)) || '—';
  const groups = Array.from(new Set(data.map(val)));
  const W = Math.max(260, box.clientWidth), rowH = 44, m = { t: 6, r: 14, b: 28, l: 10 }, H = m.t + m.b + groups.length * rowH;
  const x = d3.scaleLinear().domain([Math.min(0, d3.min(data, (r) => r.efecto)), d3.max(data, (r) => r.efecto)]).nice().range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', key);
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 90))).tickFormat(axisFmt(',.1f')));
  svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', m.t).attr('y2', H - m.b).style('stroke', 'var(--cds-chart-reference)').style('stroke-dasharray', '3 3');
  const tt = tip(box);
  groups.forEach((gname, i) => {
    const g = svg.append('g').attr('transform', `translate(0,${m.t + i * rowH})`);
    const items = data.filter((r) => val(r) === gname);
    g.append('text').attr('x', m.l).attr('y', 12).style('font-size', '12px').style('fill', 'var(--color-fg)').text(gname + ' (' + T('nRes', items.length) + ')').each(function () { recortar(this, W - m.l - m.r); });
    g.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', 28).attr('y2', 28).style('stroke', 'var(--cds-chart-grid)');
    items.forEach((r) => g.append('circle').attr('cx', x(r.efecto)).attr('cy', 28).attr('r', 6).style('fill', r.verificacion === 'Verificado' ? AZUL : 'var(--color-panel)').style('fill-opacity', r.verificacion === 'Verificado' ? 0.7 : 1).style('stroke', AZUL).style('stroke-width', 2)
      .on('mousemove', (ev) => tt.show(ev, [r.etiqueta, tr(r.R, 'resultado'), f3(r.efecto) + ' ' + T('DE')])).on('mouseleave', () => tt.hide()));
  });
});
reg('paises', (box) => {
  const d = dash.data('cobertura');
  if (d.status !== 'ok' || !d.data) { failMsg(box, d.status); return; }
  box.replaceChildren();
  const est = rows('estudios');
  const nombre = (p) => tr(est.find((e) => e.pais === p), 'pais') || p;
  const data = d.data, W = Math.max(260, box.clientWidth), rowH = 24;
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('role', 'img').attr('aria-label', 'Countries');
  let lw = 0;
  data.forEach((r) => { const t = svg.append('text').style('font-size', '12px').text(nombre(r.pais)); lw = Math.max(lw, t.node().getComputedTextLength()); t.remove(); });
  svg.attr('viewBox', `0 0 ${W} ${data.length * rowH + 8}`);
  const x = d3.scaleLinear().domain([0, d3.max(data, (r) => r.n)]).range([0, W - 50 - lw]);
  data.forEach((r, i) => {
    const y = 4 + i * rowH;
    svg.append('text').attr('x', 8 + lw).attr('y', y + 15).attr('text-anchor', 'end').style('font-size', '12px').style('fill', 'var(--color-fg)').text(nombre(r.pais));
    svg.append('rect').attr('x', lw + 16).attr('y', y + 4).attr('height', 14).attr('width', Math.max(2, x(r.n))).style('fill', AZUL).attr('rx', 2);
    svg.append('text').attr('x', lw + 20 + x(r.n)).attr('y', y + 15).style('font-size', '12px').style('fill', 'var(--cds-text-secondary)').text(r.n);
  });
});
reg('otrasUnidades', (tb) => {
  const d = dash.data('resultados');
  if (d.status !== 'ok') { tb.replaceChildren(); return; }
  const est = new Map(rows('estudios').map((e) => [e.id, e]));
  tb.replaceChildren(...d.data.filter((r) => !String(r.unidad).startsWith('DE')).map((r) => {
    const row = el('tr', { 'data-key': encodeURIComponent(r.id) });
    const e = est.get(r.estudio);
    row.append(el('td', null, e ? corto(e) : r.estudio), el('td', null, tr(r, 'resultado')), el('td', { class: 'lab-num' }, fmt.g(r.efecto)), el('td', null, tr(r, 'unidad')), el('td', { class: 'lab-num' }, typeof r.ee === 'number' ? fmt.g(r.ee) : T('noRep')));
    const td = el('td'); td.append(pillVer(r)); row.append(td);
    return row;
  }));
});

/* ===================== Calculadora ===================== */

function calculateInvestment({ aiGain, alternativeGain, aiCost, alternativeCost }) {
  if (!Number.isFinite(aiGain) || !Number.isFinite(alternativeGain) || !Number.isFinite(aiCost) || !Number.isFinite(alternativeCost) || aiCost <= 0 || alternativeCost <= 0) {
    throw new Error('Invalid inputs');
  }
  const aiEffectiveness = (aiGain / aiCost) * 100;
  const alternativeEffectiveness = (alternativeGain / alternativeCost) * 100;
  const relativeEffectiveness = alternativeEffectiveness !== 0 ? aiEffectiveness / alternativeEffectiveness : null;
  const threshold = aiGain > 0 && alternativeGain > 0 ? (aiGain / alternativeGain) * alternativeCost : null;
  return { threshold, aiEffectiveness, alternativeEffectiveness, relativeEffectiveness, aiIsCompetitive: aiEffectiveness >= alternativeEffectiveness };
}

const C = { init: false, v: { aiGain: NaN, aiCost: NaN, altGain: NaN, altCost: NaN }, st: { aiGain: 'Faltante', aiCost: 'Faltante', altGain: 'Faltante', altCost: 'Faltante' }, selA: 'escenario', selB: 'escenario', meta: { a: null, b: null } };
function opcionesCalc() {
  const lote = efectosCompletos().filter((r) => !r.agrupado).map((r) => ({ id: 'l:' + r.id, grupo: 'lote', etiqueta: r.etiqueta + ' · ' + tr(r.R, 'resultado'), gain: r.efecto, cost: r.costoPorEstudiante, st: r.verificacion, icInf: r.icInf, icSup: r.icSup, materia: tr(r.R, 'materia'), base: tr(r.E, 'costoPerspectiva') }));
  const nombres = new Map(rows('simulador').map((s) => [s.id, tr(s, 'nombre')]));
  const ev = rows(evId()).filter((r) => r.efecto != null).map((r) => ({ id: 'e:' + r.id, grupo: 'ev', etiqueta: (nombres.get(r.id) ? nombres.get(r.id) + ' · ' : '') + r.estudio, gain: r.efecto, cost: r.costo, st: 'EvidencIA', icInf: r.icInf, icSup: r.icSup, materia: r.queMidio, base: r.basePor100 || r.costoTexto }));
  return ev.concat(lote);
}
function setInput(k, v) { document.querySelectorAll('#calculadora input[data-k="' + k + '"]').forEach((i) => { i.value = Number.isFinite(v) ? String(v) : ''; }); }
function aplicarEscenario(lado) {
  const esc = new Map(rows('escenario').map((r) => [r.parametro, r]));
  const pairs = lado === 'a' ? [['aiGain', 'aiGain'], ['aiCost', 'aiCost']] : [['altGain', 'alternativeGain'], ['altCost', 'alternativeCost']];
  pairs.forEach(([k, p]) => { const r = esc.get(p); C.v[k] = r ? Number(r.valor) : NaN; C.st[k] = r ? (k === 'aiGain' ? 'IlusGain' : 'Ilus') : 'Faltante'; setInput(k, C.v[k]); });
  C.meta[lado] = null;
}
function aplicarOpcion(lado, id) {
  const o = opcionesCalc().find((x) => x.id === id);
  if (!o) return;
  const [kg, kc] = lado === 'a' ? ['aiGain', 'aiCost'] : ['altGain', 'altCost'];
  C.v[kg] = o.gain; C.st[kg] = o.st;
  if (typeof o.cost === 'number') { C.v[kc] = o.cost; C.st[kc] = o.st; } else { C.v[kc] = NaN; C.st[kc] = 'Faltante'; }
  setInput(kg, C.v[kg]); setInput(kc, C.v[kc]);
  C.meta[lado] = o;
}
const CALC_DRAWS = ['badge', 'tipoResultado', 'oOut', 'avisos', 'chartA', 'chartB', 'chartD', 'chartE', 'tornadoChart'];
const redibujarCalc = () => CALC_DRAWS.forEach((n) => dash.draw(n));
dash.onData(() => { if (C.init || !ok('escenario')) return; C.init = true; aplicarEscenario('a'); aplicarEscenario('b'); });
document.querySelectorAll('#calculadora input[data-k]').forEach((inp) => inp.addEventListener('input', () => {
  const k = inp.dataset.k;
  C.v[k] = inp.value === '' ? NaN : Number(inp.value); C.st[k] = inp.value === '' ? 'Faltante' : 'Usuario';
  redibujarCalc();
}));
document.querySelectorAll('#btn-reset-calc').forEach((b) => b.addEventListener('click', () => { C.selA = 'escenario'; C.selB = 'escenario'; aplicarEscenario('a'); aplicarEscenario('b'); dash.draw('selCalc'); redibujarCalc(); }));
document.querySelectorAll('#rangoCosto').forEach((i) => i.addEventListener('input', () => dash.draw('chartE')));

reg('selCalc', (sel) => {
  const lado = sel.dataset.side;
  const otro = lado === 'a' ? C.selB : C.selA;
  const grp = (g, label) => {
    const og = document.createElement('optgroup'); og.label = label;
    opcionesCalc().filter((o) => o.grupo === g).forEach((o) => {
      const op = new Option(o.etiqueta + ' · ' + f3(o.gain) + ' ' + T('DE') + ' · ' + (o.cost == null ? T('sinCostoCorto') : usd(o.cost)), o.id);
      if (o.id === otro) op.disabled = true;
      og.append(op);
    });
    return og;
  };
  sel.replaceChildren(new Option(lado === 'a' ? T('escA') : T('escB'), 'escenario'), new Option(T('usuarioB'), 'usuario'), grp('ev', T('grpEv')), grp('lote', T('grpLote')));
  sel.value = lado === 'a' ? C.selA : C.selB;
  sel.onchange = () => {
    const v = sel.value;
    if (lado === 'a') C.selA = v; else C.selB = v;
    if (v === 'escenario') aplicarEscenario(lado);
    else if (v === 'usuario') { (lado === 'a' ? ['aiGain', 'aiCost'] : ['altGain', 'altCost']).forEach((k) => { C.st[k] = Number.isFinite(C.v[k]) ? 'Usuario' : 'Faltante'; }); C.meta[lado] = null; }
    else aplicarOpcion(lado, v);
    dash.draw('selCalc'); redibujarCalc();
  };
});
reg('badge', (span) => {
  const st = C.st[span.dataset.k];
  span.replaceChildren(pill({ Verificado: 'ver', EvidencIA: 'ver', Provisional: 'pro', IlusGain: 'sup', Ilus: 'sup', Usuario: 'sup', Faltante: 'fal' }[st] || '', T('st_' + st)));
});
const resultadoActual = () => { try { return calculateInvestment({ aiGain: C.v.aiGain, alternativeGain: C.v.altGain, aiCost: C.v.aiCost, alternativeCost: C.v.altCost }); } catch (e) { return null; } };
function tipoGlobal() {
  const s = Object.values(C.st);
  if (s.includes('Faltante')) return 'incompleto';
  if (s.includes('Ilus') || s.includes('IlusGain')) return 'ilustrativo';
  if (s.includes('Usuario')) return 'supuestos';
  if (s.includes('Provisional')) return 'provisional';
  return 'verificado';
}
reg('tipoResultado', (s) => {
  const t = tipoGlobal();
  s.replaceChildren(pill({ ilustrativo: 'sup', supuestos: 'sup', provisional: 'pro', verificado: 'ver', incompleto: 'fal' }[t], T('tg_' + t)));
});
reg('oOut', (box) => {
  const r = resultadoActual();
  if (!r) { box.textContent = '—'; return; }
  box.textContent = {
    threshold: r.threshold == null ? T('noInterp') : usd2(r.threshold), ai: f3(r.aiEffectiveness), alt: f3(r.alternativeEffectiveness),
    ratio: r.relativeEffectiveness == null ? T('noDef') : f3(r.relativeEffectiveness), comp: r.aiIsCompetitive ? T('si') : T('no'),
  }[box.dataset.k];
});
reg('avisos', (box) => {
  const out = [];
  const add = (cls, t) => out.push(el('p', { class: cls }, t));
  const v = C.v;
  if (C.st.aiGain === 'Faltante') add('bad', T('fGainA'));
  if (C.st.aiCost === 'Faltante') add('bad', T('fCostA'));
  if (C.st.altGain === 'Faltante') add('bad', T('fGainB'));
  if (C.st.altCost === 'Faltante') add('bad', T('fCostB'));
  if ((Number.isFinite(v.aiCost) && v.aiCost <= 0) || (Number.isFinite(v.altCost) && v.altCost <= 0)) add('bad', T('costoCero'));
  if ((Number.isFinite(v.aiGain) && v.aiGain <= 0) || (Number.isFinite(v.altGain) && v.altGain <= 0)) add('warn', T('ojoNeg'));
  const A = C.meta.a, B = C.meta.b;
  if (A && B) {
    if (A.materia !== B.materia) add('warn', T('ojoMidio', A.materia, B.materia));
    if (A.cost != null && B.cost != null && A.base !== B.base) add('warn', T('ojoBase', A.base || '—', B.base || '—'));
  }
  [A, B].forEach((o) => { if (o && o.st === 'Provisional') add('warn', o.etiqueta + ': ' + T('st_Provisional')); });
  if (tipoGlobal() === 'ilustrativo') add('lab-muted', T('ilusNota'));
  box.replaceChildren(...out);
});
function needAll(box) { const r = resultadoActual(); if (!r) { box.replaceChildren(); box.textContent = T('completa'); return null; } return r; }

reg('chartA', (box) => {
  const r = needAll(box); if (!r) return;
  box.replaceChildren();
  const data = [{ n: T('iaA'), v: r.aiEffectiveness, c: AZUL }, { n: T('compB'), v: r.alternativeEffectiveness, c: VERDE }];
  const W = Math.max(260, box.clientWidth), m = { t: 6, r: 60, b: 24, l: 120 }, rowH = 34, H = m.t + m.b + data.length * rowH;
  const x = d3.scaleLinear().domain([Math.min(0, d3.min(data, (d) => d.v)), Math.max(0.0001, d3.max(data, (d) => d.v))]).nice().range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('por100'));
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(4).tickFormat(axisFmt(',.2f')));
  data.forEach((d, i) => {
    const y = m.t + i * rowH;
    svg.append('text').attr('x', m.l - 8).attr('y', y + 19).attr('text-anchor', 'end').style('font-size', '12px').style('fill', 'var(--color-fg)').text(d.n);
    svg.append('rect').attr('x', Math.min(x(0), x(d.v))).attr('y', y + 6).attr('height', 20).attr('width', Math.abs(x(d.v) - x(0))).style('fill', d.c).attr('rx', 2);
    svg.append('text').attr('x', Math.max(x(0), x(d.v)) + 6).attr('y', y + 20).style('font-size', '12px').style('fill', 'var(--color-fg)').text(f3(d.v));
  });
});
reg('chartB', (box) => {
  const r = needAll(box); if (!r) return;
  box.replaceChildren();
  if (!(C.v.aiGain > 0)) { box.textContent = T('verdNoInterp'); return; }
  const W = Math.max(280, box.clientWidth), H = 240, m = { t: 12, r: 16, b: 36, l: 48 };
  const xmax = Math.max(C.v.aiCost * 2, (r.threshold || 0) * 1.6, 1), xmin = xmax / 40;
  const pts = d3.range(0, 121).map((i) => { const c = xmin + (xmax - xmin) * (i / 120); return { c, y: (C.v.aiGain / c) * 100 }; });
  const x = d3.scaleLinear().domain([0, xmax]).range([m.l, W - m.r]);
  const y = d3.scaleLinear().domain([0, Math.max(r.alternativeEffectiveness * 2.5, r.aiEffectiveness * 1.5)]).nice().range([H - m.b, m.t]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('equilibrio'));
  const cid = 'clipB' + Math.random().toString(36).slice(2);
  svg.append('defs').append('clipPath').attr('id', cid).append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', H - m.t - m.b);
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(Math.max(3, Math.floor(W / 90))).tickFormat(axisFmt(',.0f')));
  svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(axisFmt(',.1f')));
  svg.append('text').attr('x', (m.l + W - m.r) / 2).attr('y', H - 4).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ejeCosto'));
  svg.append('text').attr('transform', `translate(11,${(H - m.b + m.t) / 2}) rotate(-90)`).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('por100'));
  const g = svg.append('g').attr('clip-path', `url(#${cid})`);
  g.append('path').datum(pts).attr('d', d3.line().x((p) => x(p.c)).y((p) => y(p.y))).style('fill', 'none').style('stroke', AZUL).style('stroke-width', 2);
  g.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', y(r.alternativeEffectiveness)).attr('y2', y(r.alternativeEffectiveness)).style('stroke', VERDE).style('stroke-width', 2);
  const lab = (t, xx, yy) => { const n = svg.append('text').attr('x', xx + 8).attr('y', yy).style('font-size', '11px').style('fill', 'var(--color-fg)').text(t); if (xx + 8 + n.node().getComputedTextLength() > W - m.r) n.attr('x', xx - 8).attr('text-anchor', 'end'); };
  if (r.threshold != null) {
    g.append('line').attr('x1', x(r.threshold)).attr('x2', x(r.threshold)).attr('y1', y(r.alternativeEffectiveness)).attr('y2', H - m.b).style('stroke', 'var(--cds-chart-reference)').style('stroke-dasharray', '3 3');
    g.append('circle').attr('cx', x(r.threshold)).attr('cy', y(r.alternativeEffectiveness)).attr('r', 5).style('fill', 'var(--color-panel)').style('stroke', 'var(--color-fg)').style('stroke-width', 2);
    lab(T('equilibrio') + ': ' + usd2(r.threshold), x(r.threshold), y(r.alternativeEffectiveness) - 8);
  }
  if (C.v.aiCost <= xmax) { g.append('circle').attr('cx', x(C.v.aiCost)).attr('cy', y(r.aiEffectiveness)).attr('r', 6).style('fill', AZUL); lab(T('costoActual') + ': ' + usd2(C.v.aiCost), x(C.v.aiCost), y(r.aiEffectiveness) + 16); }
  const tt = tip(box);
  svg.append('rect').attr('x', m.l).attr('y', m.t).attr('width', W - m.l - m.r).attr('height', H - m.t - m.b).style('fill', 'transparent')
    .on('mousemove', (ev) => { const c = Math.max(xmin, x.invert(d3.pointer(ev)[0])); tt.show(ev, [usd2(c), T('iaA') + ': ' + f3((C.v.aiGain / c) * 100), T('compB') + ': ' + f3(r.alternativeEffectiveness)]); })
    .on('mouseleave', () => tt.hide());
});
reg('chartC', (box) => {
  const d = dash.data(evId());
  if (d.status !== 'ok' || !d.data) { failMsg(box, d.status); return; }
  box.replaceChildren();
  const data = d.data.filter((r) => r.efecto != null && r.costo != null);
  if (!data.length) return;
  const nombres = new Map(rows('simulador').map((s) => [s.id, tr(s, 'nombre')]));
  const W = Math.max(280, box.clientWidth), H = 260, m = { t: 14, r: 20, b: 38, l: 48 };
  const x = d3.scaleLog().domain([Math.max(1, d3.min(data, (r) => r.costo) / 1.5), d3.max(data, (r) => r.costo) * 1.5]).range([m.l, W - m.r]);
  const y = d3.scaleLinear().domain([Math.min(0, d3.min(data, (r) => r.icInf ?? r.efecto)), d3.max(data, (r) => r.icSup ?? r.efecto) * 1.1]).nice().range([H - m.b, m.t]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', T('ejeGan') + ' / ' + T('ejeCostoC'));
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).tickValues([1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000].filter((v) => v >= x.domain()[0] && v <= x.domain()[1])).tickFormat(axisFmt(',.0f')));
  svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y).ticks(5).tickFormat(axisFmt(',.1f')));
  svg.append('text').attr('x', (m.l + W - m.r) / 2).attr('y', H - 4).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ejeCostoC') + ' (log)');
  svg.append('text').attr('transform', `translate(11,${(H - m.b + m.t) / 2}) rotate(-90)`).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ejeGan'));
  const tt = tip(box);
  data.forEach((r) => {
    if (r.icInf != null) svg.append('line').attr('x1', x(r.costo)).attr('x2', x(r.costo)).attr('y1', y(r.icInf)).attr('y2', y(r.icSup)).style('stroke', r.noGenerativa ? VERDE : AZUL).style('stroke-opacity', 0.4).style('stroke-width', 2);
    svg.append('circle').attr('cx', x(r.costo)).attr('cy', y(r.efecto)).attr('r', 6).style('fill', r.noGenerativa ? VERDE : AZUL)
      .on('mousemove', (ev) => tt.show(ev, [nombres.get(r.id) || r.estudio, f2(r.efecto) + ' ' + T('DE') + ' · ' + usd(r.costo), r.dePor100 != null ? f2(r.dePor100) + ' ' + T('por100') + (r.basePor100 ? ' (' + r.basePor100 + ')' : '') : '', r.queMidio])).on('mouseleave', () => tt.hide());
    const t = svg.append('text').attr('x', x(r.costo) + 9).attr('y', y(r.efecto) + 4).style('font-size', '11px').style('fill', 'var(--color-fg)').text(nombres.get(r.id) || r.estudio).each(function () { recortar(this, Math.max(80, W / 3)); });
    if (x(r.costo) + 9 + t.node().getComputedTextLength() > W) t.attr('x', x(r.costo) - 9).attr('text-anchor', 'end');
  });
});
reg('chartD', (box) => {
  const r = needAll(box); if (!r) return;
  box.replaceChildren();
  const mult = [0.5, 0.67, 0.83, 1, 1.17, 1.33, 1.5];
  const W = Math.max(280, box.clientWidth), m = { t: 8, r: 8, b: 44, l: 62 }, cw = (W - m.l - m.r) / mult.length, ch = 30, H = m.t + m.b + ch * mult.length;
  const cells = [];
  mult.forEach((ma, i) => mult.forEach((mb, j) => { const a = C.v.aiGain * ma, b = C.v.altGain * mb; cells.push({ i, j, a, b, th: a > 0 && b > 0 ? (a / b) * C.v.altCost : null }); }));
  const vals = cells.map((c) => c.th).filter((v) => v != null);
  if (!vals.length) { box.textContent = T('verdNoInterp'); return; }
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Heatmap');
  const col = d3.scaleSequential(d3.interpolateBlues).domain([d3.min(vals), d3.max(vals)]);
  const tt = tip(box);
  cells.forEach((c) => {
    const gx = m.l + c.j * cw, gy = m.t + (mult.length - 1 - c.i) * ch;
    svg.append('rect').attr('x', gx).attr('y', gy).attr('width', cw - 1).attr('height', ch - 1).style('fill', c.th == null ? 'var(--color-bg)' : col(c.th)).style('stroke', mult[c.i] === 1 && mult[c.j] === 1 ? 'var(--color-fg)' : 'none').style('stroke-width', 2)
      .on('mousemove', (ev) => tt.show(ev, [T('ganIA') + ' ' + f3(c.a) + ' · ' + T('ganComp') + ' ' + f3(c.b), c.th == null ? T('noInterp') : usd2(c.th)])).on('mouseleave', () => tt.hide());
    if (cw > 34 && c.th != null) svg.append('text').attr('x', gx + cw / 2).attr('y', gy + ch / 2 + 4).attr('text-anchor', 'middle').style('font-size', '10px').style('pointer-events', 'none').style('fill', d3.hsl(col(c.th)).l < 0.55 ? '#fff' : '#0b0b0b').text(LOC.format(',.1f')(c.th));
  });
  mult.forEach((mm, j) => svg.append('text').attr('x', m.l + j * cw + cw / 2).attr('y', H - m.b + 14).attr('text-anchor', 'middle').style('font-size', '10px').style('fill', 'var(--cds-text-secondary)').text(LOC.format(',.2f')(C.v.altGain * mm)));
  mult.forEach((mm, i) => svg.append('text').attr('x', m.l - 6).attr('y', m.t + (mult.length - 1 - i) * ch + ch / 2 + 4).attr('text-anchor', 'end').style('font-size', '10px').style('fill', 'var(--cds-text-secondary)').text(LOC.format(',.3f')(C.v.aiGain * mm)));
  svg.append('text').attr('x', (m.l + W - m.r) / 2).attr('y', H - 6).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ganComp'));
  svg.append('text').attr('transform', `translate(10,${m.t + (ch * mult.length) / 2}) rotate(-90)`).attr('text-anchor', 'middle').style('font-size', '11px').style('fill', 'var(--cds-text-secondary)').text(T('ganIA'));
});
reg('chartE', (box) => {
  const r = needAll(box); if (!r) return;
  box.replaceChildren();
  const pct = Math.max(0, Math.min(90, Number((document.getElementById('rangoCosto') || {}).value) || 0)) / 100;
  const A = C.meta.a;
  const conIC = A && A.icInf != null && C.st.aiGain !== 'Usuario';
  const lista = [];
  if (conIC) {
    const thr = (g) => (g > 0 && C.v.altGain > 0 ? (g / C.v.altGain) * C.v.altCost : null);
    lista.push({ n: T('eGan'), lo: A.icInf, mid: A.gain, hi: A.icSup, f: (v) => (v == null ? '—' : f3(v) + ' ' + T('DE')), k: 'est' });
    lista.push({ n: T('eTh'), lo: thr(A.icInf), mid: thr(A.gain), hi: thr(A.icSup), f: (v) => (v == null ? '—' : usd2(v)), k: 'est' });
  }
  lista.push({ n: T('eCosto', Math.round(pct * 100)), lo: (C.v.aiGain / (C.v.aiCost * (1 + pct))) * 100, mid: r.aiEffectiveness, hi: (C.v.aiGain / (C.v.aiCost * (1 - pct))) * 100, f: (v) => f3(v), k: 'esc' });
  const cont = el('div');
  if (!conIC) cont.append(el('p', { class: 'lab-small lab-muted' }, T('sinIntervalo')));
  lista.forEach((e) => {
    const row = el('div', { style: 'margin:8px 0' });
    row.append(el('div', { class: 'lab-small' }, e.n + ' (' + T(e.k) + ')'));
    const W = Math.max(240, box.clientWidth), H = 26;
    const vs = [e.lo, e.mid, e.hi].filter((v) => v != null && Number.isFinite(v));
    if (vs.length) {
      const svg = d3.select(row).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', e.n);
      const x = d3.scaleLinear().domain([Math.min(0, d3.min(vs)), d3.max(vs) * 1.1 || 1]).range([10, W - 10]);
      const c = e.k === 'esc' ? LILA : AZUL;
      if (e.lo != null && e.hi != null) svg.append('line').attr('x1', x(e.lo)).attr('x2', x(e.hi)).attr('y1', 12).attr('y2', 12).style('stroke', c).style('stroke-width', e.k === 'esc' ? 8 : 2).style('stroke-opacity', e.k === 'esc' ? 0.35 : 1);
      if (e.mid != null) svg.append('circle').attr('cx', x(e.mid)).attr('cy', 12).attr('r', 5).style('fill', c);
    }
    row.append(el('div', { class: 'lab-small lab-muted lab-num' }, T('bajo') + ' ' + e.f(e.lo) + ' · ' + T('central') + ' ' + e.f(e.mid) + ' · ' + T('alto') + ' ' + e.f(e.hi)));
    cont.append(row);
  });
  box.append(cont);
});
reg('tornadoChart', (box) => {
  const r = needAll(box); if (!r) return;
  if (r.relativeEffectiveness == null) { box.textContent = T('noDef'); return; }
  box.replaceChildren();
  const base = r.relativeEffectiveness, keys = ['aiGain', 'aiCost', 'altGain', 'altCost'], names = T('tn');
  const items = keys.map((k, idx) => {
    const calc = (f) => { const v = { ...C.v, [k]: C.v[k] * f }; try { return calculateInvestment({ aiGain: v.aiGain, alternativeGain: v.altGain, aiCost: v.aiCost, alternativeCost: v.altCost }).relativeEffectiveness; } catch (e) { return null; } };
    const a = calc(0.8), b = calc(1.2);
    return { n: names[idx], lo: Math.min(a, b), hi: Math.max(a, b), a, b };
  }).sort((p, q) => (q.hi - q.lo) - (p.hi - p.lo));
  const W = Math.max(280, box.clientWidth), m = { t: 6, r: 50, b: 26, l: 150 }, rowH = 28, H = m.t + m.b + items.length * rowH;
  const x = d3.scaleLinear().domain([Math.min(base, d3.min(items, (i) => i.lo)) * 0.95, Math.max(base, d3.max(items, (i) => i.hi)) * 1.05]).range([m.l, W - m.r]);
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`).attr('role', 'img').attr('aria-label', 'Tornado');
  svg.append('g').attr('transform', `translate(0,${H - m.b})`).call(d3.axisBottom(x).ticks(5).tickFormat(axisFmt(',.2f')));
  svg.append('line').attr('x1', x(base)).attr('x2', x(base)).attr('y1', m.t).attr('y2', H - m.b).style('stroke', 'var(--color-fg)');
  const tt = tip(box);
  items.forEach((it, i) => {
    const y = m.t + i * rowH;
    svg.append('text').attr('x', m.l - 8).attr('y', y + 17).attr('text-anchor', 'end').style('font-size', '12px').style('fill', 'var(--color-fg)').text(it.n);
    svg.append('rect').attr('x', x(it.lo)).attr('y', y + 6).attr('height', 16).attr('width', Math.max(1, x(it.hi) - x(it.lo))).style('fill', AZUL).style('fill-opacity', 0.6)
      .on('mousemove', (ev) => tt.show(ev, [it.n, '−20%: ' + f3(it.a), '+20%: ' + f3(it.b), T('base') + ': ' + f3(base)])).on('mouseleave', () => tt.hide());
  });
});

/* ===================== Costos y escala ===================== */

const S = {};
const leerS = () => { document.querySelectorAll('#simulador input[data-s], #simulador input[data-b]').forEach((i) => { S[i.dataset.s || i.dataset.b] = Number(i.value); }); };
function modeloCostos() {
  leerS();
  const n = Math.max(0, S.nEst || 0), meses = Math.max(0, S.meses || 0);
  const variables = n * (S.sesMes || 0) * meses * (S.costoSesion || 0) + (S.licencia || 0) * (meses / 12) + n * (S.varEst || 0) * meses;
  const fijos = (S.fijo || 0) + (S.docente || 0), total = fijos + variables;
  return { fijos, variables, total, porEst: n > 0 ? total / n : NaN };
}
reg('costosOut', (box) => {
  const r = modeloCostos();
  const tile = (v, l) => { const t = el('div', { class: 'lab-tile' }); t.append(el('span', { class: 'v' }, v), el('span', { class: 'l' }, l)); return t; };
  box.replaceChildren(tile(usd2(r.fijos), T('costosFijos')), tile(usd2(r.variables), T('costosVar')), tile(usd2(r.total), T('costoTot')), tile(Number.isFinite(r.porEst) ? usd2(r.porEst) : '—', T('costoPE')));
});
document.querySelectorAll('#simulador input[data-s]').forEach((i) => i.addEventListener('input', () => dash.draw('costosOut')));
document.querySelectorAll('#simulador input[data-b]').forEach((i) => i.addEventListener('input', () => dash.draw('presupuestoOut')));
document.querySelectorAll('#btn-usar-costo').forEach((b) => b.addEventListener('click', () => {
  const r = modeloCostos();
  if (!Number.isFinite(r.porEst) || r.porEst <= 0) return;
  const v = Math.round(r.porEst * 100) / 100;
  C.v.aiCost = v; C.st.aiCost = 'Usuario'; setInput('aiCost', v);
  document.querySelectorAll('#simulador input[data-b="costoIA"]').forEach((i) => { i.value = String(v); });
  redibujarCalc(); dash.draw('presupuestoOut'); abrir('calculadora');
}));
document.querySelectorAll('#btn-desde-calc').forEach((b) => b.addEventListener('click', () => {
  Object.entries({ costoIA: 'aiCost', costoAlt: 'altCost', ganIA: 'aiGain', ganAlt: 'altGain' }).forEach(([bk, ck]) => {
    if (Number.isFinite(C.v[ck])) document.querySelectorAll('#simulador input[data-b="' + bk + '"]').forEach((i) => { i.value = String(C.v[ck]); });
  });
  dash.draw('presupuestoOut');
}));
const PRESETS = { piloto: { presupuesto: 15000, poblacion: 1000 }, distrito: { presupuesto: 500000, poblacion: 50000 }, nacional: { presupuesto: 20000000, poblacion: 2000000 } };
document.querySelectorAll('#simulador [data-preset]').forEach((b) => b.addEventListener('click', () => {
  Object.entries(PRESETS[b.dataset.preset]).forEach(([k, v]) => document.querySelectorAll('#simulador input[data-b="' + k + '"]').forEach((i) => { i.value = String(v); }));
  dash.draw('presupuestoOut');
}));
reg('presupuestoOut', (box) => {
  leerS();
  const t = el('table'), th = el('thead'), hr = el('tr');
  T('presCols').forEach((c) => hr.append(el('th', null, c)));
  th.append(hr);
  const tb = el('tbody');
  [{ n: T('presIA'), costo: S.costoIA, gan: S.ganIA }, { n: T('presComp'), costo: S.costoAlt, gan: S.ganAlt }].forEach((o) => {
    const row = el('tr');
    if (!(o.costo > 0) || !(S.presupuesto >= 0) || !(S.poblacion > 0)) row.append(el('td', null, o.n), el('td', { colspan: '5' }, T('presFalta')));
    else {
      const at = Math.min(S.poblacion, Math.floor(S.presupuesto / o.costo)), gasto = at * o.costo;
      [o.n, f0(at), usd2(gasto), usd2(S.presupuesto - gasto), fmt.pct(at / S.poblacion), Number.isFinite(o.gan) ? f3((o.gan / o.costo) * 100) : '—'].forEach((v, i) => row.append(el('td', { class: i ? 'lab-num' : '' }, v)));
    }
    tb.append(row);
  });
  t.append(th, tb);
  let umbral = T('noInterp');
  try { const r = calculateInvestment({ aiGain: S.ganIA, alternativeGain: S.ganAlt, aiCost: S.costoIA, alternativeCost: S.costoAlt }); if (r.threshold != null) umbral = usd2(r.threshold); } catch (e) { umbral = '—'; }
  const p = el('p', { class: 'lab-small', style: 'margin-top:8px' });
  p.append(document.createTextNode(T('presUmbral')), el('b', { class: 'lab-num' }, umbral), document.createTextNode(T('presSup')));
  box.replaceChildren(t, p);
});

/* ===================== Brechas y metodología ===================== */

reg('brechasBody', (tb) => {
  const d = dash.data('brechas');
  if (d.status !== 'ok' || !d.data) { tb.replaceChildren(); return; }
  tb.replaceChildren(...d.data.map((r) => {
    const row = el('tr', { 'data-key': encodeURIComponent(r.clave) });
    row.append(el('td', null, T('br_' + r.clave)), el('td', { class: 'lab-num' }, String(r.nEstudios)), el('td', { class: 'lab-num' }, String(r.nBase)), el('td', { class: 'lab-muted' }, r.lista));
    return row;
  }));
});
reg('panorama', (box) => {
  const d = dash.data(panId());
  if (d.status !== 'ok' || !d.data) { box.replaceChildren(el('p', { class: 'lab-small lab-muted' }, d.status === 'loading' ? T('cargando') : d.status === 'connect' ? '' : T('failed'))); return; }
  box.replaceChildren(...d.data.map((r) => el('p', { class: 'lab-small', style: 'margin:0 0 6px' }, r.linea)));
  if (L === 'pt') box.prepend(el('p', { class: 'lab-small lab-muted' }, T('textoConector')));
});
reg('fuentesList', (box) => {
  const d = dash.data('fuentes');
  if (d.status !== 'ok') { failMsg(box, d.status); return; }
  const K = T('fCampos');
  box.replaceChildren(...d.data.map((f) => {
    const c = el('div', { style: 'margin-bottom:12px' });
    const h = el('h3'); h.append(el('a', { href: f.enlace, target: '_blank', rel: 'noopener' }, tr(f, 'nombre')), document.createTextNode(' · ' + tr(f, 'rol')));
    const dl = el('dl');
    [[K[0], tr(f, 'conector')], [K[1], tr(f, 'estado')], [K[2], tr(f, 'cobertura')], [K[3], f.fechaConsulta]].forEach(([k, v]) => dl.append(el('dt', null, k), el('dd', null, v)));
    c.append(h, dl);
    return c;
  }));
});
reg('mapeoResumen', (box) => {
  const d = dash.data('mapeo');
  if (d.status !== 'ok' || !d.data) { failMsg(box, d.status); return; }
  const cnt = d3.rollups(d.data, (v) => v.length, (r) => r.categoria);
  box.replaceChildren(el('p', { class: 'lab-small' }, cnt.map(([k, n]) => T('cat_' + k) + ': ' + n).join(' · ') + ' · ' + T('totalSinDup') + ': ' + d.data.length));
});
reg('mapeoBody', (tb) => {
  const d = dash.data('mapeo');
  if (d.status !== 'ok' || !d.data) { tb.replaceChildren(); return; }
  tb.replaceChildren(...d.data.map((r) => {
    const row = el('tr', { 'data-key': encodeURIComponent(r.id) });
    row.append(el('td', null, r.estudio), el('td', null, T('ev_' + r.evidencia)), el('td', null, T('sc_' + r.scale)), el('td', null, T('cat_' + r.categoria)));
    return row;
  }));
});
