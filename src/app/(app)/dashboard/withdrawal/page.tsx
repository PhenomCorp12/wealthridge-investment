// app/(app)/dashboard/withdrawal/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Wallet, 
  Banknote, 
  Building, 
  ArrowDownRight,
  CheckCircle,
  Shield,
  AlertCircle,
  Clock,
  CreditCard,
  Zap,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'

export default function WithdrawalPage() {
  const router = useRouter()
  const { data, loading, addTransaction, refresh } = useDashboard()
  
  const [amount, setAmount] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'card' | 'crypto'>('bank')
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Calculate available balance
  const availableBalance = data.stats.totalDeposits - data.stats.totalWithdrawals - data.stats.activeInvestment

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: '1-3 business days • $25 fee',
      fee: 25,
      processingTime: '1-3 days',
      minAmount: 50,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      requiresDetails: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: '2-5 business days • 3% fee',
      feePercentage: 3,
      processingTime: '2-5 days',
      minAmount: 20,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      requiresDetails: false
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Zap,
      description: '15-60 minutes • 1.5% fee',
      feePercentage: 1.5,
      processingTime: '15-60 min',
      minAmount: 10,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      requiresDetails: true
    }
  ]

  const quickAmounts = [50, 100, 500, 1000]

  // Helper function to safely format numbers
  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  // Safe calculate functions that always return numbers
  const calculateFee = (): number => {
    const numAmount = parseFloat(amount) || 0
    const method = withdrawalMethods.find(m => m.id === selectedMethod)
    
    if (!method || numAmount <= 0) return 0
    
    if (method.id === 'bank') {
      return method.fee || 25 // Default to $25 if not specified
    } else {
      const feePercentage = method.feePercentage || 0
      return (numAmount * feePercentage) / 100
    }
  }

  const calculateTotal = (): number => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount <= 0) return 0
    
    const fee = calculateFee()
    return numAmount + fee
  }

  const calculateReceiveAmount = (): number => {
    const numAmount = parseFloat(amount) || 0
    if (numAmount <= 0) return 0
    
    const fee = calculateFee()
    const receiveAmount = numAmount - fee
    return Math.max(0, receiveAmount) // Ensure non-negative
  }

  const validateAmount = (value: string) => {
    const numValue = parseFloat(value)
    const method = withdrawalMethods.find(m => m.id === selectedMethod)
    
    if (!numValue || numValue <= 0) return 'Please enter a valid amount'
    if (method && numValue < method.minAmount) return `Minimum withdrawal is $${method.minAmount}`
    if (numValue > availableBalance) return 'Insufficient available balance'
    if (numValue > 25000) return 'Maximum single withdrawal is $25,000'
    
    const receiveAmount = calculateReceiveAmount()
    if (receiveAmount < 0) return 'Amount too small after fees'
    
    return null
  }

  const validateBankDetails = () => {
    if (!withdrawalMethods.find(m => m.id === selectedMethod)?.requiresDetails) return true
    
    if (selectedMethod === 'bank') {
      if (!bankDetails.accountNumber.trim()) return 'Account number is required'
      if (!bankDetails.routingNumber.trim()) return 'Routing number is required'
      if (!bankDetails.accountName.trim()) return 'Account name is required'
      if (bankDetails.accountNumber.length < 8) return 'Invalid account number'
      if (bankDetails.routingNumber.length !== 9) return 'Routing number must be 9 digits'
    }
    
    return true
  }

  const handleQuickAmount = (quickAmount: number) => {
    if (quickAmount <= availableBalance) {
      setAmount(quickAmount.toString())
      setError(null)
    } else {
      setError('Amount exceeds available balance')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const numAmount = parseFloat(amount)
    const validationError = validateAmount(amount)
    const detailsValid = validateBankDetails()
    
    if (validationError) {
      setError(validationError)
      return
    }
    
    if (detailsValid !== true) {
      setError(detailsValid)
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      const method = withdrawalMethods.find(m => m.id === selectedMethod)
      const fee = calculateFee()
      const receiveAmount = calculateReceiveAmount()
      const totalAmount = calculateTotal()

      // Create a simplified transaction without metadata for now
      const transactionData: any = {
        type: 'withdrawal',
        amount: totalAmount, // Total deducted (amount + fee)
        status: 'pending', // Starts as pending, completes after processing
        description: `Withdrawal to ${method?.name || 'selected method'}`
      }

      // Add option if method exists
      if (method) {
        transactionData.option = method.name
      }

      console.log('Submitting withdrawal:', transactionData)

      const result = await addTransaction(transactionData)

      if (result.success) {
        setSuccess(`Withdrawal request for $${numAmount.toLocaleString()} submitted! You'll receive $${receiveAmount.toLocaleString()} after fees.`)
        setAmount('')
        setBankDetails({ accountNumber: '', routingNumber: '', accountName: '' })
        
        // Refresh dashboard data
        await refresh()
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        console.error('Transaction failed:', result.error)
        throw new Error(result.error?.message || result.error || 'Withdrawal failed')
      }
    } catch (err) {
      console.error('Withdrawal error details:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during withdrawal')
    } finally {
      setIsProcessing(false)
    }
  }

  // Reset error when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      setError(null)
    }
  }, [amount, selectedMethod])

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

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Withdraw Funds</h1>
        <p className="text-gray-600 mt-2">Withdraw funds from your investment account</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`bg-linear-to-r rounded-xl p-6 ${
          availableBalance > 0 
            ? 'from-green-50 to-green-100' 
            : 'from-gray-100 to-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${formatCurrency(availableBalance)}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-gray-600" />
          </div>
          {availableBalance <= 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-700 text-center">
                No funds available for withdrawal
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-linear-to-r from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Total Withdrawals</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                ${formatCurrency(data.stats.totalWithdrawals)}
              </p>
            </div>
            <ArrowDownRight className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-linear-to-r from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Withdrawal Limit</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">$25,000</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Withdrawal Methods & Amount */}
        <div className="lg:col-span-2 space-y-6">
          {/* Withdrawal Methods */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Select Withdrawal Method</h2>
              <p className="text-sm text-gray-600 mt-1">Choose how you want to receive funds</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {withdrawalMethods.map((method) => {
                  const isDisabled = availableBalance <= 0
                  const isSelected = selectedMethod === method.id
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id as any)}
                      disabled={isDisabled}
                      className={`p-4 rounded-xl border transition-all ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed border-gray-200'
                          : isSelected
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
                })}
              </div>
            </div>
          </div>

          {/* Bank Details Form (Conditional) */}
          {selectedMethodData?.requiresDetails && selectedMethod === 'bank' && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Bank Account Details</h2>
                <p className="text-sm text-gray-600 mt-1">Enter your bank information securely</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={bankDetails.accountName}
                    onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.routingNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 9)
                        setBankDetails({...bankDetails, routingNumber: value})
                      }}
                      placeholder="123456789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setBankDetails({...bankDetails, accountNumber: value})
                      }}
                      placeholder="Your account number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Your bank details are encrypted and stored securely. We never share your information with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Withdrawal Amount</h2>
              <p className="text-sm text-gray-600 mt-1">How much would you like to withdraw?</p>
            </div>
            
            <div className="p-6">
              {/* Quick Amount Buttons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickAmounts.map((quickAmount) => {
                    const isDisabled = availableBalance < quickAmount
                    const isSelected = amount === quickAmount.toString()
                    
                    return (
                      <button
                        key={quickAmount}
                        onClick={() => handleQuickAmount(quickAmount)}
                        type="button"
                        disabled={isDisabled}
                        className={`py-3 px-4 rounded-lg border transition-all ${
                          isDisabled
                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                            : isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">${quickAmount.toLocaleString()}</span>
                      </button>
                    )
                  })}
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
                      min={selectedMethodData?.minAmount || 10}
                      max={Math.min(25000, availableBalance)}
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        setError(null)
                      }}
                      placeholder="0.00"
                      disabled={availableBalance <= 0}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium ${
                        availableBalance <= 0
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Min: ${selectedMethodData?.minAmount || 10}
                    </span>
                    <span className="text-xs text-gray-500">
                      Max: ${Math.min(25000, availableBalance).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Amount Breakdown */}
                {amount && parseFloat(amount) > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Withdrawal Amount</span>
                      <span className="font-medium">
                        ${formatCurrency(parseFloat(amount) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Fee</span>
                      <span className="font-medium text-red-600">
                        -${formatCurrency(calculateFee())}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Amount you'll receive</span>
                        <span className="text-lg font-bold text-green-600">
                          ${formatCurrency(calculateReceiveAmount())}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-2">
                      <p>Total deducted from balance: ${formatCurrency(calculateTotal())}</p>
                    </div>
                  </div>
                )}

                {/* Balance Warning */}
                {availableBalance > 0 && availableBalance < 100 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-yellow-700 text-sm">
                      Your available balance is low. Consider leaving some funds for investment opportunities.
                    </p>
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
                  disabled={
                    !amount || 
                    parseFloat(amount) <= 0 || 
                    isProcessing || 
                    availableBalance <= 0 ||
                    (selectedMethodData?.requiresDetails && selectedMethod === 'bank' && 
                     (!bankDetails.accountNumber || !bankDetails.routingNumber || !bankDetails.accountName))
                  }
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    isProcessing
                      ? 'bg-blue-400 cursor-not-allowed'
                      : availableBalance <= 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  } text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Processing Withdrawal...</span>
                    </>
                  ) : availableBalance <= 0 ? (
                    <>
                      <AlertCircle className="h-5 w-5" />
                      <span>Insufficient Balance</span>
                    </>
                  ) : (
                    <>
                      <Banknote className="h-5 w-5" />
                      <span>Withdraw ${amount || '0.00'}</span>
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
              <h3 className="font-semibold text-blue-900">Secure Withdrawal</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">Bank-level encryption</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">Two-factor authentication</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">24/7 fraud monitoring</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-blue-800">Regulated & insured</span>
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
              {withdrawalMethods.map((method) => (
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
                  <div className="text-xs text-gray-500 mt-1">
                    Min: ${method.minAmount} • {
                      method.id === 'bank' 
                        ? `$${method.fee} fee` 
                        : `${method.feePercentage}% fee`
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Withdrawals */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Recent Withdrawals</h3>
            </div>
            <div className="p-4">
              {data.recentActivities
                .filter(activity => activity.type === 'withdrawal')
                .slice(0, 3)
                .map((withdrawal, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        ${withdrawal.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{withdrawal.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      withdrawal.status === 'completed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {withdrawal.status}
                    </span>
                  </div>
                ))}
              
              {data.recentActivities.filter(a => a.type === 'withdrawal').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent withdrawals</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}