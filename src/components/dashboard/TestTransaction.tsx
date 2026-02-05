// components/dashboard/TestTransaction.tsx
'use client'

import { useDashboard } from '@/components/providers/DashboardProvider'

export default function TestTransaction() {
  const { addTransaction } = useDashboard()

  const handleTestDeposit = async () => {
    const result = await addTransaction({
      type: 'deposit',
      amount: 1000,
      status: 'completed',
      description: 'Test deposit'
    })
    
    if (result.success) {
      alert('Test deposit added! Check dashboard.')
    } else {
      alert('Error: ' + result.error?.message)
    }
  }

  const handleTestWithdrawal = async () => {
    const result = await addTransaction({
      type: 'withdrawal',
      amount: 200,
      status: 'completed',
      description: 'Test withdrawal'
    })
    
    if (result.success) {
      alert('Test withdrawal added! Check dashboard.')
    } else {
      alert('Error: ' + result.error?.message)
    }
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-medium mb-2">Test Transactions (Dev Only)</h3>
      <div className="flex space-x-2">
        <button
          onClick={handleTestDeposit}
          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
        >
          Add $1000 Deposit
        </button>
        <button
          onClick={handleTestWithdrawal}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Add $200 Withdrawal
        </button>
      </div>
    </div>
  )
}