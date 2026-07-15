import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { CODES } from './mbti-types.mjs'
import { profilesDir, buildInjection } from './mbti-state.mjs'

test('_guardrail.md 존재 및 안전 문구 포함', () => {
  const g = readFileSync(path.join(profilesDir(), '_guardrail.md'), 'utf8')
  assert.match(g, /정확성/)
})
for (const code of CODES) {
  test(`${code}.md 존재 및 4개 섹션 포함`, () => {
    const p = path.join(profilesDir(), `${code}.md`)
    assert.ok(existsSync(p), `${code}.md 없음`)
    const body = readFileSync(p, 'utf8')
    for (const h of ['말투', '설명', '상호작용', '하지 않는']) {
      assert.match(body, new RegExp(h), `${code}.md 에 "${h}" 섹션 없음`)
    }
  })
  test(`buildInjection(${code}) 은 경계+프로파일 결합`, () => {
    const combined = buildInjection(code)
    assert.match(combined, /정확성/)      // 경계
    assert.match(combined, /## 말투/)     // 프로파일
  })
}
