/**
 * [학습 포인트] API 호출 함수 분리
 *
 * API 호출 로직을 별도 파일로 분리하면:
 * 1. 컴포넌트가 깔끔해짐 (UI 로직과 데이터 로직 분리)
 * 2. 여러 컴포넌트에서 같은 API를 재사용 가능
 * 3. API 변경 시 이 파일만 수정하면 됨
 *
 * [Spring 비교]
 * Spring에서 Service 레이어를 분리하는 것과 같은 이유입니다.
 * Controller(컴포넌트)가 직접 DB를 호출하지 않고 Service(API 함수)를 통하는 것처럼.
 */

import api from './axios'

export const authApi = {
  // 회원가입
  signup: (data) => api.post('/api/auth/signup', data),

  // 로그인
  login: (data) => api.post('/api/auth/login', data),
}
