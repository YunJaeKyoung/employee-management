/**
 * ============================================================
 * [학습 포인트] 재사용 가능한 폼 컴포넌트
 * ============================================================
 *
 * 이 폼은 직원 등록(Create)과 수정(Edit) 모두에서 사용됩니다.
 * initialData prop이 있으면 수정 모드, 없으면 등록 모드입니다.
 *
 * [설계 원칙: 하나의 컴포넌트, 두 가지 용도]
 *
 * 등록: <EmployeeForm onSubmit={createEmployee} departments={departments} />
 * 수정: <EmployeeForm initialData={employee} onSubmit={updateEmployee} departments={departments} />
 *
 * initialData가 있으면 폼이 기존 데이터로 채워집니다.
 *
 * [JSP 비교]
 * JSP에서도 insert.jsp와 update.jsp를 하나로 합칠 때
 * <c:if test="${not empty employee}"> 로 분기하는 것과 같습니다.
 *
 * [useEffect + initialData]
 * initialData가 변경되면(수정 페이지에서 데이터 로드 완료 시)
 * useEffect가 실행되어 폼을 기존 데이터로 채웁니다.
 * ============================================================
 */

import { useState, useEffect } from 'react'

function EmployeeForm({ initialData, onSubmit, departments = [], isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    hireDate: '',
    salary: '',
    departmentId: '',
  })

  /**
   * [useEffect로 초기 데이터 설정]
   *
   * useEffect(() => { ... }, [initialData])
   * → initialData가 변경될 때 실행됩니다.
   *
   * 수정 페이지에서:
   * 1. 페이지 로드 → API로 직원 데이터 요청
   * 2. 데이터 도착 → initialData가 null에서 실제 데이터로 변경
   * 3. useEffect 실행 → 폼을 기존 데이터로 채움
   *
   * 의존성 배열 [initialData]:
   * → "initialData가 바뀔 때만 실행해라"는 의미
   * → 빈 배열 []이면 "마운트 시 1번만", 배열 없으면 "매 렌더링마다" 실행
   */
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        position: initialData.position || '',
        hireDate: initialData.hireDate || '',
        salary: initialData.salary || '',
        departmentId: initialData.departmentId || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // salary를 숫자로 변환하여 전달
    const submitData = {
      ...formData,
      salary: formData.salary ? Number(formData.salary) : null,
      departmentId: formData.departmentId ? Number(formData.departmentId) : null,
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 이름 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="직원 이름"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 이메일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 연락처 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
          <input
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="010-0000-0000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 직급 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">직급</label>
          <input
            name="position"
            type="text"
            value={formData.position}
            onChange={handleChange}
            placeholder="예: 시니어 개발자"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 입사일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">입사일</label>
          <input
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 연봉 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">연봉 (원)</label>
          <input
            name="salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            placeholder="50000000"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* 부서 선택 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">부서</label>
          {/**
           * [select 요소의 Controlled Component]
           * value={formData.departmentId}로 현재 선택값을 state와 동기화
           * onChange에서 선택이 변경되면 state 업데이트
           *
           * JSP: <select name="departmentId">
           *        <option value="${dept.id}" ${dept.id == employee.departmentId ? 'selected' : ''}>
           * React: value prop으로 제어 (selected 속성 불필요!)
           */}
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">부서 선택</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg
            hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '저장 중...' : initialData ? '수정' : '등록'}
        </button>
      </div>
    </form>
  )
}

export default EmployeeForm
