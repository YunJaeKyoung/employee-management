/**
 * ============================================================
 * [학습 포인트] Redux Store - 전체 상태를 하나로 묶는 중앙 저장소
 * ============================================================
 *
 * Redux에서는 모든 slice를 하나의 store에 등록합니다.
 *
 * [Spring 비교]
 * @Configuration 클래스에서 여러 @Bean을 등록하는 것과 비슷합니다.
 *
 * @Configuration
 * public class AppConfig {
 *     @Bean AuthService authService() { ... }
 *     @Bean ThemeService themeService() { ... }
 *     @Bean NotificationService notificationService() { ... }
 * }
 *
 * Redux:
 * configureStore({
 *   reducer: {
 *     auth: authReducer,           // 인증 상태
 *     theme: themeReducer,         // 테마 상태 (예시)
 *     notification: notifReducer,  // 알림 상태 (예시)
 *   }
 * })
 *
 * [Zustand와의 차이]
 * Zustand: store가 여러 개 (useAuthStore, useThemeStore, ...)
 * Redux:   store가 하나, 그 안에 slice 여러 개
 * ============================================================
 */

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    // 나중에 추가할 때:
    // theme: themeReducer,
    // notification: notificationReducer,
  },
})

export default store
