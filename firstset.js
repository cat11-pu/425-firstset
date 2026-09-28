// firstset.js：是不是非终结符、FIRST 递归、左递归点名、头部撞车（基线：一律给空或假）
export function isNonterminal(rules, symbol) {
  return false;
}

export function firstSet(rules, nt) {
  return [];
}

export function cycleNames(rules, nt) {
  return [];
}

export function sharedHeads(rules, lhs) {
  return [];
}
