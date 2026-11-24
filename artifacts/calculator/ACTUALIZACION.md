# Actualización mensual de datos

Procedimiento que sigue la tarea programada mensual (último día de cada mes) para mantener el sitio al día con sus fuentes. Lo puede seguir también una persona. Regla general: **no inventar nada**. Cada cifra nueva sale de la fuente y se coteja con la publicación; si algo no se puede verificar, se deja fuera y se anota en el informe.

## Resultado esperado

- Si no hay novedades: no se cambia nada, no se abre PR y no se avisa.
- Si hay novedades: una rama `datos-AAAA-MM` con los cambios, un **pull request sin fusionar** (lo aprueba la persona responsable) y un aviso breve con el resumen.

Nunca fusionar el PR ni publicar sin aprobación.

## 1. Revisar las fuentes

| Fuente | Cómo revisarla | Qué comparar con el sitio |
|---|---|---|
| EvidencIA (primaria) | Conector `https://mcp.redevidencia.org/mcp`: `evidence_overview` y `whats_new` con `max_level: 1`, `sort_by: date_added`, `limit: 25` | Versión y corte de la base, conteos por nivel (en `data/fuentes.json`) y ensayos de nivel 1 que no estén en `data/estudiosElementos.json` (comparar por título y cita) |
| Stanford SCALE | Página https://scale.stanford.edu/research-in-action/understanding-evidence-base-ai-k12-education y búsqueda web de una revisión nueva | Fecha de la revisión y número de estudios causales (en `data/fuentes.json`) |
| AI and Human Skill Atlas | `https://aiskillatlas.org/releases/index.json` (o búsqueda web si no se puede leer) | Versión usada en `data/fuentes.json` (hoy 2026-11-11.1) |
| Consensus | No tiene versiones. No se actualiza el mapa de factores en la tarea mensual: su codificación usa tres revisores y un protocolo propio (`data/verificacion_mapa/PROTOCOLO.md`). Solo se informa si conviene repetirlo. | — |

## 2. Incorporar ensayos nuevos de EvidencIA

Para cada ensayo de nivel 1 que falte en `data/estudiosElementos.json`:

1. Abrir la ficha con `view_study` y la publicación original (enlace de la ficha).
2. Crear un registro con **el mismo esquema** que los existentes: `id`, `cita`, `titulo`, `url`, `nivel`, `advertenciaNivel`, `pais`, `region`, `ingreso`, `nivelEducativo`, `materia`, `tipo`, `generativa`, `conIA`, `herramienta`, `diseno`, `muestra`, `duracion`, `efecto`, `veredicto`, `lugar`, `codigos`, `elementos`, `aprendizaje`. Usar los mismos valores de vocabulario que los registros existentes.
3. Los textos (`muestra`, `duracion`, `efecto.texto`, `elementos.*`, `aprendizaje`) van en `es`, `en` y `pt`, en lenguaje simple, y cada dato de `elementos` lleva su página en `pag` cuando la publicación la indica.
4. Copiar cifras, enlaces y nombres letra por letra desde la ficha o la publicación. Si un campo no se informa, usar `not_reported` o `null` como en los registros existentes.
5. Anotar en `data/verificacion/verificacion_log.json` (lista `cambios`) qué se agregó y de dónde salió.
6. Si un ensayo de nivel 1 se deja fuera a propósito, decir por qué en el informe.

## 3. Actualizar conteos y fechas

- `data/fuentes.json`: estado, cobertura y `fechaConsulta` de cada fuente revisada.
- Conteo de ensayos del explorador en `index.html` (hoy "99 ensayos" y "100 registros", en es, en y pt, y en el texto de "Acerca de"). Cambiar todos los idiomas a la vez.
- La línea de fuentes bajo el título del sitio ("copia del …").
- Los videos de "Acerca de" (español e inglés) dicen "más de 100 ensayos". Solo hay que avisar en el informe si el número de ensayos del explorador baja de 101.
- Si una lección o un resumen ejecutivo citan cifras que cambiaron, no reescribirlos: anotarlo en el informe para revisión humana.

## 4. Probar antes de proponer

1. `node --check artifacts/calculator/app.js` y validar que todos los JSON de `data/` cargan.
2. Servir el sitio en local y abrir las tres pestañas en es, en y pt sin errores en la consola. Comprobar que el explorador muestra los registros nuevos.
3. Descargar un PDF de lecciones y uno de consulta para confirmar que se generan.

## 5. Proponer los cambios

- Rama `datos-AAAA-MM`, commit con resumen claro, PR contra `main` **sin fusionar**.
- Cuerpo del PR y aviso: qué fuentes cambiaron, qué ensayos se agregaron (cita y enlace), qué quedó fuera y por qué, y qué requiere revisión humana.
- Si algo falló (sin acceso al conector, al repositorio o a una fuente), avisar igual explicando qué no se pudo revisar.
