import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'

export default function FarmersPage() {
  const navigate = useNavigate()
  const [farmers, setFarmers] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('farmers', [orderBy('fullName', 'asc')])
        setFarmers(records)
      } catch {
        setFarmers([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = farmers.filter(f => {
    if (!search) return true
    const q = search.toLowerCase()
    return (f.fullName as string || '').toLowerCase().includes(q) ||
           (f.farmName as string || '').toLowerCase().includes(q) ||
           (f.phone as string || '').includes(q)
  })

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Farmers</h1>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search farmers..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><div className="text-center py-8"><Users className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No farmers found</p></div></Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3">Farmer</th>
                  <th className="px-4 py-3">Farm</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((f) => (
                  <tr key={f.id as string} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/farmers/${f.id}`)}>
                    <td className="px-4 py-3 font-medium text-navy-900">{f.fullName as string}</td>
                    <td className="px-4 py-3 text-gray-600">{f.farmName as string || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{f.town as string}, {f.district as string}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{f.phone as string}</td>
                    <td className="px-4 py-3"><StatusBadge status={f.status as string || 'active'} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((f) => (
              <div key={f.id as string} className="p-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/app/farmers/${f.id}`)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-navy-900 text-sm">{f.fullName as string}</span>
                  <StatusBadge status={f.status as string || 'active'} size="sm" />
                </div>
                <p className="text-xs text-gray-500">{f.town as string} &middot; {f.phone as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
