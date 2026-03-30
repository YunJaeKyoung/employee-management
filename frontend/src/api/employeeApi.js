import api from './axios'

export const employeeApi = {
  // 직원 목록 조회 (검색, 페이지네이션 지원)
  getAll: (params) => api.get('/api/employees', { params }),

  // 직원 상세 조회
  getById: (id) => api.get(`/api/employees/${id}`),

  // 직원 등록
  create: (data) => api.post('/api/employees', data),

  // 직원 수정
  update: (id, data) => api.put(`/api/employees/${id}`, data),

  // 직원 삭제
  delete: (id) => api.delete(`/api/employees/${id}`),
}
