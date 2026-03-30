# 직원 관리 시스템 (Employee Management System)

> **React 학습 프로젝트** - Java/Spring 개발자를 위한 React 단계별 학습

이 프로젝트는 JSP/Thymeleaf/jQuery에 익숙한 Java Spring 개발자가
React를 처음부터 단계별로 배울 수 있도록 설계된 풀스택 학습 프로젝트입니다.

모든 React 파일에 **한국어 주석**으로 개념을 설명하고,
기존에 익숙한 **JSP/jQuery/Spring 패턴과 1:1 비교**하여 이해를 돕습니다.

---

## 기술 스택

| 영역 | 기술 | 선택 이유 |
|------|------|-----------|
| **Backend** | Spring Boot 3.3 + Java 17 + Gradle | 안정적, 널리 사용 |
| **DB** | MyBatis + H2 (인메모리) | 외부 DB 설치 불필요, MyBatis 친숙 |
| **인증** | Spring Security + JWT | 실무 표준 패턴 |
| **Frontend** | React 18 + Vite 5 + JavaScript | 학습 자료 풍부, TypeScript는 다음 단계 |
| **스타일** | Tailwind CSS 3.4 | 유틸리티 기반 CSS, 빠른 UI 개발 |
| **HTTP** | Axios | jQuery $.ajax와 유사한 개념 |
| **라우팅** | React Router v6 | React 표준 라우터 |
| **상태관리** | useState + Context API | React 내장, 기본기 학습 우선 |

---

## 프로젝트 구조

```
employee-management/
├── backend/                         # Spring Boot 3.3 + MyBatis
│   ├── build.gradle
│   └── src/main/
│       ├── java/com/example/empmgmt/
│       │   ├── EmpMgmtApplication.java    # 앱 진입점
│       │   ├── config/                     # WebConfig, SecurityConfig, MyBatisConfig
│       │   ├── security/                   # JWT 토큰, 필터, UserDetailsService
│       │   ├── controller/                 # Auth, Employee, Department, Dashboard
│       │   ├── service/                    # 비즈니스 로직
│       │   ├── mapper/                     # MyBatis Mapper 인터페이스
│       │   ├── dto/                        # Request/Response DTOs
│       │   └── domain/                     # User, Employee, Department
│       └── resources/
│           ├── application.yml
│           ├── schema.sql                  # H2 테이블 자동 생성
│           ├── data.sql                    # 샘플 데이터 (15명 직원, 5개 부서)
│           └── mapper/*.xml                # MyBatis SQL XML
│
└── frontend/                        # React 18 + Vite + Tailwind CSS
    ├── package.json
    ├── vite.config.js               # /api → localhost:8080 프록시 설정
    └── src/
        ├── main.jsx                 # [학습] React 앱 진입점
        ├── App.jsx                  # [학습] React Router 설정
        ├── api/                     # Axios 인스턴스 + API 호출 함수
        │   ├── axios.js             # [학습] Interceptor (JWT 자동 첨부)
        │   ├── authApi.js
        │   ├── employeeApi.js
        │   ├── departmentApi.js
        │   └── dashboardApi.js
        ├── context/
        │   └── AuthContext.jsx      # [학습] Context API (전역 인증 상태)
        ├── components/
        │   ├── layout/              # Layout, Header, Sidebar
        │   ├── common/              # Pagination, Modal, SearchBar, Alert 등
        │   └── employee/            # EmployeeTable, EmployeeForm
        ├── pages/                   # 각 페이지 컴포넌트
        │   ├── LoginPage.jsx        # [학습] 폼 처리, Controlled Component
        │   ├── SignupPage.jsx       # [학습] 폼 유효성 검사
        │   ├── DashboardPage.jsx    # [학습] 다중 데이터 표시
        │   ├── EmployeeListPage.jsx # [학습] 복합 상태 관리 (핵심!)
        │   ├── EmployeeDetailPage.jsx # [학습] useParams
        │   ├── EmployeeCreatePage.jsx # [학습] useNavigate
        │   ├── EmployeeEditPage.jsx # [학습] 수정 폼 재사용
        │   └── DepartmentListPage.jsx # [학습] 모달 CRUD 패턴
        └── utils/                   # 포맷터, 유효성 검사 유틸
```

---

## 빠른 시작 (IntelliJ)

### 사전 요구사항
- **Java 17** 이상
- **Node.js 18** 이상
- **IntelliJ IDEA** (Ultimate 또는 Community)

### 1단계: Backend 실행

1. IntelliJ에서 `employee-management/backend` 폴더를 **Gradle 프로젝트**로 열기
2. Gradle 동기화가 완료될 때까지 대기
3. `EmpMgmtApplication.java` 파일을 찾아서 **Run** (Ctrl+Shift+F10)
4. http://localhost:8080 에서 서버 확인
5. http://localhost:8080/h2-console 에서 DB 확인 가능
   - JDBC URL: `jdbc:h2:mem:empdb`
   - User: `sa` / Password: (비워두기)

### 2단계: Frontend 실행

1. IntelliJ 터미널(Alt+F12)에서:
```bash
cd frontend
npm install
npm run dev
```
2. http://localhost:3000 에서 프론트엔드 확인
3. Vite 프록시가 `/api/*` 요청을 자동으로 8080으로 전달

### 3단계: 로그인

**테스트 계정:**
- 아이디: `admin`
- 비밀번호: `admin123`

또는 회원가입 페이지에서 새 계정 생성 가능

---

## REST API 엔드포인트

| Method | Path | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/auth/signup` | 회원가입 | X |
| POST | `/api/auth/login` | 로그인 → JWT 반환 | X |
| GET | `/api/employees?search=&page=0&size=10` | 직원 목록 (검색/페이지네이션) | O |
| GET | `/api/employees/{id}` | 직원 상세 | O |
| POST | `/api/employees` | 직원 등록 | O |
| PUT | `/api/employees/{id}` | 직원 수정 | O |
| DELETE | `/api/employees/{id}` | 직원 삭제 | O |
| GET | `/api/departments` | 부서 목록 (직원 수 포함) | O |
| POST | `/api/departments` | 부서 등록 | O |
| PUT | `/api/departments/{id}` | 부서 수정 | O |
| DELETE | `/api/departments/{id}` | 부서 삭제 | O |
| GET | `/api/dashboard/stats` | 대시보드 통계 | O |

---

## React 학습 로드맵

각 파일에 한국어 주석으로 개념을 설명합니다.
**JSP/jQuery/Spring과 1:1 비교**하여 기존 지식을 활용합니다.

### 1단계: React 기초 (진입점)

**파일:** `main.jsx`, `App.jsx`

| React 개념 | Spring/JSP 대응 |
|------------|-----------------|
| `main.jsx` | `web.xml` / `@SpringBootApplication` |
| `React Router` | `@RequestMapping` |
| `<Route path="/employees">` | `@GetMapping("/employees")` |

**핵심 이해:**
- JSP는 서버에서 HTML을 만들어서 보냄
- React는 브라우저에서 JavaScript로 HTML을 만듦 (SPA)

### 2단계: 레이아웃 (컴포넌트 구조)

**파일:** `Layout.jsx`, `Header.jsx`, `Sidebar.jsx`

| React 개념 | JSP/Thymeleaf 대응 |
|------------|---------------------|
| `children` prop | `<tiles:insertAttribute name="body" />` |
| `<Outlet />` | Thymeleaf `layout:fragment="content"` |
| `<Link to="/">` | `<a href="/">` (새로고침 없음) |

### 3단계: 인증 (전역 상태 관리)

**파일:** `AuthContext.jsx`, `LoginPage.jsx`, `SignupPage.jsx`

| React 개념 | Spring/jQuery 대응 |
|------------|---------------------|
| `Context API` | `SecurityContextHolder` |
| `useAuth()` | `SecurityContextHolder.getContext().getAuthentication()` |
| `useState` | jQuery 변수 + DOM 수동 업데이트 |
| `localStorage` | HttpSession |

**핵심 이해 - 상태 변화:**
```
[jQuery 방식]
let user = null
user = { name: '김철수' }
$('#user-name').text(user.name)  ← DOM 수동 업데이트 필요

[React 방식]
setUser({ name: '김철수' })       ← UI 자동 업데이트!
```

### 4단계: API 통신

**파일:** `axios.js`, `authApi.js`, `employeeApi.js`

| React 개념 | jQuery 대응 |
|------------|-------------|
| `axios.create()` | `$.ajaxSetup()` |
| Request Interceptor | 매 요청마다 headers 설정 |
| Response Interceptor | error 콜백에서 공통 처리 |

### 5단계: 직원 목록 (가장 중요한 파일!)

**파일:** `EmployeeListPage.jsx`

| React 개념 | jQuery 대응 |
|------------|-------------|
| `useEffect(fn, [deps])` | `$(document).ready()` + 이벤트 리스너 |
| `useState` → UI 자동 업데이트 | `$.ajax` 성공 → DOM 수동 조작 |
| 의존성 배열 `[search, page]` | 각 이벤트마다 별도 핸들러 |

**핵심 이해 - 데이터 흐름:**
```
검색어 입력 "김"
  → setSearch("김") 호출
  → useEffect 감지 (의존성 배열에 search 포함)
  → API 호출: GET /api/employees?search=김
  → 응답 → setEmployees(새 데이터)
  → React가 자동으로 테이블 다시 그림

jQuery였다면?
  → $('#search').keyup() → $.ajax() → 성공 → $('#table').html('...')
  → DOM을 직접 지우고 다시 만들어야 함
```

### 6단계: 리스트 렌더링

**파일:** `EmployeeTable.jsx`

| React 개념 | JSP/Thymeleaf 대응 |
|------------|---------------------|
| `.map()` + `key` | `<c:forEach>` / `th:each` |
| `onClick={() => fn(id)}` | `$('#btn').click(function() { fn(id) })` |

### 7단계: 폼 처리

**파일:** `EmployeeForm.jsx`

| React 개념 | JSP/jQuery 대응 |
|------------|-----------------|
| Controlled Component | `$('#input').val()` |
| `value={state}` + `onChange` | `<input value="${employee.name}">` |
| `onSubmit` + `e.preventDefault()` | `<form action="/save" method="POST">` |

### 8단계: 부서 관리 (모달 패턴)

**파일:** `DepartmentListPage.jsx`

직원 관리는 여러 페이지로 분리했지만, 부서 관리는 모달로 한 페이지에서 처리.
두 가지 CRUD 패턴을 비교 학습할 수 있습니다.

### 9단계: 대시보드

**파일:** `DashboardPage.jsx`

CSS만으로 간단한 바 차트를 구현합니다 (Chart.js 같은 라이브러리 없이).

---

## React 핵심 개념 요약표

| React | Spring/JSP/jQuery | 배우는 파일 |
|-------|-------------------|-------------|
| Component | JSP include / Tiles fragment | Layout.jsx |
| props | request.setAttribute / Model | EmployeeTable.jsx |
| useState | `let` 변수 + DOM 수동 업데이트 | LoginPage.jsx |
| useEffect | `$(document).ready()` + `$.ajax()` | EmployeeListPage.jsx |
| onClick={fn} | `$('#btn').click(fn)` | EmployeeTable.jsx |
| Context API | SecurityContextHolder / HttpSession | AuthContext.jsx |
| React Router | @RequestMapping | App.jsx |
| 조건부 렌더링 | `<c:if>` / `th:if` / jQuery show/hide | Header.jsx |
| .map() 렌더링 | `<c:forEach>` / `th:each` | EmployeeTable.jsx |
| useParams | @PathVariable | EmployeeDetailPage.jsx |
| useNavigate | response.sendRedirect() | LoginPage.jsx |
| Controlled Component | `$('#input').val()` | EmployeeForm.jsx |

---

## 주요 기능

### 인증
- 회원가입 (유효성 검사 포함)
- 로그인 (JWT 토큰 기반)
- 자동 로그인 유지 (localStorage)
- 로그아웃
- 비인증 접근 시 로그인 리다이렉트

### 직원 관리
- 직원 목록 (페이지네이션, 검색, 부서 필터)
- 직원 상세 조회
- 직원 등록
- 직원 수정
- 직원 삭제 (확인 다이얼로그)

### 부서 관리
- 부서 목록 (카드 뷰, 소속 직원 수 표시)
- 부서 등록/수정 (모달)
- 부서 삭제

### 대시보드
- 전체 직원 수, 부서 수, 평균 연봉, 이달 입사자
- 부서별 직원 현황 바 차트
- 최근 입사 직원 목록

---

## 다음 학습 단계

이 프로젝트를 마친 후 추천하는 학습 순서:

1. **TypeScript 적용** - `.jsx` → `.tsx` 변환, 타입 정의 추가
2. **Zustand** - Context API 대신 전문 상태관리 라이브러리
3. **React Query (TanStack Query)** - 서버 상태 관리, 캐싱
4. **React Hook Form** - 폼 관리 라이브러리
5. **Next.js** - 서버 사이드 렌더링 (SSR)
