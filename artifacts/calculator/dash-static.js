/*
 * Adaptador estático del panel.
 * El panel original corre en Claude Data, que entrega un objeto `dash` con los datos.
 * Este archivo da a app.js el mismo objeto `dash` en un sitio estático (GitHub Pages):
 * lee los datos desde ./data, aplica los loaders y cálculos que declara app.js y vuelve a dibujar.
 * Los datos de EvidencIA son una copia fechada (ver data/README en el README de la carpeta).
 */
(function () {
  const FUENTES = {
    estudios: { url: 'data/estudios.json', tipo: 'json' },
    resultados: { url: 'data/resultados.json', tipo: 'json' },
    escenario: { url: 'data/escenario.json', tipo: 'json' },
    fuentes: { url: 'data/fuentes.json', tipo: 'json' },
    simulador: { url: 'data/simulador.json', tipo: 'json' },
    contexto: { url: 'data/contexto.json', tipo: 'json' },
    estandarizacion: { url: 'data/estandarizacion.json', tipo: 'json' },
    atlas_estimaciones: { url: 'data/atlas_estimaciones.json', tipo: 'json' },
    atlas_estudios: { url: 'data/atlas_estudios.json', tipo: 'json' },
    lecciones: { url: 'data/lecciones.json', tipo: 'json' },
    estudiosElementos: { url: 'data/estudiosElementos.json', tipo: 'json' },
    evidencia_es: { url: 'data/evidencia_es.txt', tipo: 'texto' },
    evidencia_en: { url: 'data/evidencia_en.txt', tipo: 'texto' },
    panorama_es: { url: 'data/panorama_es.txt', tipo: 'texto' },
    panorama_en: { url: 'data/panorama_en.txt', tipo: 'texto' },
  };
  const estado = {}; // id -> {status, data}
  const loaders = {};
  const calcs = {};
  const cacheCalc = {};
  const dibujos = {}; // nombre -> fn
  const alCambiar = [];
  let iniciado = false;
  let pendiente = false;

  function cargar(id) {
    const f = FUENTES[id];
    if (!f || estado[id]) return;
    estado[id] = { status: 'loading', data: [] };
    fetch(f.url)
      .then((r) => { if (!r.ok) throw new Error(r.status + ' ' + f.url); return f.tipo === 'json' ? r.json() : r.text(); })
      .then((respuesta) => {
        let filas = respuesta;
        if (loaders[id]) {
          const out = loaders[id].fn({ answer: respuesta, args: {}, call: () => Promise.reject(new Error('Sin conector en la versión estática')), read: {} });
          filas = Array.isArray(out) ? out : out && (out.rows || out.data) ? (out.rows || out.data) : [];
        }
        estado[id] = { status: 'ok', data: filas };
      })
      .catch((e) => { console.error(e); estado[id] = { status: 'error', data: [], message: String(e) }; })
      .then(() => { Object.keys(cacheCalc).forEach((k) => delete cacheCalc[k]); programar(); });
  }

  function data(id) {
    if (calcs[id]) {
      const c = calcs[id];
      const ins = c.inputs.map((i) => data(i));
      if (ins.some((d) => d.status === 'error')) return { status: 'error', data: null };
      if (ins.some((d) => d.status !== 'ok')) return { status: 'loading', data: null };
      if (!(id in cacheCalc)) {
        try { cacheCalc[id] = c.fn(...ins.map((d) => d.data)); } catch (e) { console.error(e); return { status: 'error', data: null }; }
      }
      return { status: 'ok', data: cacheCalc[id] };
    }
    if (!estado[id]) cargar(id);
    return estado[id] || { status: 'missing', data: [] };
  }

  function correr(nombre) {
    const fn = dibujos[nombre];
    if (!fn) return;
    document.querySelectorAll('[data-draw="' + nombre + '"]').forEach((el) => {
      if (el.closest('[hidden]')) return;
      try { fn(el); } catch (e) { console.error('dibujo ' + nombre, e); }
    });
  }
  function todo() {
    pendiente = false;
    alCambiar.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
    Object.keys(dibujos).forEach(correr);
  }
  function programar() { if (!iniciado || pendiente) return; pendiente = true; requestAnimationFrame(todo); }

  window.dash = {
    data,
    calc: (id, c) => { calcs[id] = c; },
    loader: (id, c) => { loaders[id] = c; },
    draw: (nombre, fn) => {
      if (fn === undefined) { if (iniciado) correr(nombre); return; }
      dibujos[nombre] = typeof fn === 'function' ? fn : (el) => { const m = fn.mount ? fn.mount(el) : undefined; if (fn.update) fn.update(el, m); };
    },
    onData: (fn) => { alCambiar.push(fn); },
    setLink: (nombre) => { try { history.replaceState(null, '', '#' + nombre); } catch (e) { /* sin historial */ } },
    params: () => ({}), setParams: () => {}, resetParams: () => {},
    refresh: () => {},
    colors: ['#2a78d6', '#2e8b57', '#d08a1e', '#7b61c9', '#c15b9a', '#5f7a8f'],
    iniciar: () => {
      iniciado = true;
      todo();
      let t = null;
      window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(programar, 150); });
      new MutationObserver((ms) => { if (ms.some((m) => m.target.classList && m.target.classList.contains('lab-section'))) programar(); }).observe(document.getElementById('dash-root'), { attributes: true, subtree: true, attributeFilter: ['hidden'] });
    },
  };
})();
