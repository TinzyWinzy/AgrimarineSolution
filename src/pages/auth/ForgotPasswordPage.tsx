import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Droplets, ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { resetPassword } from '@/services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    setLoading(true)
    setError('')
    try {
      await resetPassword(email)
      setSent(true)
    } catch {
      setError('Failed to send reset email. Check the address.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Droplets className="h-10 w-10 text-aqua-400 mx-auto mb-2" />
          <h1 className="text-xl font-bold text-white">Reset Password</h1>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
              <p className="text-sm text-gray-600">Check your email for a password reset link.</p>
              <Link to="/login" className="block text-sm text-aqua-600">Back to login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
              <Input label="Email" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
              <Button type="submit" loading={loading} className="w-full">Send Reset Link</Button>
              <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
