// components/dashboard/deposit/DepositMethodCard.tsx
'use client'

import { CheckCircle } from 'lucide-react'
import { DepositMethod } from '@/types/deposit'

interface DepositMethodCardProps {
  method: DepositMethod
  isSelected: boolean
  onSelect: () => void
}

export function DepositMethodCard({ method, isSelected, onSelect }: DepositMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-xl border transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`h-10 w-10 rounded-lg ${method.bgColor} flex items-center justify-center`}>
          <method.icon className={`h-5 w-5 ${method.iconColor}`} />
        </div>
        <div className="text-left flex-1">
          <p className="font-medium text-gray-900">{method.name}</p>
          <p className="text-xs text-gray-500">{method.description}</p>
        </div>
        {isSelected && (
          <CheckCircle className="h-5 w-5 text-blue-600" />
        )}
      </div>
    </button>
  )
}