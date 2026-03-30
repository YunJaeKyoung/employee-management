/**
 * [학습 포인트] 콜백 함수 Props
 *
 * onConfirm, onCancel은 부모가 전달한 콜백 함수입니다.
 * 사용자가 "확인"을 누르면 onConfirm(), "취소"를 누르면 onCancel() 실행.
 *
 * jQuery: if (confirm('삭제하시겠습니까?')) { deleteEmployee() }
 * React:  <ConfirmDialog onConfirm={deleteEmployee} onCancel={closeDialog} />
 */

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
        <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 z-10">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-6">{message}</p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
