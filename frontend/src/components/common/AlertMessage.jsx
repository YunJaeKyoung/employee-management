/**
 * [학습 포인트] Props에 따른 동적 스타일링
 *
 * type prop에 따라 다른 색상의 알림을 표시합니다.
 * type="success" → 초록색
 * type="error"   → 빨간색
 * type="info"    → 파란색
 */

function AlertMessage({ type = 'info', message, onClose }) {
  if (!message) return null

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div className={`border px-4 py-3 rounded-lg mb-4 flex items-center justify-between ${styles[type]}`}>
      <span className="text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 text-current opacity-50 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default AlertMessage
