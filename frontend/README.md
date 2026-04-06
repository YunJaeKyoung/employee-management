# Frontend - React 18 학습 가이드

> JSP/jQuery 개발자를 위한 React 단계별 학습 프로젝트

---

## 목차

1. [React란 무엇인가?](#1-react란-무엇인가)
2. [기술 스택 상세](#2-기술-스택-상세)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [실행 방법](#4-실행-방법)
5. [React 핵심 개념 (JSP/jQuery 비교)](#5-react-핵심-개념-jspjquery-비교)
6. [학습 순서 (파일별 가이드)](#6-학습-순서-파일별-가이드)
7. [상태(State) 완전 정복](#7-상태state-완전-정복)
8. [컴포넌트 생명주기와 useEffect](#8-컴포넌트-생명주기와-useeffect)
9. [React Router 라우팅](#9-react-router-라우팅)
10. [API 통신 패턴](#10-api-통신-패턴)
11. [Context API 전역 상태 관리](#11-context-api-전역-상태-관리)
12. [자주 쓰는 React 패턴 모음](#12-자주-쓰는-react-패턴-모음)
13. [Tailwind CSS 기초](#13-tailwind-css-기초)
14. [디버깅 방법](#14-디버깅-방법)
15. [다음 학습 단계](#15-다음-학습-단계)

---

## 1. React란 무엇인가?

### 한 줄 요약

> **React는 UI를 만드는 JavaScript 라이브러리입니다.**
> 데이터(상태)가 바뀌면 화면이 자동으로 업데이트됩니다.

### JSP/jQuery와의 근본적 차이

```
[JSP 방식 - 서버 사이드 렌더링]
┌──────────┐     ┌──────────┐     ┌──────────┐
│ 브라우저   │────>│  Spring   │────>│    DB    │
│          │     │ Controller│     │          │
│          │<────│     +     │<────│          │
│ 완성된    │     │   JSP    │     │          │
│ HTML 수신 │     │(HTML생성) │     │          │
└──────────┘     └──────────┘     └──────────┘

사용자가 페이지 이동할 때마다:
  서버가 새 HTML을 만들어서 → 브라우저가 전체 페이지 새로고침

[React 방식 - 클라이언트 사이드 렌더링 (이 프로젝트)]
┌──────────┐     ┌──────────┐     ┌──────────┐
│ 브라우저   │────>│  Spring   │────>│    DB    │
│          │     │ REST API │     │          │
│ React가   │<────│(JSON만    │<────│          │
│ 화면을    │     │ 반환)    │     │          │
│ 직접 구성  │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘

처음 한 번만 HTML+JS를 다운로드하고,
이후에는 JSON 데이터만 주고받으며 화면을 JavaScript로 업데이트
→ 페이지 새로고침 없이 빠른 화면 전환 (SPA: Single Page Application)
```

### jQuery vs React 코드 비교

같은 기능을 jQuery와 React로 구현하면:

```
[기능: 버튼을 클릭하면 카운터가 1 증가]

─── jQuery ───

<p id="count">0</p>
<button id="btn">클릭</button>

<script>
  let count = 0;

  $('#btn').click(function() {
    count++;
    $('#count').text(count);    // DOM을 직접 찾아서 수정
  });
</script>

→ 1. 변수를 변경하고
→ 2. DOM을 찾아서 (select)
→ 3. 직접 수정해야 함 (update)


─── React ───

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>클릭</button>
    </>
  );
}

→ 1. setCount로 상태만 변경하면
→ 2. React가 알아서 화면을 업데이트함!
→ DOM을 직접 건드리지 않음!
```

**이것이 React의 핵심 철학입니다:**
> "상태(State)를 바꾸면 UI가 자동으로 따라온다"

jQuery: **명령형** - "이 DOM을 찾아서 이렇게 바꿔라"
React: **선언형** - "상태가 이러면 UI는 이렇게 보여야 한다"

---

## 2. 기술 스택 상세

| 기술 | 버전 | 역할 | JSP 프로젝트에서의 대응 |
|------|------|------|----------------------|
| **React** | 18.3 | UI 라이브러리 | JSP + JSTL |
| **Vite** | 5.4 | 빌드 도구 + 개발 서버 | Maven/Gradle의 프론트엔드 버전 |
| **React Router** | 6.26 | 페이지 라우팅 | Spring @RequestMapping |
| **Axios** | 1.7 | HTTP 클라이언트 | jQuery $.ajax |
| **Tailwind CSS** | 3.4 | 유틸리티 CSS | Bootstrap (비슷하지만 다름) |

### 왜 이 기술들을 선택했는가?

| 선택 | 다른 옵션 | 이유 |
|------|----------|------|
| **React 18** (19 아님) | React 19 | 18이 학습 자료가 훨씬 많고 안정적 |
| **JavaScript** (TS 아님) | TypeScript | 한 번에 두 가지를 배우면 혼란, React 먼저 |
| **React Router v6** | TanStack Router | 가장 표준적, 문서/튜토리얼 풍부 |
| **Context API** | Redux, Zustand | React 내장이라 별도 설치 불필요, 기본기 |
| **Axios** | fetch API | jQuery $.ajax와 유사, interceptor 지원 |
| **Vite** | Webpack, CRA | 빠른 개발 서버, 간단한 설정 |

---

## 3. 프로젝트 구조

```
frontend/
├── index.html                 # HTML 진입점 (단 하나의 HTML 파일!)
├── package.json               # 의존성 관리 (Maven의 pom.xml과 같음)
├── vite.config.js             # Vite 설정 (API 프록시 등)
├── tailwind.config.js         # Tailwind CSS 설정
├── postcss.config.js          # PostCSS 설정 (Tailwind 빌드용)
│
└── src/
    ├── main.jsx               # ★ React 앱 진입점 (web.xml 역할)
    ├── App.jsx                # ★ 최상위 컴포넌트 (Router 설정)
    ├── index.css              # 전역 CSS (Tailwind import)
    │
    ├── api/                   # ──── API 통신 계층 ────
    │   ├── axios.js           #   Axios 인스턴스 + Interceptor
    │   ├── authApi.js         #   인증 API (login, signup)
    │   ├── employeeApi.js     #   직원 API (CRUD)
    │   ├── departmentApi.js   #   부서 API (CRUD)
    │   └── dashboardApi.js    #   대시보드 API (stats)
    │
    ├── context/               # ──── 전역 상태 관리 ────
    │   └── AuthContext.jsx    #   ★ 인증 상태 (로그인 정보)
    │
    ├── components/            # ──── 재사용 컴포넌트 ────
    │   ├── layout/            #   ┌ 레이아웃 구조
    │   │   ├── Layout.jsx     #   │ ★ 전체 레이아웃 (Tiles/Thymeleaf Layout)
    │   │   ├── Header.jsx     #   │ 상단 바
    │   │   └── Sidebar.jsx    #   └ 사이드 메뉴
    │   │
    │   ├── common/            #   ┌ 공통 UI 컴포넌트
    │   │   ├── ProtectedRoute.jsx # │ ★ 인증 체크 (Security 필터)
    │   │   ├── Pagination.jsx #   │ 페이지네이션
    │   │   ├── SearchBar.jsx  #   │ 검색 입력
    │   │   ├── Modal.jsx      #   │ 모달 다이얼로그
    │   │   ├── AlertMessage.jsx # │ 알림 메시지
    │   │   ├── ConfirmDialog.jsx# │ 확인 다이얼로그
    │   │   └── LoadingSpinner.jsx# └ 로딩 표시
    │   │
    │   └── employee/          #   ┌ 직원 관련 컴포넌트
    │       ├── EmployeeTable.jsx # │ ★ 직원 테이블 (.map 렌더링)
    │       └── EmployeeForm.jsx  # └ ★ 직원 폼 (등록/수정 겸용)
    │
    ├── pages/                 # ──── 페이지 컴포넌트 ────
    │   ├── LoginPage.jsx      #   ★ 로그인 (폼 처리 학습)
    │   ├── SignupPage.jsx     #   회원가입 (유효성 검사)
    │   ├── DashboardPage.jsx  #   대시보드 (통계 표시)
    │   ├── EmployeeListPage.jsx # ★★★ 직원 목록 (가장 중요!)
    │   ├── EmployeeDetailPage.jsx # 직원 상세 (useParams)
    │   ├── EmployeeCreatePage.jsx # 직원 등록 (useNavigate)
    │   ├── EmployeeEditPage.jsx # 직원 수정 (데이터 로드 후 폼)
    │   ├── DepartmentListPage.jsx # 부서 관리 (모달 CRUD)
    │   └── NotFoundPage.jsx   #   404 페이지
    │
    └── utils/                 # ──── 유틸리티 ────
        ├── formatters.js      #   날짜, 금액 포맷팅
        └── validators.js      #   입력값 유효성 검사
```

### Spring MVC 프로젝트와 구조 비교

| Spring MVC | React | 역할 |
|------------|-------|------|
| `web.xml` | `main.jsx` | 앱 진입점 |
| `@RequestMapping` | `App.jsx` (Router) | URL → 화면 매핑 |
| `layout.jsp` (Tiles) | `Layout.jsx` | 공통 레이아웃 |
| `employee/list.jsp` | `EmployeeListPage.jsx` | 직원 목록 화면 |
| `employee/form.jsp` | `EmployeeForm.jsx` | 직원 입력 폼 |
| `SecurityConfig` | `ProtectedRoute.jsx` | 인증 체크 |
| `HttpSession` | `AuthContext.jsx` | 로그인 상태 관리 |
| `pom.xml` | `package.json` | 의존성 관리 |
| `/WEB-INF/views/` | `src/pages/` | 페이지 파일 |
| `/WEB-INF/tags/` | `src/components/` | 재사용 가능한 조각 |
| `application.properties` | `vite.config.js` | 설정 |

---

## 4. 실행 방법

### 사전 요구사항

- **Node.js 18 이상**
- **Backend 서버가 실행 중** (http://localhost:8080)

> **중요:** 프론트엔드는 백엔드 API를 호출하므로
> **반드시 백엔드(Spring Boot)를 먼저 실행**한 상태에서 프론트엔드를 실행해야 합니다.
> 백엔드가 꺼져 있으면 로그인, 직원 조회 등 모든 기능이 작동하지 않습니다.

```
[전체 실행 순서]

1. 백엔드 인텔리제이에서 EmpMgmtApplication.java 실행 (포트 8080)
2. 프론트엔드 인텔리제이에서 npm run dev 실행 (포트 3000)
3. 브라우저에서 http://localhost:3000 접속
```

---

### STEP 1: Node.js 설치 확인

IntelliJ 하단의 **Terminal** 탭(Alt+F12)을 열고 아래 명령어를 실행합니다:

```bash
node -v
```

```
# 정상 출력 예시:
v18.20.0    ← 18 이상이면 OK
v20.11.1    ← 20도 OK
v22.0.0     ← 22도 OK

# Node.js가 설치되어 있지 않은 경우:
'node'은(는) 내부 또는 외부 명령... ← 설치 필요!
```

**Node.js 설치가 필요한 경우:**
1. https://nodejs.org 접속
2. **LTS 버전** (왼쪽 초록 버튼) 다운로드
3. 설치 (기본 옵션으로 Next → Next → Install)
4. **IntelliJ를 재시작** (터미널이 새 환경변수를 인식하려면)
5. 터미널에서 `node -v` 다시 확인

---

### STEP 2: IntelliJ에서 프로젝트 열기

1. **두 번째 IntelliJ 창**을 엽니다 (백엔드와 별도)
   - File → Open
   - `C:\project\employee-management\frontend` 폴더 선택
   - **"Open as Project"** 클릭

2. IntelliJ가 프로젝트를 인식하면 좌측에 파일 목록이 나타남:
```
frontend
├── node_modules/     ← 이미 있으면 STEP 3 건너뛰기
├── src/
├── index.html
├── package.json
├── vite.config.js
└── ...
```

---

### STEP 3: 의존성 설치 (최초 1회만)

> `node_modules` 폴더가 이미 있으면 이 단계를 건너뛰세요.

IntelliJ 하단의 **Terminal** 탭(Alt+F12)에서:

```bash
npm install
```

```
# 실행 중 출력 예시:
added 157 packages, and audited 158 packages in 12s
30 packages are looking for funding
  run `npm fund` for details

# → "added XXX packages" 메시지가 나오면 성공!
# → node_modules 폴더가 생성됨 (이 안에 React, Axios 등이 설치됨)
```

**npm install이란?**
```
Maven 비유:
  pom.xml에 적힌 의존성을 다운로드하는 mvn dependency:resolve와 같음

  pom.xml        →  package.json       (의존성 목록)
  .m2/repository →  node_modules/      (다운로드된 라이브러리)
  mvn install    →  npm install        (설치 명령)
```

---

### STEP 4: 개발 서버 실행

같은 터미널에서:

```bash
npm run dev
```

```
# 실행 성공 시 출력:

  VITE v5.4.10  ready in 456 ms

  ➜  Local:   http://localhost:3000/    ← 이 URL로 접속!
  ➜  Network: http://192.168.0.5:3000/
  ➜  press h + enter to show help
```

> **이 터미널은 닫지 마세요!**
> 터미널을 닫으면 개발 서버가 종료됩니다.
> 서버가 실행 중인 동안 코드를 수정하면 브라우저가 자동으로 새로고침됩니다 (Hot Reload).

---

### STEP 5: 브라우저에서 접속

#### 접속 URL

| URL | 설명 |
|-----|------|
| **http://localhost:3000** | **메인 접속 URL (여기로 접속하세요!)** |
| http://localhost:3000/login | 로그인 페이지 |
| http://localhost:3000/signup | 회원가입 페이지 |
| http://localhost:3000/dashboard | 대시보드 (로그인 필요) |
| http://localhost:3000/employees | 직원 목록 (로그인 필요) |
| http://localhost:3000/departments | 부서 관리 (로그인 필요) |

#### 처음 접속하면

1. http://localhost:3000 으로 접속
2. 로그인 페이지가 나타남 (로그인하지 않은 상태이므로 자동 이동)
3. 테스트 계정으로 로그인:

```
┌─────────────────────────────────┐
│         직원 관리 시스템          │
│       로그인하여 시작하세요       │
│                                  │
│  아이디: [ admin           ]     │
│  비밀번호: [ admin123        ]    │
│                                  │
│         [ 로그인 ]               │
│                                  │
│  테스트 계정                     │
│  아이디: admin / 비밀번호: admin123│
└─────────────────────────────────┘
```

4. 로그인 성공 → 대시보드 페이지로 이동
5. 왼쪽 사이드바에서 직원 관리, 부서 관리 등 탐색 가능

#### 전체 화면 구조

```
로그인 후 화면:

┌──────────────────────────────────────────────┐
│  🏢 직원 관리 시스템           관리자님  로그아웃 │  ← Header
├──────────┬───────────────────────────────────┤
│          │                                    │
│ 대시보드  │   (여기에 각 페이지 내용이 표시됨)    │
│ 직원 관리 │                                    │
│ 부서 관리 │   대시보드: 통계 카드, 차트           │
│          │   직원 관리: 검색, 테이블, 페이지네이션 │
│          │   부서 관리: 카드 그리드, 모달 CRUD    │
│          │                                    │
│ Sidebar  │              Main Content          │
└──────────┴───────────────────────────────────┘
```

---

### 개발 서버 중지

- **터미널에서:** `Ctrl+C` 입력 → `Y` 입력 (종료 확인)

### npm 명령어 정리

| 명령어 | 설명 | Maven 대응 |
|--------|------|-----------|
| `npm install` | 의존성 설치 (최초 1회) | `mvn dependency:resolve` |
| `npm run dev` | 개발 서버 시작 | `mvn spring-boot:run` |
| `npm run build` | 프로덕션 빌드 (배포용) | `mvn package` |
| `npm run preview` | 빌드 결과 미리보기 | - |

---

### 실행 시 자주 발생하는 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| `'node'은(는) 내부 또는 외부 명령...` | Node.js 미설치 | https://nodejs.org 에서 LTS 설치 |
| `npm ERR! code ENOENT` | 잘못된 폴더에서 실행 | `cd frontend` 후 다시 실행 |
| `Port 3000 is already in use` | 3000 포트 사용 중 | 기존 터미널 종료하거나 `npx kill-port 3000` |
| 로그인 시 네트워크 에러 | 백엔드 서버가 안 켜져 있음 | **백엔드(8080)를 먼저 실행!** |
| API 호출 시 CORS 에러 | Vite 프록시 설정 문제 | `vite.config.js`에서 proxy 설정 확인 |
| 페이지 새로고침 시 404 | SPA 라우팅 문제 (배포 시) | 개발 서버에서는 발생하지 않음 |
| `Module not found` | node_modules 누락 | `npm install` 다시 실행 |

---

### 두 프로젝트 동시 실행 요약

```
[IntelliJ 창 1 - Backend]                [IntelliJ 창 2 - Frontend]
┌─────────────────────────┐              ┌─────────────────────────┐
│ backend 프로젝트         │              │ frontend 프로젝트        │
│                         │              │                         │
│ EmpMgmtApplication.java │              │ Terminal:               │
│ ▶ Run 클릭              │              │ $ npm run dev           │
│                         │              │                         │
│ 포트: 8080              │              │ 포트: 3000              │
│ 역할: REST API 서버      │              │ 역할: React 개발 서버    │
│ 접속: 직접 접속 안 함     │              │ 접속: http://localhost:3000 │
│ (API만 제공)            │   ◄──────►  │ (이 URL로 접속!)         │
│                         │   API 통신   │                         │
└─────────────────────────┘              └─────────────────────────┘

브라우저에서 http://localhost:3000 접속
→ React 앱이 표시됨
→ 로그인, 직원 조회 등의 API 요청은 Vite 프록시를 통해 8080으로 전달됨
```

### Vite 프록시 작동 원리

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,         // 프론트엔드 개발 서버 포트
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // /api로 시작하는 요청 → 8080으로 전달
        changeOrigin: true,
      },
    },
  },
})
```

```
[프록시 동작 예시]

브라우저에서 로그인 버튼 클릭
  → React가 POST /api/auth/login 요청
  → 브라우저는 localhost:3000/api/auth/login 으로 보냄
  → Vite 프록시가 "/api"를 감지하고 localhost:8080으로 전달
  → Spring Boot가 처리 후 JSON 응답
  → Vite 프록시가 응답을 브라우저로 전달
  → React가 응답을 받아서 화면 업데이트

왜 프록시를 쓰는가?
  → 브라우저 보안 정책(CORS)으로 3000 → 8080 직접 요청이 차단됨
  → 프록시를 쓰면 브라우저 입장에서는 같은 3000으로 요청하므로 차단 안 됨
```

---

## 5. React 핵심 개념 (JSP/jQuery 비교)

### 5.1 컴포넌트 (Component)

> 컴포넌트 = 화면의 독립적인 조각

**JSP에서는:**
```jsp
<!-- header.jsp -->
<div class="header">...</div>

<!-- main.jsp -->
<jsp:include page="header.jsp" />    ← 재사용
<jsp:include page="sidebar.jsp" />
<tiles:insertAttribute name="body" />
```

**React에서는:**
```jsx
// Header.jsx
function Header() {
  return <div className="header">...</div>;
}

// Layout.jsx
function Layout() {
  return (
    <>
      <Header />           {/* ← 컴포넌트를 HTML 태그처럼 사용 */}
      <Sidebar />
      <Outlet />            {/* ← 페이지 내용이 들어가는 자리 */}
    </>
  );
}
```

**핵심 차이:**
- JSP: 서버에서 파일을 include → HTML 조각을 합침
- React: 브라우저에서 함수를 호출 → JavaScript가 DOM을 생성

### 5.2 JSX

> JSX = JavaScript + XML (HTML처럼 생긴 JavaScript)

```jsx
// 이것은 HTML이 아니라 JavaScript입니다!
function Greeting({ name }) {
  return <h1>안녕하세요, {name}님</h1>;
  //     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  //     이것이 JSX → 브라우저 실행 전에 JavaScript로 변환됨
  //     실제로는: React.createElement('h1', null, '안녕하세요, ' + name + '님')
}
```

**JSP EL과의 비교:**
```
JSP:   ${employee.name}           ← EL 표현식
React: {employee.name}            ← JSX 표현식 (중괄호 한 겹)
```

**주요 문법 차이:**

| HTML/JSP | JSX (React) | 이유 |
|----------|-------------|------|
| `class="btn"` | `className="btn"` | class는 JS 예약어 |
| `for="email"` | `htmlFor="email"` | for는 JS 예약어 |
| `onclick="fn()"` | `onClick={fn}` | camelCase + 함수 참조 |
| `style="color: red"` | `style={{color: 'red'}}` | 객체로 전달 |
| `<br>` | `<br />` | 모든 태그 닫아야 함 |

### 5.3 Props (속성)

> Props = 부모가 자식에게 전달하는 데이터

**Spring MVC에서는:**
```java
// Controller
model.addAttribute("employees", employeeList);
model.addAttribute("totalCount", total);
```
```jsp
<!-- JSP -->
총 ${totalCount}명
<c:forEach var="emp" items="${employees}">
  ${emp.name}
</c:forEach>
```

**React에서는:**
```jsx
// 부모 (EmployeeListPage)
<EmployeeTable
  employees={employees}        // ← props 전달
  onDelete={handleDelete}      // ← 함수도 전달 가능!
/>

// 자식 (EmployeeTable)
function EmployeeTable({ employees, onDelete }) {  // ← props 받기 (구조분해)
  return employees.map(emp => (
    <tr key={emp.id}>
      <td>{emp.name}</td>
      <td><button onClick={() => onDelete(emp.id)}>삭제</button></td>
    </tr>
  ));
}
```

**Props의 핵심 규칙:**
1. **읽기 전용** - 자식이 props를 수정할 수 없음 (단방향 데이터 흐름)
2. **부모 → 자식** 방향으로만 전달
3. 자식 → 부모 통신은 **콜백 함수**로 (onDelete처럼)

### 5.4 이벤트 처리

| jQuery | React | 비고 |
|--------|-------|------|
| `$('#btn').click(fn)` | `<button onClick={fn}>` | 선언적 |
| `$('#form').submit(fn)` | `<form onSubmit={fn}>` | |
| `$('#input').on('change', fn)` | `<input onChange={fn}>` | |
| `$('#input').val()` | `useState + value` | Controlled Component |
| `$('#input').val('새값')` | `setState('새값')` | |
| `e.preventDefault()` | `e.preventDefault()` | 동일 |

**흔한 실수:**
```jsx
// ✅ 올바른 사용: 함수 참조 (클릭 시 실행)
<button onClick={handleClick}>클릭</button>
<button onClick={() => handleDelete(id)}>삭제</button>

// ❌ 잘못된 사용: 함수 호출 (렌더링 시 즉시 실행됨!)
<button onClick={handleClick()}>클릭</button>
<button onClick={handleDelete(id)}>삭제</button>
```

---

## 6. 학습 순서 (파일별 가이드)

모든 파일에 한국어 주석이 달려 있습니다. 아래 순서대로 읽어보세요.

### STEP 1: 앱의 시작점 이해

**`src/main.jsx`** → React 앱이 시작되는 곳
- `ReactDOM.createRoot()` - HTML의 `<div id="root">`에 React를 연결
- `<StrictMode>` - 개발 도우미 (프로덕션에서는 무시됨)
- 배우는 것: **React 앱은 하나의 HTML 파일에서 시작된다**

**`src/App.jsx`** → URL과 페이지를 매핑
- `<BrowserRouter>` - 라우터 활성화
- `<Routes>`, `<Route>` - URL별 컴포넌트 매핑
- `<AuthProvider>` - 인증 상태 전역 제공
- 배우는 것: **React Router = Spring @RequestMapping**

#### Spring 개념 매핑

| React | Spring |
|-------|--------|
| `main.jsx` | `@SpringBootApplication` main 메소드 |
| `App.jsx`의 `<Route>` | `@RequestMapping` |
| `<BrowserRouter>` | `DispatcherServlet` |
| `<AuthProvider>` | `SecurityContextHolder` |

**흐름:** `index.html`의 `<div id="root">` → `main.jsx`가 여기에 `<App />`을 렌더링 → `App.jsx`가 URL에 따라 페이지 결정

#### 실습 1-A: main.jsx에서 App 대신 다른 걸 렌더링해보기

`main.jsx` 34번째 줄을 이렇게 바꿔보세요:

```jsx
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <h1>안녕하세요! JSP 없이 React만으로 화면이 나옵니다</h1>
  </React.StrictMode>
)
```

브라우저에서 `http://localhost:3000`을 보면 — 라우터도 없고, 로그인도 없고, 그냥 `<h1>` 텍스트만 나옵니다.
**이게 React의 본질입니다.** `main.jsx`가 뭘 render하든 그게 화면 전체입니다.
확인했으면 다시 `<App />`으로 되돌려 놓으세요.

#### 실습 1-B: App.jsx에서 라우트 추가해보기

`App.jsx`의 86번째 줄 (`{/* 404 페이지 */}` 바로 위)에 새 라우트를 추가하세요:

```jsx
              <Route path="/hello" element={<h2>내가 만든 첫 React 페이지!</h2>} />
```

브라우저에서 `http://localhost:3000/hello`로 접속 → 로그인 없이 바로 보입니다. (ProtectedRoute 밖이니까)

이제 그 라우트를 69번째 줄 `<Route element={<Layout />}>` 안쪽으로 옮기면 → 로그인해야만 보이고, 헤더/사이드바도 함께 나타납니다.

> **Spring 비유:** `SecurityConfig`에서 `.permitAll()`과 `.authenticated()`를 설정하는 것과 동일한 구조

#### 실습 1-C: Navigate 동작 확인

`App.jsx` 71번째 줄의 `<Navigate to="/dashboard" replace />`를 `<Navigate to="/employees" replace />`로 바꾸면 → 로그인 후 대시보드 대신 직원 목록이 첫 페이지가 됩니다.

> 실습을 마쳤으면 모든 변경을 원래대로 되돌리세요.

### STEP 2: 레이아웃 구조

**`src/components/layout/Layout.jsx`** → 공통 레이아웃
- `<Outlet />` - 자식 페이지가 렌더링되는 위치
- 배우는 것: **children/Outlet = Tiles/Thymeleaf의 layout:fragment**

**`src/components/layout/Header.jsx`** → 상단 바
- `{user && <span>환영합니다</span>}` - 조건부 렌더링
- 배우는 것: **조건부 렌더링 = `<c:if>` / jQuery show/hide**

**`src/components/layout/Sidebar.jsx`** → 사이드 메뉴
- `<Link to="/employees">` - 새로고침 없는 이동
- `.map()` - 배열을 JSX로 변환
- `useLocation()` - 현재 URL 감지
- 배우는 것: **Link = `<a>` 대신 사용 (SPA)**

#### 핵심 개념: Layout이 동작하는 원리

```
App.jsx에서 이렇게 중첩되어 있습니다:

<Route element={<ProtectedRoute />}>    ← 로그인 체크
  <Route element={<Layout />}>          ← 헤더+사이드바 고정
    <Route path="/dashboard" ... />     ← Outlet 자리에 들어감
    <Route path="/employees" ... />     ← Outlet 자리에 들어감
  </Route>
</Route>

Layout.jsx 구조:
┌──────────────────────────────────┐
│            <Header />             │
├──────────┬───────────────────────┤
│<Sidebar/>│                       │
│          │    <Outlet />          │
│          │    (여기가 바뀌는 영역)  │
│          │                       │
└──────────┴───────────────────────┘

JSP Tiles의 layout.jsp에서 <tiles:insertAttribute name="body" /> 하는 것과 같습니다.
```

#### 실습 2-A: Outlet 이해하기

`Layout.jsx`의 50번째 줄 `<Outlet />`을 이렇게 바꿔보세요:

```jsx
<h1>Outlet 자리에 원래 페이지가 나타납니다</h1>
<Outlet />
```

로그인 후 어떤 페이지로 이동해도 메인 영역 상단에 `<h1>`이 보입니다. `<Outlet />`이 URL에 맞는 페이지를 끼워넣는 자리라는 걸 눈으로 확인하세요. 확인 후 원래대로 되돌리세요.

#### 실습 2-B: 조건부 렌더링 실험 (Header.jsx)

`Header.jsx` 63번째 줄의 `{user && (` 블록이 조건부 렌더링입니다.

```jsx
// 현재 코드 (user가 있을 때만 보임)
{user && (
  <div>...</div>
)}
```

`{user && (...)}` 문법의 의미를 이해하세요:
- `user`가 값이 있으면(truthy) → 오른쪽 JSX를 렌더링
- `user`가 null이면(falsy) → 아무것도 렌더링하지 않음

> 참고: 이 프로젝트에서는 `ProtectedRoute`가 비로그인 사용자를 `/login`으로 보내므로,
> Header가 보이는 시점에는 항상 `user`가 존재합니다. 하지만 **방어적 코딩** 습관으로
> `{user && ...}`를 쓰는 것이 일반적입니다.

대신 `Header.jsx` 68번째 줄에서 실제로 확인할 수 있는 것을 바꿔보세요:

```jsx
{user.name.charAt(0)}
```
이것을 이렇게 바꾸면:
```jsx
{user.name}
```
아바타 원 안에 이니셜 대신 전체 이름이 나옵니다. 또는:
```jsx
{user.role}
```
으로 바꾸면 역할(ADMIN)이 표시됩니다. state에 어떤 값이 들어있는지 직접 확인해보세요.

> **Spring/JSP 비교:**
> - `{user && ...}` = `<c:if test="${user != null}">` (참일 때만 표시)
> - `{user ? A : B}` = `<c:choose><c:when>A</c:when><c:otherwise>B</c:otherwise></c:choose>`

확인 후 원래대로 되돌리세요.

#### 실습 2-C: Sidebar에 메뉴 추가하기

`Sidebar.jsx`의 `menuItems` 배열(27번째 줄)에 새 항목을 추가해보세요:

```jsx
{
  path: '/hello',
  label: '테스트 메뉴',
  icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
},
```

저장하면 사이드바에 "테스트 메뉴"가 자동으로 나타납니다. `.map()`이 배열을 순회하면서 각각을 `<Link>`로 변환하기 때문입니다.

> **핵심 깨달음:** 배열에 데이터를 추가하기만 하면 UI가 자동으로 늘어납니다. jQuery처럼 `$('#sidebar').append(...)` 할 필요 없습니다.

현재 URL이 `/hello`로 시작하면 메뉴가 파란색으로 하이라이트되는 것도 확인하세요. (`isActive` 로직 때문)

확인 후 원래대로 되돌리세요.

### STEP 3: 인증 시스템 (가장 중요한 개념!)

**`src/context/AuthContext.jsx`** → 전역 인증 상태
- `createContext()`, `Provider`, `useContext()`
- `useState`, `useEffect`
- `localStorage` 활용
- 배우는 것: **Context API = SecurityContextHolder (어디서든 인증 정보 접근)**

**`src/pages/LoginPage.jsx`** → 로그인 폼
- **Controlled Component** - input의 값을 state로 관리
- `onChange` - 입력할 때마다 state 업데이트
- `async/await` + `try/catch` - 비동기 API 호출
- `useNavigate()` - 프로그래밍 방식 페이지 이동
- 배우는 것: **React 폼 처리의 기본 패턴**

**`src/pages/SignupPage.jsx`** → 회원가입 폼
- 실시간 유효성 검사
- 여러 state의 조합
- 배우는 것: **폼 유효성 검사 패턴**

#### 핵심 개념: Context API가 동작하는 원리

```
Context API는 3단계로 동작합니다:

1단계: 그릇 만들기
  const AuthContext = createContext(null)

2단계: 그릇에 물 채우기 (Provider)
  <AuthContext.Provider value={{ user, login, logout }}>
    {children}    ← App 전체
  </AuthContext.Provider>

3단계: 아무 자식이나 물 마시기 (useContext)
  function Header() {
    const { user } = useAuth()   ← 중간 컴포넌트를 거치지 않고 직접 접근!
    return <span>{user.name}님</span>
  }

[Spring 비교]
SecurityContextHolder.getContext().getAuthentication().getName()
→ React에서는 useAuth().user.name
→ 둘 다 "어디서든 인증 정보에 접근"하는 같은 역할
```

#### 핵심 개념: Controlled Component

```
React 폼의 핵심 패턴입니다. input의 값을 React state가 "제어"합니다.

[jQuery 방식]
사용자 타이핑 → DOM에 직접 반영 → 값 읽기: $('#input').val()

[React 방식 - Controlled Component]
사용자 타이핑 → onChange 이벤트 → setState('새값') → state가 input의 value로 반영

코드:
const [username, setUsername] = useState('')
<input value={username} onChange={(e) => setUsername(e.target.value)} />

왜 이렇게 할까?
→ 입력값이 항상 JS 변수(state)와 동기화됨
→ 실시간 유효성 검사, 값 변환(대문자 등)이 쉬움
→ 폼 제출 시 DOM에서 값을 꺼낼 필요 없이 state를 그대로 사용
```

#### 실습 3-A: Context의 흐름 추적하기 (브라우저 개발자 도구)

1. 브라우저 F12 → Application 탭 → Local Storage → `http://localhost:3000`
2. admin / admin123으로 로그인
3. `token`과 `user` 키가 생긴 것을 확인하세요
4. 이것이 `AuthContext.jsx` 119~121번째 줄의 `localStorage.setItem()`이 하는 일입니다
5. 페이지를 새로고침(F5)해도 로그인이 유지됩니다 → `useEffect`(99번째 줄)가 localStorage에서 복원하기 때문
6. Local Storage에서 `token`을 직접 삭제해보세요 → 새로고침하면 로그인 페이지로 돌아갑니다

#### 실습 3-B: Controlled Component 직접 체험하기

`LoginPage.jsx`의 `handleChange` 함수(93번째 줄)에 `console.log`를 추가해보세요:

```jsx
const handleChange = (e) => {
  const { name, value } = e.target
  console.log(`필드: ${name}, 값: ${value}`)  // ← 이 줄 추가
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }))
}
```

로그인 페이지에서 한 글자씩 입력할 때마다 콘솔에 로그가 찍힙니다. **타이핑할 때마다 onChange → setState → 리렌더링** 사이클이 돌고 있다는 증거입니다.

> jQuery에서는 `$('#username').val()`로 제출 시점에 한 번 읽지만, React에서는 매 순간 state가 최신값을 갖고 있습니다.

#### 실습 3-C: useState 직접 변경 vs setter 함수

`AuthContext.jsx`의 `login` 함수(114번째 줄) 안에서 이것을 실험해보세요:

```jsx
// ❌ 이렇게 하면 절대 안 됩니다! (화면이 업데이트되지 않음)
// user = { username, name, role }

// ✅ 반드시 setter 함수를 통해야 합니다
setUser(userData)
```

> **핵심:** `user = 새값`으로 직접 할당하면 JavaScript 변수는 바뀌지만 React가 변경을 감지하지 못합니다. 반드시 `setUser()`를 통해야 React가 "아, 상태가 바뀌었구나" 하고 화면을 다시 그립니다.

#### 실습 3-D: 회원가입 폼의 실시간 유효성 검사 체험

`SignupPage.jsx`의 `validate` 함수(51번째 줄)에 새 규칙을 추가해보세요:

```jsx
const validate = (data) => {
  const newErrors = {}

  if (data.username.length < 4) {
    newErrors.username = '아이디는 4자 이상이어야 합니다'
  }
  // ↓ 새 규칙 추가
  if (data.email && !data.email.includes('@')) {
    newErrors.email = '올바른 이메일 형식이 아닙니다'
  }
  // ... 나머지
}
```

이 실습을 완성하려면 3가지를 모두 해야 합니다:

1. `validate()` 함수에 이메일 규칙 추가 (위 코드)
2. `type="email"`을 `type="text"`로 변경 (185번째 줄) — 브라우저 내장 검사가 먼저 걸리는 것을 방지
3. 이메일 input 아래에 에러 표시 JSX 추가 (187번째 줄 아래):
```jsx
{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
```
다른 필드(username, password)에는 이미 이 패턴이 있습니다. 이메일은 선택 필드라 빠져있었던 것이니 직접 추가해보세요.

> **핵심:** state로 폼을 관리하면 유효성 검사가 매우 쉬워집니다. jQuery의 `$.validate()` 플러그인 없이도 순수 JavaScript 로직만으로 가능합니다.

확인 후 모든 변경을 원래대로 되돌리세요.

### STEP 4: API 통신

**`src/api/axios.js`** → Axios 설정
- Request Interceptor - 매 요청에 JWT 토큰 자동 첨부
- Response Interceptor - 401 에러 시 자동 로그아웃
- 배우는 것: **Interceptor = jQuery $.ajaxSetup + error 공통 처리**

#### 핵심 개념: Axios Interceptor

```
모든 API 요청/응답을 가로채서 공통 처리를 합니다.

[요청 흐름]
컴포넌트에서 API 호출
  → Request Interceptor (토큰 자동 첨부)
  → 서버로 전송
  → 서버 응답
  → Response Interceptor (401이면 자동 로그아웃)
  → 컴포넌트에서 결과 처리

[Spring 비교]
Request Interceptor  = Spring의 Filter / HandlerInterceptor (요청 전처리)
Response Interceptor = Spring의 @ExceptionHandler (에러 공통 처리)

[jQuery 비교]
$.ajaxSetup({
  headers: { 'Authorization': 'Bearer ' + token },  ← Request Interceptor
  error: function(xhr) {
    if (xhr.status === 401) location.href = '/login'  ← Response Interceptor
  }
});
```

#### 실습 4-A: Interceptor가 토큰을 붙이는 것 확인하기

1. 로그인한 상태에서 브라우저 F12 → Network 탭
2. 직원 목록 페이지로 이동 (API 호출이 발생함)
3. `/api/employees` 요청을 클릭 → Headers 탭
4. Request Headers에 `Authorization: Bearer eyJhb...` 이 자동으로 들어있는 것을 확인
5. 이것이 `axios.js` 54번째 줄의 Request Interceptor가 하는 일입니다

#### 실습 4-B: Interceptor에 로그 추가해보기

`axios.js`의 Request Interceptor(54번째 줄)에 로그를 추가해보세요:

```jsx
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log(`[API 요청] ${config.method?.toUpperCase()} ${config.url}`)  // ← 추가
    console.log(`[토큰 존재 여부] ${!!token}`)  // ← 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  ...
)
```

이제 페이지를 이동할 때마다 콘솔에 어떤 API가 호출되는지 보입니다. 직원 목록, 상세, 대시보드 등 각 페이지에서 어떤 API를 호출하는지 추적해보세요.

#### 실습 4-C: 토큰 없이 API 호출하면 어떻게 되나

1. 로그인한 상태에서 정상 동작을 확인
2. F12 → Application → Local Storage에서 `token` 값을 삭제
3. 직원 목록 페이지를 새로고침 (F5)
4. Response Interceptor(74번째 줄)가 401 응답을 감지 → 자동으로 로그인 페이지로 이동

> **Spring 비교:** Spring Security의 `JwtAuthenticationFilter`가 토큰 없는 요청을 거부하는 것과 같은 흐름입니다. 프론트에서는 그 거부(401)를 받아서 로그인 페이지로 보내는 것입니다.

확인 후 모든 변경을 원래대로 되돌리세요.

### STEP 5: 직원 목록 (가장 중요한 파일!)

**`src/pages/EmployeeListPage.jsx`** ★★★
- 여러 `useState` 동시 관리 (목록, 검색어, 페이지, 로딩)
- `useEffect` + 의존성 배열로 자동 데이터 페칭
- 자식 컴포넌트에 props 전달
- 콜백 패턴 (삭제, 페이지 이동)
- 배우는 것: **React 앱 개발의 핵심 패턴 전체**

**`src/components/employee/EmployeeTable.jsx`** ★★
- `.map()` + `key` - 리스트 렌더링
- 이벤트 핸들러에 인자 전달
- 배우는 것: **.map() = `<c:forEach>` / `th:each`**

#### 핵심 개념: useEffect + 의존성 배열 (이 프로젝트에서 가장 중요!)

```
useEffect(() => {
  fetchEmployees()
}, [search, currentPage, selectedDept])
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   이 값들 중 하나라도 바뀌면 → fetchEmployees() 자동 실행

[동작 시나리오]
1. 페이지 처음 로드 → fetchEmployees() 실행 → 전체 직원 표시
2. 검색어에 "김" 입력 → search가 "김"으로 변경 → fetchEmployees() 자동 실행 → 김씨만 표시
3. 2페이지 클릭 → currentPage가 1로 변경 → fetchEmployees() 자동 실행 → 2페이지 표시
4. 부서 필터에서 "개발팀" 선택 → selectedDept 변경 → fetchEmployees() 자동 실행

[jQuery였다면?]
$('#search').on('keyup', function() { loadEmployees(); });   // 검색 이벤트
$('.page-btn').click(function() { loadEmployees(); });       // 페이지 이벤트
$('#dept-filter').change(function() { loadEmployees(); });   // 필터 이벤트
→ 각 이벤트마다 따로 loadEmployees()를 호출해야 함

React에서는 useEffect 하나로 끝! 의존성 배열에 넣기만 하면 자동 실행됩니다.
```

#### 핵심 개념: 부모-자식 컴포넌트 통신 (Props & Callback)

```
EmployeeListPage (부모 = Controller)
  │
  ├── employees 데이터를 props로 전달 ──────→ EmployeeTable (자식 = View)
  │                                             │
  └── onDelete 콜백 함수를 props로 전달 ─────→ 삭제 버튼 클릭 시 onDelete(id) 호출
      │
      └── 부모의 handleDeleteClick 실행 → API 호출 → 목록 새로고침

[Spring MVC 비유]
EmployeeListPage = Controller (데이터 처리, 비즈니스 로직)
EmployeeTable    = View/JSP (받은 데이터를 화면에 표시만 함)
props            = Model에 담아서 JSP에 전달하는 것
callback         = JSP의 form action이 다시 Controller를 호출하는 것
```

#### 실습 5-A: useEffect 의존성 배열 실험

`EmployeeListPage.jsx` 110번째 줄의 useEffect에 로그를 추가해보세요:

```jsx
useEffect(() => {
  console.log(`[useEffect 실행!] 검색어: "${search}", 페이지: ${currentPage}, 부서: ${selectedDept}`)
  fetchEmployees()
}, [search, currentPage, selectedDept])
```

이제 직원 목록 페이지에서:
1. 검색어를 입력해보세요 → 글자마다 콘솔 로그가 찍힘
2. 페이지를 이동해보세요 → 페이지 번호가 바뀐 로그가 찍힘
3. 부서 필터를 바꿔보세요 → 부서가 바뀐 로그가 찍힘

> **깨달음:** state가 바뀔 때마다 useEffect가 자동으로 실행됩니다. 이벤트를 일일이 바인딩하지 않아도 됩니다!

#### 실습 5-B: .map()과 key 이해하기

`EmployeeTable.jsx` 81번째 줄에서 `key={employee.id}`를 지워보세요:

```jsx
{employees.map((employee) => (
  <tr className="hover:bg-gray-50 transition-colors">  {/* key 제거 */}
```

F12 콘솔에 경고가 나타납니다: `Each child in a list should have a unique "key" prop.`
React가 리스트를 효율적으로 업데이트하려면 각 항목을 구분할 key가 필요합니다.

다시 `key={employee.id}`를 넣어주세요.

#### 실습 5-C: props 흐름 추적하기

`EmployeeTable.jsx` 47번째 줄에 로그를 추가해보세요:

```jsx
function EmployeeTable({ employees, onDelete }) {
  console.log('[EmployeeTable] 받은 직원 수:', employees.length)  // ← 추가
```

검색어를 입력하면:
1. 부모(EmployeeListPage)에서 API 호출 → 새 employees 배열을 state에 저장
2. state 변경 → 부모 리렌더링 → `<EmployeeTable employees={employees} />`에 새 데이터 전달
3. 자식(EmployeeTable) 리렌더링 → 콘솔에 새 직원 수 출력

> **핵심:** 부모의 state가 바뀌면 → 자식에 전달되는 props도 바뀌고 → 자식도 자동으로 다시 그려집니다. DOM을 직접 조작할 필요 없습니다!

#### 실습 5-D: 삭제 콜백 흐름 따라가기

직원 삭제가 동작하는 전체 흐름을 따라가보세요:

```
1. EmployeeTable.jsx 120번째 줄:
   <button onClick={() => onDelete(employee.id)}>삭제</button>
   → 클릭하면 부모에서 받은 onDelete(id)를 호출

2. EmployeeListPage.jsx 265번째 줄:
   <EmployeeTable onDelete={handleDeleteClick} />
   → onDelete는 사실 handleDeleteClick 함수

3. EmployeeListPage.jsx 170번째 줄:
   const handleDeleteClick = (employeeId) => {
     setDeleteDialog({ isOpen: true, employeeId })
   }
   → 삭제 확인 다이얼로그를 열기만 함

4. EmployeeListPage.jsx 174번째 줄:
   const handleDeleteConfirm = async () => {
     await employeeApi.delete(deleteDialog.employeeId)
     fetchEmployees()  ← 목록 새로고침!
   }
   → 확인 클릭 시 실제 API 호출 → 목록 자동 새로고침
```

실제로 직원을 삭제해보면서 이 흐름이 맞는지 확인하세요. (삭제된 직원은 다시 서버 재시작하면 data.sql로 복원됩니다)

확인 후 모든 console.log를 원래대로 되돌리세요.

### STEP 6: 직원 등록/수정/상세

**`src/components/employee/EmployeeForm.jsx`** ★
- 등록/수정 겸용 폼
- `useEffect([initialData])` - 초기 데이터 설정
- 배우는 것: **재사용 가능한 폼 컴포넌트**

**`src/pages/EmployeeDetailPage.jsx`**
- `useParams()` - URL 파라미터 추출
- 배우는 것: **useParams = @PathVariable**

**`src/pages/EmployeeCreatePage.jsx`**
- `useNavigate()` - 등록 후 목록으로 이동
- 배우는 것: **useNavigate = sendRedirect**

#### 핵심 개념: 하나의 폼 컴포넌트로 등록/수정 겸용

```
[EmployeeForm 재사용 원리]

등록 페이지 (EmployeeCreatePage.jsx):
  <EmployeeForm onSubmit={handleCreate} departments={depts} />
  → initialData가 없음 → 빈 폼

수정 페이지 (EmployeeEditPage.jsx):
  <EmployeeForm initialData={employee} onSubmit={handleUpdate} departments={depts} />
  → initialData가 있음 → 기존 데이터로 채워진 폼

EmployeeForm 내부:
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData })  ← 기존 데이터로 폼 채우기
    }
  }, [initialData])

[JSP 비교]
JSP에서 insert.jsp와 update.jsp를 하나로 합칠 때:
  <c:if test="${not empty employee}">
    <input value="${employee.name}" />   ← 수정 모드
  </c:if>
  <c:if test="${empty employee}">
    <input value="" />                   ← 등록 모드
  </c:if>
React에서는 initialData 유무로 자연스럽게 분기됩니다.
```

#### 핵심 개념: useParams = @PathVariable

```
[URL 파라미터 추출]

App.jsx:     <Route path="/employees/:id" element={<EmployeeDetailPage />} />
URL:         /employees/3
                        ^^
EmployeeDetailPage:  const { id } = useParams()   → id = "3"

[Spring 비교]
@GetMapping("/employees/{id}")
public Employee get(@PathVariable Long id) { ... }

정확히 같은 역할입니다!
```

#### 실습 6-A: useParams 확인하기

`EmployeeDetailPage.jsx` 37번째 줄 아래에 로그를 추가해보세요:

```jsx
const { id } = useParams()
console.log('[상세페이지] URL에서 가져온 id:', id, typeof id)  // ← 추가
```

직원 목록에서 아무 직원 이름을 클릭하면 → 콘솔에 `id: "3"` 같은 값이 찍힙니다.
주의: `typeof id`는 `string`입니다! (Spring의 @PathVariable Long id와 달리 문자열)

#### 실습 6-B: 등록 폼에 새 필드 추가해보기

`EmployeeForm.jsx`에 "한줄소개" 필드를 추가하는 실험입니다. (실제 API에는 없지만 폼 구조 이해 연습)

1단계: state에 필드 추가 (29번째 줄):
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  position: '',
  hireDate: '',
  salary: '',
  departmentId: '',
  bio: '',          // ← 추가
})
```

2단계: JSX에 input 추가 (연봉 필드 아래에):
```jsx
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">한줄소개</label>
  <input
    name="bio"
    type="text"
    value={formData.bio}
    onChange={handleChange}
    placeholder="자기소개를 입력하세요"
    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  />
</div>
```

저장하면 직원 등록 폼에 "한줄소개" 필드가 나타납니다. `handleChange`는 `name` 속성으로 어떤 필드인지 구분하므로, 새 필드를 추가해도 handleChange 함수를 수정할 필요가 없습니다!

> **핵심:** `[e.target.name]: value` 패턴 덕분에 필드가 몇 개든 handleChange 하나로 처리됩니다.

#### 실습 6-C: useNavigate로 페이지 이동 체험

`EmployeeCreatePage.jsx` 53번째 줄:

```jsx
navigate('/employees')  // 등록 성공 후 목록으로 이동
```

이것을 `/employees/new`로 바꾸면 → 등록 성공 후 다시 등록 폼이 나타납니다. (연속 등록 UX)
`/dashboard`로 바꾸면 → 등록 성공 후 대시보드로 이동합니다.

> **Spring 비교:** `return "redirect:/employees"` → `navigate('/employees')`. 같은 역할이지만 React는 페이지 새로고침 없이 즉시 이동합니다.

확인 후 모든 변경을 원래대로 되돌리세요.

### STEP 7: 부서 관리 (다른 CRUD 패턴)

**`src/pages/DepartmentListPage.jsx`**
- 한 페이지 + 모달로 CRUD 전체 처리
- 직원 관리(멀티 페이지)와 비교
- 배우는 것: **모달 CRUD 패턴**

#### 핵심 개념: 두 가지 CRUD 패턴 비교

```
[패턴 1: 멀티 페이지] (직원 관리 - STEP 5, 6에서 배움)
  /employees       → EmployeeListPage (목록)
  /employees/new   → EmployeeCreatePage (등록 = 별도 페이지)
  /employees/3     → EmployeeDetailPage (상세 = 별도 페이지)
  /employees/3/edit → EmployeeEditPage (수정 = 별도 페이지)
  → 장점: 각 페이지가 독립적, 복잡한 폼에 적합
  → 단점: 파일이 많음 (4개 페이지 + 컴포넌트들)

[패턴 2: 싱글 페이지 + 모달] (부서 관리 - 이 STEP)
  /departments     → DepartmentListPage (목록 + 모달로 등록/수정)
  → 장점: 파일 1개로 CRUD 전체 처리, 간단한 데이터에 적합
  → 단점: 페이지가 복잡해질 수 있음

[모달 모드 구분 방법]
  isModalOpen=true + editingDept=null   → 등록 모드 (빈 폼)
  isModalOpen=true + editingDept={...}  → 수정 모드 (기존 데이터)

  Spring MVC 비유:
  등록: model.addAttribute("department", new Department())
  수정: model.addAttribute("department", departmentService.findById(id))
  → React에서는 editingDept의 유무로 같은 것을 표현합니다.
```

#### 실습 7-A: 모달 상태 흐름 추적하기

`DepartmentListPage.jsx`의 `openCreateModal`(71번째 줄)과 `openEditModal`(82번째 줄)에 로그를 추가하세요:

```jsx
const openCreateModal = () => {
  console.log('[모달] 등록 모드로 열기')  // ← 추가
  setEditingDept(null)
  setFormData({ name: '', description: '' })
  setIsModalOpen(true)
}

const openEditModal = (dept) => {
  console.log('[모달] 수정 모드로 열기:', dept.name)  // ← 추가
  setEditingDept(dept)
  setFormData({ name: dept.name, description: dept.description || '' })
  setIsModalOpen(true)
}
```

부서 관리 페이지에서:
1. "부서 등록" 버튼 클릭 → 콘솔에 "등록 모드" 출력, 빈 폼이 열림
2. 기존 부서의 수정(연필) 아이콘 클릭 → 콘솔에 "수정 모드" 출력, 기존 데이터가 채워진 폼

> **핵심:** 같은 모달이지만 `editingDept`의 값에 따라 등록/수정이 결정됩니다. 240번째 줄의 버튼 텍스트도 이에 따라 바뀝니다:
> `{editingDept ? '수정' : '등록'}`

#### 실습 7-B: 직원 관리 vs 부서 관리 UX 비교해보기

두 가지를 직접 써보면서 차이를 느껴보세요:

1. **직원 등록:** 직원 관리 → 직원 등록 버튼 → 새 페이지로 이동 → 등록 → 목록으로 이동
2. **부서 등록:** 부서 관리 → 부서 등록 버튼 → 모달이 뜸 → 등록 → 모달 닫히고 목록 새로고침

부서처럼 필드가 2개(이름, 설명)뿐이면 모달이 가볍고 좋습니다.
직원처럼 필드가 7개 이상이면 별도 페이지가 편합니다.

#### 실습 7-C: 부서 삭제 시 소속 직원이 있는 경우 체험

개발팀(소속 직원이 있음)을 삭제해보세요. 서버에서 FK 제약 조건 에러가 발생하고, 118번째 줄의 catch 블록이 실행되어 "소속 직원이 있는지 확인하세요" 메시지가 표시됩니다.

> **학습 포인트:** 프론트엔드에서 에러를 잘 처리하면 사용자에게 친절한 안내를 줄 수 있습니다. Spring의 `@ExceptionHandler`가 에러 응답을 주면, React의 `catch`에서 그걸 받아 사용자에게 보여줍니다.

확인 후 모든 변경을 원래대로 되돌리세요.

### STEP 8: 대시보드

**`src/pages/DashboardPage.jsx`**
- 통계 카드, CSS 바 차트
- 배우는 것: **다중 데이터 표시**

#### 핵심 개념: 컴포넌트 분리와 props 활용

```
DashboardPage.jsx 안에 StatCard라는 작은 컴포넌트가 정의되어 있습니다 (201번째 줄).
같은 구조의 카드를 4번 반복하기 위해 분리한 것입니다.

[반복 없는 코드]
<StatCard title="전체 직원" value={15} unit="명" color="blue" icon={...} />
<StatCard title="전체 부서" value={5}  unit="개" color="green" icon={...} />
<StatCard title="평균 연봉" value={5600} unit="만원" color="purple" icon={...} />
<StatCard title="이번 달" value={0}  unit="명" color="orange" icon={...} />

→ StatCard가 props(title, value, unit, color)를 받아서 같은 구조로 렌더링

[JSP 비교]
JSP에서 custom tag나 include로 반복 UI를 추출하는 것과 같습니다:
<myapp:statCard title="전체 직원" value="${stats.totalEmployees}" />
```

#### 핵심 개념: 옵셔널 체이닝 (?.)

```
stats?.totalEmployees

이것은:
  stats가 null이면 → undefined 반환 (에러 안 남)
  stats가 있으면  → stats.totalEmployees 반환

왜 필요한가?
  useEffect에서 API를 호출하는 동안 stats는 null입니다.
  stats.totalEmployees 하면 → TypeError: Cannot read property of null
  stats?.totalEmployees 하면 → undefined (에러 없음)

Spring 비유:
  @Nullable Department dept;
  dept.getName()  → NullPointerException!
  Optional.ofNullable(dept).map(Department::getName).orElse(null)  → null
```

#### 실습 8-A: 통계 카드 추가해보기

`DashboardPage.jsx`의 통계 카드 영역(72번째 줄 `<div className="grid ...">` 안)에 새 카드를 추가해보세요:

```jsx
<StatCard
  title="최고 연봉"
  value="8,000"
  unit="만원"
  color="purple"
  icon={
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  }
/>
```

저장하면 통계 카드가 5개로 늘어납니다. `StatCard` 컴포넌트를 props만 바꿔서 재사용하는 것이 React 컴포넌트의 핵심입니다.

#### 실습 8-B: CSS 바 차트 동작 이해하기

`DashboardPage.jsx` 145번째 줄을 보세요:

```jsx
style={{ width: `${(dept.COUNT / maxCount) * 100}%` }}
```

이것이 CSS로 바 차트를 만드는 원리입니다:
- 개발팀 5명 / 최대 5명 → width: 100%
- 인사팀 3명 / 최대 5명 → width: 60%

직접 확인: 부서 관리에서 개발팀에 직원을 더 추가한 후 대시보드를 새로고침하면 바 길이가 바뀝니다.

#### 실습 8-C: API 응답 구조 확인하기

`DashboardPage.jsx`의 `fetchStats` 함수(39번째 줄)에 로그를 추가해보세요:

```jsx
const fetchStats = async () => {
  try {
    const response = await dashboardApi.getStats()
    console.log('[대시보드 API 응답]', response.data)  // ← 추가
    setStats(response.data)
  } catch (error) {
    console.error('대시보드 통계 로딩 실패:', error)
  } finally {
    setLoading(false)
  }
}
```

F12 콘솔에서 API 응답 구조를 확인하세요. `totalEmployees`, `totalDepartments`, `averageSalary`, `employeesByDepartment`, `recentEmployees` 등의 필드가 어떤 값으로 오는지 보면 프론트-백엔드 데이터 흐름을 이해할 수 있습니다.

> **Spring 비교:** `DashboardController.getStats()`가 반환하는 JSON이 바로 이 `response.data`입니다. 프론트엔드 개발 시 항상 API 응답 구조를 먼저 확인하는 습관을 들이세요.

확인 후 모든 변경을 원래대로 되돌리세요.

---

### 학습 완료 후 도전 과제

STEP 1~8을 모두 마쳤다면, 아래 도전 과제를 시도해보세요:

1. **직원 목록에 정렬 기능 추가:** 이름, 연봉 컬럼 헤더를 클릭하면 정렬되도록 (useState로 sortField, sortOrder 상태 추가)
2. **부서 상세 페이지 만들기:** 부서 카드를 클릭하면 해당 부서 소속 직원 목록을 보여주는 페이지 (새 Route + useParams 활용)
3. **다크 모드 토글:** Header에 버튼을 추가해서 배경색을 전환 (Context API로 전역 테마 관리)

막히는 부분이 있으면 언제든 물어보세요!

---

## 7. 상태(State) 완전 정복

### useState 기초

```jsx
const [count, setCount] = useState(0);
//     ^^^^  ^^^^^^^^         ^
//     현재값  변경함수        초기값

// 상태 읽기
console.log(count);     // 0

// 상태 변경 (이것만 가능!)
setCount(1);            // count가 1로 변경 → UI 자동 업데이트
setCount(count + 1);    // 현재값 + 1

// ❌ 직접 할당하면 안 됨!
count = 1;              // React가 변경을 감지하지 못함 → UI 업데이트 안 됨
```

### 왜 변수 대신 useState를 쓰는가?

```jsx
// ❌ 일반 변수 - 화면이 업데이트 안 됨
function Counter() {
  let count = 0;
  return (
    <>
      <p>{count}</p>
      <button onClick={() => { count++; }}>클릭</button>
      {/* count는 증가하지만 화면에는 여전히 0이 표시됨! */}
      {/* React는 일반 변수의 변경을 감지하지 못하기 때문 */}
    </>
  );
}

// ✅ useState - 화면이 자동으로 업데이트됨
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>클릭</button>
      {/* setCount 호출 → React가 변경 감지 → 컴포넌트 다시 렌더링 → 새 값 표시 */}
    </>
  );
}
```

### 객체 상태 관리

```jsx
// 객체 state
const [formData, setFormData] = useState({
  username: '',
  password: '',
});

// ❌ 잘못된 방법 - 객체를 직접 수정
formData.username = 'admin';  // React가 감지 못 함

// ✅ 올바른 방법 - 새 객체를 만들어서 교체
setFormData({
  ...formData,            // 기존 값 복사 (spread 연산자)
  username: 'admin',      // 변경할 필드만 덮어쓰기
});

// 결과: { username: 'admin', password: '' }
```

### 배열 상태 관리

```jsx
const [items, setItems] = useState([]);

// 추가
setItems([...items, newItem]);           // 기존 배열 + 새 항목

// 삭제
setItems(items.filter(item => item.id !== targetId));

// 수정
setItems(items.map(item =>
  item.id === targetId ? { ...item, name: '새이름' } : item
));
```

### 상태 변경의 렌더링 흐름

```
[상태 변경 시 일어나는 일]

1. setEmployees(새데이터) 호출
       ↓
2. React가 "상태가 변경되었다"고 감지
       ↓
3. 해당 컴포넌트 함수를 다시 실행 (re-render)
   → useState는 새 값을 반환
   → JSX가 새 데이터로 생성됨
       ↓
4. Virtual DOM에서 이전 화면과 비교 (diffing)
       ↓
5. 실제로 변경된 부분만 Real DOM에 반영
   → jQuery처럼 전체를 지우고 다시 그리지 않음!
   → 변경된 <td> 하나만 업데이트할 수 있음
```

---

## 8. 컴포넌트 생명주기와 useEffect

### useEffect란?

> 컴포넌트의 특정 시점에 코드를 실행하는 Hook

**jQuery 대응:**
```javascript
// jQuery
$(document).ready(function() {
  // 페이지 로드 시 실행
  $.ajax({ url: '/api/employees', success: function(data) { ... }});
});

$('#search').on('keyup', function() {
  // 검색어 변경 시 실행
  $.ajax({ ... });
});
```

**React:**
```jsx
// React - useEffect 하나로 모든 상황을 처리
useEffect(() => {
  fetchEmployees();
}, [search, currentPage]);
// ↑ 의존성 배열: search 또는 currentPage가 변경되면 다시 실행
```

### useEffect 의존성 배열 완전 이해

```jsx
// 1. 의존성 배열 없음 → 매 렌더링마다 실행 (거의 사용하지 않음)
useEffect(() => {
  console.log('매번 실행');
});

// 2. 빈 배열 [] → 마운트(첫 렌더링) 시 1번만 실행
// → $(document).ready()와 같음!
useEffect(() => {
  fetchDepartments();  // 부서 목록은 한 번만 로드
}, []);

// 3. 값이 있는 배열 → 해당 값이 변경될 때마다 실행
// → 특정 이벤트 리스너와 같음!
useEffect(() => {
  fetchEmployees();    // search가 바뀔 때마다 재검색
}, [search]);

// 4. 여러 값 → 둘 중 하나라도 변경되면 실행
useEffect(() => {
  fetchEmployees();    // 검색어 변경 OR 페이지 변경 시
}, [search, currentPage]);
```

### 비유로 이해하기

```
useEffect(실행할_함수, [감시할_변수들])

"이 변수들을 감시하다가, 변하면 이 함수를 실행해줘"

비유: CCTV
  useEffect(알림보내기, [현관문])
  → 현관문(변수)을 감시하다가, 열리면(변경) 알림을 보냄(실행)

  useEffect(알림보내기, [현관문, 창문])
  → 현관문이나 창문 중 하나라도 열리면 알림

  useEffect(알림보내기, [])
  → 설치 시(마운트) 1번만 알림, 이후 감시 안 함
```

---

## 9. React Router 라우팅

### Spring @RequestMapping과 비교

```java
// ─── Spring MVC ───
@GetMapping("/")                    → HomeController
@GetMapping("/employees")           → EmployeeController.list()
@GetMapping("/employees/{id}")      → EmployeeController.detail()
@GetMapping("/employees/new")       → EmployeeController.createForm()
@GetMapping("/employees/{id}/edit") → EmployeeController.editForm()
```

```jsx
// ─── React Router (App.jsx) ───
<Route path="/"                    element={<Navigate to="/dashboard" />} />
<Route path="/employees"           element={<EmployeeListPage />} />
<Route path="/employees/:id"       element={<EmployeeDetailPage />} />
<Route path="/employees/new"       element={<EmployeeCreatePage />} />
<Route path="/employees/:id/edit"  element={<EmployeeEditPage />} />
```

### 핵심 Hook들

```jsx
// 1. useNavigate() - 프로그래밍 방식 페이지 이동
const navigate = useNavigate();
navigate('/employees');         // Spring: return "redirect:/employees"
navigate(-1);                   // 뒤로 가기

// 2. useParams() - URL 파라미터 추출
// URL: /employees/3
const { id } = useParams();    // id = "3"  (Spring: @PathVariable)

// 3. useLocation() - 현재 URL 정보
const location = useLocation();
location.pathname;              // "/employees"

// 4. <Link> - 새로고침 없는 이동
<Link to="/employees">직원 목록</Link>
// HTML의 <a href>와 비슷하지만 페이지 새로고침 없음 (SPA)
```

### 중첩 라우트 (Nested Routes)

```jsx
// App.jsx
<Route element={<ProtectedRoute />}>     {/* 1차: 인증 체크 */}
  <Route element={<Layout />}>            {/* 2차: 레이아웃 적용 */}
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/employees" element={<EmployeeListPage />} />
  </Route>
</Route>

// 결과 구조:
// ProtectedRoute가 인증 확인
//   → 통과하면 Layout 렌더링 (Header + Sidebar + Outlet)
//     → Outlet 자리에 DashboardPage 또는 EmployeeListPage 렌더링
```

---

## 10. API 통신 패턴

### jQuery $.ajax vs Axios

```javascript
// ─── jQuery ───
$.ajax({
  url: '/api/employees',
  type: 'GET',
  headers: { 'Authorization': 'Bearer ' + token },
  data: { search: '김', page: 0 },
  success: function(data) {
    // DOM 직접 조작
    $('#table tbody').empty();
    $.each(data.content, function(i, emp) {
      $('#table tbody').append('<tr><td>' + emp.name + '</td></tr>');
    });
  },
  error: function(xhr) {
    alert('에러 발생');
  }
});
```

```jsx
// ─── React + Axios ───
const [employees, setEmployees] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await employeeApi.getAll({ search: '김', page: 0 });
      setEmployees(response.data.content);
      // → employees 상태가 변경되면 테이블이 자동으로 다시 그려짐!
      // → DOM을 직접 조작할 필요 없음!
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();
}, []);
```

### 전형적인 데이터 페칭 패턴

```jsx
function EmployeeListPage() {
  // 1. 상태 정의
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. useEffect로 데이터 페칭
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await employeeApi.getAll();
        setEmployees(response.data.content);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);  // 빈 배열 = 처음 한 번만

  // 3. 상태에 따른 조건부 렌더링
  if (loading) return <LoadingSpinner />;
  if (error) return <p>{error}</p>;

  return <EmployeeTable employees={employees} />;
}
```

이 패턴은 이 프로젝트의 거의 모든 페이지에서 사용됩니다.

---

## 11. Context API 전역 상태 관리

### 왜 필요한가? (Props Drilling 문제)

```
Context 없이:
App
  └─ Layout                    (user props 받아서 전달만 함)
       └─ Header               (user props 받아서 전달만 함)
            └─ UserMenu        (user를 실제로 사용하는 곳)

→ Layout, Header는 user를 사용하지도 않으면서 전달만 해야 함
→ 이것을 "Props Drilling"이라 함

Context 사용:
AuthProvider (user 데이터 제공)
  ├─ Layout
  │    └─ Header
  │         └─ UserMenu ← useAuth()로 직접 가져옴!
  └─ EmployeeListPage  ← useAuth()로 직접 가져옴!

→ 중간 컴포넌트를 거치지 않고 직접 접근 가능
```

### 3단계로 이해하기

```
1단계: 그릇 만들기 (createContext)
   const AuthContext = createContext(null);

2단계: 그릇에 물 채우기 (Provider)
   <AuthContext.Provider value={{ user, login, logout }}>
     {children}
   </AuthContext.Provider>

3단계: 물 마시기 (useContext)
   const { user, logout } = useAuth();
   // useAuth()는 내부적으로 useContext(AuthContext)를 호출
```

### Spring SecurityContextHolder와 비교

```java
// ─── Spring ───
// 어디서든 현재 로그인한 사용자 정보에 접근 가능
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String username = auth.getName();
```

```jsx
// ─── React ───
// 어디서든 현재 로그인한 사용자 정보에 접근 가능
const { user } = useAuth();
const username = user.username;
```

---

## 12. 자주 쓰는 React 패턴 모음

### 조건부 렌더링

```jsx
// JSP:   <c:if test="${not empty error}">${error}</c:if>
// React: {error && <p>{error}</p>}

// JSP:   <c:choose><c:when>...<c:otherwise>...</c:choose>
// React: {isLoading ? <Spinner /> : <Table />}

// 패턴 1: && (있을 때만 표시)
{error && <p className="text-red-500">{error}</p>}

// 패턴 2: 삼항 연산자 (둘 중 하나)
{isLoading ? <LoadingSpinner /> : <EmployeeTable />}

// 패턴 3: 일찍 반환 (early return)
if (loading) return <LoadingSpinner />;
if (!data) return <p>데이터 없음</p>;
return <DataTable data={data} />;
```

### 리스트 렌더링

```jsx
// JSP:   <c:forEach var="emp" items="${employees}">
//          <tr><td>${emp.name}</td></tr>
//        </c:forEach>

// React:
{employees.map((emp) => (
  <tr key={emp.id}>       {/* key는 필수! DB의 PK처럼 각 항목을 식별 */}
    <td>{emp.name}</td>
  </tr>
))}
```

### Controlled Component (폼 입력)

```jsx
// JSP:   <input type="text" name="username" value="${user.username}" />
// jQuery: const val = $('#username').val();

// React:
const [username, setUsername] = useState('');

<input
  value={username}                          // state 값 표시
  onChange={(e) => setUsername(e.target.value)} // 입력 시 state 업데이트
/>
// → value와 onChange가 항상 쌍으로!
// → state가 "진실의 원천" (Single Source of Truth)
```

### 콜백 패턴 (자식 → 부모 통신)

```jsx
// 부모
function Parent() {
  const handleDelete = (id) => {
    api.delete(id);      // 실제 삭제 로직은 부모에서
  };

  return <Child onDelete={handleDelete} />;
  //            ^^^^^^^^ 함수를 props로 전달
}

// 자식
function Child({ onDelete }) {
  return <button onClick={() => onDelete(3)}>삭제</button>;
  //                              ^^^^^^^^^ 부모에게 알림
}
```

---

## 13. Tailwind CSS 기초

### 기존 CSS와의 비교

```html
<!-- 기존 CSS -->
<style>
  .card {
    background-color: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
<div class="card">...</div>

<!-- Tailwind CSS - 클래스로 직접 스타일링 -->
<div class="bg-white rounded-lg p-6 shadow-sm">...</div>
```

### 자주 쓰는 Tailwind 클래스

| 분류 | 클래스 | 의미 |
|------|--------|------|
| **배경** | `bg-white`, `bg-blue-600` | 배경색 |
| **텍스트** | `text-sm`, `text-gray-500` | 글자 크기/색 |
| **폰트** | `font-bold`, `font-medium` | 글자 굵기 |
| **간격** | `p-4` (padding), `m-2` (margin) | 안쪽/바깥 여백 |
| **방향 간격** | `px-4` (좌우), `py-2` (상하), `mt-4` (위) | |
| **크기** | `w-full`, `h-16`, `max-w-md` | 너비/높이 |
| **Flex** | `flex`, `items-center`, `justify-between` | 가로 배치 |
| **Grid** | `grid`, `grid-cols-3`, `gap-4` | 격자 배치 |
| **둥글기** | `rounded-lg`, `rounded-full` | 모서리 둥글게 |
| **그림자** | `shadow-sm`, `shadow-xl` | 그림자 |
| **테두리** | `border`, `border-gray-200` | 테두리 |
| **상태** | `hover:bg-blue-700`, `focus:ring-2` | 마우스 오버/포커스 |
| **전환** | `transition-colors`, `transition-all` | 애니메이션 |
| **반응형** | `sm:flex`, `md:grid-cols-2`, `lg:w-1/3` | 화면 크기별 |

### 반응형 디자인

```html
<!-- sm(640px), md(768px), lg(1024px), xl(1280px) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 모바일: 1열, 태블릿: 2열, 데스크톱: 3열 -->
</div>
```

---

## 14. 디버깅 방법

### 브라우저 개발자 도구 (F12)

**Console 탭:**
```jsx
// 컴포넌트 안에서 상태 확인
console.log('employees:', employees);
console.log('현재 페이지:', currentPage);
```

**Network 탭:**
- API 요청/응답 확인 (XHR 또는 Fetch 필터)
- 요청 헤더에 Authorization 토큰이 있는지 확인
- 응답 JSON 데이터 확인

### React Developer Tools (크롬 확장 프로그램)

1. Chrome 웹 스토어에서 "React Developer Tools" 설치
2. F12 → Components 탭
3. 각 컴포넌트의 **props와 state를 실시간으로 확인** 가능
4. state를 직접 수정하여 UI 변화 테스트 가능

### 흔한 에러와 해결법

**1. `Objects are not valid as a React child`**
```
원인: JSX에서 객체를 직접 표시하려 함
잘못: {employee}
올바른: {employee.name}
```

**2. `Each child in a list should have a unique "key" prop`**
```
원인: .map()에서 key를 안 넣음
잘못: employees.map(emp => <tr>...</tr>)
올바른: employees.map(emp => <tr key={emp.id}>...</tr>)
```

**3. `Cannot read properties of null`**
```
원인: 데이터 로딩 전에 접근
잘못: {employee.name}  ← employee가 아직 null
올바른: {employee?.name}  ← 옵셔널 체이닝
    또는: if (!employee) return <Loading />;  ← 로딩 처리
```

**4. `Too many re-renders`**
```
원인: 렌더링 중에 setState를 호출
잘못: setCount(count + 1)  ← 컴포넌트 본문에 직접
올바른: <button onClick={() => setCount(count + 1)}>  ← 이벤트 핸들러 안에서
```

---

## 15. 다음 학습 단계

이 프로젝트를 완료한 후 추천하는 학습 순서:

### Level 2: TypeScript 적용

```
지금:  .jsx (JavaScript)
다음:  .tsx (TypeScript)

장점: 컴파일 시점에 타입 에러를 잡아줌
예시:
  // JavaScript - 런타임에 에러 발생
  employee.nmae  ← 오타인데 실행해봐야 알 수 있음

  // TypeScript - 코드 작성 시 에러 표시
  employee.nmae  ← 빨간 밑줄 "nmae는 Employee에 없습니다"
```

### Level 3: 상태 관리 라이브러리

```
지금:  Context API (React 내장)
다음:  Zustand (가볍고 간단) 또는 Redux Toolkit

언제: 전역 상태가 복잡해지고 Context Provider가 많아질 때
```

### Level 4: 서버 상태 관리

```
지금:  useEffect + useState로 직접 API 호출
다음:  React Query (TanStack Query)

장점:
  - 자동 캐싱 (같은 데이터를 다시 요청하지 않음)
  - 자동 재시도 (네트워크 에러 시)
  - 로딩/에러 상태 자동 관리
  - 데이터 갱신 자동화
```

### Level 5: 폼 라이브러리

```
지금:  useState로 직접 폼 관리
다음:  React Hook Form + Zod

장점:
  - 렌더링 최적화 (입력마다 전체 재렌더링 방지)
  - 유효성 검사 스키마 정의
  - 복잡한 폼 관리 간소화
```

### Level 6: 서버 사이드 렌더링

```
지금:  Vite + React (CSR - Client Side Rendering)
다음:  Next.js (SSR + CSR 혼합)

장점:
  - SEO 최적화
  - 초기 로딩 속도 향상
  - 파일 기반 라우팅
```
