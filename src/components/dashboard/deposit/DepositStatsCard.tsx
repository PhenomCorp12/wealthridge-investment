// components/dashboard/deposit/DepositStatsCard.tsx
'use client'

interface DepositStatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  gradientFrom: string
  gradientTo: string
  textColor: string
  valuePrefix?: string
}

export function DepositStatsCard({
  title,
  value,
  icon,
  gradientFrom,
  gradientTo,
  textColor,
  valuePrefix = '$'
}: DepositStatsCardProps) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { minimumFractionDigits: 2 })
    : value

  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textColor.replace('900', '700')}`}>{title}</p>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>
            {valuePrefix}{formattedValue}
          </p>
        </div>
        <div className={textColor.replace('900', '600')}>
          {icon}
        </div>
      </div>
    </div>
  )
}