// components/dashboard/deposit/DepositAmountBreakdown.tsx
'use client'

interface DepositAmountBreakdownProps {
  amount: number
  fee: number
  total: number
}

export function DepositAmountBreakdown({ amount, fee, total }: DepositAmountBreakdownProps) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Deposit Amount</span>
        <span className="font-medium">${formatCurrency(amount)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Processing Fee</span>
        <span className="font-medium text-red-600">
          -${formatCurrency(fee)}
        </span>
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900">Amount to be deposited</span>
          <span className="text-lg font-bold text-green-600">
            ${formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  )
}