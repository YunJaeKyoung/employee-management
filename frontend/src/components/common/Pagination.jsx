/**
 * ============================================================
 * [학습 포인트] Props 전달 & 이벤트 콜백 패턴
 * ============================================================
 *
 * Pagination은 "순수한 표시 컴포넌트"입니다.
 * 자체 상태를 가지지 않고, 부모로부터 모든 데이터를 props로 받습니다.
 *
 * [Props란?]
 * 부모 컴포넌트가 자식 컴포넌트에 전달하는 데이터입니다.
 *
 * Spring 비교: Controller가 Model에 데이터를 담아서 View(JSP)로 전달
 *   model.addAttribute("currentPage", page);  → props.currentPage
 *
 * JSP: ${currentPage}
 * React: props.currentPage 또는 구조분해: { currentPage }
 *
 * [이벤트 콜백 패턴]
 * 자식이 부모에게 "이벤트가 발생했어요"라고 알려주는 패턴입니다.
 *
 * 부모: <Pagination onPageChange={(page) => setCurrentPage(page)} />
 * 자식: <button onClick={() => onPageChange(3)}>3</button>
 *
 * → 자식이 onPageChange(3)을 호출하면
 * → 부모의 setCurrentPage(3)이 실행되어 페이지가 변경됨
 * ============================================================
 */

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 페이지가 1개 이하면 페이지네이션 불필요
  if (totalPages <= 1) return null

  // 표시할 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible)

    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible)
    }

    for (let i = start; i < end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-1 mt-6">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        이전
      </button>

      {/* 페이지 번호 버튼들 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3.5 py-2 text-sm rounded-lg transition-colors
            ${page === currentPage
              ? 'bg-blue-600 text-white font-medium'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
        >
          {page + 1}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600
          hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        다음
      </button>
    </div>
  )
}

export default Pagination
