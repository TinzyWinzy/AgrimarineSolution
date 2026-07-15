import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, Droplets } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginStaff } from '@/services/authService'
import { useToastStore } from '@/components/ui/Toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Email and password are required'); return }
    setLoading(true)
    setError('')
    try {
      await loginStaff(email, password)
      addToast('success', 'Welcome back!')
      navigate('/app')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Droplets className="h-10 w-10 text-aqua-400 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-white">Agrimarine Staff</h1>
          <p className="text-white/60 text-sm">Sign in to the operations platform</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 shadow-xl">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aqua-500" placeholder="staff@agrimarine.co.zw" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-aqua-500" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          <Link to="/forgot-password" className="block text-center text-sm text-aqua-600 hover:text-aqua-500">Forgot password?</Link>
          <hr className="border-gray-200" />
          <Link to="/" className="block text-center text-sm text-gray-500 hover:text-gray-700">Back to public site</Link>
        </form>
      </div>
    </div>
  )
}
