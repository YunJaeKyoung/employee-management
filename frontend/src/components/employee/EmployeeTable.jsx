/**
 * ============================================================
 * [학습 포인트] 리스트 렌더링 - .map()과 key
 * ============================================================
 *
 * 이 컴포넌트는 직원 목록을 테이블로 렌더링합니다.
 *
 * [JSP/Thymeleaf 비교]
 *
 * === JSTL (JSP) ===
 * <c:forEach var="emp" items="${employees}">
 *   <tr>
 *     <td>${emp.name}</td>
 *     <td>${emp.position}</td>
 *   </tr>
 * </c:forEach>
 *
 * === Thymeleaf ===
 * <tr th:each="emp : ${employees}">
 *   <td th:text="${emp.name}"></td>
 * </tr>
 *
 * === React (.map()) ===
 * {employees.map((emp) => (
 *   <tr key={emp.id}>
 *     <td>{emp.name}</td>
 *   </tr>
 * ))}
 *
 * [key가 꼭 필요한 이유]
 * React가 리스트에서 어떤 항목이 변경/추가/삭제되었는지 식별하기 위함.
 * DB의 Primary Key처럼, 각 항목을 구분하는 고유 식별자입니다.
 * key가 없으면 전체 리스트를 다시 렌더링하므로 성능이 떨어집니다.
 *
 * [Props로 받는 것들]
 * - employees: 표시할 직원 데이터 배열
 * - onEdit: 수정 버튼 클릭 시 호출할 콜백 함수
 * - onDelete: 삭제 버튼 클릭 시 호출할 콜백 함수
 *
 * 이 컴포넌트는 데이터를 "받아서 보여주기만" 합니다.
 * 실제 수정/삭제 로직은 부모(EmployeeListPage)에 있습니다.
 * ============================================================
 */

import { Link } from 'react-router-dom'

function EmployeeTable({ employees, onDelete }) {
  // 급여를 원 단위로 포맷팅
  const formatSalary = (salary) => {
    if (!salary) return '-'
    return new Intl.NumberFormat('ko-KR').format(salary) + '원'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이름</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">직급</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">부서</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">이메일</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">연봉</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {/**
             * [.map() 상세 설명]
             *
             * .map()은 배열의 각 요소를 변환하여 새 배열을 만드는 JavaScript 메서드입니다.
             *
             * employees = [{ id: 1, name: '김철수' }, { id: 2, name: '이영희' }]
             *
             * employees.map((emp) => <tr>...</tr>)
             * → [<tr>김철수</tr>, <tr>이영희</tr>]
             *
             * 결과적으로 배열 속 각 직원마다 <tr> 하나가 생성됩니다.
             */}
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link
                    to={`/employees/${employee.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {employee.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.position || '-'}</td>
                <td className="px-6 py-4">
                  {employee.departmentName && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {employee.departmentName}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.email || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatSalary(employee.salary)}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  {/**
                   * [이벤트 핸들러에 인자 전달]
                   *
                   * onClick={() => onDelete(employee.id)}
                   *
                   * 화살표 함수로 감싸서 클릭 시에만 onDelete가 실행되게 합니다.
                   * onClick={onDelete(employee.id)} 라고 쓰면 렌더링 시 바로 실행됩니다!
                   *
                   * jQuery: $(btn).click(function() { deleteEmployee(id) })
                   * React:  onClick={() => onDelete(id)}
                   */}
                  <Link
                    to={`/employees/${employee.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 데이터가 없을 때 표시 */}
      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">등록된 직원이 없습니다</p>
        </div>
      )}
    </div>
  )
}

export default EmployeeTable
