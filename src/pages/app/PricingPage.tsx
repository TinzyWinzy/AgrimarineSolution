import { useEffect, useState } from 'react'
import { BarChart3, Plus } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getRecords } from '@/services/firebaseService'
import { orderBy } from 'firebase/firestore'

export default function PricingPage() {
  const [rules, setRules] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    async function load() {
      try {
        const records = await getRecords('pricingRules', [orderBy('effectiveDate', 'desc')])
        setRules(records)
      } catch {
        setRules([])
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy-900">Pricing Rules</h1>
        <Button size="sm">
          <Plus className="h-4 w-4" /> New Rule
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <BarChart3 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No pricing rules configured.</p>
            <p className="text-sm text-gray-400">Default: Nile tilapia USD 3.50/kg (min 300g)</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((r) => (
            <Card key={r.id as string}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-navy-900">{r.species as string}</h3>
                  <p className="text-sm text-gray-600">USD {r.pricePerKg as string}/kg &middot; Min {r.minAverageFishGrams as string}g</p>
                </div>
                <StatusBadge status={r.status as string || 'active'} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <h3 className="font-semibold text-navy-900 text-sm mb-2">Default Active Rule</h3>
        <p className="text-sm text-gray-600">Nile tilapia: USD 3.50/kg (minimum 300g average fish weight)</p>
        <p className="text-xs text-gray-400 mt-1">Configured online and cached for offline use.</p>
      </Card>
    </div>
  )
}
