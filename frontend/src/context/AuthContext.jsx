/**
 * ============================================================
 * [학습 포인트] Context API - 전역 상태 관리
 * ============================================================
 *
 * Context API는 React에 내장된 전역 상태 관리 도구입니다.
 * "전역 상태"란 여러 컴포넌트에서 공유해야 하는 데이터를 말합니다.
 *
 * [Spring 비교]
 * Spring의 SecurityContextHolder처럼 어디서든 인증 정보에 접근 가능합니다.
 *
 * SecurityContextHolder.getContext().getAuthentication()
 * → React에서는 useAuth() 훅으로 같은 역할을 합니다.
 *
 * [왜 Context API가 필요한가?]
 *
 * 문제 상황 (Props Drilling):
 * App → Layout → Header → UserMenu 로 로그인 정보를 전달하려면
 * 중간에 있는 Layout, Header가 사용하지도 않는 props를 받아서 전달해야 합니다.
 *
 * Context API 해결:
 * AuthProvider가 최상위에서 데이터를 제공하면,
 * UserMenu가 직접 useAuth()로 가져올 수 있습니다. 중간 컴포넌트는 관여 안 함.
 *
 * [핵심 3가지]
 * 1. createContext(): Context 객체 생성 (빈 그릇)
 * 2. Provider: 데이터를 공급하는 컴포넌트 (그릇에 물을 채움)
 * 3. useContext(): 데이터를 소비하는 Hook (그릇에서 물을 마심)
 *
 * [상태 변화 흐름]
 * 사용자 로그인 → setUser(userData) 호출
 * → AuthContext의 값이 변경됨
 * → AuthContext를 사용하는 모든 컴포넌트가 자동으로 다시 렌더링됨
 * → Header의 "김철수님 환영합니다"가 자동으로 나타남
 *
 * jQuery라면?
 * → $.ajax 성공 후 직접 $('#username').text('김철수') 이렇게 DOM을 조작해야 했음
 * → React에서는 상태만 바꾸면 UI가 알아서 업데이트됩니다! (선언적 UI)
 * ============================================================
 */

import { createContext, useState, useContext, useEffect } from 'react'
import { authApi } from '../api/authApi'

// 1단계: Context 생성 (빈 그릇 만들기)
const AuthContext = createContext(null)

/**
 * 2단계: Provider 컴포넌트 (그릇에 물 채우기)
 *
 * 이 컴포넌트로 감싸진 모든 하위 컴포넌트에서 인증 정보에 접근 가능합니다.
 * App.jsx에서 <AuthProvider>로 전체 앱을 감쌌습니다.
 *
 * [children 이란?]
 * children은 이 컴포넌트의 여는 태그와 닫는 태그 사이에 있는 모든 것입니다.
 *
 * <AuthProvider>
 *   <App />          ← 이것이 children
 * </AuthProvider>
 *
 * JSP의 <tiles:insertAttribute name="body" />와 비슷합니다.
 */
export function AuthProvider({ children }) {
  /**
   * [useState 상세 설명]
   *
   * const [user, setUser] = useState(null)
   *
   * - user: 현재 상태값 (읽기 전용)
   * - setUser: 상태를 변경하는 함수 (이것만으로 상태 변경 가능)
   * - useState(null): 초기값은 null (로그인 전이니까)
   *
   * [jQuery 비교]
   * jQuery: let user = null;  → 변수 직접 변경
   *         user = { name: '김철수' };
   *         $('#user-name').text(user.name);  → DOM 수동 업데이트
   *
   * React:  setUser({ name: '김철수' })  → 상태 변경 + UI 자동 업데이트
   *
   * 중요: user = { name: '김철수' } 이렇게 직접 할당하면 안 됩니다!
   * 반드시 setUser()를 통해야 React가 변경을 감지하고 UI를 업데이트합니다.
   */
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  /**
   * [useEffect 상세 설명]
   *
   * useEffect(() => { ... }, [])
   *
   * 컴포넌트가 화면에 처음 나타날 때(마운트) 실행되는 코드입니다.
   *
   * [jQuery 비교]
   * $(document).ready(function() { ... })
   *
   * 두 번째 인자 [](빈 배열) = "처음 한 번만 실행"
   * → 여기서는 앱 시작 시 localStorage에 저장된 로그인 정보를 복원합니다.
   */
  useEffect(() => {
    // 앱 시작 시 localStorage에서 이전 로그인 정보 복원
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false) // 로딩 완료
  }, []) // ← 빈 배열: 컴포넌트 마운트 시 1번만 실행

  /**
   * 로그인 함수
   * LoginPage에서 호출됩니다.
   */
  const login = async (credentials) => {
    const response = await authApi.login(credentials)
    const { token, username, name, role } = response.data

    // localStorage에 토큰과 사용자 정보 저장 (브라우저 새로고침해도 유지)
    localStorage.setItem('token', token)
    const userData = { username, name, role }
    // userData.test = '테스트'
    localStorage.setItem('user', JSON.stringify(userData))

    // 상태 업데이트 → AuthContext를 사용하는 모든 컴포넌트가 자동 업데이트
    setUser(userData)

    return response
  }

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null) // user를 null로 → 로그아웃 상태로 전환 → UI 자동 업데이트
  }

  /**
   * Provider의 value에 공유할 데이터를 넣습니다.
   * 이 value를 하위 컴포넌트에서 useAuth() 훅으로 가져올 수 있습니다.
   */
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * 3단계: Custom Hook (그릇에서 물 마시기)
 *
 * useAuth()를 호출하면 AuthContext의 value에 접근할 수 있습니다.
 * { user, loading, login, logout }를 반환합니다.
 *
 * [사용 예시]
 * function Header() {
 *   const { user, logout } = useAuth()
 *   return <span>{user.name}님 환영합니다</span>
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용 가능합니다')
  }
  return context
}
