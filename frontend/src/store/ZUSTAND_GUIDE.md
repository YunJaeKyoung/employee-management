# Zustand 전환 가이드

> Context API → Zustand로 바꾸려면 어디를 어떻게 바꿔야 하는지 정리한 문서입니다.
> 기존 코드(Context API)는 그대로 두고, 이 가이드를 보면서 차이를 비교하세요.

---

## 전체 요약: 바뀌는 파일 4개

| 파일 | 변경 내용 | 난이도 |
|------|----------|--------|
| `App.jsx` | `<AuthProvider>` 제거 + initialize() 호출 추가 | 쉬움 |
| `components/layout/Header.jsx` | import 경로만 변경 | 매우 쉬움 |
| `components/common/ProtectedRoute.jsx` | import 경로만 변경 | 매우 쉬움 |
| `pages/LoginPage.jsx` | import 경로만 변경 | 매우 쉬움 |

핵심: **import 경로만 바꾸면 대부분 끝납니다!**

---

## 1. App.jsx 변경

```jsx
// ── Context API (현재) ──

import { AuthProvider } from './context/AuthContext'   // ← 이거 쓰고 있음

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>          {/* ← Provider로 감싸야 함 */}
        <Routes>
          ...
        </Routes>
      </AuthProvider>         {/* ← 닫는 태그 */}
    </BrowserRouter>
  )
}


// ── Zustand (전환 후) ──

import { useEffect } from 'react'                      // ← 추가
import useAuthStore from './store/useAuthStore'          // ← 변경

function App() {
  // 앱 시작 시 localStorage에서 로그인 정보 복원
  // Context API에서는 AuthProvider 안의 useEffect가 했던 일
  const initialize = useAuthStore((state) => state.initialize)
  useEffect(() => { initialize() }, [])

  return (
    <BrowserRouter>
      {/* AuthProvider 제거! 감쌀 필요 없음 */}
      <Routes>
        ...
      </Routes>
    </BrowserRouter>
  )
}
```

**왜 Provider가 필요 없나?**
- Context API: React의 트리 구조를 따라 위→아래로 데이터를 전달하므로 Provider가 필수
- Zustand: 외부 store에 데이터가 있으므로 어디서든 직접 접근 가능 (트리 구조와 무관)

---

## 2. Header.jsx 변경

```jsx
// ── Context API (현재) ──
import { useAuth } from '../../context/AuthContext'

function Header() {
  const { user, logout } = useAuth()
  ...
}


// ── Zustand (전환 후) ──
import useAuthStore from '../../store/useAuthStore'     // ← import만 변경

function Header() {
  const { user, logout } = useAuthStore()               // ← useAuth → useAuthStore
  ...
  // 나머지 코드는 완전히 동일합니다!
}
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


// ── Zustand (전환 후) ──
import useAuthStore from '../../store/useAuthStore'     // ← import만 변경

function ProtectedRoute() {
  const { user, loading } = useAuthStore()              // ← useAuth → useAuthStore
  ...
  // 나머지 코드는 완전히 동일합니다!
}
```

---

## 4. LoginPage.jsx 변경

```jsx
// ── Context API (현재) ──
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  ...
}


// ── Zustand (전환 후) ──
import useAuthStore from '../store/useAuthStore'        // ← import만 변경

function LoginPage() {
  const { login } = useAuthStore()                      // ← useAuth → useAuthStore
  ...
  // 나머지 코드는 완전히 동일합니다!
}
```

---

## Context API vs Zustand 최종 비교

```
[Context API]
파일: AuthContext.jsx (약 60줄)
├── createContext()
├── AuthProvider 컴포넌트
│   ├── useState (user, loading)
│   ├── useEffect (initialize)
│   ├── login 함수
│   └── logout 함수
├── <AuthContext.Provider value={...}>
└── useAuth() 커스텀 훅

App.jsx에서: <AuthProvider>로 반드시 감싸야 함
사용할 때:   const { user } = useAuth()

[Zustand]
파일: useAuthStore.js (약 30줄)
└── create()
    ├── user: null, loading: true  (상태)
    ├── initialize()               (액션)
    ├── login()                    (액션)
    └── logout()                   (액션)

App.jsx에서: 감쌀 필요 없음 (Provider 불필요)
사용할 때:   const { user } = useAuthStore()
```

### Zustand의 장점
1. **코드가 짧다** - Provider, createContext, useContext 등 보일러플레이트 없음
2. **Provider 불필요** - 컴포넌트 트리와 독립적으로 동작
3. **여러 store 분리가 쉽다** - 인증, 테마, 알림 등을 각각 별도 store로

### Context API의 장점
1. **React 내장** - 별도 설치 불필요
2. **React 기본기 학습** - useState, useEffect, useContext를 직접 다뤄봄
3. **단순한 경우 충분** - 전역 상태가 1~2개면 Context API로 충분

### 실무 가이드
- 전역 상태 1~2개 (인증 정도) → Context API로 충분
- 전역 상태 3개 이상 / 복잡한 상태 로직 → Zustand 추천
- 대규모 팀 프로젝트 → Redux Toolkit (엄격한 규칙이 팀 협업에 도움)
