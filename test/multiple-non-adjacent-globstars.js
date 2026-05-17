const t = require('tap')
const minimatch = require('../')

t.test('GHSA-7r86-cg39-jmmj', t => {
  const k = 50
  const pattern =
    Array.from({ length: k }, () => '**/a').join('/') + '/b/**'
  const patha = Array(100).fill('a').join('/') + '/a'
  const pathb = Array(100).fill('a').join('/') + '/b/c/d/.e/a/b'

  const starta = Date.now()
  t.equal(minimatch(patha, pattern), false)
  const dura = Date.now() - starta
  t.ok(dura < 1000, 'should take less than 1s to find mismatch')

  const startb = Date.now()
  t.equal(minimatch(pathb, pattern, { dot: true }), true)
  const durb = Date.now() - startb
  t.ok(durb < 1000, 'should take less than 1s to find match')

  const startc = Date.now()
  t.equal(minimatch(pathb, pattern), false)
  const durc = Date.now() - startc
  t.ok(durc < 1000, 'should take less than 1s to find dot mismatch')

  t.end()
})

t.test('alphabetical', t => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.repeat(5)
  const pattern = '**/' + alphabet.split('').join('/**/') + '/**'
  const exclude = function(c) {
    return alphabet.split('').filter(function(char) { return c !== char })
  }
  const pathParts = alphabet.split('').reduce(function(acc, c) {
    return acc.concat(exclude(c))
  }, [])
  const path = pathParts.join('/') + '/' + exclude('a').concat('a').join('/')
  t.equal(minimatch(path, pattern, { maxGlobstarRecursion: 30 }), false)
  t.equal(minimatch(path, pattern), true)
  t.end()
})

t.test('tail handling 1', t => {
  const pattern = '.x/**/*/*/**'
  const match = '.x/.y/.z/'
  const nomatch = '.x/.y/.z'
  t.equal(minimatch(match, pattern, { dot: true }), true)
  t.equal(minimatch(nomatch, pattern, { dot: true }), false)
  t.end()
})

t.test('tail handling 2', t => {
  const pattern = '.x/**/**/*'
  const match = '.x/.y/.z/'
  const nomatch = '.x/'
  t.equal(minimatch(match, pattern, { dot: true }), true)
  t.equal(minimatch(nomatch, pattern, { dot: true }), false)
  t.end()
})
