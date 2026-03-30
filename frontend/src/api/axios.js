/**
 * ============================================================
 * [학습 포인트] Axios 인스턴스 & Interceptor
 * ============================================================
 *
 * Axios는 HTTP 요청을 보내는 라이브러리입니다.
 *
 * [jQuery 비교]
 * jQuery: $.ajax({ url: '/api/employees', type: 'GET', ... })
 * Axios:  axios.get('/api/employees')
 *
 * jQuery: $.ajaxSetup({ headers: { 'Authorization': token } })
 * Axios:  interceptor로 모든 요청에 자동으로 토큰 첨부
 *
 * [핵심 개념]
 * 1. axios.create(): 기본 설정이 적용된 Axios 인스턴스 생성
 *    → baseURL을 설정하면 매번 전체 URL을 쓸 필요 없음
 *
 * 2. Request Interceptor: 요청이 서버로 가기 전에 가로채서 처리
 *    → 여기서는 JWT 토큰을 Authorization 헤더에 자동 첨부
 *    → Spring의 Filter와 비슷한 개념 (요청 전처리)
 *
 * 3. Response Interceptor: 서버 응답을 받은 후 가로채서 처리
 *    → 여기서는 401(인증 실패) 응답을 받으면 자동 로그아웃 처리
 *    → Spring의 ExceptionHandler와 비슷한 개념 (응답 후처리)
 * ============================================================
 */

import axios from 'axios'

// Axios 인스턴스 생성 - 기본 설정을 한 번만 정의하면 모든 요청에 적용됨
const api = axios.create({
  // Vite 프록시가 /api 요청을 localhost:8080으로 전달하므로 baseURL 불필요
  // 프로덕션에서는 여기에 실제 서버 URL을 넣으면 됨
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * [Request Interceptor]
 * 모든 API 요청이 서버로 가기 전에 실행됩니다.
 *
 * 동작 원리:
 * 1. localStorage에서 JWT 토큰을 가져옴
 * 2. 토큰이 있으면 Authorization 헤더에 "Bearer {토큰}" 형태로 추가
 * 3. Spring Security의 JwtAuthenticationFilter가 이 헤더를 읽어서 인증 처리
 *
 * [jQuery 비교]
 * jQuery에서는 $.ajaxSetup()이나 매 요청마다 headers를 설정했지만,
 * Axios에서는 interceptor로 한 번만 설정하면 자동 적용됩니다.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * [Response Interceptor]
 * 서버로부터 응답을 받은 후 실행됩니다.
 *
 * 401 응답 = 인증 실패 (토큰 만료 또는 유효하지 않은 토큰)
 * → localStorage의 토큰을 삭제하고 로그인 페이지로 이동
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 로그인 페이지가 아닌 경우에만 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
