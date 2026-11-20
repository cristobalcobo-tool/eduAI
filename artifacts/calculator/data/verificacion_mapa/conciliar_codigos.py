"""Reconcile the three blind codings (A, B, C) of the included studies.

Rules (PROTOCOLO.md):
  * A factor counts as tested only if at least 2 of 3 coders coded it.
  * The final code is the majority code among the coders who coded it.
  * No majority (2 coders disagree, or 3 different codes) -> adjudication by the lead
    reviewer against the source text, recorded in adjudicaciones.json.
  * A study with no factor tested by majority is dropped from the map (NOFACTOR).
Outputs: codigos_conciliados.json, pendientes_adjudicar.json, acuerdo.json
"""
import json, glob, collections, os

FAC = ['acceso', 'pedagogia', 'duracion', 'contexto', 'docente', 'diseno', 'formacion', 'estudiantes', 'materia']
CODERS = ['A', 'B', 'C']
here = os.path.dirname(os.path.abspath(__file__))


def load(letter):
    out = {}
    for f in sorted(glob.glob(os.path.join(here, f'codificacion_{letter}*.json'))):
        for r in json.load(open(f)):
            out[r['id']] = r
    return out


cod = {L: load(L) for L in CODERS}
ids = json.load(open(os.path.join(here, 'cribado_conciliado.json')))['incluidos']
adj_path = os.path.join(here, 'adjudicaciones.json')
adj = json.load(open(adj_path)) if os.path.exists(adj_path) else {}

missing = {L: [i for i in ids if i not in cod[L]] for L in CODERS}


def fleiss(table):
    # table: list of dicts category -> count, each row sums to n raters
    N = len(table)
    n = sum(table[0].values())
    cats = sorted({c for row in table for c in row})
    p = {c: sum(row.get(c, 0) for row in table) / (N * n) for c in cats}
    P = [(sum(v * v for v in row.values()) - n) / (n * (n - 1)) for row in table]
    Pbar = sum(P) / N
    Pe = sum(v * v for v in p.values())
    return (Pbar - Pe) / (1 - Pe) if Pe < 1 else 1.0, Pbar


final, pend, rows_code, rows_test = {}, [], [], []
fuente_ct = collections.Counter()
for i in ids:
    recs = {L: cod[L].get(i) for L in CODERS}
    if any(r is None for r in recs.values()):
        continue
    dis = collections.Counter(r.get('design', '') for r in recs.values()).most_common(1)[0][0]
    src = collections.Counter(r.get('source_used', '') for r in recs.values()).most_common(1)[0][0]
    fuente_ct[src] += 1
    facs, log = {}, {}
    for f in FAC:
        got = {L: (recs[L].get('factors') or {}).get(f) for L in CODERS}
        codes = {L: g['code'] for L, g in got.items() if g and g.get('code') in ('C', 'M', 'N')}
        rows_code.append(collections.Counter(codes.get(L, '-') for L in CODERS))
        rows_test.append(collections.Counter('T' if L in codes else '-' for L in CODERS))
        if len(codes) < 2:
            if codes:
                log[f] = {'coders': codes, 'decision': 'dropped (only 1 of 3 coders marked it tested)'}
            continue
        top, k = collections.Counter(codes.values()).most_common(1)[0]
        quotes = {L: got[L] for L in codes}
        key = f'{i}|{f}'
        if k >= 2:
            facs[f] = {'code': top, 'agree': f'{k}/3', 'quotes': quotes}
            if len(codes) == 3 and k == 2:
                log[f] = {'coders': codes, 'decision': f'majority {top} (2 of 3)'}
        elif key in adj:
            a = adj[key]
            if a['code'] in ('C', 'M', 'N'):
                facs[f] = {'code': a['code'], 'agree': 'adjudicated', 'quotes': quotes, 'adjudication': a}
            log[f] = {'coders': codes, 'decision': 'adjudicated: ' + a['code'] + '. ' + a.get('reason', '')}
        else:
            pend.append({'key': key, 'id': i, 'factor': f, 'coders': codes, 'quotes': quotes})
    final[i] = {'id': i, 'design': dis, 'source_used': src, 'factors': facs, 'log': log,
                'notes': {L: recs[L].get('note', '') for L in CODERS}}

k_code, po_code = fleiss(rows_code) if rows_code else (None, None)
k_test, po_test = fleiss(rows_test) if rows_test else (None, None)
kept = {i: r for i, r in final.items() if r['factors']}
dropped = sorted(set(final) - set(kept))
acuerdo = {
    'studies_coded_by_all_three': len(final),
    'missing_codings': missing,
    'cells': len(rows_code),
    'fleiss_kappa_code_with_absent': round(k_code, 3) if k_code is not None else None,
    'observed_agreement_code': round(po_code, 3) if po_code is not None else None,
    'fleiss_kappa_tested_or_not': round(k_test, 3) if k_test is not None else None,
    'observed_agreement_tested': round(po_test, 3) if po_test is not None else None,
    'pending_adjudication': len(pend),
    'adjudicated': len(adj),
    'studies_in_map': len(kept),
    'dropped_no_factor_by_majority': dropped,
    'source_used': dict(fuente_ct),
}
json.dump(final, open(os.path.join(here, 'codigos_conciliados.json'), 'w'), ensure_ascii=False, indent=1)
json.dump(pend, open(os.path.join(here, 'pendientes_adjudicar.json'), 'w'), ensure_ascii=False, indent=1)
json.dump(acuerdo, open(os.path.join(here, 'acuerdo.json'), 'w'), ensure_ascii=False, indent=1)
print(json.dumps(acuerdo, ensure_ascii=False, indent=1))
