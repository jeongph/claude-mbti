---
description: MBTI 성격을 켜고 끄고 전환한다 (말투+행동 성향)
argument-hint: "[유형 | off | list | random]"
allowed-tools: Bash(node:*)
---

다음은 `/mbti` 명령 실행 결과다:

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/mbti-state.mjs" cmd $ARGUMENTS`

위 출력을 사용자에게 그대로 전하라. 성격이 활성화/해제되었다면 한 줄로만 담백하게 확인해 주고, 활성화된 경우 그 유형의 말투로 인사 한마디를 덧붙여도 좋다.
