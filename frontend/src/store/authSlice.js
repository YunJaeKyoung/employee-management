/**
 * ============================================================
 * [학습 포인트] Redux Toolkit - Slice (상태 + 액션 정의)
 * ============================================================
 *
 * Redux Toolkit에서는 "Slice"라는 단위로 상태를 관리합니다.
 * Slice = 상태(initialState) + 변경 방법(reducers) 묶음
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  Context API         │  Zustand              │  Redux Toolkit    │
 * ├─────────────────────────────────────────────────────────────────┤
 * │  AuthContext.jsx      │  useAuthStore.js      │  authSlice.js     │
 * │  (60줄)               │  (30줄)               │  + reduxStore.js  │
 * │                       │                       │  (합계 50줄)      │
 * │  createContext()      │  create()             │  createSlice()    │
 * │  useState + setState  │  set()                │  reducers         │
 * │  Provider 필수        │  Provider 불필요      │  Provider 필수    │
 * │  useAuth()            │  useAuthStore()       │  useSelector()    │
 * │                       │                       │  useDispatch()    │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * [Redux Toolkit의 핵심 규칙]
 * 상태를 변경하려면 반드시:
 *   1. reducer에 변경 방법을 미리 정의해두고
 *   2. 컴포넌트에서 dispatch(액션)으로 호출
 * → 이 외의 방법으로는 상태 변경 불가능!
 *
 * [Spring 비교]
 * reducer = @Service 메서드 (비즈니스 로직을 여기에만 작성)
 * dispatch = Controller가 Service를 호출하는 것
 * slice = @Service 클래스 하나 (관련 로직을 한 곳에 모음)
 * ============================================================
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../api/authApi'

/**
 * [createAsyncThunk - 비동기 액션]
 *
 * API 호출같은 비동기 작업을 Redux 방식으로 처리합니다.
 *
 * Context API:  const login = async (credentials) => { ... setUser(userData) }
 * Zustand:      login: async (credentials) => { ... set({ user: userData }) }
 * Redux:        createAsyncThunk로 비동기 함수를 만들고 → extraReducers에서 결과 처리
 *
 * 왜 이렇게 분리하나?
 * → "API 호출"과 "상태 변경"을 명확히 분리하기 위함
 * → Spring의 Controller(요청 처리) ↔ Service(비즈니스 로직) 분리와 같은 철학
 */
export const loginAsync = createAsyncThunk(
  'auth/login',  // 액션 이름 (DevTools에 이 이름으로 표시됨)
  async (credentials) => {
    const response = await authApi.login(credentials)
    const { token, username, name, role } = response.data

    localStorage.setItem('token', token)
    const userData = { username, name, role }
    localStorage.setItem('user', JSON.stringify(userData))

    return userData  // 이 값이 reducer의 action.payload로 전달됨
  }
)

/**
 * [createSlice - 상태 + 변경 방법 정의]
 *
 * Context API에서 useState + 여러 함수로 흩어져 있던 것을
 * 한 곳에 모아서 정의합니다.
 */
const authSlice = createSlice({
  name: 'auth',  // 이 slice의 이름 (DevTools에서 구분용)

  /**
   * 초기 상태
   *
   * Context API:  const [user, setUser] = useState(null)
   *               const [loading, setLoading] = useState(true)
   * Redux:        initialState에 한 번에 정의
   */
  initialState: {
    user: null,
    loading: true,
  },

  /**
   * [reducers - 동기 액션]
   *
   * 상태를 변경하는 유일한 방법입니다.
   * 여기에 정의하지 않은 방법으로는 상태를 바꿀 수 없습니다!
   *
   * Context API:  setUser(null) → 아무 데서나 호출 가능
   * Redux:        dispatch(logout()) → 반드시 여기 정의된 reducer를 통해서만 가능
   *
   * [Immer 내장]
   * state.user = null 이렇게 직접 변경하는 것처럼 보이지만,
   * Redux Toolkit이 내부적으로 Immer 라이브러리를 사용하여
   * 불변성(immutability)을 자동으로 처리해줍니다.
   */
  reducers: {
    /**
     * 앱 시작 시 localStorage에서 로그인 정보 복원
     *
     * Context API:  useEffect 안에서 setUser(JSON.parse(savedUser))
     * Zustand:      initialize() { set({ user: ... }) }
     * Redux:        dispatch(initialize()) → 이 reducer가 실행됨
     */
    initialize: (state) => {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')

      if (savedUser && savedToken) {
        state.user = JSON.parse(savedUser)
      }
      state.loading = false
    },

    /**
     * 로그아웃
     *
     * Context API:  logout() { setUser(null) }
     * Zustand:      logout() { set({ user: null }) }
     * Redux:        dispatch(logout()) → 이 reducer가 실행됨
     */
    logout: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      state.user = null
    },
  },

  /**
   * [extraReducers - 비동기 액션의 결과 처리]
   *
   * createAsyncThunk로 만든 비동기 액션의 성공/실패를 처리합니다.
   *
   * loginAsync가 실행되면:
   * 1. pending (시작) → 로딩 표시 가능
   * 2. fulfilled (성공) → user 상태 업데이트
   * 3. rejected (실패) → 에러 처리 가능
   *
   * [Spring 비교]
   * Controller에서 Service를 호출한 후:
   * - 성공 → return ResponseEntity.ok(result)
   * - 실패 → throw new RuntimeException("...")
   * 와 같은 패턴입니다.
   */
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      // action.payload = loginAsync에서 return한 userData
      state.user = action.payload
    })
  },
})

// reducer에서 정의한 액션들을 export
// 컴포넌트에서: dispatch(initialize()), dispatch(logout())
export const { initialize, logout } = authSlice.actions

// store에 등록할 reducer를 export
export default authSlice.reducer
