import assert from "node:assert";
import { isNonterminal, firstSet, cycleNames, sharedHeads } from "../firstset.js";
import { step, close } from "../setrun.js";
import { render } from "../app.js";

const base = {
  budget: 1,
  state: { rules: [["s", ["x"]]], firsts: [], lefts: [], clashes: [], ledger: [], applied: [] },
  events: [{ id: 1, kind: "first", nt: "s" }],
  bad_name_code: "E_BAD_NAME", bad_rhs_code: "E_BAD_RHS",
  no_rule_code: "E_NO_RULE", event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("isNonterminal returns a boolean", () => {
  assert.strictEqual(typeof isNonterminal(base.state.rules, "s"), "boolean");
});

check("firstSet returns a list", () => {
  assert.ok(Array.isArray(firstSet(base.state.rules, "s")));
});

check("cycleNames returns a list", () => {
  assert.ok(Array.isArray(cycleNames(base.state.rules, "s")));
});

check("sharedHeads returns a list", () => {
  assert.ok(Array.isArray(sharedHeads(base.state.rules, "s")));
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("6 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
