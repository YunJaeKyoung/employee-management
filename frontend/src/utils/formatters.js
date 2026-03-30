/**
 * [학습 포인트] 유틸리티 함수
 *
 * 여러 컴포넌트에서 공통으로 사용하는 함수들을 모아둡니다.
 * Spring의 Utility 클래스와 같은 역할입니다.
 */

// 급여 포맷: 50000000 → "5,000만원"
export const formatSalary = (salary) => {
  if (!salary) return '-'
  const man = Math.round(salary / 10000)
  return new Intl.NumberFormat('ko-KR').format(man) + '만원'
}

// 전화번호 포맷: 01012345678 → "010-1234-5678"
export const formatPhone = (phone) => {
  if (!phone) return '-'
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

// 날짜 포맷: 2024-03-15 → "2024년 3월 15일"
export const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}
