/**
 * ============================================================
 * [학습 포인트] useParams - URL에서 파라미터 추출
 * ============================================================
 *
 * App.jsx에서 <Route path="/employees/:id" /> 로 정의한 :id를
 * useParams()로 가져옵니다.
 *
 * [Spring 비교]
 * @GetMapping("/employees/{id}")
 * public Employee getEmployee(@PathVariable Long id) { ... }
 *
 * Spring의 @PathVariable과 같은 역할입니다.
 * URL이 /employees/3 이면 → id = "3"
 *
 * [useEffect 의존성 배열: [id]]
 * URL의 id가 바뀌면 (다른 직원 페이지로 이동하면)
 * useEffect가 다시 실행되어 새 직원 데이터를 가져옵니다.
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { employeeApi } from '../api/employeeApi'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'

function EmployeeDetailPage() {
  /**
   * [useParams() 훅]
   * URL의 동적 파라미터를 추출합니다.
   *
   * Route: path="/employees/:id"
   * URL:   /employees/3
   * → id = "3"
   */
  const { id } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  /**
   * [useEffect + useParams]
   *
   * id가 변경되면 해당 직원의 상세 정보를 API로 조회합니다.
   *
   * 의존성 배열에 [id]를 넣었으므로:
   * - 페이지 첫 로드 시 실행
   * - URL의 id가 바뀌면 다시 실행 (예: /employees/3 → /employees/5)
   */
  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    try {
      const response = await employeeApi.getById(id)
      setEmployee(response.data)
    } catch (error) {
      console.error('직원 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await employeeApi.delete(id)
      navigate('/employees')
    } catch (error) {
      alert('삭제에 실패했습니다')
    }
  }

  const formatSalary = (salary) => {
    if (!salary) return '-'
    return new Intl.NumberFormat('ko-KR').format(salary) + '원'
  }

  if (loading) return <LoadingSpinner />

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">직원을 찾을 수 없습니다</p>
        <Link to="/employees" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            to="/employees"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{employee.name}</h1>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/employees/${id}/edit`}
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            수정
          </Link>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>

      {/* 직원 상세 정보 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">{employee.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{employee.name}</h2>
            <p className="text-gray-500">{employee.position || '직급 미지정'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="이메일" value={employee.email} />
          <InfoItem label="연락처" value={employee.phone} />
          <InfoItem label="부서" value={employee.departmentName} />
          <InfoItem label="직급" value={employee.position} />
          <InfoItem label="입사일" value={employee.hireDate} />
          <InfoItem label="연봉" value={formatSalary(employee.salary)} />
        </div>
      </div>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="직원 삭제"
        message={`${employee.name}님을 삭제하시겠습니까?`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  )
}

/**
 * [학습 포인트] 작은 컴포넌트 분리
 *
 * 반복되는 UI 패턴은 작은 컴포넌트로 분리할 수 있습니다.
 * 같은 파일 안에 정의해도 됩니다. (별도 파일로 분리할 만큼 크지 않을 때)
 */
function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-sm text-gray-900">{value || '-'}</dd>
    </div>
  )
}

export default EmployeeDetailPage
