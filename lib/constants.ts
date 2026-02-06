export const CATEGORIES = [
  '이사/용달',
  '청소',
  '수리/설치',
  '인테리어',
  '철거',
  '기타',
] as const;

export const REGIONS = [
  '서울 마포구',
  '서울 강남구',
  '서울 서초구',
  '서울 송파구',
  '서울 종로구',
  '서울 용산구',
  '서울 기타',
  '경기도',
  '인천',
  '기타 지역',
] as const;

export const REQUEST_STATUS_LABELS = {
  open: '모집중',
  matched: '매칭됨',
  closed: '마감',
} as const;
