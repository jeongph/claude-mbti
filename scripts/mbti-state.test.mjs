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
