import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Map, Columns } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy, where } from 'firebase/firestore'
import { recommendRouteGroups, type RouteGroup } from '@/lib/haversine'

type ViewMode = 'table' | 'kanban' | 'route'

export default function CollectionsPage() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>('table')
  const [routeGroups, setRouteGroups] = useState<RouteGroup[]>([])

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('fishSubmissions', [
          where('status', 'in', ['Approved', 'Collection scheduled', 'Team assigned', 'In transit', 'Arrived', 'Weight verified', 'Collected', 'Payment pending']),
          orderBy('createdAt', 'desc'),
        ])
        setCollections(records)

        const groups = recommendRouteGroups(records.map(r => ({
          id: r.id as string,
          farmerName: r.farmerName as string,
          farmerId: r.farmerId as string || '',
          district: r.district as string,
          latitude: r.latitude as number | undefined,
          longitude: r.longitude as number | undefined,
          estimatedKg: Number(r.estimatedKg) || 0,
          scheduledDate: r.scheduledDate as string || '',
        })))
        setRouteGroups(groups)
      } catch {
        setCollections([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Collection Command Centre</h1>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['table', 'kanban', 'route'] as ViewMode[]).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 text-xs rounded-md transition-colors ${view === v ? 'bg-white shadow-sm text-navy-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {v === 'table' ? 'Table' : v === 'kanban' ? 'Board' : 'Routes'}
            </button>
          ))}
        </div>
      </div>

      {view === 'route' && routeGroups.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {routeGroups.map((g, i) => (
            <Card key={i}>
              <h3 className="font-semibold text-navy-900 text-sm mb-2">{g.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{g.farmers.map(f => f.name).join(', ')}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>{g.totalKg} kg</span>
                <span>{g.farmers.length} stops</span>
                <span>{g.reason}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : collections.length === 0 ? (
        <Card><div className="text-center py-8"><ClipboardList className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No active collections</p></div></Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Weight</th>
                  <th className="px-4 py-3">Scheduled</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {collections.map((c) => (
                  <tr key={c.id as string} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-navy-900">{c.farmerName as string}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.town as string}, {c.district as string}</td>
                    <td className="px-4 py-3 text-gray-600">{c.estimatedKg as string} kg</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{c.scheduledDate as string || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status as string} size="sm" /></td>
                    <td className="px-4 py-3">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/app/submissions/${c.id}`)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-gray-100">
            {collections.map((c) => (
              <div key={c.id as string} className="p-4" onClick={() => navigate(`/app/submissions/${c.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-navy-900 text-sm">{c.farmerName as string}</span>
                  <StatusBadge status={c.status as string} size="sm" />
                </div>
                <p className="text-xs text-gray-500">{c.town as string} &middot; {c.estimatedKg as string} kg</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
