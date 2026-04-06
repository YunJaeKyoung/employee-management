/**
 * ============================================================
 * [학습 포인트] Link 컴포넌트 & 현재 위치 감지
 * ============================================================
 *
 * [Link vs <a> 태그]
 * HTML/JSP: <a href="/employees">직원 목록</a>
 *   → 페이지 전체를 새로고침 (서버에 새 요청)
 *
 * React:    <Link to="/employees">직원 목록</Link>
 *   → 페이지 새로고침 없이 URL만 변경 (SPA - Single Page Application)
 *   → 훨씬 빠르고 부드러운 화면 전환!
 *
 * [useLocation 훅]
 * 현재 URL 정보를 가져오는 훅입니다.
 * 사이드바에서 현재 페이지에 해당하는 메뉴를 하이라이트하는 데 사용합니다.
 * ============================================================
 */

import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  // useLocation()으로 현재 URL 경로를 가져옴
  const location = useLocation()

  // 메뉴 항목 배열 - 데이터로 관리하면 추가/수정이 편함
  const menuItems = [
    // {
    //   path: '/hello',
    //   label: '테스트 메뉴',
    //   icon: (
    //       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    //       </svg>
    //   ),
    // },
    {
      path: '/dashboard',
      label: '대시보드',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      path: '/employees',
      label: '직원 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      path: '/departments',
      label: '부서 관리',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ]

  return (
    <aside className="bg-white w-64 min-h-screen border-r border-gray-200 fixed top-16 left-0 pt-6">
      <nav className="px-4 space-y-1">
        {/**
         * [배열 렌더링 - .map()]
         *
         * menuItems 배열을 순회하면서 각 항목을 JSX로 변환합니다.
         *
         * JSP:    <c:forEach var="item" items="${menuItems}">
         * jQuery: $.each(menuItems, function(i, item) { ... })
         * React:  menuItems.map((item) => <Link ... />)
         *
         * [key prop]
         * React가 리스트의 각 항목을 구분하기 위해 필요한 고유 식별자입니다.
         * → DB의 Primary Key처럼, React가 어떤 항목이 변경/추가/삭제되었는지 추적
         */}
        {menuItems.map((item) => {
          // 현재 URL이 메뉴의 path로 시작하는지 확인
          const isActive = location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
