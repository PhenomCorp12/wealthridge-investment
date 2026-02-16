// components/dashboard/deposit/QuickAmountButtons.tsx
'use client'

interface QuickAmountButtonsProps {
  amounts: number[]
  selectedAmount: string
  onSelect: (amount: number) => void
}

export function QuickAmountButtons({ amounts, selectedAmount, onSelect }: QuickAmountButtonsProps) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {amounts.map((amount) => {
          const isSelected = selectedAmount === amount.toString()
          return (
            <button
              key={amount}
              onClick={() => onSelect(amount)}
              type="button"
              className={`py-3 px-4 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">${amount.toLocaleString()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}