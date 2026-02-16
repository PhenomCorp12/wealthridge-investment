// components/dashboard/deposit/DepositForm.tsx
'use client'

import { useState } from 'react'
import { DollarSign, Banknote } from 'lucide-react'
import { QuickAmountButtons } from './QuickAmountButtons'
import { DepositAmountBreakdown } from './DepositAmountBreakdown'
import { CardForm } from './CardForm'
import { BankTransferForm } from './BankTransferForm'
import { CryptoForm } from './CryptoForm'
import { DepositMethod, CardDetails, CryptoDetails } from '@/types/deposit'

interface DepositFormProps {
  selectedMethod: DepositMethod
  onSubmit: (amount: number, details?: any) => Promise<void>
  isProcessing: boolean
  error: string | null
}

export function DepositForm({ 
  selectedMethod, 
  onSubmit, 
  isProcessing, 
  error 
}: DepositFormProps) {
  const [amount, setAmount] = useState('')
  const [showMethodForm, setShowMethodForm] = useState(false)
  const quickAmounts = [100, 500, 1000, 5000]

  const calculateFee = () => {
    const numAmount = parseFloat(amount) || 0
    return (numAmount * selectedMethod.fee) / 100
  }

  const calculateTotal = () => {
    const numAmount = parseFloat(amount) || 0
    const fee = calculateFee()
    return numAmount - fee
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
    setShowMethodForm(false)
  }

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      setShowMethodForm(true)
    }
  }

  const handleMethodSubmit = async (details?: CardDetails | CryptoDetails) => {
    const numAmount = parseFloat(amount)
    await onSubmit(numAmount, details)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Enter Amount</h2>
        <p className="text-sm text-gray-600 mt-1">How much would you like to deposit?</p>
      </div>
      
      <div className="p-6">
        {!showMethodForm ? (
          <form onSubmit={handleAmountSubmit} className="space-y-4">
            <QuickAmountButtons
              amounts={quickAmounts}
              selectedAmount={amount}
              onSelect={handleQuickAmount}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    setShowMethodForm(false)
                  }}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                  required
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Min: $10</span>
                <span className="text-xs text-gray-500">Max: $50,000</span>
              </div>
            </div>

            {amount && parseFloat(amount) > 0 && (
              <DepositAmountBreakdown
                amount={parseFloat(amount)}
                fee={calculateFee()}
                total={calculateTotal()}
              />
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Pay ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} via {selectedMethod.name}
              </h3>
              <button
                onClick={() => setShowMethodForm(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Change amount
              </button>
            </div>

            {selectedMethod.id === 'card' && (
              <CardForm
                onSubmit={handleMethodSubmit}
                isProcessing={isProcessing}
              />
            )}

            {selectedMethod.id === 'bank' && (
              <BankTransferForm
                amount={parseFloat(amount)}
                onSubmit={() => handleMethodSubmit()}
                isProcessing={isProcessing}
              />
            )}

            {selectedMethod.id === 'crypto' && (
              <CryptoForm
                amount={parseFloat(amount)}
                onSubmit={handleMethodSubmit}
                isProcessing={isProcessing}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}