/**
 * [학습 포인트] 재사용 가능한 컴포넌트
 *
 * 로딩 스피너는 여러 페이지에서 반복 사용됩니다.
 * 이렇게 별도 컴포넌트로 분리하면 코드 중복을 줄일 수 있습니다.
 *
 * [JSP 비교]
 * JSP에서 공통 부분을 include하는 것과 같습니다.
 * <jsp:include page="/common/loading.jsp" />
 */

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default LoadingSpinner
