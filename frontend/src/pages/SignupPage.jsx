/**
 * ============================================================
 * [학습 포인트] 폼 유효성 검사 & 상태 관리 심화
 * ============================================================
 *
 * LoginPage에서 배운 Controlled Component를 확장하여
 * 실시간 유효성 검사를 추가합니다.
 *
 * [새로운 개념]
 * 1. 여러 개의 useState를 조합하여 복잡한 폼 상태 관리
 * 2. 입력값 변경 시 실시간 유효성 검사
 * 3. 비밀번호 확인 로직
 *
 * [jQuery 비교]
 * jQuery에서 폼 유효성 검사:
 *   $('#form').validate({ rules: { username: { required: true, minlength: 4 } } })
 *   또는 직접 if ($('#username').val().length < 4) { ... }
 *
 * React에서는 state가 변할 때마다 자동으로 유효성 검사를 실행하고
 * 그 결과를 바로 UI에 반영할 수 있습니다.
 * ============================================================
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConfirm: '',
    name: '',
    email: '',
  })

  // 각 필드별 에러 메시지를 관리하는 state
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  /**
   * [유효성 검사 함수]
   * 폼 데이터를 받아서 에러 객체를 반환합니다.
   *
   * 에러가 있는 필드만 에러 메시지를 포함합니다.
   * 예: { username: '아이디는 4자 이상이어야 합니다', password: '...' }
   */
  const validate = (data) => {
    const newErrors = {}

    if (data.username.length < 4) {
      newErrors.username = '아이디는 4자 이상이어야 합니다'
    }
    // // ↓ 새 규칙 추가
    // if (data.email && !data.email.includes('@')) {
    //   newErrors.email = '올바른 이메일 형식이 아닙니다'
    // }
    if (data.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다'
    }
    if (data.password !== data.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    }
    if (!data.name.trim()) {
      newErrors.name = '이름은 필수입니다'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    // 입력할 때마다 해당 필드의 에러를 지움 (사용자 경험 개선)
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 유효성 검사
    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return // 에러가 있으면 API 호출하지 않음
    }

    setIsLoading(true)
    setServerError('')

    try {
      await authApi.signup({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
      })

      // 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다! 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      setServerError(err.response?.data?.message || '회원가입에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">회원가입</h2>
          <p className="text-gray-500 mt-2">새 계정을 만들어보세요</p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 아이디 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">아이디</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="4자 이상 입력"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all
                ${errors.username
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {/**
             * [에러 메시지 조건부 렌더링]
             * errors.username이 존재할 때만 빨간 텍스트 표시
             *
             * && 연산자: 왼쪽이 truthy이면 오른쪽을 렌더링
             * 이것이 React에서 가장 많이 쓰는 조건부 렌더링 패턴입니다.
             */}
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이름</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all
                ${errors.name
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 (선택)</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {/*{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}*/}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="6자 이상 입력"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all
                ${errors.password
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
            <input
              name="passwordConfirm"
              type="password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-all
                ${errors.passwordConfirm
                  ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
              hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all
              disabled:bg-blue-300 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:text-blue-700">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
