/**
 * ============================================================
 * [학습 포인트] Zustand로 전역 상태 관리 (Context API 대체)
 * ============================================================
 *
 * 이 파일은 AuthContext.jsx와 동일한 역할을 합니다.
 * 두 파일을 비교하면서 차이를 느껴보세요.
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │        Context API (AuthContext.jsx)  │  Zustand (이 파일)     │
 * ├──────────────────────────────────────────────────────────────┤
 * │ 1. createContext() 생성              │ 1. create()로 store 생성│
 * │ 2. Provider 컴포넌트 만들기          │    (Provider 필요 없음!) │
 * │ 3. App.jsx에서 <AuthProvider> 감싸기 │    (감싸기 필요 없음!)   │
 * │ 4. useAuth() 커스텀 훅 만들기        │    (자동으로 훅 생성됨)  │
 * │ 5. useState + useEffect 직접 관리    │ 2. set()으로 상태 변경   │
 * │                                      │                        │
 * │ 약 60줄                              │ 약 30줄                 │
 * └──────────────────────────────────────────────────────────────┘
 *
 * [Spring 비교]
 * Context API = HttpSession에 직접 setAttribute/getAttribute 하는 것
 * Zustand     = Spring Security처럼 잘 만들어진 프레임워크에 위임하는 것
 * ============================================================
 */

import { create } from 'zustand'
import { authApi } from '../api/authApi'

/**
 * create()로 store를 만들면 자동으로 React 훅이 됩니다.
 *
 * Context API에서는:
 *   1. createContext(null)
 *   2. AuthProvider 컴포넌트 안에서 useState, useEffect
 *   3. <AuthContext.Provider value={{ user, login, logout }}>
 *   4. export function useAuth() { return useContext(AuthContext) }
 *
 * Zustand에서는:
 *   create() 한 방이면 끝!
 */
const useAuthStore = create((set) => ({
  // ── 상태 (State) ──
  // Context API:  const [user, setUser] = useState(null)
  // Zustand:      user: null
  user: null,
  loading: true,

  // ── 액션 (Actions) ──

  /**
   * 앱 시작 시 localStorage에서 로그인 정보 복원
   *
   * [Context API 버전] AuthContext.jsx 99~108번째 줄:
   *   useEffect(() => {
   *     const savedUser = localStorage.getItem('user')
   *     const savedToken = localStorage.getItem('token')
   *     if (savedUser && savedToken) {
   *       setUser(JSON.parse(savedUser))
   *     }
   *     setLoading(false)
   *   }, [])
   *
   * [Zustand 버전] Provider도 useEffect도 필요 없이 함수 하나로 끝
   */
  initialize: () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')

    if (savedUser && savedToken) {
      // Context API:  setUser(JSON.parse(savedUser))
      // Zustand:      set({ user: ... })
      set({ user: JSON.parse(savedUser), loading: false })
    } else {
      set({ loading: false })
    }
  },

  /**
   * 로그인
   *
   * [Context API 버전] AuthContext.jsx 114~127번째 줄
   * [Zustand 버전] set()으로 상태 변경 - setUser() 대신 set({ user: ... })
   */
  login: async (credentials) => {
    const response = await authApi.login(credentials)
    const { token, username, name, role } = response.data

    localStorage.setItem('token', token)
    const userData = { username, name, role }
    localStorage.setItem('user', JSON.stringify(userData))

    // Context API:  setUser(userData)
    // Zustand:      set({ user: userData })
    set({ user: userData })

    return response
  },

  /**
   * 로그아웃
   *
   * [Context API 버전] AuthContext.jsx 132~136번째 줄
   * [Zustand 버전] 동일한 로직, set()만 다름
   */
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    // Context API:  setUser(null)
    // Zustand:      set({ user: null })
    set({ user: null })
  },
}))

export default useAuthStore

/**
 * ============================================================
 * [사용법 비교]
 * ============================================================
 *
 * === Context API (현재 방식) ===
 *
 * // App.jsx에서 Provider로 감싸야 함
 * <AuthProvider>
 *   <Routes>...</Routes>
 * </AuthProvider>
 *
 * // 컴포넌트에서 사용
 * import { useAuth } from '../context/AuthContext'
 * const { user, logout } = useAuth()
 *
 * === Zustand (이 파일 방식) ===
 *
 * // App.jsx에서 Provider 불필요! 그냥 바로 사용
 * <Routes>...</Routes>
 *
 * // 컴포넌트에서 사용
 * import useAuthStore from '../store/useAuthStore'
 * const { user, logout } = useAuthStore()
 *
 * → import 경로만 바꾸면 나머지 코드는 동일합니다!
 * ============================================================
 */
