/**
 * ============================================================
 * [학습 포인트] Layout 컴포넌트 - children과 Outlet
 * ============================================================
 *
 * 레이아웃은 모든 페이지에 공통으로 적용되는 구조입니다.
 * 헤더, 사이드바는 고정이고, 가운데 영역만 페이지에 따라 바뀝니다.
 *
 * [JSP/Thymeleaf 비교]
 * JSP: Apache Tiles의 layout.jsp에서 <tiles:insertAttribute name="body" />
 * Thymeleaf: layout:fragment="content"
 * React: <Outlet /> (React Router v6)
 *
 * 구조:
 * ┌──────────────────────────────────┐
 * │            Header                │
 * ├──────────┬───────────────────────┤
 * │ Sidebar  │                       │
 * │          │    <Outlet />          │
 * │          │    (페이지 내용)        │
 * │          │                       │
 * └──────────┴───────────────────────┘
 * ============================================================
 */

import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 - 모든 페이지에서 고정 */}
      <Header />

      <div className="flex">
        {/* 왼쪽 사이드바 - 모든 페이지에서 고정 */}
        <Sidebar />

        {/* 메인 콘텐츠 영역 - URL에 따라 다른 페이지가 렌더링됨 */}
        <main className="flex-1 p-6 ml-64 mt-16">
          {/**
           * Outlet은 현재 URL에 매칭되는 자식 Route의 컴포넌트를 여기에 렌더링합니다.
           *
           * URL이 /employees 이면 → EmployeeListPage가 여기 나타남
           * URL이 /dashboard 이면 → DashboardPage가 여기 나타남
           *
           * JSP Tiles의 <tiles:insertAttribute name="body" />와 같은 역할!
           */}
            {/*<h1>Outlet 자리에 원래 페이지가 나타납니다</h1>*/}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
