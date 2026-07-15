import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const hook = path.join(here, 'inject-personality.mjs')
const state = path.join(here, 'mbti-state.mjs')

function run(configDir) {
  return execFileSync('node', [hook], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: configDir }, encoding: 'utf8',
  })
}

let tmp
beforeEach(() => { tmp = mkdtempSync(path.join(os.tmpdir(), 'mbti-hook-')) })

test('비활성 상태 → 빈 출력, exit 0', () => {
  assert.equal(run(tmp).trim(), '')
})

test('활성 상태 → additionalContext 에 프로파일+경계 포함', () => {
  execFileSync('node', [state, 'cmd', 'intj'], { env: { ...process.env, CLAUDE_CONFIG_DIR: tmp } })
  const out = JSON.parse(run(tmp))
  assert.equal(out.hookSpecificOutput.hookEventName, 'UserPromptSubmit')
  assert.match(out.hookSpecificOutput.additionalContext, /전략가/)
  assert.match(out.hookSpecificOutput.additionalContext, /정확성/)
})
