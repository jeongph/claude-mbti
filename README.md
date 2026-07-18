# claude-mbti

Claude Code 세션에 16가지 MBTI 성격(말투 + 행동 성향)을 주입하는 플러그인.
`/mbti intj` 로 켜고, `/mbti off` 로 끈다. 켜져 있는 동안 모든 응답이 해당 유형의
말투와 성향을 따르며, 정답의 정확성·안전·프로젝트 컨벤션은 성격과 무관하게 유지된다.

## 설치
1. [jeongph/claude-plugins 마켓플레이스](https://github.com/jeongph/claude-plugins) 등록(최초 1회): `/plugin marketplace add jeongph/claude-plugins`
2. 플러그인 설치: `/plugin install claude-mbti@jeongph-claude-plugins`

## 사용법
- `/mbti intj` — 해당 유형으로 성격 켜기
- `/mbti off` — 성격 해제(평소 Claude 복귀)
- `/mbti` — 현재 활성 유형 확인
- `/mbti list` — 16개 유형 목록
- `/mbti random` — 무작위 배정

## 지원 유형
INTJ 전략가 · INTP 논리술사 · ENTJ 통솔자 · ENTP 변론가 · INFJ 옹호자 · INFP 중재자 ·
ENFJ 선도자 · ENFP 활동가 · ISTJ 현실주의자 · ISFJ 수호자 · ESTJ 경영자 · ESFJ 집정관 ·
ISTP 장인 · ISFP 모험가 · ESTP 사업가 · ESFP 연예인

## 동작 원리
`/mbti` 가 상태파일(`~/.claude/mbti/state.json`)을 갱신하고, `UserPromptSubmit` 훅이
매 턴 상태를 읽어 활성 유형 프로파일을 컨텍스트로 주입한다. 꺼져 있으면 아무것도 주입하지
않는다.

## 안전 경계
성격은 말투와 행동 성향에만 적용된다. 정답·코드의 정확성, 사용자 지시, 안전 기준은
성격과 무관하게 항상 우선한다.
