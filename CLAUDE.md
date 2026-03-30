# Employee Management System

## 프로젝트 개요
Java/Spring 개발자가 React를 단계별로 학습하기 위한 풀스택 직원 관리 시스템.
모든 React 파일에 JSP/jQuery와 비교하는 한국어 주석이 포함되어 있음.

## 기술 스택
- **Backend**: Spring Boot 3.3.5 + Java 17 + MyBatis 3.0.3 + H2(인메모리) + JWT(JJWT 0.12.6)
- **Frontend**: React 18 + Vite 5 + Tailwind CSS 3.4 + React Router v6 + Axios

## 빌드 및 실행
```bash
# Backend (포트 8080)
cd backend
./gradlew bootRun

# Frontend (포트 3000)
cd frontend
npm install
npm run dev
```

## 주요 URL
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- H2 Console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:empdb)
- Vite가 /api/* 요청을 자동으로 8080으로 프록시

## 기본 계정
- admin / admin123 (DataInitializer.java에서 BCrypt 런타임 생성)

## 프로젝트 구조
```
backend/src/main/java/com/example/empmgmt/
├── config/          # Security, CORS, MyBatis, DataInitializer
├── security/        # JWT 토큰 생성/검증, 필터, UserDetailsService
├── controller/      # REST API (Auth, Employee, Department, Dashboard)
├── service/         # 비즈니스 로직
├── mapper/          # MyBatis 매퍼 인터페이스
├── domain/          # 엔티티 (User, Employee, Department)
└── dto/             # Request/Response DTO

frontend/src/
├── api/             # Axios 인스턴스 + API 함수
├── context/         # AuthContext (전역 인증 상태)
├── components/
│   ├── layout/      # Layout, Header, Sidebar
│   ├── common/      # Pagination, Modal, SearchBar, Alert 등
│   └── employee/    # EmployeeTable, EmployeeForm
├── pages/           # Login, Signup, CRUD 페이지, Dashboard
└── utils/           # 포맷터, 유효성 검사
```

## REST API
| Method | Path | 설명 |
|--------|------|------|
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 → JWT 반환 |
| GET | /api/employees | 직원 목록 (검색/페이지네이션) |
| GET/POST/PUT/DELETE | /api/employees/{id} | 직원 CRUD |
| GET/POST/PUT/DELETE | /api/departments/{id} | 부서 CRUD |
| GET | /api/dashboard/stats | 대시보드 통계 |

## 코딩 컨벤션
- React 파일에는 JSP/jQuery 비교 한국어 주석 유지
- JavaScript 사용 (TypeScript 아님)
- 상태관리: useState + Context API (Redux 미사용)
- 백엔드 SQL: MyBatis XML 매퍼 (backend/src/main/resources/mapper/*.xml)
- DB 스키마: schema.sql 자동 생성, 샘플 데이터: data.sql
