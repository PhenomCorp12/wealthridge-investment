// hooks/useDashboardData.ts
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DashboardData, Activity, DistributionItem, QuickStat, ActivityType } from '@/types/dashboard'

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalDeposits: 0,
      totalWithdrawals: 0,
      activeInvestment: 0,
      profit: 0,
      profitPercentage: 0
    },
    recentActivities: [],
    investmentDistribution: [],
    quickStats: [
      {
        title: 'Avg. Daily Return',
        value: '0.00%',
        icon: 'trending-up',
        gradientFrom: 'from-blue-50',
        gradientTo: 'to-blue-100',
        textColor: 'text-blue-900',
        iconColor: 'text-blue-600'
      },
      {
        title: 'Portfolio Risk',
        value: 'Low',
        icon: 'trending-down',
        gradientFrom: 'from-green-50',
        gradientTo: 'to-green-100',
        textColor: 'text-green-900',
        iconColor: 'text-green-600'
      },
      {
        title: 'Next Payout',
        value: '--',
        icon: 'calendar',
        gradientFrom: 'from-purple-50',
        gradientTo: 'to-purple-100',
        textColor: 'text-purple-900',
        iconColor: 'text-purple-600'
      }
    ]
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      // Fetch user data
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch transactions from Supabase
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (transactionsError) throw transactionsError

      // Initialize with empty array if no transactions
      const safeTransactions = transactions || []

      // Calculate stats from transactions
      const totalDeposits = safeTransactions
        .filter((t: any) => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      const totalWithdrawals = safeTransactions
        .filter((t: any) => t.type === 'withdrawal' && t.status === 'completed')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      const activeInvestment = safeTransactions
        .filter((t: any) => t.type === 'investment' && t.status === 'active')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      const profit = safeTransactions
        .filter((t: any) => t.type === 'profit')
        .reduce((sum: number, t: any) => sum + (t.amount || 0), 0)

      const profitPercentage = activeInvestment > 0
        ? (profit / activeInvestment) * 100
        : 0

      // Format activities for display
      const recentActivities: Activity[] = safeTransactions.slice(0, 5).map((t: any) => ({
        type: t.type as ActivityType,
        amount: t.amount || 0,
        date: new Date(t.created_at).toLocaleDateString(),
        status: t.status || 'pending',
        option: t.option || undefined
      }))

      // Calculate investment distribution (simplified for now)
      const investmentDistribution: DistributionItem[] = [
        { option: 'Stocks & ETFs', amount: 0, percentage: 0, color: 'bg-blue-500' },
        { option: 'Bonds', amount: 0, percentage: 0, color: 'bg-green-500' },
        { option: 'Real Estate', amount: 0, percentage: 0, color: 'bg-amber-500' },
        { option: 'Cryptocurrency', amount: 0, percentage: 0, color: 'bg-red-500' },
      ]

      // For now, we'll use mock distribution. Later, we'll calculate from real data
      if (activeInvestment > 0) {
        investmentDistribution[0].amount = activeInvestment * 0.472
        investmentDistribution[1].amount = activeInvestment * 0.256
        investmentDistribution[2].amount = activeInvestment * 0.177
        investmentDistribution[3].amount = activeInvestment * 0.095
        investmentDistribution.forEach(item => {
          item.percentage = (item.amount / activeInvestment) * 100
        })
      }

      // Update quick stats
      const updatedQuickStats = [...data.quickStats]
      updatedQuickStats[0].value = `${(profitPercentage / 365).toFixed(2)}%` // Daily return
      updatedQuickStats[2].value = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      setData({
        stats: {
          totalDeposits,
          totalWithdrawals,
          activeInvestment,
          profit,
          profitPercentage: parseFloat(profitPercentage.toFixed(1))
        },
        recentActivities,
        investmentDistribution,
        quickStats: updatedQuickStats
      })

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Function to update after a transaction
  const addTransaction = async (transaction: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return { success: false, error: 'No user found' }
      }

      const { error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: user.id,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      // Refresh dashboard data
      await fetchDashboardData()

      return { success: true }
    } catch (err) {
      console.error('Error adding transaction:', err)
      // Extract error message properly
      const errorMessage = err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'Unknown error occurred'
      return { success: false, error: errorMessage }
    }

  }

  return {
    data,
    loading,
    error,
    refresh: fetchDashboardData,
    addTransaction
  }
}