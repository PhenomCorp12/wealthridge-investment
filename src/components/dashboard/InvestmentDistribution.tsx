// components/dashboard/InvestmentDistribution.tsx
import Link from 'next/link'

interface DistributionItem {
  option: string
  amount: number
  percentage: number
  color: string
  colorCode?: string
}

interface InvestmentDistributionProps {
  distribution: DistributionItem[]
  totalInvested: number
}

export default function InvestmentDistribution({ distribution, totalInvested }: InvestmentDistributionProps) {
  // Map Tailwind colors to hex codes for conic-gradient
  const colorMap: Record<string, string> = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#10b981',
    'bg-amber-500': '#f59e0b',
    'bg-red-500': '#ef4444',
    'bg-purple-500': '#8b5cf6',
    'bg-indigo-500': '#6366f1',
    'bg-pink-500': '#ec4899',
    'bg-teal-500': '#14b8a6',
  }

  // Calculate cumulative percentages for gradient
  let cumulativePercentage = 0
  const gradientStops = distribution.map(item => {
    const start = cumulativePercentage
    cumulativePercentage += item.percentage
    const color = colorMap[item.color] || item.color
    return `${color} ${start}% ${cumulativePercentage}%`
  })

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Investment Distribution</h2>
        <p className="text-sm text-gray-600 mt-1">How your funds are allocated</p>
      </div>
      
      <div className="p-6">
        {/* Pie Chart Visualization */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative h-48 w-48">
            <div 
              className="h-full w-full rounded-full"
              style={{
                background: `conic-gradient(${gradientStops.join(', ')})`
              }}
            />
            <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-gray-500">Invested</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {distribution.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`h-3 w-3 rounded-full ${item.color} mr-3`}></div>
                <span className="text-sm font-medium text-gray-700">{item.option}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Current Plan</p>
            <p className="font-medium text-gray-900">Growth Plan</p>
          </div>
          <Link
            href="/dashboard/settings"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Upgrade Plan
          </Link>
        </div>
      </div>
    </div>
  )
}