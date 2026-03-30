/**
 * ============================================================
 * [학습 포인트] 조건부 렌더링 & 이벤트 핸들링
 * ============================================================
 *
 * [조건부 렌더링]
 * React에서는 JavaScript 문법으로 조건부 렌더링을 합니다.
 *
 * JSP:    <c:if test="${user != null}">환영합니다</c:if>
 * jQuery: if (user) { $('#welcome').show() }
 * React:  {user && <span>환영합니다</span>}
 *
 * [이벤트 핸들링]
 * jQuery: $('#logout-btn').click(function() { ... })
 * React:  <button onClick={handleLogout}>로그아웃</button>
 *
 * 차이점:
 * - jQuery: DOM에서 요소를 찾아서(select) 이벤트를 연결
 * - React: JSX에서 직접 이벤트를 선언 (더 직관적!)
 * ============================================================
 */

import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Header() {
  // useAuth() 훅으로 전역 인증 상태에 접근
  const { user, logout } = useAuth()

  // useNavigate() 훅으로 프로그래밍 방식의 페이지 이동
  // Spring의 response.sendRedirect()와 비슷
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()            // 인증 상태 초기화
    navigate('/login')  // 로그인 페이지로 이동
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 h-16">
        {/* 로고 */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white rounded-lg p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">직원 관리 시스템</h1>
        </div>

        {/* 사용자 정보 & 로그아웃 */}
        {/**
         * [조건부 렌더링 상세 설명]
         *
         * {user && (...)} 문법:
         * - user가 truthy(값이 있음)이면 → 오른쪽을 렌더링
         * - user가 falsy(null/undefined)이면 → 아무것도 렌더링하지 않음
         *
         * JSP의 <c:if test="${not empty user}"> 와 동일한 역할
         */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {user.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-gray-700 font-medium">{user.name}님</span>
            </div>
            {/**
             * [onClick 이벤트]
             *
             * onClick={handleLogout}
             * → 버튼 클릭 시 handleLogout 함수 실행
             *
             * 주의: onClick={handleLogout()}가 아닙니다!
             * ()를 붙이면 렌더링 시점에 바로 실행됩니다.
             * ()를 빼야 "클릭했을 때" 실행됩니다.
             *
             * jQuery: $('#btn').click(handleLogout)  ← 같은 원리
             */}
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
