/**
 * [학습 포인트] 유효성 검사 유틸리티
 *
 * 폼 유효성 검사 로직을 별도로 분리하면
 * 여러 폼에서 재사용할 수 있고, 테스트도 쉬워집니다.
 */

export const validateEmail = (email) => {
  if (!email) return true // 선택 필드
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePhone = (phone) => {
  if (!phone) return true // 선택 필드
  const regex = /^01[0-9]-?\d{3,4}-?\d{4}$/
  return regex.test(phone)
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}
