/**
 * ============================================================
 * [학습 포인트] 최상위 컴포넌트 & React Router 설정
 * ============================================================
 *
 * 이 파일은 React 앱의 "뼈대"입니다.
 * URL에 따라 어떤 페이지(컴포넌트)를 보여줄지 결정합니다.
 *
 * [Spring 비교]
 * Spring에서 @RequestMapping("/employees")이 URL을 Controller에 매핑하듯,
 * React Router는 URL을 컴포넌트에 매핑합니다.
 *
 * Spring:  @GetMapping("/employees") → EmployeeController
 * React:   <Route path="/employees" element={<EmployeeListPage />} />
 *
 * [핵심 개념]
 * 1. BrowserRouter: 브라우저의 URL을 관리하는 최상위 라우터
 *    → HTML5 History API를 사용 (페이지 새로고침 없이 URL 변경)
 *
 * 2. Routes & Route: URL 패턴과 컴포넌트를 매핑
 *    → path="/employees/:id" → :id는 Spring의 @PathVariable과 같음
 *
 * 3. AuthProvider: 인증 상태를 전역으로 관리하는 Context Provider
 *    → Spring의 SecurityContextHolder처럼 어디서든 로그인 정보에 접근 가능
 *    → 이 Provider로 감싸야 하위 컴포넌트에서 useAuth() 훅 사용 가능
 * ============================================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import EmployeeListPage from './pages/EmployeeListPage'
import EmployeeDetailPage from './pages/EmployeeDetailPage'
import EmployeeCreatePage from './pages/EmployeeCreatePage'
import EmployeeEditPage from './pages/EmployeeEditPage'
import DepartmentListPage from './pages/DepartmentListPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    /**
     * BrowserRouter로 전체 앱을 감싸야 React Router가 작동합니다.
     * JSP에서는 서버가 URL을 처리했지만, React에서는 클라이언트(브라우저)가 처리합니다.
     */
    <BrowserRouter>
      {/**
       * AuthProvider로 감싸서 모든 하위 컴포넌트에서 인증 정보에 접근 가능하게 함
       * → Spring의 SecurityContextHolder와 비슷한 역할
       */}
      <AuthProvider>
        <Routes>
          {/* 인증 페이지 - 로그인하지 않아도 접근 가능 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/**
           * 보호된 라우트 - 로그인해야만 접근 가능
           * ProtectedRoute가 로그인 여부를 체크하고,
           * 로그인하지 않았으면 /login으로 리다이렉트합니다.
           *
           * Spring Security의 .authorizeHttpRequests() 설정과 같은 역할
           */}
          <Route element={<ProtectedRoute />}>
            {/* Layout으로 감싸서 공통 헤더/사이드바 표시 */}
            <Route element={<Layout />}>
              {/* 기본 경로(/)로 접근하면 대시보드로 이동 */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* 직원 관리 라우트 */}
              <Route path="/employees" element={<EmployeeListPage />} />
              <Route path="/employees/new" element={<EmployeeCreatePage />} />
              <Route path="/employees/:id" element={<EmployeeDetailPage />} />
              <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />

              {/* 부서 관리 라우트 */}
              <Route path="/departments" element={<DepartmentListPage />} />
            </Route>
          </Route>

          {/* 404 페이지 - 위의 어떤 경로에도 매칭되지 않을 때 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
