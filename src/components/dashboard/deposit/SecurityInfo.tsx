// components/dashboard/deposit/SecurityInfo.tsx
'use client'

import { Shield, CheckCircle } from 'lucide-react'

export function SecurityInfo() {
  const securityFeatures = [
    '256-bit SSL encryption',
    'PCI DSS compliant',
    'Regulated by SEC',
    'Funds insured up to $250,000'
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Shield className="h-6 w-6 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Secure Deposit</h3>
      </div>
      <ul className="space-y-3">
        {securityFeatures.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <span className="text-sm text-blue-800">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}