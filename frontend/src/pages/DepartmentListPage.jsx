/**
 * ============================================================
 * [학습 포인트] 한 페이지에서 CRUD 전체 처리 (모달 패턴)
 * ============================================================
 *
 * 직원 관리는 목록/상세/등록/수정이 각각 별도 페이지였지만,
 * 부서 관리는 모달을 사용하여 한 페이지에서 모든 CRUD를 처리합니다.
 *
 * 두 가지 패턴 비교:
 *
 * [멀티 페이지 패턴] (직원 관리)
 * - /employees       → 목록
 * - /employees/new   → 등록 (별도 페이지)
 * - /employees/:id   → 상세 (별도 페이지)
 * - /employees/:id/edit → 수정 (별도 페이지)
 *
 * [싱글 페이지 + 모달 패턴] (부서 관리 - 이 파일)
 * - /departments     → 목록 + 모달로 등록/수정
 *
 * 언제 어떤 패턴을 쓸까?
 * - 데이터가 복잡하고 필드가 많으면 → 멀티 페이지
 * - 데이터가 간단하면 → 싱글 페이지 + 모달
 *
 * [새로운 개념: 여러 상태의 조합]
 * isModalOpen + editingDept로 모달의 모드를 결정:
 * - isModalOpen=true, editingDept=null → 등록 모드
 * - isModalOpen=true, editingDept={...} → 수정 모드
 * ============================================================
 */

import { useState, useEffect } from 'react'
import { departmentApi } from '../api/departmentApi'
import Modal from '../components/common/Modal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import AlertMessage from '../components/common/AlertMessage'

function DepartmentListPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState({ type: '', message: '' })

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState(null) // null이면 등록, 값이 있으면 수정
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 삭제 다이얼로그 상태
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, deptId: null })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll()
      setDepartments(response.data)
    } catch (error) {
      setAlert({ type: 'error', message: '부서 목록을 불러오는데 실패했습니다' })
    } finally {
      setLoading(false)
    }
  }

  /**
   * [등록 모달 열기]
   * editingDept를 null로 설정하여 등록 모드임을 표시
   */
  const openCreateModal = () => {
    setEditingDept(null)
    setFormData({ name: '', description: '' })
    setIsModalOpen(true)
  }

  /**
   * [수정 모달 열기]
   * editingDept에 부서 데이터를 설정하여 수정 모드임을 표시
   * 폼에 기존 데이터를 채움
   */
  const openEditModal = (dept) => {
    setEditingDept(dept)
    setFormData({ name: dept.name, description: dept.description || '' })
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingDept) {
        // 수정 모드
        await departmentApi.update(editingDept.id, formData)
        setAlert({ type: 'success', message: '부서가 수정되었습니다' })
      } else {
        // 등록 모드
        await departmentApi.create(formData)
        setAlert({ type: 'success', message: '부서가 등록되었습니다' })
      }

      setIsModalOpen(false)
      fetchDepartments() // 목록 새로고침
    } catch (error) {
      setAlert({ type: 'error', message: '저장에 실패했습니다' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await departmentApi.delete(deleteDialog.deptId)
      setAlert({ type: 'success', message: '부서가 삭제되었습니다' })
      fetchDepartments()
    } catch (error) {
      setAlert({ type: 'error', message: '삭제에 실패했습니다. 소속 직원이 있는지 확인하세요.' })
    } finally {
      setDeleteDialog({ isOpen: false, deptId: null })
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">부서 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {departments.length}개 부서</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          부서 등록
        </button>
      </div>

      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      {/* 부서 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{dept.description || '설명 없음'}</p>
              </div>
              <div className="flex space-x-1 ml-2">
                <button
                  onClick={() => openEditModal(dept)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteDialog({ isOpen: true, deptId: dept.id })}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 소속 직원 수 배지 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {dept.employeeCount || 0}명
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 등록/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDept ? '부서 수정' : '부서 등록'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">부서명</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="부서명을 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">설명</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="부서 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isSubmitting ? '저장 중...' : editingDept ? '수정' : '등록'}
            </button>
          </div>
        </form>
      </Modal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="부서 삭제"
        message="이 부서를 삭제하시겠습니까? 소속 직원이 있으면 삭제할 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, deptId: null })}
      />
    </div>
  )
}

export default DepartmentListPage
