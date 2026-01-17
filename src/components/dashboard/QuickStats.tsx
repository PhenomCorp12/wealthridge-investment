// components/dashboard/QuickStats.tsx
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface QuickStat {
  title: string
  value: string
  icon: 'trending-up' | 'trending-down' | 'calendar'
  gradientFrom: string
  gradientTo: string
  textColor: string
  iconColor: string
}

interface QuickStatsProps {
  stats: QuickStat[]
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'trending-up': return <TrendingUp className="h-8 w-8" />
      case 'trending-down': return <TrendingDown className="h-8 w-8" />
      case 'calendar': return <Calendar className="h-8 w-8" />
      default: return <TrendingUp className="h-8 w-8" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-linear-to-r ${stat.gradientFrom} ${stat.gradientTo} rounded-xl p-6 hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${stat.textColor}`}>{stat.title}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>{stat.value}</p>
            </div>
            <div className={stat.iconColor}>
              {getIcon(stat.icon)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}