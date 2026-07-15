import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CODES, TYPES } from './mbti-types.mjs'

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

function nameOf(code) { return (TYPES.find(t => t.code === code) || {}).name || '' }

export function cmd(args) {
  const [head, ...rest] = args.map(a => String(a).trim()).filter(Boolean)
  const verb = (head || '').toLowerCase()

  if (!head) {
    const s = getState()
    return s ? `🎭 현재 성격: ${s.type.toUpperCase()} (${nameOf(s.type)})`
             : '성격이 꺼져 있다. `/mbti <유형>` 으로 켤 수 있다. 목록은 `/mbti list`.'
  }
  if (verb === 'off') { clearState(); return '🎭 성격을 해제했다. 평소 Claude 로 돌아간다.' }
  if (verb === 'list') {
    return ['사용 가능한 16개 유형:', ...TYPES.map(t => `- ${t.code.toUpperCase()} — ${t.name}`)].join('\n')
  }
  if (verb === 'random') {
    const s = setState(randomType())
    return `🎲 무작위 배정: ${s.type.toUpperCase()} (${nameOf(s.type)}) 활성화.`
  }
  const code = (verb === 'set' ? rest[0] : head || '').toLowerCase()
  if (!isValidType(code)) {
    return `알 수 없는 유형: "${code || head}". \`/mbti list\` 로 16개 목록을 확인할 수 있다.`
  }
  const s = setState(code)
  return `🎭 ${s.type.toUpperCase()} (${nameOf(s.type)}) 성격을 활성화했다. 해제는 \`/mbti off\`.`
}

// CLI 진입점: `node mbti-state.mjs cmd <args...>`
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const [sub, ...rest] = process.argv.slice(2)
  if (sub === 'cmd') process.stdout.write(cmd(rest) + '\n')
}
