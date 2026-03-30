/**
 * ============================================================
 * [학습 포인트] 수정 페이지 - 기존 데이터 로드 후 폼 채우기
 * ============================================================
 *
 * 수정 페이지의 흐름:
 * 1. URL에서 직원 ID 추출 (useParams)
 * 2. API로 해당 직원 데이터 조회 (useEffect)
 * 3. EmployeeForm에 initialData로 전달 → 폼 자동 채움
 * 4. 사용자가 수정 후 제출 → update API 호출
 * 5. 상세 페이지로 이동 (useNavigate)
 *
 * [EmployeeForm 재사용]
 * CreatePage와 같은 폼 컴포넌트를 사용하되,
 * initialData prop을 전달하여 기존 데이터로 채웁니다.
 *
 * 같은 컴포넌트를 등록과 수정에서 모두 사용하는 것은
 * React에서 흔한 패턴입니다.
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { employeeApi } from '../api/employeeApi'
import { departmentApi } from '../api/departmentApi'
import EmployeeForm from '../components/employee/EmployeeForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import AlertMessage from '../components/common/AlertMessage'

function EmployeeEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [employee, setEmployee] = useState(null)
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 직원 데이터와 부서 목록을 동시에 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          employeeApi.getById(id),
          departmentApi.getAll(),
        ])
        setEmployee(empRes.data)
        setDepartments(deptRes.data)
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    setError('')
    try {
      await employeeApi.update(id, formData)
      navigate(`/employees/${id}`)
    } catch (err) {
      setError(err.response?.data?.message || '수정에 실패했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link to={`/employees/${id}`} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">직원 수정</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <AlertMessage type="error" message={error} onClose={() => setError('')} />

        {/**
         * [EmployeeForm에 initialData 전달]
         * employee 데이터가 전달되면 EmployeeForm의 useEffect가
         * 이를 감지하고 폼 필드를 기존 데이터로 채웁니다.
         */}
        <EmployeeForm
          initialData={employee}
          onSubmit={handleSubmit}
          departments={departments}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  )
}

export default EmployeeEditPage
