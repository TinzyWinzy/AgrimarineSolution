import { Bell } from 'lucide-react'
import { Card } from '@/components/ui/Card'

const demoNotifications = [
  { title: 'New fish submission', message: 'Tawanda Moyo submitted 420 kg Nile tilapia', time: '2 hours ago' },
  { title: 'Collection scheduled', message: 'Rutendo Fisheries collection set for Friday', time: '5 hours ago' },
  { title: 'Payment pending', message: 'Marondera delivery awaiting payment confirmation', time: '1 day ago' },
  { title: 'Offline sync completed', message: '3 pending items synchronized successfully', time: '2 days ago' },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-navy-900">Notifications</h1>
      {demoNotifications.length === 0 ? (
        <Card><div className="text-center py-8"><Bell className="h-10 w-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications</p></div></Card>
      ) : (
        <div className="space-y-2">
          {demoNotifications.map((n, i) => (
            <Card key={i}>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-aqua-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
