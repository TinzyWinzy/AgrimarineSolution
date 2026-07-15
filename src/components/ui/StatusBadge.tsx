interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusColors: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  'Under review': 'bg-yellow-100 text-yellow-800',
  'More information required': 'bg-orange-100 text-orange-800',
  Approved: 'bg-green-100 text-green-800',
  'Collection scheduled': 'bg-purple-100 text-purple-800',
  'Team assigned': 'bg-indigo-100 text-indigo-800',
  'In transit': 'bg-cyan-100 text-cyan-800',
  Arrived: 'bg-teal-100 text-teal-800',
  'Weight verified': 'bg-emerald-100 text-emerald-800',
  Collected: 'bg-green-100 text-green-800',
  'Payment pending': 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-emerald-100 text-emerald-800',
  Declined: 'bg-red-100 text-red-800',
  Cancelled: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  syncing: 'bg-blue-100 text-blue-800',
  synced: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  requiresAttention: 'bg-orange-100 text-orange-800',
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  contacted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const colorClass = statusColors[status] || 'bg-gray-100 text-gray-800'
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}>
      {status}
    </span>
  )
}
