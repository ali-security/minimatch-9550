const t = require('tap')
const minimatch = require('../')

const cases = [
  ['*(+(*(a|b)|c)|d)', 15],
  ['*(*(*(*(*(*(a|f)|g)|h)|i)|j)|k)', 15],
  ['*(+(*(+(*(+(a|m)|n)|o)|p)|q)|r)', 15],
  ['*(*(+(+(?(@(a|t)|u)|v)|w)|x)|y)', 15],
  ['*(*(*(a|a)))', 15],
  ['*(*(*(a|c)))', 17],
  ['*(*(*(a|e)))', 19],
  ['*(*(a|g))', 23],
  ['*(a|i)', 101],
]

for (const [pat, n] of cases) {
  t.test(pat + ' chars=' + n, t => {
    const start = Date.now()
    minimatch('a'.repeat(n) + 'z', pat)
    const elapsed = Date.now() - start
    t.ok(elapsed < 100, 'completed in ' + elapsed + 'ms (< 100ms)')
    t.end()
  })
}
