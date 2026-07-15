import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('serviceEnquiries', [orderBy('createdAt', 'desc')])
        setEnquiries(records)
      } catch {
        setEnquiries([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Service Enquiries</h1>
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : enquiries.length === 0 ? (
        <Card><div className="text-center py-8"><Megaphone className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No enquiries yet</p></div></Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="hidden sm:block">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((e) => (
                  <tr key={e.id as string}>
                    <td className="px-4 py-3 font-medium text-navy-900">{e.customerName as string}</td>
                    <td className="px-4 py-3 text-gray-600">{e.service as string}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{e.phone as string}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status as string || 'New'} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="sm:hidden divide-y divide-gray-100">
            {enquiries.map((e) => (
              <div key={e.id as string} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-navy-900 text-sm">{e.customerName as string}</span>
                  <StatusBadge status={e.status as string || 'New'} size="sm" />
                </div>
                <p className="text-xs text-gray-500">{e.service as string} &middot; {e.phone as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
