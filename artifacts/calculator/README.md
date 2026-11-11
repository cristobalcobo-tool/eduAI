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

Los datos de EvidencIA no se actualizan solos en esta versión. En el panel original de Claude Data se leen en vivo desde el conector `https://mcp.redevidencia.org/mcp`. Para actualizar la copia, vuelve a ejecutar esas dos herramientas con los mismos argumentos y reemplaza los archivos `.txt` (texto plano, para que GitHub Pages no los convierta en páginas).

## Cómo funciona

`app.js` es el mismo código del panel de Claude Data. `dash-static.js` le entrega el objeto `dash` que espera (datos, cálculos y dibujos) leyendo los archivos de `data/`, para que la página funcione en un sitio estático. D3 7.9.0 se carga desde cdnjs.

## Advertencias

* Los efectos de EvidencIA son los que EvidencIA calcula con una regla común y pueden diferir de la cifra del paper.
* Cada estudio calculó su costo de forma distinta (total de un piloto, licencias, costo marginal o proyección): úsalos como orden de magnitud.
* Las comparaciones entre estudios de países, edades, materias y duraciones distintas son descriptivas, no causales.
