import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding ? 'p-4 sm:p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function MetricCard({ label, value, sub, icon, trend }: {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: { value: string; positive: boolean }
}) {
  return (
    <Card className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        {icon && <span className="text-navy-600">{icon}</span>}
      </div>
      <span className="text-2xl font-bold text-navy-900">{value}</span>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {sub && <span>{sub}</span>}
        {trend && (
          <span className={trend.positive ? 'text-green-600' : 'text-red-600'}>
            {trend.value}
          </span>
        )}
      </div>
    </Card>
  )
}
