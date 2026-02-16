// components/dashboard/deposit/RecentDeposits.tsx
'use client'

import { Activity } from '@/types/dashboard'

interface RecentDepositsProps {
  deposits: Activity[]
}

export function RecentDeposits({ deposits }: RecentDepositsProps) {
  const recentDeposits = deposits
    .filter(activity => activity.type === 'deposit')
    .slice(0, 3)

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900">Recent Deposits</h3>
      </div>
      <div className="p-4">
        {recentDeposits.length > 0 ? (
          recentDeposits.map((deposit, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  ${deposit.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{deposit.date}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                Completed
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No recent deposits</p>
        )}
      </div>
    </div>
  )
}