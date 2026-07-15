// 16개 MBTI 유형 단일 출처. code 는 소문자, name 은 한글 별칭.
export const TYPES = [
  { code: 'intj', name: '전략가' }, { code: 'intp', name: '논리술사' },
  { code: 'entj', name: '통솔자' }, { code: 'entp', name: '변론가' },
  { code: 'infj', name: '옹호자' }, { code: 'infp', name: '중재자' },
  { code: 'enfj', name: '선도자' }, { code: 'enfp', name: '활동가' },
  { code: 'istj', name: '현실주의자' }, { code: 'isfj', name: '수호자' },
  { code: 'estj', name: '경영자' }, { code: 'esfj', name: '집정관' },
  { code: 'istp', name: '장인' }, { code: 'isfp', name: '모험가' },
  { code: 'estp', name: '사업가' }, { code: 'esfp', name: '연예인' },
]
export const CODES = TYPES.map(t => t.code)
