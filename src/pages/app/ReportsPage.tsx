import { BarChart3, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const reports = [
  { name: 'Submitted Fish Volume', desc: 'Total weight of fish submitted by period' },
  { name: 'Collected Fish Volume', desc: 'Verified weight collected by location' },
  { name: 'Estimated vs Verified', desc: 'Comparison of estimated and verified weights' },
  { name: 'Procurement Value', desc: 'Total value paid to farmers' },
  { name: 'Farmers by Location', desc: 'Farmer distribution across regions' },
  { name: 'Collections by Status', desc: 'Current collection pipeline statuses' },
  { name: 'Sync Health', desc: 'Offline synchronization statistics' },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Reports</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <Card key={r.name}>
            <BarChart3 className="h-8 w-8 text-aqua-500 mb-3" />
            <h3 className="font-semibold text-navy-900 text-sm mb-1">{r.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{r.desc}</p>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3" /> Export CSV
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
