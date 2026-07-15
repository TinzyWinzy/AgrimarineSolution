import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fish, Search, Plus } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'
import { getAllPendingSubmissions } from '@/offline/db'
import { useAppStore } from '@/stores/appStore'

export default function SubmissionsPage() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<Record<string, unknown>[]>([])
  const [pendingLocal, setPendingLocal] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const isOnline = useAppStore(s => s.isOnline)

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('fishSubmissions', [orderBy('createdAt', 'desc')])
        setSubmissions(records)
      } catch {
        setSubmissions([])
      }
      const local = await getAllPendingSubmissions()
      setPendingLocal(local)
      setLoading(false)
    }
    load()
  }, [isOnline])

  const filtered = submissions.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      const name = String(s.farmerName ?? '').toLowerCase()
      const ref = String(s.referenceNumber ?? '').toLowerCase()
      if (!name.includes(q) && !ref.includes(q)) return false
    }
    return true
  })

  function getDateStr(s: Record<string, unknown>): string {
    const created = s.createdAt
    if (!created) return '-'
    if (typeof created === 'object') {
      const c = created as Record<string, unknown>
      if (typeof c.toMillis === 'function') {
        return new Date(c.toMillis()).toLocaleDateString()
      }
    }
    return new Date(Number(created)).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Fish Submissions</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/sell-fish')}>
            <Plus className="h-4 w-4" /> New (Public)
          </Button>
        </div>
      </div>

      {pendingLocal.length > 0 && (
        <Card>
          <h3 className="font-semibold text-yellow-800 text-sm mb-2">Pending Local Submissions</h3>
          <div className="space-y-2">
            {pendingLocal.map((p) => (
              <div key={String(p.localId)} className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs">{String(p.localId)}</span>
                <StatusBadge status={String(p.syncStatus)} size="sm" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or reference..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All statuses</option>
          <option value="New">New</option>
          <option value="Under review">Under review</option>
          <option value="Approved">Approved</option>
          <option value="Collection scheduled">Scheduled</option>
          <option value="Collected">Collected</option>
          <option value="Paid">Paid</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <Fish className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No submissions found</p>
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Species</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => {
                  const sId = String(s.id ?? '')
                  return (
                    <tr key={sId} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/submissions/${sId}`)}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{String(s.referenceNumber ?? '—')}</td>
                      <td className="px-4 py-3 font-medium text-navy-900">{String(s.farmerName ?? '')}</td>
                      <td className="px-4 py-3 text-gray-600">{String(s.species ?? '')}</td>
                      <td className="px-4 py-3 text-gray-600">{String(s.estimatedKg ?? '')} kg</td>
                      <td className="px-4 py-3 text-gray-600">USD {Number(s.estimatedValue ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={String(s.status ?? 'New')} size="sm" /></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{getDateStr(s)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((s) => {
              const sId = String(s.id ?? '')
              return (
                <div key={sId} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/submissions/${sId}`)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-navy-900 text-sm">{String(s.farmerName ?? '')}</span>
                    <StatusBadge status={String(s.status ?? 'New')} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500">
                    {String(s.species ?? '')} &middot; {String(s.estimatedKg ?? '')} kg &middot; USD {Number(s.estimatedValue ?? 0).toLocaleString()}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
