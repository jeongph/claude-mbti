import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isValidType, getState, setState, clearState, randomType, stateFile } from './mbti-state.mjs'

let tmp
beforeEach(() => {
  tmp = mkdtempSync(path.join(os.tmpdir(), 'mbti-'))
  process.env.CLAUDE_CONFIG_DIR = tmp
})

test('isValidType 은 16개 유형만 허용', () => {
  assert.equal(isValidType('intj'), true)
  assert.equal(isValidType('INTJ'), true) // 대소문자 무관
  assert.equal(isValidType('xxxx'), false)
  assert.equal(isValidType(''), false)
})

test('getState 는 상태 없으면 null', () => {
  assert.equal(getState(), null)
})

test('setState → getState 라운드트립', () => {
  const s = setState('enfp')
  assert.equal(s.type, 'enfp')
  assert.equal(getState().type, 'enfp')
  assert.ok(existsSync(stateFile()))
})

test('setState 는 잘못된 유형에 throw', () => {
  assert.throws(() => setState('nope'))
})

test('clearState 후 getState 는 null', () => {
  setState('intj')
  clearState()
  assert.equal(getState(), null)
})

test('randomType 은 유효한 코드 반환', () => {
  assert.equal(isValidType(randomType()), true)
})

import { cmd } from './mbti-state.mjs'

test('cmd 빈 인자 → 현재 상태(꺼짐)', () => {
  assert.match(cmd([]), /꺼져 있|없/)
})
test('cmd intj → 활성화 메시지 + 상태 기록', () => {
  const out = cmd(['intj'])
  assert.match(out, /INTJ|전략가/)
  assert.equal(getState().type, 'intj')
})
test('cmd set enfp → 활성화', () => {
  cmd(['set', 'enfp'])
  assert.equal(getState().type, 'enfp')
})
test('cmd off → 해제', () => {
  cmd(['intj'])
  const out = cmd(['off'])
  assert.match(out, /해제|평소|꺼/)
  assert.equal(getState(), null)
})
test('cmd list → 16개 유형 나열', () => {
  const out = cmd(['list'])
  assert.equal((out.match(/\b(intj|intp|entj|entp|infj|infp|enfj|enfp|istj|isfj|estj|esfj|istp|isfp|estp|esfp)\b/gi) || []).length, 16)
})
test('cmd random → 활성화', () => {
  cmd(['random'])
  assert.ok(getState() !== null)
})
test('cmd 잘못된 유형 → 오류 안내(상태 불변)', () => {
  const out = cmd(['zzzz'])
  assert.match(out, /알 수 없|유효하지|목록/)
  assert.equal(getState(), null)
})
test('cmd set (유형 없이) → 크래시 없이 오류 안내', () => {
  let out
  assert.doesNotThrow(() => { out = cmd(['set']) })
  assert.match(out, /알 수 없|유효하지|목록/)
  assert.equal(getState(), null)
})

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const CLI = path.join(path.dirname(fileURLToPath(import.meta.url)), 'mbti-state.mjs')
function runCli(arg) {
  return execFileSync('node', [CLI, 'cmd', arg], {
    env: { ...process.env, CLAUDE_CONFIG_DIR: tmp }, encoding: 'utf8',
  })
}

test('CLI: 공백 포함 단일 인자 "set intj" 를 재분리해 활성화', () => {
  // 커맨드가 "$ARGUMENTS" 를 따옴표로 넘겨도 정상 파싱되어야 한다
  const out = runCli('set intj')
  assert.match(out, /INTJ|전략가/)
  assert.equal(getState().type, 'intj')
})
test('CLI: 셸 메타문자 포함 입력은 유형으로만 취급(인젝션 무력화)', () => {
  const out = runCli('intj; echo PWNED')
  assert.doesNotMatch(out, /PWNED/)          // 부작용 없음
  assert.match(out, /알 수 없|유효하지|목록/) // 유효하지 않은 유형으로 안내
  assert.equal(getState(), null)             // 상태 불변
})
