/**
 * ============================================================
 * [학습 포인트] 조건부 렌더링 & children 패턴
 * ============================================================
 *
 * 모달은 조건부 렌더링과 children 패턴을 동시에 보여줍니다.
 *
 * 사용 예시:
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="직원 등록">
 *   <EmployeeForm />     ← 이것이 children
 * </Modal>
 *
 * isOpen이 false이면 → null 반환 (아무것도 렌더링하지 않음)
 * isOpen이 true이면 → 모달 UI 렌더링
 *
 * [jQuery 비교]
 * jQuery: $('#modal').show() / $('#modal').hide()
 * React:  isOpen state로 제어 → true면 렌더링, false면 안 함
 *
 * jQuery는 DOM을 숨기고 보여주는 것이고,
 * React는 아예 컴포넌트를 만들거나 안 만드는 것입니다.
 * ============================================================
 */

function Modal({ isOpen, onClose, title, children }) {
  // isOpen이 false이면 아무것도 렌더링하지 않음
  if (!isOpen) return null

  return (
    // 배경 오버레이 (클릭 시 모달 닫힘)
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* 반투명 배경 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* 모달 본체 */}
        <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 모달 내용 - children이 여기에 렌더링됨 */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
