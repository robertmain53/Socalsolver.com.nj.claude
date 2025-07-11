import { diff_match_patch } from 'diff-match-patch'

export function diffText(oldText: string, newText: string) {
  const dmp = new diff_match_patch()
  const diffs = dmp.diff_main(oldText, newText)
  dmp.diff_cleanupSemantic(diffs)
  return diffs
}

export function formatDiff(diffs: [number, string][]) {
  return diffs.map(([op, text]) => {
    if (op === -1) return `[-${text}-]`  // removed
    if (op === 1) return `{+${text}+}`   // added
    return text // unchanged
  }).join('')
}
