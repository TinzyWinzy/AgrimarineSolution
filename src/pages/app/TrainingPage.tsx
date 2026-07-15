import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'

export default function TrainingPage() {
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('trainingBookings', [orderBy('createdAt', 'desc')])
        setBookings(records)
      } catch {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Training Bookings</h1>
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : bookings.length === 0 ? (
        <Card><div className="text-center py-8"><BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No training bookings</p></div></Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id as string}>
                  <td className="px-4 py-3 font-medium text-navy-900">{b.name as string}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{b.topic as string}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{b.preferredDate as string}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status as string || 'New'} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
