// app/(app)/dashboard/deposit/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Banknote, 
  Wallet, 
  ArrowUpRight,
  CheckCircle,
  Shield,
  AlertCircle,
  Clock,
  Building,
  Zap,
  DollarSign
} from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

export default function DepositPage() {
  const router = useRouter()
  const { data, loading, addTransaction, refresh } = useDashboard()
  
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'crypto'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const availableBalance = data.stats.totalDeposits - data.stats.totalWithdrawals - data.stats.activeInvestment

  const depositMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Instant deposit • 2.5% fee',
      fee: 2.5,
      processingTime: 'Instant',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: '1-3 business days • $0 fee',
      fee: 0,
      processingTime: '1-3 days',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Zap,
      description: 'Fast & secure • 1% fee',
      fee: 1,
      processingTime: '15-30 minutes',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]

  const quickAmounts = [100, 500, 1000, 5000]

  const calculateFee = () => {
    const numAmount = parseFloat(amount) || 0
    const method = depositMethods.find(m => m.id === selectedMethod)
    if (!method) return 0
    return (numAmount * method.fee) / 100
  }

  const calculateTotal = () => {
    const numAmount = parseFloat(amount) || 0
    const fee = calculateFee()
    return numAmount - fee
  }

  const validateAmount = (value: string) => {
    const numValue = parseFloat(value)
    if (numValue < 10) return 'Minimum deposit is $10'
    if (numValue > 50000) return 'Maximum deposit is $50,000'
    return null
  }

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount)
    const validationError = validateAmount(amount)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const result = await addTransaction({
        type: 'deposit',
        amount: numAmount,
        status: 'completed',
        description: `Deposit via ${selectedMethod}`,
        option: depositMethods.find(m => m.id === selectedMethod)?.name
      })

      if (result.success) {
        setSuccess(`Successfully deposited $${numAmount.toLocaleString()}!`)
        setAmount('')
        
        // Refresh dashboard data
        await refresh()
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        throw new Error(result.error || 'Deposit failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deposit')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Deposit Funds</h1>
        <p className="text-gray-600 mt-2">Add funds to your investment account securely</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Available Balance</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Total Deposits</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                ${data.stats.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <ArrowUpRight className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Deposit Limit</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">$50,000</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Deposit Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deposit Methods */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Select Deposit Method</h2>
              <p className="text-sm text-gray-600 mt-1">Choose how you want to add funds</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {depositMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id as any)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedMethod === method.id
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
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Enter Amount</h2>
              <p className="text-sm text-gray-600 mt-1">How much would you like to deposit?</p>
            </div>
            
            <div className="p-6">
              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleQuickAmount(quickAmount)}
                      type="button"
                      className={`py-3 px-4 rounded-lg border transition-all ${
                        amount === quickAmount.toString()
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">${quickAmount.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-4">
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
                        setError(null)
                      }}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium"
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Min: $10</span>
                    <span className="text-xs text-gray-500">Max: $50,000</span>
                  </div>
                </div>

                {/* Amount Breakdown */}
                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Deposit Amount</span>
                      <span className="font-medium">${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Fee ({depositMethods.find(m => m.id === selectedMethod)?.fee}%)</span>
                      <span className="font-medium text-red-600">-${calculateFee().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Amount to be deposited</span>
                        <span className="text-lg font-bold text-green-600">
                          ${calculateTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error & Success Messages */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-700 font-medium">{success}</p>
                      <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    isProcessing
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  } text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing Deposit...</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="h-5 w-5" />
                      <span>Deposit ${amount || '0.00'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info & Security */}
        <div className="space-y-6">
          {/* Security Info */}
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Secure Deposit</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">256-bit SSL encryption</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">PCI DSS compliant</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">Regulated by SEC</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">Funds insured up to $250,000</span>
              </li>
            </ul>
          </div>

          {/* Processing Info */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Processing Times</h3>
            </div>
            <div className="space-y-4">
              {depositMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`p-3 rounded-lg border ${
                    selectedMethod === method.id
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{method.name}</span>
                    <span className={`text-sm font-medium ${
                      selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {method.processingTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Recent Deposits</h3>
            </div>
            <div className="p-4">
              {data.recentActivities
                .filter(activity => activity.type === 'deposit')
                .slice(0, 3)
                .map((deposit, index) => (
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
                ))}
              
              {data.recentActivities.filter(a => a.type === 'deposit').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent deposits</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}