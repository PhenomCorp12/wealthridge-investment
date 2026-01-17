// components/dashboard/StatsCard.tsx
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  iconBgColor: string
  iconColor: string
  trend?: {
    value: string
    isPositive: boolean
    label: string
  }
  additionalInfo?: React.ReactNode
}

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconBgColor, 
  iconColor, 
  trend,
  additionalInfo 
}: StatsCardProps) {
  const formattedValue = value.toLocaleString('en-US', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })

  return (
    <div className="bg-white rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-2">${formattedValue}</p>
        </div>
        <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4">
          {trend.isPositive ? (
            <span className="text-green-500">↑</span>
          ) : (
            <span className="text-red-500">↓</span>
          )}
          <span className={`text-sm font-medium ml-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.value}
          </span>
          <span className="text-sm text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
      
      {additionalInfo && (
        <div className="mt-4">
          {additionalInfo}
        </div>
      )}
    </div>
  )
}