import { Play, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

const steps = [
  { step: '1', title: 'Open homepage', action: 'Browse the public site and services', link: '/' },
  { step: '2', title: 'Open Sell Your Fish', action: 'Start a new fish submission', link: '/sell-fish' },
  { step: '3', title: 'Submit Tawanda Moyo', action: 'Enter Tawanda Moyo, Moyo Aqua Farm, Marondera, 420 kg Nile tilapia at 450g average', link: null },
  { step: '4', title: 'Calculate estimate', action: 'USD 3.50/kg rule applies, estimated value USD 1,470', link: null },
  { step: '5', title: 'Go offline', action: 'Toggle browser offline mode via DevTools > Network > Offline', link: null },
  { step: '6', title: 'Complete submission offline', action: 'Save locally, get temporary local reference', link: null },
  { step: '7', title: 'Restore connectivity', action: 'Go back online; submission syncs automatically', link: null },
  { step: '8', title: 'Login as staff', action: 'Access the admin dashboard', link: '/login' },
  { step: '9', title: 'Review submission', action: 'Open the submission, approve it', link: '/app/submissions' },
  { step: '10', title: 'Schedule collection', action: 'Set date and time, assign team', link: '/app/collections' },
  { step: '11', title: 'Record verified weight', action: 'Enter verified weight, system calculates final value', link: '/app/collections' },
  { step: '12', title: 'Update payment status', action: 'Mark as paid', link: null },
  { step: '13', title: 'Check analytics', action: 'Dashboard and farmer history update', link: '/app' },
]

export default function DemoPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Demo Guide</h1>
        <Button size="sm" variant="outline" onClick={() => navigate('/sell-fish')}>
          <Play className="h-4 w-4" /> Start Demo Request
        </Button>
      </div>

      <Card>
        <p className="text-sm text-gray-600">
          This guide walks through a complete demonstration of the Agrimarine Farmer & Operations Platform.
          All data is fictional.
        </p>
      </Card>

      <div className="space-y-3">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-aqua-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
              {s.step}
            </div>
            <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-navy-900 text-sm">{s.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.action}</p>
              {s.link && (
                <button onClick={() => navigate(s.link)} className="flex items-center gap-1 text-xs text-aqua-600 mt-2 hover:text-aqua-500">
                  <ExternalLink className="h-3 w-3" /> Open
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
