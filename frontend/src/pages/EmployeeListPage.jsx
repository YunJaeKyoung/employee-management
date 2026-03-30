/**
 * ============================================================
 * [학습 포인트] 복합 상태 관리 - 가장 중요한 학습 파일!
 * ============================================================
 *
 * 이 파일은 React의 핵심 개념들이 모두 모인 곳입니다:
 * - useState: 여러 상태를 동시에 관리
 * - useEffect: 데이터 페칭(fetching)
 * - 자식 컴포넌트와의 통신 (props & 콜백)
 *
 * [전체 데이터 흐름 - jQuery와의 근본적 차이]
 *
 * === jQuery 방식 ===
 * 1. 페이지 로드 → $.ajax로 데이터 가져옴
 * 2. 성공 콜백에서 직접 DOM 조작: $('#table tbody').append('<tr>...')
 * 3. 검색어 변경 → 다시 $.ajax → 다시 DOM 조작
 * 4. 페이지 변경 → 다시 $.ajax → 다시 DOM 조작
 *
 * 문제: DOM 조작 코드가 여기저기 흩어져 있어 관리가 어려움
 *
 * === React 방식 (이 파일) ===
 * 1. 상태(state) 정의: employees, search, page, loading
 * 2. useEffect가 상태 변경을 감지하고 자동으로 API 호출
 * 3. API 응답으로 employees 상태 업데이트
 * 4. React가 자동으로 UI를 다시 그림 (Virtual DOM)
 *
 * 핵심: "상태를 바꾸면 UI가 알아서 업데이트된다"
 * → DOM을 직접 조작할 필요가 없음!
 *
 * [상태 변화 흐름 예시: 검색어 입력]
 * 1. 사용자가 "김" 입력
 * 2. setSearch("김") 호출 → search 상태가 "김"으로 변경
 * 3. useEffect의 의존성 배열에 search가 있으므로 useEffect 재실행
 * 4. API 호출: GET /api/employees?search=김
 * 5. 응답 도착 → setEmployees(새 데이터) 호출
 * 6. React가 EmployeeTable을 새 데이터로 다시 렌더링
 *
 * 이 모든 과정이 자동으로 일어납니다!
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { employeeApi } from '../api/employeeApi'
import { departmentApi } from '../api/departmentApi'
import EmployeeTable from '../components/employee/EmployeeTable'
import SearchBar from '../components/common/SearchBar'
import Pagination from '../components/common/Pagination'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import AlertMessage from '../components/common/AlertMessage'

function EmployeeListPage() {
  /**
   * [여러 개의 useState]
   *
   * 이 페이지는 여러 상태를 동시에 관리합니다.
   * 각 useState는 독립적으로 작동합니다.
   *
   * jQuery에서는 이런 상태들을 그냥 변수로 관리했을 것입니다:
   *   let employees = [];
   *   let search = '';
   *   let currentPage = 0;
   *
   * 하지만 변수를 바꿔도 화면이 자동으로 업데이트되지 않습니다.
   * React의 useState는 값 변경 시 자동으로 화면을 업데이트합니다.
   */
  const [employees, setEmployees] = useState([])     // 직원 목록
  const [loading, setLoading] = useState(true)       // 로딩 상태
  const [search, setSearch] = useState('')           // 검색어
  const [currentPage, setCurrentPage] = useState(0)  // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(0)    // 전체 페이지 수
  const [totalElements, setTotalElements] = useState(0)
  const [departments, setDepartments] = useState([]) // 부서 목록 (필터용)
  const [selectedDept, setSelectedDept] = useState('') // 선택된 부서 필터
  const [alert, setAlert] = useState({ type: '', message: '' })

  // 삭제 확인 다이얼로그 상태
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    employeeId: null,
  })

  /**
   * [useEffect - 데이터 페칭 (핵심!)]
   *
   * useEffect(() => { ... }, [search, currentPage, selectedDept])
   *
   * 이 useEffect는 다음 상황에서 실행됩니다:
   * 1. 컴포넌트가 처음 화면에 나타날 때 (마운트)
   * 2. search 값이 변경될 때 (사용자가 검색어 입력)
   * 3. currentPage 값이 변경될 때 (페이지 이동)
   * 4. selectedDept 값이 변경될 때 (부서 필터 변경)
   *
   * [jQuery 비교]
   * $(document).ready(function() {
   *   loadEmployees();   // 페이지 로드 시
   * });
   * $('#search').on('keyup', function() {
   *   loadEmployees();   // 검색어 변경 시
   * });
   * $('#page-btn').click(function() {
   *   loadEmployees();   // 페이지 변경 시
   * });
   *
   * jQuery에서는 각 이벤트마다 loadEmployees()를 호출해야 하지만,
   * React에서는 useEffect 하나로 모든 상황을 처리합니다.
   * 의존성 배열에 넣은 값이 변하면 자동으로 실행되니까요!
   */
  useEffect(() => {
    fetchEmployees()
  }, [search, currentPage, selectedDept])

  // 부서 목록은 페이지 로드 시 한 번만
  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const params = {
        search,
        page: currentPage,
        size: 10,
      }
      if (selectedDept) {
        params.departmentId = selectedDept
      }

      const response = await employeeApi.getAll(params)
      const data = response.data

      /**
       * [상태 업데이트 → 자동 리렌더링]
       *
       * setEmployees(data.content) 호출 후:
       * 1. React가 employees 상태가 변경됨을 감지
       * 2. 이 컴포넌트를 다시 렌더링 (re-render)
       * 3. EmployeeTable에 새 employees가 props로 전달됨
       * 4. EmployeeTable도 다시 렌더링 → 화면에 새 데이터 표시
       *
       * 이 모든 과정이 자동입니다!
       * jQuery처럼 $('#table').html('') 할 필요 없습니다.
       */
      setEmployees(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
    } catch (error) {
      setAlert({ type: 'error', message: '직원 목록을 불러오는데 실패했습니다' })
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('부서 목록 로딩 실패:', error)
    }
  }

  /**
   * [삭제 처리]
   * 1. 삭제 버튼 클릭 → 확인 다이얼로그 표시
   * 2. 확인 클릭 → API 호출 → 목록 새로고침
   */
  const handleDeleteClick = (employeeId) => {
    setDeleteDialog({ isOpen: true, employeeId })
  }

  const handleDeleteConfirm = async () => {
    try {
      await employeeApi.delete(deleteDialog.employeeId)
      setAlert({ type: 'success', message: '직원이 삭제되었습니다' })
      fetchEmployees() // 목록 새로고침
    } catch (error) {
      setAlert({ type: 'error', message: '삭제에 실패했습니다' })
    } finally {
      setDeleteDialog({ isOpen: false, employeeId: null })
    }
  }

  /**
   * [검색어 변경 핸들러]
   * 검색어가 변경되면 첫 페이지로 리셋합니다.
   */
  const handleSearchChange = (value) => {
    setSearch(value)
    setCurrentPage(0) // 검색 시 첫 페이지로
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">직원 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {totalElements}명의 직원</p>
        </div>
        <Link
          to="/employees/new"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          직원 등록
        </Link>
      </div>

      {/* 알림 메시지 */}
      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      {/* 검색 & 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={handleSearchChange}
            placeholder="이름, 이메일, 직급으로 검색..."
          />
        </div>
        <select
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value)
            setCurrentPage(0)
          }}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        >
          <option value="">전체 부서</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>

      {/* 직원 테이블 또는 로딩 */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/**
           * [Props 전달]
           *
           * EmployeeTable에 employees 데이터와 onDelete 콜백을 전달합니다.
           *
           * employees={employees} → 표시할 데이터
           * onDelete={handleDeleteClick} → 삭제 버튼 클릭 시 호출할 함수
           *
           * EmployeeTable은 받은 데이터를 보여주기만 하고,
           * 실제 삭제 로직은 여기(부모)에서 처리합니다.
           *
           * Spring MVC의 관점에서:
           * - EmployeeListPage = Controller (데이터 처리)
           * - EmployeeTable = View (화면 표시)
           */}
          <EmployeeTable
            employees={employees}
            onDelete={handleDeleteClick}
          />

          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="직원 삭제"
        message="정말 이 직원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, employeeId: null })}
      />
    </div>
  )
}

export default EmployeeListPage
