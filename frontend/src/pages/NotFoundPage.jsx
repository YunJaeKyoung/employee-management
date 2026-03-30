import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-2">페이지를 찾을 수 없습니다</p>
        <p className="text-gray-400 mb-8">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          대시보드로 이동
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
