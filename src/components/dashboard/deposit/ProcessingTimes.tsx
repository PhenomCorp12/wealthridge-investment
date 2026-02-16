// components/dashboard/deposit/ProcessingTimes.tsx
'use client'

import { Clock } from 'lucide-react'
import { DepositMethod } from '@/types/deposit'

interface ProcessingTimesProps {
  methods: DepositMethod[]
  selectedMethodId: string
}

export function ProcessingTimes({ methods, selectedMethodId }: ProcessingTimesProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Clock className="h-6 w-6 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Processing Times</h3>
      </div>
      <div className="space-y-4">
        {methods.map((method) => {
          const isSelected = selectedMethodId === method.id
          return (
            <div 
              key={method.id}
              className={`p-3 rounded-lg border ${
                isSelected
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{method.name}</span>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {method.processingTime}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}