// app/(app)/dashboard/deposit/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Wallet,
  ArrowUpRight,
  Shield,
  Building,
  Zap
} from 'lucide-react'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { DepositMethod, DepositMethodType } from '@/types/deposit'

// Import components with named imports
import { DepositStatsCard } from '@/components/dashboard/deposit/DepositStatsCard'
import { DepositMethodCard } from '@/components/dashboard/deposit/DepositMethodCard'
import { DepositForm } from '@/components/dashboard/deposit/DepositForm'
import { SecurityInfo } from '@/components/dashboard/deposit/SecurityInfo'
import { ProcessingTimes } from '@/components/dashboard/deposit/ProcessingTimes'
import { RecentDeposits } from '@/components/dashboard/deposit/RecentDeposits'

export default function DepositPage() {
  const router = useRouter()
  const { data, loading, addTransaction, refresh } = useDashboard()

  const [selectedMethod, setSelectedMethod] = useState<DepositMethodType>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const availableBalance = data.stats.totalDeposits - data.stats.totalWithdrawals - data.stats.activeInvestment

  const depositMethods: DepositMethod[] = [
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

  // Get current method with fallback
  const currentMethod = depositMethods.find(m => m.id === selectedMethod) || depositMethods[0]

  // Update selected method if current becomes invalid
  useEffect(() => {
    if (!depositMethods.find(m => m.id === selectedMethod)) {
      setSelectedMethod(depositMethods[0].id)
    }
  }, [selectedMethod])

  const handleDeposit = async (amount: number, details?: any) => {
    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    try {
      console.log('Creating transaction with:', {
        type: 'deposit',
        amount,
        status: selectedMethod === 'card' ? 'completed' : 'pending',
        method: selectedMethod,
        details
      })

      const transactionData: {
        type: string
        amount: number
        status: string
        description: string
        option: string | undefined
        metadata?: any
      } = {
        type: 'deposit',
        amount: amount, // Make sure this is a number, not a string
        status: selectedMethod === 'card' ? 'completed' : 'pending',
        description: `Deposit via ${selectedMethod}`,
        option: depositMethods.find(m => m.id === selectedMethod)?.name
      }

      console.log('Sending to addTransaction:', transactionData)

      // Add method-specific metadata
      if (selectedMethod === 'card' && details) {
        transactionData.metadata = {
          cardBrand: details.cardBrand,
          last4: details.cardNumber.slice(-4)
        }
        transactionData.status = 'completed'
      }

      if (selectedMethod === 'bank') {
        transactionData.metadata = {
          reference: `DEP-${Date.now().toString().slice(-8)}`,
          expectedArrival: '1-3 business days'
        }
      }

      if (selectedMethod === 'crypto' && details) {
        transactionData.metadata = {
          coin: details.coin,
          receiptFile: details.receiptPreview ? 'uploaded' : null
        }
      }

      const result = await addTransaction(transactionData)

      if (result.success) {
        let successMessage = `Successfully deposited $${amount.toLocaleString()}!`
        if (selectedMethod === 'bank') {
          successMessage = `Bank transfer initiated! Your deposit will be credited within 1-3 business days.`
        }
        if (selectedMethod === 'crypto') {
          successMessage = `Crypto deposit received! Waiting for network confirmation.`
        }

        setSuccess(successMessage)

        // Refresh dashboard data
        await refresh()

        // Redirect after success
        setTimeout(() => {
          router.push('/dashboard')
        }, 3000)
      } else {
        const errorMessage = typeof result.error === 'string'
          ? result.error
          : 'Deposit failed - unknown error'
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('Error in handleDeposit:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
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

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <div className="flex-1">
            <p className="text-green-700 font-medium">{success}</p>
            <p className="text-green-600 text-sm mt-1">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DepositStatsCard
          title="Available Balance"
          value={availableBalance}
          icon={<Wallet className="h-8 w-8" />}
          gradientFrom="from-blue-50"
          gradientTo="to-blue-100"
          textColor="text-blue-900"
        />

        <DepositStatsCard
          title="Total Deposits"
          value={data.stats.totalDeposits}
          icon={<ArrowUpRight className="h-8 w-8" />}
          gradientFrom="from-green-50"
          gradientTo="to-green-100"
          textColor="text-green-900"
        />

        <DepositStatsCard
          title="Deposit Limit"
          value="50,000"
          icon={<Shield className="h-8 w-8" />}
          gradientFrom="from-purple-50"
          gradientTo="to-purple-100"
          textColor="text-purple-900"
          valuePrefix="$"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Deposit Methods & Form */}
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
                  <DepositMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onSelect={() => setSelectedMethod(method.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Deposit Form - Using currentMethod which is guaranteed to exist */}
          <DepositForm
            selectedMethod={currentMethod}
            onSubmit={handleDeposit}
            isProcessing={isProcessing}
            error={error}
          />
        </div>

        {/* Right Column - Info & Security */}
        <div className="space-y-6">
          <SecurityInfo />
          <ProcessingTimes
            methods={depositMethods}
            selectedMethodId={selectedMethod}
          />
          <RecentDeposits deposits={data.recentActivities} />
        </div>
      </div>
    </div>
  )
}