# Laboratorio de Impacto e Inversión en IA Educativa

Calculadora interactiva en español, inglés y portugués para comparar el impacto en el aprendizaje y el costo por estudiante de intervenciones de IA en educación, y para calcular hasta qué costo una intervención sigue siendo mejor compra que una alternativa.

Página: `artifacts/calculator/index.html` (en GitHub Pages, https://cristobalcobo-tool.github.io/eduAI/artifacts/calculator/).

## Secciones

1. **Simulador**: elige A y B, mueve los controles o arrastra los puntos en el mapa; los estudios con valores parecidos se iluminan.
2. **Explorador de evidencia**: tabla filtrable con ficha por estudio.
3. **Impacto en el aprendizaje**: gráfico de bosque y comparaciones descriptivas.
4. **Calculadora de inversión**: umbral de equilibrio, sensibilidad e incertidumbre.
5. **Costos y escala**: modelo de costos y simulación de presupuesto (todo proyectado).
6. **Brechas de investigación** y **Fuentes y metodología**.

## Origen de los datos

| Archivo | Contenido | Estado |
|---|---|---|
| `data/evidencia_es.txt`, `data/evidencia_en.txt` | Tabla de la herramienta `compare_studies` del conector EvidencIA para 8 estudios | Copia del 11 nov 2026; corte de la base EvidencIA: 16 oct 2026 |
| `data/panorama_es.txt`, `data/panorama_en.txt` | Texto de la herramienta `evidence_overview` del conector EvidencIA | Copia del 11 nov 2026 |
| `data/estudios.json`, `data/resultados.json` | Lote 1: 9 estudios extraídos de las publicaciones originales y de Stanford SCALE, cotejados con las fichas de EvidencIA | Cada registro dice si está verificado o es provisional |
| `data/escenario.json` | Escenario ilustrativo de la calculadora: 0,125 DE de Burneo et al. (2026) y tres supuestos hipotéticos | Ilustrativo |
| `data/fuentes.json`, `data/simulador.json` | Registro de fuentes y selección de estudios del simulador | |
| `data/contexto.json` | Intensidad, uso, apoyo humano, infraestructura y qué explica el resultado de cada estudio del simulador, resumidos de las fichas de EvidencIA | Resumen del 11 nov 2026 |
| `data/estandarizacion.json` | Para cada estudio de la tabla de costos de EvidencIA: si su efecto se calculó con la regla común (coeficiente dividido por la DE del grupo de control) o se tomó del paper, según la ficha `view_study` | Consulta del 12 nov 2026 |
| `data/atlas_estimaciones.json`, `data/atlas_estudios.json` | Copia de la versión 2026-11-11.1 del AI and Human Skill Atlas (repositorio público germanr/ai-skill-atlas, Germán Reyes, Middlebury College): 184 estimaciones de 43 estudios, con las columnas que usa la página | Sin licencia explícita en el repositorio; uso exploratorio con atribución |

Los datos de EvidencIA no se actualizan solos en esta versión. En el panel original de Claude Data se leen en vivo desde el conector `https://mcp.redevidencia.org/mcp`. Para actualizar la copia, vuelve a ejecutar esas dos herramientas con los mismos argumentos y reemplaza los archivos `.txt` (texto plano, para que GitHub Pages no los convierta en páginas).

## Cómo funciona

`app.js` es el mismo código del panel de Claude Data. `dash-static.js` le entrega el objeto `dash` que espera (datos, cálculos y dibujos) leyendo los archivos de `data/`, para que la página funcione en un sitio estático. D3 7.9.0 se carga desde cdnjs.

## Advertencias

* Los efectos de EvidencIA son los que EvidencIA calcula con una regla común y pueden diferir de la cifra del paper.
* Por defecto, el simulador, la pestaña Decidir y la calculadora muestran solo efectos estandarizados con la regla común de EvidencIA. Hoy queda oculto Kestin et al. (2025), cuyo efecto EvidencIA toma del paper porque no hay datos para aplicar la regla, y las cifras del lote 1, tomadas de cada paper. Un interruptor permite verlos, marcados con ⚠.
* Las cifras del AI Skill Atlas son las que registra el Atlas para cada estimación; no se verificó si usan la misma regla de estandarización que EvidencIA. El Atlas no trae costos, así que no entra en la calculadora.
* Cada estudio calculó su costo de forma distinta (total de un piloto, licencias, costo marginal o proyección): úsalos como orden de magnitud.
* Las comparaciones entre estudios de países, edades, materias y duraciones distintas son descriptivas, no causales.
