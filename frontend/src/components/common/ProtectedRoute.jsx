/**
 * ============================================================
 * [학습 포인트] 라우트 가드 (Route Guard)
 * ============================================================
 *
 * 로그인하지 않은 사용자가 보호된 페이지에 접근하면
 * 자동으로 로그인 페이지로 리다이렉트합니다.
 *
 * [Spring Security 비교]
 * SecurityConfig에서 .authorizeHttpRequests()로 보호하는 것과 같은 역할입니다.
 *
 * Spring:  .requestMatchers("/api/employees/**").authenticated()
 * React:   <Route element={<ProtectedRoute />}>
 *            <Route path="/employees" ... />
 *          </Route>
 *
 * [핵심 개념]
 * - Outlet: 중첩 라우트의 자식 컴포넌트를 렌더링하는 위치
 *   → App.jsx에서 <Route element={<ProtectedRoute />}> 안에 있는
 *     자식 Route들이 <Outlet /> 위치에 나타남
 *
 * - Navigate: 프로그래밍 방식으로 다른 페이지로 이동
 *   → Spring의 response.sendRedirect()와 같음
 * ============================================================
 */

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  // 로딩 중이면 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // 로그인하지 않았으면 로그인 페이지로 이동
  if (!user) {
    return <Navigate to="/login" replace />
  }

  /**
   * Outlet은 App.jsx의 중첩 Route에서 자식 컴포넌트가 렌더링되는 위치입니다.
   *
   * <Route element={<ProtectedRoute />}>     ← ProtectedRoute가 먼저 체크
   *   <Route path="/dashboard" ... />         ← 통과하면 여기가 Outlet에 렌더링
   * </Route>
   */
  return <Outlet />
}

export default ProtectedRoute
