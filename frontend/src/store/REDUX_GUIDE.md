# Redux Toolkit 전환 가이드

> Context API → Redux Toolkit으로 바꾸려면 어디를 어떻게 바꿔야 하는지 정리한 문서입니다.
> 기존 코드(Context API)는 그대로 두고, 이 가이드를 보면서 차이를 비교하세요.

---

## Zustand와 다른 점

Zustand는 import 경로만 바꾸면 거의 끝이었지만,
Redux Toolkit은 **사용 방법 자체가 다릅니다:**

| | Context API | Zustand | Redux Toolkit |
|---|---|---|---|
| 상태 읽기 | `useAuth()` | `useAuthStore()` | `useSelector()` |
| 상태 변경 | `login(data)` 직접 호출 | `login(data)` 직접 호출 | `dispatch(login(data))` |
| Provider | 필요 | **불필요** | 필요 |

---

## 전체 요약: 바뀌는 파일 4개 + 새 파일 2개

| 파일 | 변경 내용 |
|------|----------|
| `store/authSlice.js` | **새 파일** - 상태 + 액션 정의 |
| `store/reduxStore.js` | **새 파일** - 중앙 store |
| `App.jsx` | `<AuthProvider>` → `<ReduxProvider>` 교체 |
| `components/layout/Header.jsx` | useAuth → useSelector + useDispatch |
| `components/common/ProtectedRoute.jsx` | useAuth → useSelector |
| `pages/LoginPage.jsx` | useAuth → useSelector + useDispatch |

---

## 1. App.jsx 변경

```jsx
// ── Context API (현재) ──
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>...</Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}


// ── Redux Toolkit (전환 후) ──
import { useEffect } from 'react'
import { Provider } from 'react-redux'           // React-Redux의 Provider
import store from './store/reduxStore'            // 중앙 store
import { initialize } from './store/authSlice'    // 초기화 액션

function App() {
  useEffect(() => {
    store.dispatch(initialize())   // 앱 시작 시 localStorage 복원
  }, [])

  return (
    // Redux도 Provider가 필요합니다! (Zustand만 불필요)
    // Context API의 <AuthProvider>와 비슷하지만,
    // 이 하나의 Provider로 모든 slice를 커버합니다.
    <Provider store={store}>
      <BrowserRouter>
        <Routes>...</Routes>
      </BrowserRouter>
    </Provider>
  )
}
```

### Provider 비교
```
Context API:  전역 상태마다 Provider 하나씩 (3개면 3중첩)
  <AuthProvider>
    <ThemeProvider>
      <NotificationProvider>

Redux:        Provider 딱 하나 (slice가 몇 개든 하나)
  <Provider store={store}>

Zustand:      Provider 없음
  (그냥 바로 사용)
```

---

## 2. Header.jsx 변경

```jsx
// ── Context API (현재) ──
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
}


// ── Redux Toolkit (전환 후) ──
import { useSelector, useDispatch } from 'react-redux'  // Redux 훅 2개
import { logout } from '../../store/authSlice'           // 액션

function Header() {
  // useSelector: store에서 필요한 상태를 꺼냄 (읽기)
  // Spring 비유: service.getUser() 호출
  const user = useSelector((state) => state.auth.user)

  // useDispatch: 액션을 보내는 함수 (쓰기)
  // Spring 비유: controller가 service 메서드를 호출하는 통로
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())       // dispatch로만 상태 변경 가능!
    navigate('/login')
  }
}
```

### 상태 읽기/쓰기 비교
```
[상태 읽기]
Context API:  const { user } = useAuth()
Zustand:      const { user } = useAuthStore()
Redux:        const user = useSelector((state) => state.auth.user)
                                                  ^^^^^  ^^^^
                                                  store   slice명

[상태 변경]
Context API:  logout()                    ← 직접 호출
Zustand:      logout()                    ← 직접 호출
Redux:        dispatch(logout())          ← 반드시 dispatch를 통해야 함
              ^^^^^^^^
              이게 Redux의 "엄격한 규칙"
```

---

## 3. ProtectedRoute.jsx 변경

```jsx
// ── Context API (현재) ──
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  ...
}


// ── Redux Toolkit (전환 후) ──
import { useSelector } from 'react-redux'

function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)
  ...
  // 나머지 로직은 동일
}
```

---

## 4. LoginPage.jsx 변경

```jsx
// ── Context API (현재) ──
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(formData)
    navigate('/dashboard')
  }
}


// ── Redux Toolkit (전환 후) ──
import { useDispatch } from 'react-redux'
import { loginAsync } from '../store/authSlice'       // 비동기 액션

function LoginPage() {
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    // unwrap()으로 비동기 결과를 기다림 (성공/실패 처리)
    await dispatch(loginAsync(formData)).unwrap()
    navigate('/dashboard')
  }
}
```

---

## 3가지 방식 최종 비교

```
[파일 구조]

Context API:
  src/context/AuthContext.jsx     ← 이 파일 하나에 전부

Zustand:
  src/store/useAuthStore.js       ← 이 파일 하나에 전부

Redux Toolkit:
  src/store/authSlice.js          ← 상태 + 액션 정의
  src/store/reduxStore.js         ← 중앙 store (slice들을 등록)
```

```
[코드 복잡도 비교]

                    Context API    Zustand    Redux Toolkit
상태 정의            useState       객체 리터럴  initialState
상태 변경            setState()     set()       reducers + dispatch
비동기 처리          async 함수      async 함수  createAsyncThunk
Provider 필요       O              X           O (하나만)
DevTools           X              △            O (강력)
보일러플레이트       중간            적음         많음
학습 난이도          쉬움            쉬움         어려움
```

### 결론
- Redux Toolkit은 코드는 가장 많지만, 상태 변경이 전부 추적되고 규칙이 강제됨
- 10명이 같이 개발해도 모두 같은 패턴으로 코드를 작성하게 됨
- 대신 간단한 프로젝트에서는 오버엔지니어링이 될 수 있음
