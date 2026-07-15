import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

test('hooks.json 은 UserPromptSubmit 에 inject-personality 를 등록', () => {
  const h = JSON.parse(readFileSync(path.join(root, 'hooks/hooks.json'), 'utf8'))
  const cmds = JSON.stringify(h.hooks.UserPromptSubmit)
  assert.match(cmds, /inject-personality\.mjs/)
  assert.match(cmds, /CLAUDE_PLUGIN_ROOT/)
})

test('mbti.md 는 필수 프론트매터와 스크립트 호출을 포함', () => {
  const md = readFileSync(path.join(root, 'commands/mbti.md'), 'utf8')
  assert.match(md, /argument-hint:/)
  assert.match(md, /allowed-tools:.*Bash/)
  assert.match(md, /mbti-state\.mjs/)
  assert.match(md, /\$ARGUMENTS/)
})
