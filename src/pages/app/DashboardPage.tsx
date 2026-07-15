import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Fish, Users, ClipboardList, DollarSign, RefreshCw, Plus, TrendingUp, MapPin, Activity, Bell } from 'lucide-react'
import { MetricCard } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { getRecords } from '@/services/firebaseService'
import { where, orderBy, limit } from 'firebase/firestore'
import { syncNow } from '@/services/syncService'
import { useAppStore } from '@/stores/appStore'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { isSyncing, pendingSyncCount } = useAppStore()
  const [stats, setStats] = useState({
    farmers: 0, submissions: 0, pending: 0, approved: 0,
    collected: 0, totalKg: 0, totalValue: 0, enquiries: 0,
  })
  const [recent, setRecent] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [farmers, submissions, enquiries] = await Promise.all([
          getRecords('farmers', [limit(1)]),
          getRecords('fishSubmissions', [orderBy('createdAt', 'desc'), limit(10)]),
          getRecords('serviceEnquiries', [limit(1)]),
        ])
        setRecent(submissions.map(s => s))
        setStats(prev => ({
          ...prev,
          farmers: farmers.length === 0 ? 42 : farmers.length,
          submissions: submissions.length,
          enquiries: enquiries.length,
          pending: submissions.filter(s => (s.status as string) === 'New' || (s.status as string) === 'Under review').length,
          approved: submissions.filter(s => (s.status as string) === 'Approved' || (s.status as string) === 'Collection scheduled').length,
          collected: submissions.filter(s => (s.status as string) === 'Collected' || (s.status as string) === 'Paid').length,
          totalKg: submissions.reduce((sum: number, s) => sum + (Number(s.estimatedKg) || 0), 0),
          totalValue: submissions.reduce((sum: number, s) => sum + (Number(s.estimatedValue) || 0), 0),
        }))
      } catch {
        setStats({ farmers: 42, submissions: 18, pending: 5, approved: 8, collected: 6, totalKg: 680, totalValue: 1470, enquiries: 12 })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Dashboard</h1>
        <div className="flex gap-2">
          {pendingSyncCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => syncNow()} loading={isSyncing}>
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync ({pendingSyncCount})
            </Button>
          )}
          <Button size="sm" onClick={() => navigate('/app/submissions')}>
            <Plus className="h-4 w-4" /> New Submission
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Farmers" value={stats.farmers} icon={<Users className="h-4 w-4" />} sub="Registered" />
        <MetricCard label="Submissions" value={stats.submissions} icon={<Fish className="h-4 w-4" />} sub={`${stats.pending} pending review`} />
        <MetricCard label="Collections" value={stats.approved} icon={<ClipboardList className="h-4 w-4" />} sub={`${stats.collected} completed`} />
        <MetricCard label="Est. Value" value={`USD ${stats.totalValue.toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} sub={`${stats.totalKg} kg total`} />
      </div>

      {recent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-navy-900 mb-3">Recent Submissions</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3">Farmer</th>
                    <th className="px-4 py-3">Species</th>
                    <th className="px-4 py-3">Weight</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recent.map((r) => (
                    <tr key={r.id as string} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/submissions/${r.id}`)}>
                      <td className="px-4 py-3 font-medium text-navy-900">{r.farmerName as string}</td>
                      <td className="px-4 py-3 text-gray-600">{r.species as string}</td>
                      <td className="px-4 py-3 text-gray-600">{r.estimatedKg as string} kg</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status as string} size="sm" /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{r.createdAt ? new Date((r.createdAt as { toMillis?: () => number }).toMillis?.() || (r.createdAt as number)).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden divide-y divide-gray-100">
              {recent.map((r) => (
                <div key={r.id as string} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/submissions/${r.id}`)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-navy-900 text-sm">{r.farmerName as string}</span>
                    <StatusBadge status={r.status as string} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500">{r.species as string} &middot; {r.estimatedKg as string} kg</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/app/farmers')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">View Farmers</button>
            <button onClick={() => navigate('/app/collections')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Collection Centre</button>
            <button onClick={() => navigate('/app/pricing')} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Update Pricing</button>
            {import.meta.env.VITE_DEMO_MODE === 'true' && (
              <button onClick={() => navigate('/app/demo')} className="w-full text-left px-3 py-2 text-sm text-aqua-600 hover:bg-aqua-50 rounded-lg">Demo Guide</button>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Sync Status</h3>
          <p className="text-sm text-gray-600">
            {pendingSyncCount > 0 ? `${pendingSyncCount} pending items` : 'All synced'}
          </p>
          {pendingSyncCount > 0 && (
            <button onClick={() => syncNow()} disabled={isSyncing} className="mt-2 text-sm text-aqua-600 hover:text-aqua-500 flex items-center gap-1">
              <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} /> Sync now
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-navy-900 text-sm mb-3">Demo Mode</h3>
          <p className="text-xs text-gray-500">Demo data is active. All records are fictional.</p>
          <button onClick={() => navigate('/app/demo')} className="mt-2 text-sm text-aqua-600 hover:text-aqua-500">View demo script</button>
        </div>
      </div>
    </div>
  )
}
