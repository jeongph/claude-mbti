import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CODES } from './mbti-types.mjs'

export function pluginRoot() {
  // scripts/ 의 상위가 플러그인 루트
  return path.dirname(path.dirname(fileURLToPath(import.meta.url)))
}
export function profilesDir() {
  return path.join(pluginRoot(), 'profiles')
}
function configDir() {
  return process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude')
}
export function stateFile() {
  return path.join(configDir(), 'mbti', 'state.json')
}
export function isValidType(code) {
  return typeof code === 'string' && CODES.includes(code.toLowerCase())
}
export function getState() {
  try {
    const raw = readFileSync(stateFile(), 'utf8')
    const s = JSON.parse(raw)
    return isValidType(s.type) ? s : null
  } catch {
    return null // 없음/손상 → off 로 간주 (fail-open)
  }
}
export function setState(code) {
  if (!isValidType(code)) throw new Error(`알 수 없는 유형: ${code}`)
  const state = { type: code.toLowerCase(), since: new Date().toISOString(), scope: 'global' }
  mkdirSync(path.dirname(stateFile()), { recursive: true })
  writeFileSync(stateFile(), JSON.stringify(state, null, 2))
  return state
}
export function clearState() {
  if (existsSync(stateFile())) rmSync(stateFile())
}
export function randomType() {
  // 결정적 랜덤 회피 불필요 — 일반 스크립트이므로 Math.random 허용
  return CODES[Math.floor(Math.random() * CODES.length)]
}
export function buildInjection(code) {
  const guardrail = readFileSync(path.join(profilesDir(), '_guardrail.md'), 'utf8')
  const profile = readFileSync(path.join(profilesDir(), `${code.toLowerCase()}.md`), 'utf8')
  return `${guardrail}\n\n---\n\n${profile}`
}
