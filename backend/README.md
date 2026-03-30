# Backend - Spring Boot + MyBatis + JWT 인증

> 직원 관리 시스템의 백엔드 REST API 서버

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택 상세](#2-기술-스택-상세)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [실행 방법](#4-실행-방법)
5. [설정 파일 해설](#5-설정-파일-해설)
6. [데이터베이스 설계](#6-데이터베이스-설계)
7. [API 명세](#7-api-명세)
8. [아키텍처 계층 설명](#8-아키텍처-계층-설명)
9. [인증 흐름 (JWT)](#9-인증-흐름-jwt)
10. [MyBatis 사용법](#10-mybatis-사용법)
11. [주요 코드 해설](#11-주요-코드-해설)
12. [테스트 방법](#12-테스트-방법)
13. [트러블슈팅](#13-트러블슈팅)

---

## 1. 프로젝트 개요

이 프로젝트는 React 프론트엔드에 데이터를 제공하는 **REST API 서버**입니다.

기존에 익숙한 Spring MVC(JSP/Thymeleaf) 방식과의 차이점:

| 항목 | 기존 (Spring MVC + JSP) | 이 프로젝트 (REST API + React) |
|------|------------------------|-------------------------------|
| **Controller 반환** | `ModelAndView`, `String` (뷰 이름) | `ResponseEntity<T>` (JSON) |
| **View** | JSP, Thymeleaf 파일 | 없음 (프론트엔드가 별도) |
| **데이터 전달** | `Model.addAttribute()` | JSON 응답 |
| **인증** | 세션 기반 (HttpSession) | JWT 토큰 기반 (Stateless) |
| **Form 처리** | `@ModelAttribute`, `<form action="">` | `@RequestBody` (JSON) |
| **CSRF** | 활성화 (폼 기반이므로) | 비활성화 (JWT 사용) |
| **CORS** | 불필요 (같은 서버) | 필요 (프론트 3000, 백 8080) |

### 핵심 변화

```
[기존 방식]
브라우저 → Spring Controller → Service → DB
                  ↓
              JSP/Thymeleaf로 HTML 생성
                  ↓
              완성된 HTML을 브라우저에 전달

[REST API 방식 (이 프로젝트)]
React (브라우저) → Spring Controller → Service → DB
                        ↓
                    JSON 데이터만 응답
                        ↓
                React가 받아서 화면을 직접 구성
```

---

## 2. 기술 스택 상세

| 기술 | 버전 | 역할 | 비고 |
|------|------|------|------|
| **Java** | 17 | 실행 언어 | LTS, Spring Boot 3.x 최소 요구 |
| **Spring Boot** | 3.3.5 | 프레임워크 | 자동 설정, 내장 톰캣 |
| **Spring Security** | 6.x | 인증/인가 | Spring Boot 3.x에 포함 |
| **MyBatis** | 3.0.3 | SQL 매퍼 | XML 기반 SQL 매핑 |
| **H2 Database** | 내장 | 인메모리 DB | 별도 설치 불필요, 앱 종료 시 초기화 |
| **JJWT** | 0.12.6 | JWT 처리 | 토큰 생성/검증 |
| **Lombok** | 내장 | 보일러플레이트 제거 | @Data, @Builder 등 |
| **Gradle** | 8.10.2 | 빌드 도구 | Groovy DSL |

### 왜 H2 인메모리 DB인가?

- 별도의 MySQL/PostgreSQL 설치 과정이 불필요
- 앱 실행만 하면 자동으로 테이블 생성 + 샘플 데이터 삽입
- 학습에 집중할 수 있도록 환경 설정 최소화
- 나중에 MySQL 등으로 전환할 때는 `application.yml`의 datasource만 변경하면 됨

---

## 3. 프로젝트 구조

```
backend/
├── build.gradle                      # 빌드 설정 및 의존성 관리
├── settings.gradle                   # 프로젝트 이름 설정
├── gradlew / gradlew.bat            # Gradle Wrapper (Java 빌드 실행)
│
└── src/
    ├── main/
    │   ├── java/com/example/empmgmt/
    │   │   │
    │   │   ├── EmpMgmtApplication.java       # 앱 진입점 (@SpringBootApplication)
    │   │   │
    │   │   ├── config/                        # ──── 설정 계층 ────
    │   │   │   ├── SecurityConfig.java        #   Spring Security + JWT 설정
    │   │   │   ├── WebConfig.java             #   CORS 설정
    │   │   │   └── MyBatisConfig.java         #   MyBatis @MapperScan 설정
    │   │   │
    │   │   ├── security/                      # ──── 보안 계층 ────
    │   │   │   ├── JwtTokenProvider.java      #   JWT 토큰 생성/검증 유틸
    │   │   │   ├── JwtAuthenticationFilter.java #  매 요청마다 JWT 검증하는 필터
    │   │   │   └── CustomUserDetailsService.java # UserDetailsService 구현
    │   │   │
    │   │   ├── controller/                    # ──── 표현 계층 (Presentation) ────
    │   │   │   ├── AuthController.java        #   POST /api/auth/signup, /login
    │   │   │   ├── EmployeeController.java    #   GET/POST/PUT/DELETE /api/employees
    │   │   │   ├── DepartmentController.java  #   GET/POST/PUT/DELETE /api/departments
    │   │   │   └── DashboardController.java   #   GET /api/dashboard/stats
    │   │   │
    │   │   ├── service/                       # ──── 비즈니스 계층 (Business) ────
    │   │   │   ├── AuthService.java           #   회원가입, 로그인 처리
    │   │   │   ├── EmployeeService.java       #   직원 CRUD + 페이지네이션
    │   │   │   ├── DepartmentService.java     #   부서 CRUD
    │   │   │   └── DashboardService.java      #   통계 데이터 조합
    │   │   │
    │   │   ├── mapper/                        # ──── 데이터 접근 계층 (Data Access) ────
    │   │   │   ├── UserMapper.java            #   사용자 조회/등록 인터페이스
    │   │   │   ├── EmployeeMapper.java        #   직원 CRUD 인터페이스
    │   │   │   ├── DepartmentMapper.java      #   부서 CRUD 인터페이스
    │   │   │   └── DashboardMapper.java       #   통계 쿼리 인터페이스
    │   │   │
    │   │   ├── domain/                        # ──── 도메인 (Entity) ────
    │   │   │   ├── User.java                  #   사용자 (회원가입/로그인)
    │   │   │   ├── Employee.java              #   직원
    │   │   │   └── Department.java            #   부서
    │   │   │
    │   │   └── dto/                           # ──── 데이터 전송 객체 ────
    │   │       ├── request/                   #   클라이언트 → 서버 (요청)
    │   │       │   ├── SignupRequest.java
    │   │       │   ├── LoginRequest.java
    │   │       │   ├── EmployeeRequest.java
    │   │       │   └── DepartmentRequest.java
    │   │       └── response/                  #   서버 → 클라이언트 (응답)
    │   │           ├── TokenResponse.java
    │   │           ├── EmployeeResponse.java
    │   │           ├── DepartmentResponse.java
    │   │           ├── DashboardResponse.java
    │   │           └── PageResponse.java
    │   │
    │   └── resources/
    │       ├── application.yml               # 앱 설정 (DB, JWT, MyBatis)
    │       ├── schema.sql                    # 테이블 생성 DDL (앱 시작 시 자동 실행)
    │       ├── data.sql                      # 샘플 데이터 INSERT (앱 시작 시 자동 실행)
    │       └── mapper/                       # MyBatis SQL XML
    │           ├── UserMapper.xml
    │           ├── EmployeeMapper.xml
    │           ├── DepartmentMapper.xml
    │           └── DashboardMapper.xml
    │
    └── test/
        └── java/com/example/empmgmt/
            └── EmpMgmtApplicationTests.java  # 기본 테스트
```

### 계층 구조 (Layer Architecture)

```
[요청 흐름]

React (프론트엔드)
    │
    │  HTTP 요청 (JSON)
    ▼
┌─────────────────────────────────────────────┐
│  JwtAuthenticationFilter                     │  ← 매 요청마다 JWT 토큰 검증
│  (Spring Security Filter Chain)              │
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│  Controller (표현 계층)                       │  ← 요청 파라미터 검증, 응답 포맷 결정
│  @RestController, @RequestMapping            │     JSP Controller와 같지만 JSON 반환
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│  Service (비즈니스 계층)                      │  ← 비즈니스 로직 처리
│  @Service                                    │     기존 Service 계층과 동일
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│  Mapper (데이터 접근 계층)                    │  ← SQL 실행 (MyBatis)
│  @Mapper + XML                               │     JPA의 Repository 역할
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│  H2 Database (인메모리)                       │
└─────────────────────────────────────────────┘
```

---

## 4. 실행 방법

### 사전 요구사항

- **Java 17 이상**
- **IntelliJ IDEA** (Ultimate 또는 Community)

> **중요:** 프론트엔드(React)와 백엔드(Spring Boot)는 **동시에 실행**해야 합니다.
> 백엔드가 먼저 실행되어 있어야 프론트엔드에서 API 호출이 가능합니다.

---

### STEP 1: IntelliJ에서 프로젝트 열기

1. IntelliJ IDEA 실행
2. **File → Open** 클릭
3. `C:\project\employee-management\backend` 폴더를 선택
4. **"Open as Project"** 클릭
5. 우측 하단에 Gradle 동기화 진행바가 나타남 → **완료될 때까지 대기**
   - 처음 열면 의존성 다운로드 때문에 2~5분 소요될 수 있음
   - `BUILD SUCCESSFUL` 또는 진행바가 사라지면 완료

```
만약 Gradle 동기화가 실패하면:
  → View → Tool Windows → Gradle 클릭
  → 좌측 상단 🔄(새로고침) 버튼 클릭하여 재시도
```

---

### STEP 2: Java 17 SDK 설정

이 프로젝트는 **Java 17 이상**이 필요합니다.

1. **File → Project Structure** (단축키: `Ctrl+Alt+Shift+S`)
2. 왼쪽 메뉴에서 **SDKs** 클릭
3. Java 17이 이미 있으면 → 선택 후 OK
4. **Java 17이 없으면** → IntelliJ에서 직접 다운로드:
   - `+` 버튼 클릭 → **Download JDK...**
   - Version: **17** 선택
   - Vendor: **Eclipse Temurin (Adoptium)** 선택 (무료, 안정적)
   - Download 클릭 → 다운로드 완료까지 대기
5. **Project** 탭 → Project SDK: **17** 선택
6. **Modules** 탭 → Language Level: **17** 선택
7. **OK** 클릭

```
[Java 17 다운로드 화면]

  ┌── Download JDK ──────────────────────┐
  │                                       │
  │  Version:  [ 17          ▼]           │
  │  Vendor:   [ Eclipse Temurin ▼]       │
  │  Location: C:\Users\...\.jdks\17     │
  │                                       │
  │              [Download]               │
  └───────────────────────────────────────┘
```

---

### STEP 3: Lombok 플러그인 확인

이 프로젝트는 **Lombok**을 사용합니다 (getter/setter 자동 생성).

1. **File → Settings** (단축키: `Ctrl+Alt+S`)
2. **Plugins** 검색
3. **"Lombok"** 플러그인이 설치되어 있는지 확인
   - 설치 안 되어 있으면: Marketplace 탭에서 "Lombok" 검색 → Install → IntelliJ 재시작
4. **Settings → Build, Execution, Deployment → Compiler → Annotation Processors**
5. **"Enable annotation processing"** 체크 ✅
6. OK 클릭

```
체크해야 하는 항목:
  ☑ Enable annotation processing    ← 이것을 반드시 체크!
```

---

### STEP 4: 실행

1. 좌측 프로젝트 탐색기에서 다음 파일을 찾아서 엽니다:
   ```
   src/main/java/com/example/empmgmt/EmpMgmtApplication.java
   ```

2. 파일을 열면 `main` 메서드 왼쪽에 **▶ (초록색 재생 버튼)** 이 보입니다

3. **▶ 버튼 클릭** → **"Run 'EmpMgmtApplication'"** 선택
   - 또는 단축키: `Ctrl+Shift+F10`

4. 하단 콘솔(Run 탭)에서 다음 메시지가 나타나면 **실행 성공**:
   ```
   Started EmpMgmtApplication in X.XXX seconds
   ```

```
[실행 성공 시 콘솔 출력 예시]

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v3.3.5)

 ...
 Tomcat started on port 8080
 Started EmpMgmtApplication in 3.456 seconds (process running for 4.123)
```

---

### STEP 5: 실행 확인

서버가 실행되면 아래 URL들로 접속하여 확인합니다.

#### 접속 URL 목록

| URL | 설명 | 비고 |
|-----|------|------|
| http://localhost:8080/h2-console | **H2 데이터베이스 콘솔** | DB 직접 조회 가능 |
| http://localhost:8080/api/auth/login | 로그인 API (POST) | Postman으로 테스트 |
| http://localhost:8080/api/employees | 직원 목록 API (GET) | JWT 토큰 필요 |
| http://localhost:8080/api/departments | 부서 목록 API (GET) | JWT 토큰 필요 |
| http://localhost:8080/api/dashboard/stats | 대시보드 통계 (GET) | JWT 토큰 필요 |

#### H2 콘솔로 DB 확인하기

1. 브라우저에서 http://localhost:8080/h2-console 접속
2. 아래와 같이 입력:

```
┌── H2 Console Login ──────────────────┐
│                                       │
│  Driver Class: org.h2.Driver          │
│  JDBC URL:     jdbc:h2:mem:empdb      │  ← 이것을 정확히 입력!
│  User Name:    sa                     │
│  Password:     (비워두기)              │
│                                       │
│              [Connect]                │
└───────────────────────────────────────┘
```

3. Connect 클릭
4. 왼쪽에 테이블 목록이 보이면 성공:
   - **USERS** - 사용자 테이블 (admin 계정 1개)
   - **DEPARTMENTS** - 부서 테이블 (5개)
   - **EMPLOYEES** - 직원 테이블 (15명)

5. SQL을 직접 실행해볼 수 있습니다:
```sql
SELECT * FROM employees;
SELECT * FROM departments;
SELECT e.name, d.name AS dept FROM employees e JOIN departments d ON e.department_id = d.id;
```

#### Postman 또는 curl로 API 테스트

```bash
# 1단계: 로그인하여 JWT 토큰 발급
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# 응답 예시:
# {"token":"eyJhbGciOi...","username":"admin","name":"관리자","role":"ADMIN"}
# → token 값을 복사해둡니다

# 2단계: 토큰으로 직원 목록 조회
curl http://localhost:8080/api/employees \
  -H "Authorization: Bearer eyJhbGciOi...(복사한 토큰)"

# 3단계: 회원가입 테스트
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"password\":\"test1234\",\"name\":\"테스트\",\"email\":\"test@test.com\"}"
```

---

### 터미널에서 실행 (IntelliJ 터미널 또는 CMD)

IntelliJ 하단의 **Terminal** 탭(Alt+F12)에서 실행할 수도 있습니다:

```bash
# Windows (CMD / PowerShell)
gradlew.bat bootRun

# Git Bash / WSL
./gradlew bootRun
```

### 서버 중지

- IntelliJ: Run 탭의 **■ (빨간 정지 버튼)** 클릭
- 터미널: `Ctrl+C`

---

### 실행 시 자주 발생하는 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| `UnsupportedClassVersionError` | Java 17 미만으로 실행 | STEP 2에서 Java 17 설정 |
| `Port 8080 already in use` | 8080 포트가 이미 사용 중 | 기존 프로세스 종료하거나 application.yml에서 포트 변경 |
| Gradle 동기화 실패 | 네트워크 문제 또는 Java 미설정 | 인터넷 연결 확인, Java 17 SDK 설정 후 Gradle 새로고침 |
| Lombok 에러 (`cannot find symbol`) | Annotation Processing 미활성화 | STEP 3에서 Lombok 설정 |
| `Table "USERS" not found` | schema.sql 미실행 | application.yml의 `spring.sql.init.mode: always` 확인 |
| 한글 깨짐 | 인코딩 설정 누락 | application.yml의 `spring.sql.init.encoding: UTF-8` 확인 |

---

## 5. 설정 파일 해설

### application.yml

```yaml
server:
  port: 8080                          # 서버 포트 (React는 3000에서 실행)

spring:
  datasource:
    url: jdbc:h2:mem:empdb            # H2 인메모리 DB (앱 종료 시 데이터 사라짐)
    driver-class-name: org.h2.Driver
    username: sa
    password:                          # H2 기본값: 비밀번호 없음
  h2:
    console:
      enabled: true                    # H2 웹 콘솔 활성화 (개발용)
      path: /h2-console                # http://localhost:8080/h2-console
  sql:
    init:
      mode: always                     # 앱 시작마다 schema.sql + data.sql 실행
      encoding: UTF-8                  # 한글 깨짐 방지

mybatis:
  mapper-locations: classpath:mapper/*.xml   # SQL XML 파일 위치
  type-aliases-package: com.example.empmgmt.domain  # resultType에 패키지 생략 가능
  configuration:
    map-underscore-to-camel-case: true # DB: hire_date → Java: hireDate 자동 변환

jwt:
  secret: bXlTdX...                   # JWT 서명용 비밀키 (Base64 인코딩)
  expiration: 86400000                # 토큰 유효기간: 24시간 (밀리초)
```

### build.gradle 주요 의존성 설명

```groovy
dependencies {
    // [웹] Spring MVC + 내장 톰캣
    implementation 'org.springframework.boot:spring-boot-starter-web'

    // [보안] Spring Security (인증/인가 프레임워크)
    implementation 'org.springframework.boot:spring-boot-starter-security'

    // [검증] @NotBlank, @Size 등 Bean Validation
    implementation 'org.springframework.boot:spring-boot-starter-validation'

    // [DB] MyBatis - SQL 매퍼 프레임워크
    implementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.3'

    // [DB] H2 - 인메모리 데이터베이스
    runtimeOnly 'com.h2database:h2'

    // [JWT] JSON Web Token 생성/검증 라이브러리
    implementation 'io.jsonwebtoken:jjwt-api:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.6'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.6'

    // [편의] Lombok - getter/setter/constructor 자동 생성
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

### SecurityConfig.java 핵심 설정

```java
http
    // CSRF 비활성화
    // ↳ JSP 폼에서는 CSRF 토큰이 필요했지만,
    //   JWT 기반 REST API에서는 불필요 (토큰 자체가 인증 수단)
    .csrf(csrf -> csrf.disable())

    // 세션 사용 안 함
    // ↳ JSP에서는 HttpSession으로 로그인 상태를 유지했지만,
    //   JWT 방식에서는 매 요청의 토큰으로 인증 (Stateless)
    .sessionManagement(session ->
        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

    // URL별 접근 권한 설정
    .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()  // 로그인/회원가입은 누구나
        .requestMatchers("/h2-console/**").permitAll() // H2 콘솔은 개발용
        .anyRequest().authenticated()                  // 나머지는 인증 필요
    )
```

### WebConfig.java - CORS 설정

```java
// CORS (Cross-Origin Resource Sharing)
//
// 프론트엔드(localhost:3000)와 백엔드(localhost:8080)의 포트가 다르면
// 브라우저가 보안 정책으로 요청을 차단합니다.
// CORS 설정으로 프론트엔드의 요청을 허용합니다.
//
// [기존 JSP 방식에서는 불필요했던 이유]
// JSP는 같은 서버(8080)에서 HTML을 생성하므로 Origin이 같음.
// React는 별도 서버(3000)에서 실행되므로 Cross-Origin 요청이 됨.

registry.addMapping("/api/**")
        .allowedOrigins("http://localhost:3000")  // React 개발 서버
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(true);
```

---

## 6. 데이터베이스 설계

### ERD (Entity-Relationship Diagram)

```
┌───────────────┐       ┌──────────────────┐       ┌─────────────────┐
│    USERS      │       │   DEPARTMENTS    │       │   EMPLOYEES     │
├───────────────┤       ├──────────────────┤       ├─────────────────┤
│ id (PK)       │       │ id (PK)          │──┐    │ id (PK)         │
│ username (UQ) │       │ name (UQ)        │  │    │ name            │
│ password      │       │ description      │  │    │ email           │
│ name          │       │ created_at       │  │    │ phone           │
│ email         │       └──────────────────┘  │    │ position        │
│ role          │                              │    │ hire_date       │
│ created_at    │                              │    │ salary          │
└───────────────┘                              └───>│ department_id(FK)│
                                                    │ created_at      │
                                                    │ updated_at      │
                                                    └─────────────────┘
```

### 테이블 상세

**USERS** - 시스템 사용자 (로그인/회원가입)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT (PK, AUTO) | 사용자 고유 ID |
| username | VARCHAR(50), UNIQUE | 로그인 아이디 |
| password | VARCHAR(255) | BCrypt 해시 비밀번호 |
| name | VARCHAR(100) | 사용자 이름 |
| email | VARCHAR(100) | 이메일 |
| role | VARCHAR(20), DEFAULT 'USER' | 권한 (USER/ADMIN) |
| created_at | TIMESTAMP | 가입일시 |

**DEPARTMENTS** - 부서

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT (PK, AUTO) | 부서 고유 ID |
| name | VARCHAR(100), UNIQUE | 부서명 |
| description | VARCHAR(500) | 부서 설명 |
| created_at | TIMESTAMP | 생성일시 |

**EMPLOYEES** - 직원

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGINT (PK, AUTO) | 직원 고유 ID |
| name | VARCHAR(100) | 직원 이름 |
| email | VARCHAR(100) | 이메일 |
| phone | VARCHAR(20) | 연락처 |
| position | VARCHAR(100) | 직급/직위 |
| hire_date | DATE | 입사일 |
| salary | BIGINT | 연봉 (원) |
| department_id | BIGINT (FK) | 소속 부서 ID |
| created_at | TIMESTAMP | 등록일시 |
| updated_at | TIMESTAMP | 수정일시 |

### 샘플 데이터

앱 시작 시 자동으로 삽입됩니다:
- 관리자 1명 (admin / admin123)
- 부서 5개 (개발팀, 인사팀, 마케팅팀, 영업팀, 재무팀)
- 직원 15명 (각 부서에 2~5명 배정)

---

## 7. API 명세

모든 API는 `/api` prefix를 사용합니다.
인증이 필요한 API는 Authorization 헤더에 JWT 토큰을 포함해야 합니다.

### 인증 API

#### POST /api/auth/signup - 회원가입

```
요청:
{
  "username": "testuser",    // 4~50자
  "password": "test1234",    // 6자 이상
  "name": "테스트유저",
  "email": "test@example.com"
}

성공 응답 (201):
{
  "message": "회원가입이 완료되었습니다"
}

실패 응답 (400):
{
  "message": "이미 존재하는 아이디입니다: testuser"
}
```

#### POST /api/auth/login - 로그인

```
요청:
{
  "username": "admin",
  "password": "admin123"
}

성공 응답 (200):
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",   // JWT 토큰
  "username": "admin",
  "name": "관리자",
  "role": "ADMIN"
}

실패 응답 (401):
{
  "message": "아이디 또는 비밀번호가 올바르지 않습니다"
}
```

### 직원 API (인증 필요)

모든 요청에 헤더 추가: `Authorization: Bearer {JWT토큰}`

#### GET /api/employees - 직원 목록

```
파라미터:
  search      (선택) 검색어 (이름, 이메일, 직급)
  departmentId (선택) 부서 ID
  page        (선택, 기본값 0) 페이지 번호
  size        (선택, 기본값 10) 페이지 크기

응답 (200):
{
  "content": [
    {
      "id": 1,
      "name": "김철수",
      "email": "kim.cs@company.com",
      "phone": "010-1234-5678",
      "position": "시니어 개발자",
      "hireDate": "2020-03-15",
      "salary": 65000000,
      "departmentId": 1,
      "departmentName": "개발팀"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 15,
  "totalPages": 2
}
```

#### GET /api/employees/{id} - 직원 상세

```
응답 (200): 직원 단일 객체 (위와 동일한 구조)
```

#### POST /api/employees - 직원 등록

```
요청:
{
  "name": "홍길동",           // 필수
  "email": "hong@company.com",
  "phone": "010-0000-0000",
  "position": "주니어 개발자",
  "hireDate": "2024-01-15",
  "salary": 38000000,
  "departmentId": 1
}

응답 (201): 생성된 직원 객체
```

#### PUT /api/employees/{id} - 직원 수정

```
요청: POST와 동일한 구조
응답 (200): 수정된 직원 객체
```

#### DELETE /api/employees/{id} - 직원 삭제

```
응답 (204): No Content (본문 없음)
```

### 부서 API (인증 필요)

#### GET /api/departments - 부서 목록

```
응답 (200):
[
  {
    "id": 1,
    "name": "개발팀",
    "description": "소프트웨어 개발 및 유지보수",
    "employeeCount": 5
  }
]
```

#### POST /api/departments - 부서 등록

```
요청:
{
  "name": "신규부서",        // 필수
  "description": "설명"
}
```

#### PUT /api/departments/{id} - 부서 수정
#### DELETE /api/departments/{id} - 부서 삭제

### 대시보드 API (인증 필요)

#### GET /api/dashboard/stats - 통계

```
응답 (200):
{
  "totalEmployees": 15,
  "totalDepartments": 5,
  "averageSalary": 57200000,
  "newEmployeesThisMonth": 0,
  "employeesByDepartment": [
    { "DEPARTMENT_NAME": "개발팀", "COUNT": 5 }
  ],
  "recentEmployees": [
    { "NAME": "윤서현", "POSITION": "영업 사원", "HIREDATE": "2023-06-01", "DEPARTMENTNAME": "영업팀" }
  ]
}
```

---

## 8. 아키텍처 계층 설명

### Controller 계층

**역할:** HTTP 요청을 받아서 응답을 반환
**기존과 다른 점:** `@Controller` 대신 `@RestController` 사용

```java
// ─── 기존 JSP 방식 ───
@Controller
public class EmployeeController {
    @GetMapping("/employees")
    public String list(Model model) {
        model.addAttribute("employees", service.findAll());
        return "employee/list";  // → employee/list.jsp로 이동
    }
}

// ─── REST API 방식 (이 프로젝트) ───
@RestController   // @Controller + @ResponseBody
@RequestMapping("/api/employees")
public class EmployeeController {
    @GetMapping
    public ResponseEntity<PageResponse<EmployeeResponse>> getEmployees(...) {
        return ResponseEntity.ok(service.getEmployees(...));  // → JSON 반환
    }
}
```

**@RestController = @Controller + @ResponseBody**
- 모든 메서드의 반환값이 자동으로 JSON으로 변환됨
- 뷰(JSP/Thymeleaf) 이름이 아니라 데이터 객체를 반환

### Service 계층

**역할:** 비즈니스 로직 처리 (기존과 동일)

```java
@Service
@RequiredArgsConstructor  // final 필드를 매개변수로 하는 생성자 자동 생성 (Lombok)
public class EmployeeService {
    private final EmployeeMapper employeeMapper;  // 생성자 주입 (DI)
    // ...
}
```

### Mapper 계층 (MyBatis)

**역할:** SQL 실행 (JPA의 Repository 대신 사용)

```java
@Mapper
public interface EmployeeMapper {
    List<Employee> findAll(...);  // → EmployeeMapper.xml의 <select id="findAll">
    Employee findById(Long id);
    void insert(Employee employee);
    void update(Employee employee);
    void delete(Long id);
}
```

### DTO (Data Transfer Object)

**역할:** 계층 간 데이터 전달

```
Request DTO:  클라이언트 → Controller   (요청 데이터)
Domain:       Service 내부에서 사용      (DB 테이블과 1:1 매핑)
Response DTO: Controller → 클라이언트   (응답 데이터)

왜 Domain을 직접 반환하지 않는가?
→ password 같은 민감 정보 노출 방지
→ API 스펙과 DB 스키마의 분리 (DB 변경이 API에 영향 안 줌)
→ 필요한 데이터만 선별적으로 반환 가능
```

---

## 9. 인증 흐름 (JWT)

### JWT(JSON Web Token)란?

```
JWT = Header.Payload.Signature

Header:    { "alg": "HS256" }                    // 알고리즘
Payload:   { "sub": "admin", "exp": 1234567890 } // 사용자 정보 + 만료시간
Signature: HMACSHA256(header + payload, 비밀키)   // 위변조 방지 서명
```

### 세션 vs JWT 비교

```
[세션 기반 (기존 JSP)]
1. 로그인 → 서버가 세션 생성 (서버 메모리에 저장)
2. 서버가 세션 ID를 쿠키로 전달
3. 매 요청마다 쿠키의 세션 ID로 서버에서 사용자 확인
→ 서버가 상태를 유지해야 함 (Stateful)
→ 서버 여러 대일 때 세션 공유 문제 발생

[JWT 기반 (이 프로젝트)]
1. 로그인 → 서버가 JWT 토큰 생성 (서버에 저장 안 함)
2. 클라이언트가 토큰을 localStorage에 저장
3. 매 요청마다 Authorization 헤더에 토큰 첨부
4. 서버는 토큰의 서명만 검증 (DB 조회 불필요)
→ 서버가 상태를 유지하지 않음 (Stateless)
→ 서버 확장이 용이
```

### 인증 흐름 상세

```
[1. 로그인]

React                          Spring Boot
  │                                │
  │  POST /api/auth/login          │
  │  { username, password }        │
  │──────────────────────────────>│
  │                                │  AuthController.login()
  │                                │    ↓
  │                                │  AuthService.login()
  │                                │    ↓ AuthenticationManager.authenticate()
  │                                │  CustomUserDetailsService.loadUserByUsername()
  │                                │    ↓ UserMapper.findByUsername()
  │                                │  BCryptPasswordEncoder.matches(입력값, DB해시)
  │                                │    ↓ 비밀번호 일치 확인
  │                                │  JwtTokenProvider.generateToken()
  │                                │    ↓ JWT 토큰 생성
  │  { token, username, name }     │
  │<──────────────────────────────│
  │                                │
  │  localStorage.setItem('token') │
  │  (토큰을 브라우저에 저장)        │


[2. 인증된 API 요청]

React                          Spring Boot
  │                                │
  │  GET /api/employees            │
  │  Authorization: Bearer {token} │
  │──────────────────────────────>│
  │                                │  JwtAuthenticationFilter.doFilterInternal()
  │                                │    ↓ 헤더에서 토큰 추출
  │                                │  JwtTokenProvider.validateToken(token)
  │                                │    ↓ 서명 검증 + 만료 확인
  │                                │  JwtTokenProvider.getUsernameFromToken(token)
  │                                │    ↓ 토큰에서 username 추출
  │                                │  CustomUserDetailsService.loadUserByUsername()
  │                                │    ↓ DB에서 사용자 조회
  │                                │  SecurityContextHolder.setAuthentication()
  │                                │    ↓ 인증 완료, Controller로 진행
  │                                │
  │                                │  EmployeeController.getEmployees()
  │                                │    ↓ EmployeeService → EmployeeMapper
  │  { content: [...], page: 0 }   │
  │<──────────────────────────────│
```

---

## 10. MyBatis 사용법

### Java 인터페이스 + XML SQL 매핑

```java
// EmployeeMapper.java - 인터페이스 정의
@Mapper
public interface EmployeeMapper {
    List<Employee> findAll(@Param("search") String search,
                           @Param("departmentId") Long departmentId,
                           @Param("offset") int offset,
                           @Param("size") int size);
}
```

```xml
<!-- EmployeeMapper.xml - SQL 정의 -->
<mapper namespace="com.example.empmgmt.mapper.EmployeeMapper">
    <!--
      namespace: Java 인터페이스의 전체 경로 (패키지 + 클래스명)
      id: Java 메서드명과 일치해야 함
      resultType: 반환 타입 (type-aliases-package 설정으로 패키지 생략 가능)
    -->
    <select id="findAll" resultType="Employee">
        SELECT e.*, d.name AS department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        <where>
            <!--
              동적 SQL: 조건이 있을 때만 WHERE절에 추가
              <if test="...">: Java의 if문과 같은 역할
              #{search}: PreparedStatement의 ? 바인딩 (SQL Injection 방지)
            -->
            <if test="search != null and search != ''">
                AND (e.name LIKE CONCAT('%', #{search}, '%')
                     OR e.email LIKE CONCAT('%', #{search}, '%'))
            </if>
            <if test="departmentId != null">
                AND e.department_id = #{departmentId}
            </if>
        </where>
        ORDER BY e.id DESC
        LIMIT #{size} OFFSET #{offset}
    </select>
</mapper>
```

### MyBatis 핵심 문법

| 문법 | 설명 | 예시 |
|------|------|------|
| `#{param}` | PreparedStatement 바인딩 (안전) | `WHERE id = #{id}` |
| `${param}` | 문자열 치환 (SQL Injection 위험!) | `ORDER BY ${column}` |
| `<if>` | 조건부 SQL | `<if test="name != null">AND name = #{name}</if>` |
| `<where>` | 자동으로 WHERE 추가, 불필요한 AND 제거 | |
| `<foreach>` | IN절 등 반복 | `<foreach item="id" collection="ids">` |
| `useGeneratedKeys` | INSERT 후 자동 생성 ID 반환 | `useGeneratedKeys="true" keyProperty="id"` |

### map-underscore-to-camel-case 설정

```yaml
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

이 설정으로 DB 컬럼명과 Java 필드명이 자동 매핑됩니다:

| DB 컬럼 | Java 필드 |
|---------|-----------|
| department_id | departmentId |
| hire_date | hireDate |
| created_at | createdAt |
| department_name | departmentName |

---

## 11. 주요 코드 해설

### JwtTokenProvider.java - 토큰 생성/검증

```java
// 토큰 생성
public String generateToken(Authentication authentication) {
    UserDetails userDetails = (UserDetails) authentication.getPrincipal();

    return Jwts.builder()
            .subject(userDetails.getUsername())  // 토큰에 사용자 ID 저장
            .issuedAt(new Date())                // 발급 시간
            .expiration(new Date(now + 86400000)) // 만료 시간 (24시간)
            .signWith(key)                       // 비밀키로 서명
            .compact();                          // 문자열로 변환
}

// 토큰 검증
public boolean validateToken(String token) {
    try {
        // 서명 검증 + 만료 확인을 한 번에 수행
        Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
        return true;
    } catch (JwtException e) {
        return false;  // 유효하지 않은 토큰
    }
}
```

### EmployeeService.java - 페이지네이션

```java
public PageResponse<EmployeeResponse> getEmployees(String search, Long deptId, int page, int size) {
    int offset = page * size;  // page=0, size=10 → offset=0 (1페이지)
                                // page=1, size=10 → offset=10 (2페이지)

    List<Employee> employees = employeeMapper.findAll(search, deptId, offset, size);
    int total = employeeMapper.countAll(search, deptId);
    int totalPages = (int) Math.ceil((double) total / size);

    List<EmployeeResponse> content = employees.stream()
            .map(EmployeeResponse::from)  // Domain → DTO 변환
            .toList();

    return new PageResponse<>(content, page, size, total, totalPages);
}
```

### AuthController.java - REST API 응답 패턴

```java
@PostMapping("/signup")
public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
    // @Valid: DTO의 @NotBlank, @Size 등 검증 자동 실행
    // @RequestBody: JSON → Java 객체 자동 변환
    //   (JSP에서는 @ModelAttribute로 폼 데이터를 받았음)

    try {
        authService.signup(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)          // 201 Created
                .body(Map.of("message", "회원가입이 완료되었습니다"));
    } catch (RuntimeException e) {
        return ResponseEntity
                .badRequest()                         // 400 Bad Request
                .body(Map.of("message", e.getMessage()));
    }
}
```

---

## 12. 테스트 방법

### Postman / curl로 API 테스트

```bash
# 1. 로그인하여 토큰 발급
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 응답에서 token 값 복사

# 2. 토큰으로 직원 목록 조회
curl http://localhost:8080/api/employees \
  -H "Authorization: Bearer {위에서_복사한_토큰}"

# 3. 직원 등록
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {토큰}" \
  -d '{"name":"홍길동","position":"인턴","departmentId":1}'

# 4. 검색 + 페이지네이션
curl "http://localhost:8080/api/employees?search=김&page=0&size=5" \
  -H "Authorization: Bearer {토큰}"
```

### H2 콘솔에서 직접 SQL 실행

1. http://localhost:8080/h2-console 접속
2. JDBC URL: `jdbc:h2:mem:empdb`, User: `sa`
3. SQL 직접 실행:

```sql
-- 전체 직원 조회
SELECT e.*, d.name AS dept_name
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;

-- 부서별 직원 수
SELECT d.name, COUNT(e.id)
FROM departments d
LEFT JOIN employees e ON d.id = e.department_id
GROUP BY d.name;
```

---

## 13. 트러블슈팅

### 자주 발생하는 문제

**1. `java.lang.UnsupportedClassVersionError`**
```
원인: Java 17 미만 버전으로 실행
해결: IntelliJ → File → Project Structure → SDKs에서 Java 17 설정
```

**2. `Table "USERS" not found`**
```
원인: schema.sql이 실행되지 않음
해결: application.yml에서 spring.sql.init.mode: always 확인
```

**3. CORS 에러 (브라우저 콘솔)**
```
원인: 프론트엔드에서 직접 8080으로 요청
해결: Vite 프록시를 사용하거나 WebConfig.java CORS 설정 확인
```

**4. 401 Unauthorized**
```
원인: JWT 토큰이 만료되었거나 없음
해결: 다시 로그인하여 새 토큰 발급
```

**5. 한글 깨짐**
```
원인: 인코딩 설정 누락
해결: application.yml → spring.sql.init.encoding: UTF-8
      build.gradle → options.encoding = 'UTF-8'
```

---

## MySQL로 전환하기 (참고)

나중에 실제 DB로 전환할 때는 아래만 변경하면 됩니다:

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/empdb?useSSL=false&serverTimezone=Asia/Seoul
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: your_password
  sql:
    init:
      mode: never  # MySQL에서는 직접 테이블 생성
```

```groovy
// build.gradle
runtimeOnly 'com.mysql:mysql-connector-j'  // H2 대신 MySQL 드라이버
```
