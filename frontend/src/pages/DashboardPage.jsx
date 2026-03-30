/**
 * ============================================================
 * [학습 포인트] 다중 데이터 표시 & 통계 대시보드
 * ============================================================
 *
 * 이 페이지에서는 하나의 API 호출로 여러 통계 데이터를 가져와서
 * 카드, 리스트, 차트 형태로 보여줍니다.
 *
 * [새로운 학습 내용]
 * 1. 객체 상태 관리: useState에 복잡한 객체를 저장
 * 2. 옵셔널 체이닝 (?.): stats?.totalEmployees
 *    → stats가 null이어도 에러 안 남 (로딩 중 대비)
 * 3. CSS로 간단한 바 차트 구현 (라이브러리 없이)
 *
 * [JSP/jQuery 비교]
 * JSP에서 대시보드를 만들려면:
 * - Controller에서 여러 서비스를 호출해서 Model에 담음
 * - JSP에서 ${totalEmployees} 등으로 표시
 * - 차트는 Chart.js 등 별도 라이브러리
 *
 * React에서는:
 * - useEffect에서 API 호출
 * - state에 데이터 저장
 * - JSX에서 {stats.totalEmployees}로 표시
 * - 간단한 차트는 CSS로도 가능!
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi } from '../api/dashboardApi'
import LoadingSpinner from '../components/common/LoadingSpinner'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats()
        setStats(response.data)
      } catch (error) {
        console.error('대시보드 통계 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return <LoadingSpinner />

  // 부서별 직원 수 차트를 위한 최대값 계산
  const maxCount = stats?.employeesByDepartment?.reduce(
    (max, dept) => Math.max(max, dept.COUNT || 0), 0
  ) || 1

  const formatSalary = (salary) => {
    if (!salary) return '0'
    return new Intl.NumberFormat('ko-KR').format(Math.round(salary / 10000))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">회사 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 4개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="전체 직원"
          value={stats?.totalEmployees || 0}
          unit="명"
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          title="전체 부서"
          value={stats?.totalDepartments || 0}
          unit="개"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <StatCard
          title="평균 연봉"
          value={formatSalary(stats?.averageSalary)}
          unit="만원"
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="이번 달 입사"
          value={stats?.newEmployeesThisMonth || 0}
          unit="명"
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 부서별 직원 수 차트 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">부서별 직원 현황</h2>
          <div className="space-y-3">
            {/**
             * [CSS로 간단한 바 차트 구현]
             *
             * 각 부서의 직원 수를 최대값 대비 비율로 계산하여
             * width 스타일에 적용합니다.
             *
             * 예: 개발팀 5명, 최대 5명 → width: 100%
             *     인사팀 3명, 최대 5명 → width: 60%
             */}
            {stats?.employeesByDepartment?.map((dept, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{dept.DEPARTMENT_NAME}</span>
                  <span className="text-gray-500">{dept.COUNT}명</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(dept.COUNT / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 입사 직원 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">최근 입사 직원</h2>
            <Link
              to="/employees"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              전체 보기
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentEmployees?.map((emp, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {emp.NAME?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{emp.NAME}</p>
                    <p className="text-xs text-gray-500">{emp.POSITION} · {emp.DEPARTMENTNAME}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{emp.HIREDATE}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * [학습 포인트] 작은 컴포넌트로 분리
 *
 * StatCard는 동일한 구조의 통계 카드를 반복 사용하기 위해 분리했습니다.
 * 같은 파일에 정의해도 되고, 별도 파일로 분리해도 됩니다.
 *
 * [동적 클래스 매핑]
 * color prop에 따라 다른 Tailwind 클래스를 적용합니다.
 */
function StatCard({ title, value, unit, color, icon }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {value}<span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
