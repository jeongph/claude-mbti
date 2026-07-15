#!/usr/bin/env node
// UserPromptSubmit 훅: 활성 MBTI 프로파일을 additionalContext 로 주입한다.
// fail-open — 어떤 오류에도 세션을 깨지 않고 조용히 통과한다.
import { getState, buildInjection } from './mbti-state.mjs'

try {
  const s = getState()
  if (s) {
    const additionalContext = buildInjection(s.type)
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext },
    }))
  }
} catch (err) {
  process.stderr.write(`[claude-mbti] 주입 생략: ${err.message}\n`)
}
process.exit(0)
