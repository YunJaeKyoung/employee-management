/**
 * ============================================================
 * [학습 포인트] 폼 제출 & useNavigate
 * ============================================================
 *
 * [useNavigate 훅]
 * 프로그래밍 방식으로 페이지를 이동합니다.
 *
 * Spring: response.sendRedirect("/employees");
 * React:  navigate('/employees');
 *
 * [EmployeeForm 재사용]
 * initialData를 전달하지 않으면 → 빈 폼(등록 모드)
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { employeeApi } from '../api/employeeApi'
import { departmentApi } from '../api/departmentApi'
import EmployeeForm from '../components/employee/EmployeeForm'
import AlertMessage from '../components/common/AlertMessage'

function EmployeeCreatePage() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentApi.getAll()
        setDepartments(response.data)
      } catch (err) {
        console.error('부서 목록 로딩 실패:', err)
      }
    }
    fetchDepartments()
  }, [])

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError('')
    try {
      await employeeApi.create(formData)
      /**
       * [useNavigate로 페이지 이동]
       *
       * 등록 성공 후 목록 페이지로 이동합니다.
       * Spring의 return "redirect:/employees" 와 같은 역할입니다.
       */
      navigate('/employees')
    } catch (err) {
      setError(err.response?.data?.message || '직원 등록에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/employees" className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">직원 등록</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <AlertMessage type="error" message={error} onClose={() => setError('')} />

        {/**
         * [EmployeeForm 재사용]
         * initialData를 전달하지 않음 → 빈 폼으로 렌더링 (등록 모드)
         * onSubmit에 handleSubmit 전달 → 폼 제출 시 API 호출
         */}
        <EmployeeForm
          onSubmit={handleSubmit}
          departments={departments}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default EmployeeCreatePage
