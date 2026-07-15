import { Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useAppStore } from '@/stores/appStore'
import { getPendingCount } from '@/offline/db'
import { useEffect, useState } from 'react'

const sections = [
  { title: 'Business Information', desc: 'Name, address, phone, email, currency' },
  { title: 'Collection Settings', desc: 'Default minimum fish size, regions, vehicle capacity' },
  { title: 'Reference Numbers', desc: 'Prefixes, sequence counters' },
  { title: 'Branding', desc: 'Logo, colours (coming soon)' },
  { title: 'Notification Settings', desc: 'WhatsApp number, email templates (coming soon)' },
  { title: 'Staff Management', desc: 'Manage staff accounts (coming soon)' },
]

export default function SettingsPage() {
  const [localSize, setLocalSize] = useState('0')
  useEffect(() => {
    getPendingCount().then(c => setLocalSize(String(c)))
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Settings</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Card key={s.title}>
            <Settings className="h-6 w-6 text-gray-400 mb-2" />
            <h3 className="font-semibold text-navy-900 text-sm">{s.title}</h3>
            <p className="text-xs text-gray-500">{s.desc}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="font-semibold text-navy-900 text-sm mb-2">Sync & Storage</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Pending local items: {localSize}</p>
          <p>Demo mode: {import.meta.env.VITE_DEMO_MODE === 'true' ? 'Enabled' : 'Disabled'}</p>
        </div>
      </Card>
    </div>
  )
}
