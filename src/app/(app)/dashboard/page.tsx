// app/(app)/dashboard/page.tsx
'use client'

import { DollarSign, TrendingUp, Wallet, PieChart, Clock } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import InvestmentDistribution from '@/components/dashboard/InvestmentDistribution'
import QuickStats from '@/components/dashboard/QuickStats'
import { useDashboard } from '@/components/providers/DashboardProvider'
import { Activity } from '@/types/dashboard'
import TestTransaction from '@/components/dashboard/TestTransaction'

export default function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {/* Loading skeleton for header */}
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>

          {/* Loading skeleton for stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>

          {/* Loading skeleton for two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 space-y-8 md:p-6">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's your investment overview."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Deposit"
          value={data.stats.totalDeposits}
          icon={DollarSign}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          trend={{
            value: data.stats.totalDeposits > 0 ? '+0.0%' : '+0.0%',
            isPositive: true,
            label: 'started'
          }}
        />

        <StatsCard
          title="Total Withdrawals"
          value={data.stats.totalWithdrawals}
          icon={Wallet}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
          trend={{
            value: data.stats.totalWithdrawals > 0 ? '+0.0%' : '+0.0%',
            isPositive: data.stats.totalWithdrawals > 0,
            label: data.stats.totalWithdrawals > 0 ? 'started' : 'no withdrawals'
          }}
        />

        <StatsCard
          title="Active Investment"
          value={data.stats.activeInvestment}
          icon={TrendingUp}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
          additionalInfo={
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">
                {data.recentActivities.filter((a: Activity) => a.type === 'investment').length} active investments
              </span>
            </div>
          }
        />

        <StatsCard
          title="Total Profit"
          value={data.stats.profit}
          icon={PieChart}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          trend={{
            value: data.stats.profitPercentage > 0 ? `+${data.stats.profitPercentage.toFixed(1)}%` : '0.0%',
            isPositive: data.stats.profitPercentage > 0,
            label: 'ROI'
          }}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={data.recentActivities} />

        <InvestmentDistribution
          distribution={data.investmentDistribution}
          totalInvested={data.stats.activeInvestment}
        />
      </div>

      {/* Quick Stats */}
      <QuickStats stats={data.quickStats} />

      <div className="mt-8">
        <TestTransaction />
      </div>
    </div>
  )
}