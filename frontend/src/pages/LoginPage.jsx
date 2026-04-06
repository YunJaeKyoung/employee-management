/**
 * ============================================================
 * [학습 포인트] 폼 처리 & 비동기 통신 (async/await)
 * ============================================================
 *
 * 이 파일은 React에서 폼(Form)을 다루는 핵심 패턴을 보여줍니다.
 *
 * [JSP/jQuery vs React 폼 처리 비교]
 *
 * === JSP 방식 ===
 * <form action="/auth/login" method="POST">
 *   <input type="text" name="username" />
 *   <button type="submit">로그인</button>
 * </form>
 * → 폼 제출 시 페이지 전체가 새로고침됨
 *
 * === jQuery 방식 ===
 * $('#login-form').submit(function(e) {
 *   e.preventDefault();
 *   var username = $('#username').val();
 *   $.ajax({ url: '/api/auth/login', data: { username: username }, ... });
 * });
 * → 비동기 통신은 하지만, DOM에서 직접 값을 가져옴
 *
 * === React 방식 (이 파일) ===
 * const [username, setUsername] = useState('')
 * <input value={username} onChange={(e) => setUsername(e.target.value)} />
 * → 입력값이 React 상태(state)로 관리됨 (Controlled Component)
 * → 상태가 변하면 UI가 자동으로 업데이트됨
 *
 * [Controlled Component란?]
 * input의 값이 React state에 의해 "제어"되는 패턴입니다.
 * 사용자가 타이핑 → onChange 이벤트 → setState → state 변경 → input에 반영
 *
 * 왜 이렇게 할까?
 * 1. 입력값에 대한 실시간 유효성 검사 가능
 * 2. 여러 input의 값을 한 곳에서 관리 가능
 * 3. 값 변환(대문자 변환 등) 쉬움
 * ============================================================
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  /**
   * [useState로 폼 상태 관리]
   *
   * 각 input의 값을 state로 관리합니다.
   * 이것이 React의 "Controlled Component" 패턴입니다.
   *
   * jQuery에서는:
   *   const username = $('#username').val()  // DOM에서 직접 읽기
   *
   * React에서는:
   *   const [username, setUsername] = useState('')  // state로 관리
   *   // username이 항상 input의 현재 값을 가지고 있음
   */
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  /**
   * [onChange 이벤트 핸들러]
   *
   * input에 값을 입력할 때마다 호출됩니다.
   *
   * e.target.name: input의 name 속성값 ('username' 또는 'password')
   * e.target.value: 사용자가 입력한 값
   *
   * ...formData: 기존 formData를 복사 (Spread 연산자)
   * [e.target.name]: e.target.value: 해당 필드만 새 값으로 덮어쓰기
   *
   * [상태 변화 흐름]
   * 1. 사용자가 'admin' 입력
   * 2. onChange 이벤트 발생
   * 3. setFormData({ username: 'admin', password: '' }) 호출
   * 4. React가 상태 변경을 감지
   * 5. input의 value={formData.username}이 'admin'으로 업데이트
   * 6. 화면에 'admin'이 표시됨
   *
   * jQuery였다면?
   * → 사용자가 입력하면 DOM에 자동 반영되지만, JS 변수와 동기화가 안 됨
   * → 값을 읽으려면 매번 $('#username').val()을 호출해야 함
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    // console.log(`필드:${name}, 값:${value}`)
    setFormData((prev) => ({
      ...prev,       // 기존 값 복사 (다른 필드 유지)
      [name]: value, // 변경된 필드만 업데이트
    }))
  }

  /**
   * [폼 제출 핸들러 - 비동기 처리]
   *
   * async/await를 사용한 비동기 API 호출입니다.
   *
   * [jQuery 비교]
   * $.ajax({
   *   url: '/api/auth/login',
   *   type: 'POST',
   *   data: JSON.stringify({ username, password }),
   *   success: function(data) { window.location.href = '/dashboard' },
   *   error: function(xhr) { alert('로그인 실패') }
   * });
   *
   * → React에서는 async/await + try/catch로 더 깔끔하게 처리
   */
  const handleSubmit = async (e) => {
    // 폼의 기본 동작(페이지 새로고침) 방지 - jQuery의 e.preventDefault()와 같음
    e.preventDefault()

    setError('')
    setIsLoading(true)

    try {
      // AuthContext의 login 함수 호출 (API 요청 + 상태 업데이트)
      await login(formData)

      // 성공 시 대시보드로 이동
      // Spring의 response.sendRedirect("/dashboard")와 같음
      navigate('/dashboard')
    } catch (err) {
      // 실패 시 에러 메시지 표시
      setError(
        err.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* 로고 영역 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">직원 관리 시스템</h2>
          <p className="text-gray-500 mt-2">로그인하여 시작하세요</p>
        </div>

        {/* 에러 메시지 - 조건부 렌더링 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/**
         * [Form 제출]
         * onSubmit={handleSubmit}
         * → 폼 제출(Enter 키 또는 버튼 클릭) 시 handleSubmit 함수 실행
         */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
              아이디
            </label>
            {/**
             * [Controlled Component]
             *
             * value={formData.username} → state의 값을 input에 표시
             * onChange={handleChange}   → 입력 시 state 업데이트
             * name="username"           → handleChange에서 어떤 필드인지 구분
             *
             * 이 세 가지가 Controlled Component의 핵심입니다.
             * input의 값이 항상 React state와 동기화됩니다.
             */}
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
              hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all
              disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {/**
             * [삼항 연산자로 조건부 렌더링]
             * isLoading ? '로그인 중...' : '로그인'
             * → isLoading이 true면 '로그인 중...' 표시, false면 '로그인' 표시
             *
             * JSP: <c:choose><c:when test="${loading}">...</c:when></c:choose>
             */}
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          {/**
           * [Link 컴포넌트]
           * <a> 태그 대신 <Link>를 사용합니다.
           * <a>는 페이지를 새로고침하지만, <Link>는 새로고침 없이 이동합니다 (SPA).
           */}
          <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-700">
            회원가입
          </Link>
        </p>

        {/* 테스트 계정 안내 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 font-medium mb-1">테스트 계정</p>
          <p className="text-xs text-gray-600">아이디: admin / 비밀번호: admin123</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
