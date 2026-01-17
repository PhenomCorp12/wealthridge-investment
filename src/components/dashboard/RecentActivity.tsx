// components/dashboard/RecentActivity.tsx
import { DollarSign, TrendingUp, PieChart, Wallet, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  type: 'deposit' | 'investment' | 'profit' | 'withdrawal'
  amount: number
  date: string
  status: string
  option?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <DollarSign className="h-5 w-5 text-blue-600" />
      case 'investment': return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'profit': return <PieChart className="h-5 w-5 text-purple-600" />
      case 'withdrawal': return <Wallet className="h-5 w-5 text-gray-600" />
      default: return <DollarSign className="h-5 w-5 text-blue-600" />
    }
  }

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'bg-blue-50'
      case 'investment': return 'bg-green-50'
      case 'profit': return 'bg-purple-50'
      case 'withdrawal': return 'bg-gray-50'
      default: return 'bg-blue-50'
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <p className="text-sm text-gray-600 mt-1">Your latest transactions and investments</p>
      </div>
      
      <div className="p-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${getActivityBgColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div>
                <p className="font-medium capitalize">{activity.type}</p>
                {activity.option && (
                  <p className="text-sm text-gray-500">{activity.option}</p>
                )}
                <p className="text-xs text-gray-400">{activity.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                activity.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
              }`}>
                {activity.type === 'withdrawal' ? '-' : '+'}${activity.amount.toLocaleString()}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                activity.status === 'completed' || activity.status === 'credited' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t">
        <Link
          href="/dashboard/analytics"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center"
        >
          View all activity
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}