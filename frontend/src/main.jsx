/**
 * ============================================================
 * [학습 포인트] React 앱의 진입점 (Entry Point)
 * ============================================================
 *
 * 이 파일은 React 앱이 시작되는 곳입니다.
 *
 * [JSP/Spring 비교]
 * - Spring에서는 web.xml 또는 @SpringBootApplication이 앱의 시작점
 * - React에서는 이 main.jsx가 앱의 시작점
 *
 * [핵심 개념]
 * 1. ReactDOM.createRoot(): 실제 HTML의 <div id="root">에 React 앱을 연결
 *    → index.html에 있는 <div id="root"></div>를 찾아서 그 안에 React 컴포넌트를 렌더링
 *
 * 2. StrictMode: 개발 모드에서 잠재적 문제를 미리 감지해주는 도구
 *    → 개발 중에만 작동하고, 실제 배포(production)에서는 아무 영향 없음
 *    → 컴포넌트를 2번 렌더링해서 사이드 이펙트를 찾아줌
 *
 * 3. import './index.css': Tailwind CSS를 전역으로 적용
 *    → JSP에서 <link rel="stylesheet"> 하는 것과 같음
 * ============================================================
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// HTML에서 id="root"인 요소를 찾아서 React 앱의 루트로 사용
const rootElement = document.getElementById('root')

// createRoot()로 React 루트를 생성하고, render()로 App 컴포넌트를 그림
ReactDOM.createRoot(rootElement).render(
  // StrictMode는 개발 중 도움을 주는 래퍼 (프로덕션에서는 무시됨)
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
