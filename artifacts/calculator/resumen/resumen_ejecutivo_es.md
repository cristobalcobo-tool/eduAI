# Resumen ejecutivo: IA y tutoría en educación

La tutoría con IA puede mejorar el aprendizaje, pero lo que más pesa es cómo se implementa: tiempo protegido en el horario, alguien a cargo de que ocurra y herramientas que exijan esfuerzo. El acceso abierto a chatbots empeora lo que se aprende sin ellos, y la IA generativa todavía no muestra una ventaja clara sobre la práctica adaptativa más barata. La evidencia de costo es escasa (8 de 247 estudios verificados reportan costo por estudiante) y casi no hay ensayos rigurosos de países de ingreso bajo ni de América Latina, así que conviene pilotear con evaluación independiente antes de escalar.

Este resumen acompaña el [Laboratorio de Impacto e Inversión en IA Educativa](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/), un sitio exploratorio que reúne EvidencIA, el Stanford SCALE AI Hub y el AI and Human Skill Atlas.

## Cinco conclusiones para decidir

1. **La estructura rinde más que la herramienta.** En India, lo que se sorteó fueron encargados que aseguraban dos sesiones semanales de Khan Academy, no la plataforma: matemática subió 0,33 a 0,44 desviaciones estándar (DE), a USD 14 por estudiante en siete meses ([Oreopoulos et al., 2026](https://www.nber.org/papers/w34683)). En Tennessee, con el tutor de IA a un clic, la ganancia fue 0,04 DE por trimestre y los autores la atribuyen a la práctica estructurada, no al chat ([Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620)).
2. **El chatbot abierto no enseña.** En Turquía, el acceso libre a GPT 4 mejoró la práctica, pero el examen sin IA cayó 17 %; con pistas en vez de respuestas el daño desapareció, sin ganancia ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)). EvidencIA califica esta lección como consistente.
3. **La IA generativa aún no supera a la práctica adaptativa.** Un metaanálisis de 14 ensayos encuentra 0,125 DE en promedio para tecnología adaptativa y con IA, sin ventaja detectable de la generativa ([Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf), de la propia red de EvidencIA). La tutoría humana logra 0,37 DE en promedio y 0,25 en estudios grandes ([Nickow et al., 2020](https://doi.org/10.3386/w27476)).
4. **El costo se conoce poco.** Solo 8 de los 247 estudios del núcleo verificado reportan costo por estudiante, y cada uno lo calcula distinto (licencias, piloto total o proyección). Sirve como orden de magnitud, no como precio.
5. **La evidencia viene de pocos lugares y muchos la producen los propios desarrolladores.** De 247 estudios verificados, 161 son de países de ingreso alto y 3 de ingreso bajo; en 110 de 161 evaluaciones de herramientas participó el desarrollador, y solo 25 miden aprendizaje dos semanas o más después.

## Las 8 lecciones

La fuerza de la evidencia separa lo que muestran ensayos causales de lo que solo sugieren estudios descriptivos o recomiendan guías y políticas. El detalle y las fuentes de cada lección están en la pestaña Lecciones del sitio.

| Tema | Lección | Evidencia | Qué hacer primero |
| --- | --- | --- | --- |
| Diseño y dosis | Evita los chatbots abiertos para aprender: elige herramientas que exijan esfuerzo. | Causal consistente | Exige que la herramienta dé pistas y pasos, no la respuesta final. |
| Implementación, costo y escala | Paga por la estructura, no solo por la herramienta. | Causal moderada | Reserva sesiones fijas en el horario y presupuesta a alguien que las asegure. |
| Docentes | Apoya a los docentes para enseñar mejor, no solo para preparar más rápido. | Causal moderada | Forma para juzgar las respuestas de la IA y proteger datos; acompaña con coaching. |
| Estudiantes | Enseña a usar la IA como tutor: pedir explicaciones y pasos, no respuestas. | Causal moderada | Da instrucciones concretas de uso y pide que intenten antes de consultar. |
| Infraestructura | Diagnostica primero y diseña para la conectividad que realmente tienes. | Parcial, sobre todo descriptiva | Haz un diagnóstico de preparación y presupuesta dispositivos y soporte técnico. |
| Lugar de uso | Prefiere el horario escolar con supervisión: fuera de la escuela la asistencia cae. | Parcial, sobre todo descriptiva | Integra las sesiones al horario; si es fuera de la escuela, mide la asistencia. |
| Inclusión y equidad | No supongas que la IA cierra brechas: mide desde el inicio quién gana. | Parcial, sobre todo descriptiva | Desagrega resultados por nivel inicial, género, discapacidad, zona y lengua. |
| Privacidad y gobernanza | Protege los datos antes de desplegar: ningún estudio lo prueba, pero casi todas las políticas lo exigen. | Solo guías y políticas | Haz una evaluación de impacto en protección de datos antes de comprar. |

## Efecto y costo

Los programas más baratos no son los de menor efecto, pero cada costo se calculó distinto, así que no deben ordenarse por “efecto por dólar” sin decir qué cubre cada cifra. Efectos con la regla común de EvidencIA (coeficiente dividido por la DE del grupo de control).

| Programa | Efecto (DE) | Costo por estudiante | Qué tener en cuenta |
| --- | --- | --- | --- |
| [Práctica supervisada en Khan Academy, India](https://www.nber.org/papers/w34683) | +0,44 | USD 14 en siete meses, sobre todo personal | 44,5 % sin prueba final; no es IA generativa |
| [Rori por WhatsApp, Ghana](https://doi.org/10.1007/978-3-031-64315-6_34) | +0,37 | USD 5, proyección de los autores | Nivel 2: 11 escuelas, 25 % de pérdida; no es IA generativa |
| [Gemini Guided Learning, Sierra Leona](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) | +0,30 | No reportado | Informe del desarrollador, sin revisión por pares |
| [Copilot como tutor de inglés, Nigeria](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) | +0,24 | USD 48, total del piloto | 42,8 % sin prueba final; suma tiempo extra y supervisión |
| [ShaIA para docentes, Bogotá](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) | +0,21 | USD 9,14, licencias y acompañamiento | Resultado preliminar en 29 de 158 colegios |
| [Tutoría Saga con software, Chicago y Nueva York](https://www.nber.org/papers/w32510) | +0,19 | USD 2.200, tutores humanos incluidos | Prueba estandarizada externa; sin riesgo alto de sesgo |
| [Khanmigo, Tennessee](https://www.nber.org/papers/w35620) | +0,05 | USD 15 al año, solo licencias | Prueba externa; los autores atribuyen el efecto a la práctica, no al chat |

El ensayo de Harvard ([Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6), +0,63) queda fuera de esta tabla: EvidencIA toma su efecto del paper porque no hay datos para aplicar la regla común, y se midió en la misma sesión tras una sola lección.

## Qué tan sólida es la evidencia

Hay una base causal real, pero estrecha: sirve para orientar decisiones, no para prometer un efecto en un país concreto. Cifras de EvidencIA (corte de la base: 16 oct 2026; consultado el 18 nov 2026).

| Indicador | Valor |
| --- | --- |
| Ensayos verificados de nivel 1 (aleatorios, miden aprendizaje sin IA) | 99 estudios: 70 sobre IA, 29 sin IA; 71 de campo y 28 de laboratorio |
| Estudios del núcleo verificado que reportan costo por estudiante | 8 de 247 |
| Estudios del núcleo que miden dos semanas o más después | 25 de 247 |
| Evaluaciones de herramientas con participación del desarrollador | 110 de 161 (31 independientes) |
| Estudios del núcleo por ingreso del país | alto 161, medio alto 36, medio bajo 15, bajo 3 |
| Estudios del núcleo en América Latina y el Caribe | 19 de 247 |

Lo que falta saber: si los efectos duran meses después; qué parte del efecto es de la herramienta y qué parte de la estructura que la acompaña; qué pasa en países de ingreso bajo y en escuelas públicas de la región; si la IA cierra o abre brechas (los ensayos apuntan en ambas direcciones); y si las protecciones de datos que piden las políticas cambian los riesgos. Ningún estudio verificado midió por separado el pensamiento crítico con una prueba.

## Recomendaciones

Estas recomendaciones son una síntesis propia a partir de la evidencia anterior; no provienen de un estudio en particular.

**Para ministerios**

1. Financia la estructura junto con la herramienta: sesiones fijas en el horario, una persona responsable por escuela y seguimiento del uso real.
2. En las compras, exige herramientas que den pistas y pasos en vez de respuestas, con práctica adaptada al nivel; evita el chatbot abierto como herramienta de aprendizaje.
3. Compara con opciones más baratas (práctica adaptativa, tutoría en grupos pequeños) y calcula el costo por estudiante con todo incluido: dispositivos, conectividad, personal y formación.
4. Pilotea antes de escalar, con evaluación aleatoria e independiente, una prueba sin IA y una medición meses después, y resultados desagregados por nivel inicial, género, zona y discapacidad.
5. Antes de adoptar una herramienta, haz una evaluación de impacto en protección de datos y firma acuerdos que dejen los datos en manos de la escuela.

**Para la investigación**

1. Reporta el costo por estudiante con un método común y di qué cubre.
2. Mide con pruebas sin IA, externas y diferidas, no solo al terminar la sesión.
3. Separa el aporte de la herramienta del de la estructura (tiempo extra, supervisión, formación), con brazos que lo permitan.
4. Aumenta las evaluaciones independientes y los ensayos en países de ingreso bajo y en América Latina.
5. Informa resultados por subgrupo y mide habilidades que hoy no se miden, como el pensamiento crítico.

## Fuentes y método

Las cifras vienen del conector de [EvidencIA](https://mcp.redevidencia.org/) (red latinoamericana sobre IA y ciencia del aprendizaje; corte de la base 16 oct 2026, consultado el 18 nov 2026), que incluye la colección del Stanford SCALE AI Hub, y del [AI and Human Skill Atlas](https://aiskillatlas.org/) (versión 2026-11-11.1), usado con atribución para fines exploratorios. Los efectos están en desviaciones estándar con la regla común de EvidencIA; pueden diferir de la cifra que publica cada paper. Las lecciones y recomendaciones las destiló Claude; las lecciones curadas de EvidencIA son un prototipo (versión 0.2.0) pendiente de revisión por su comité. Son insumos para decidir y deben corroborarse en el contexto local.

Estudios citados: [Oreopoulos et al., 2026](https://www.nber.org/papers/w34683) · [Oreopoulos & Low, 2026](https://www.nber.org/papers/w35620) · [Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122) · [Burneo et al., 2026](https://thedocs.worldbank.org/en/doc/2fba81cd6cd60d2f54532fc7062395fb-0050062026/original/Can-EdTech-Close-Learning-Gaps.pdf) · [Nickow et al., 2020](https://doi.org/10.3386/w27476) · [Henkel et al., 2024](https://doi.org/10.1007/978-3-031-64315-6_34) · [LearnLM Team & Fab AI, 2026](https://storage.googleapis.com/deepmind-media/LearnLM/learnLM_sierraleone_may26.pdf) · [De Simone et al., 2025](https://documents.worldbank.org/curated/en/099548105192529324/pdf/IDU-c09f40d8-9ff8-42dc-b315-591157499be7.pdf) · [Barrera-Osorio & Muñoz-Morales, 2026](https://juansmunoz.github.io/AI_Evaluation_Bogota.pdf) · [Bhatt et al., 2024](https://www.nber.org/papers/w32510) · [Kestin et al., 2025](https://doi.org/10.1038/s41598-025-97652-6)

Sitio con el detalle, el explorador de 99 ensayos y la calculadora: [Laboratorio de Impacto e Inversión en IA Educativa](https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/).
