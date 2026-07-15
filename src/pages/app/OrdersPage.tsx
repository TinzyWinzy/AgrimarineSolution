import { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Card } from '@/components/ui/Card'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('supplyRequests', [orderBy('createdAt', 'desc')])
        setOrders(records)
      } catch {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Supply Orders</h1>
      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <Card><div className="text-center py-8"><ShoppingCart className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No orders yet</p></div></Card>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
              <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Items</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id as string}>
                  <td className="px-4 py-3 font-medium text-navy-900">{o.customerName as string}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{(o.items as { productName: string }[] || []).map((i: { productName: string }) => i.productName).join(', ')}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status as string || 'New'} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
