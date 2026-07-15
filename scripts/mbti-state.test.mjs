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
