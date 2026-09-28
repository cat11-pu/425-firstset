// app.js：渲染结果
import { isNonterminal, firstSet, cycleNames, sharedHeads } from "./firstset.js";
import { step, close } from "./setrun.js";

export function render(spec) {
  const events = spec.events || [];
  const half = Math.ceil(events.length / 2);
  const first = step(spec);
  const closed = close(Object.assign({}, spec, { state: first.state }));
  const r1 = step(Object.assign({}, spec, { events: events.slice(0, half) }));
  const r2 = step(Object.assign({}, spec, { state: r1.state, events: events.slice(half) }));
  const closedTwo = close(Object.assign({}, spec, { state: r2.state }));
  const replay = step(Object.assign({}, spec, { state: closed.state }));
  const wide = step(Object.assign({}, spec, { budget: spec.budget + 2 }));
  const full = step(Object.assign({}, spec, { events: events, budget: events.length + 2 }));
  const fullClosed = close(Object.assign({}, spec, { state: full.state }));
  const byName = function (state) {
    return state.firsts.slice().sort(function (a, b) {
      return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    }).map(function (row) { return [row[0], row[1].slice()]; });
  };
  const fingerprint = function (state) {
    return JSON.stringify({
      rules: state.rules, firsts: state.firsts, lefts: state.lefts,
      clashes: state.clashes, ledger: state.ledger, applied: state.applied.length
    });
  };
  const rows = function (list) {
    return (list || []).map(function (row) { return row.slice(); });
  };
  return { firsts: byName(closed.state), lefts: (closed.state.lefts || []).slice(),
           clashes: rows(closed.state.clashes), rule_n: (closed.state.rules || []).length,
           served_first: first.served, served_wide: wide.served,
           pair_differs: first.served !== wide.served,
           ledger_before: first.ledger_before, ledger: rows(first.ledger),
           catchup_n: closed.catchup, ledger_after: closed.state.ledger.length,
           mid_differs: fingerprint(r2.state) !== fingerprint(first.state),
           closed_equal: fingerprint(closedTwo.state) === fingerprint(closed.state),
           replay_new: replay.served, judged: first.judged, judged_bound: first.judged_bound,
           full_diff: fingerprint(closed.state) === fingerprint(fullClosed.state) ? 0 : 1,
           count_events: events.length,
           tail: (isNonterminal([["s", ["x"]]], "x") ? 0 : 1)
                 + firstSet([["s", ["x"]]], "s").length
                 + cycleNames([["s", ["s"]]], "s").length
                 + sharedHeads([["s", ["x"]]], "s").length };
}
