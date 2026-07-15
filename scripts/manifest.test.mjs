import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

test('plugin.json 은 필수 필드를 갖는 유효한 JSON', () => {
  const m = JSON.parse(readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8'))
  assert.equal(m.name, 'claude-mbti')
  assert.match(m.version, /^\d+\.\d+\.\d+$/)
  assert.ok(m.description && m.description.length > 0)
})

test('marketplace.json 은 claude-mbti 플러그인을 나열한다', () => {
  const mk = JSON.parse(readFileSync(path.join(root, '.claude-plugin/marketplace.json'), 'utf8'))
  assert.ok(Array.isArray(mk.plugins))
  assert.ok(mk.plugins.some(p => p.name === 'claude-mbti'))
})
