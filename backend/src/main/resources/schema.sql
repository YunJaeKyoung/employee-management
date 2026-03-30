-- 사용자 테이블 (회원가입/로그인용)
CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100),
    role        VARCHAR(20)  DEFAULT 'USER',
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 부서 테이블
CREATE TABLE IF NOT EXISTS departments (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 직원 테이블
CREATE TABLE IF NOT EXISTS employees (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100),
    phone         VARCHAR(20),
    position      VARCHAR(100),
    hire_date     DATE,
    salary        BIGINT,
    department_id BIGINT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);
