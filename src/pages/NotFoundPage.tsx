import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-navy-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-aqua-500 text-white rounded-lg text-sm hover:bg-aqua-400 transition-colors">
            <Home className="h-4 w-4" /> Home
          </Link>
          <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      </div>
    </div>
  )
}
