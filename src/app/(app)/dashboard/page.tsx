// app/(app)/dashboard/page.tsx
import { DollarSign, TrendingUp, Wallet, PieChart, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatsCard from '@/components/dashboard/StatsCard'
import RecentActivity from '@/components/dashboard/RecentActivity'
import InvestmentDistribution from '@/components/dashboard/InvestmentDistribution'
import QuickStats from '@/components/dashboard/QuickStats'

// Mock data
const dashboardData = {
  stats: {
    totalDeposits: 35420.50,
    totalWithdrawals: 9990.00,
    activeInvestment: 25430.50,
    profit: 3245.75,
    profitPercentage: 12.8
  },
  recentActivities: [
    { type: 'deposit' as const, amount: 5000, date: '2024-01-15', status: 'completed' },
    { type: 'investment'as const, amount: 10000, option: 'Stocks & ETFs', date: '2024-01-10', status: 'active' },
    { type: 'profit'as const, amount: 245.75, date: '2024-01-05', status: 'credited' },
    { type: 'withdrawal'as const, amount: 2000, date: '2024-01-01', status: 'completed' },
  ],
  investmentDistribution: [
    { option: 'Stocks & ETFs', amount: 12000, percentage: 47.2, color: 'bg-blue-500' },
    { option: 'Bonds', amount: 6500, percentage: 25.6, color: 'bg-green-500' },
    { option: 'Real Estate', amount: 4500, percentage: 17.7, color: 'bg-amber-500' },
    { option: 'Cryptocurrency', amount: 2430.50, percentage: 9.5, color: 'bg-red-500' },
  ],
  quickStats: [
    {
      title: 'Avg. Daily Return',
      value: '0.35%',
      icon: 'trending-up' as const,
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-blue-100',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Portfolio Risk',
      value: 'Medium',
      icon: 'trending-down' as const,
      gradientFrom: 'from-green-50',
      gradientTo: 'to-green-100',
      textColor: 'text-green-900',
      iconColor: 'text-green-600'
    },
    {
      title: 'Next Payout',
      value: 'Jan 31',
      icon: 'calendar' as const,
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-purple-100',
      textColor: 'text-purple-900',
      iconColor: 'text-purple-600'
    }
  ]
}

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's your investment overview."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Total Deposit"
          value={dashboardData.stats.totalDeposits}
          icon={DollarSign}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          trend={{
            value: '+12.5%',
            isPositive: true,
            label: 'from last month'
          }}
        />

        <StatsCard
          title="Total Withdrawals"
          value={dashboardData.stats.totalWithdrawals}
          icon={Wallet}
          iconBgColor="bg-red-50"
          iconColor="text-red-600"
          trend={{
            value: '-3.2%',
            isPositive: false,
            label: 'from last month'
          }}
        />

        <StatsCard
          title="Active Investment"
          value={dashboardData.stats.activeInvestment}
          icon={TrendingUp}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
          additionalInfo={
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-gray-600">4 active investments</span>
            </div>
          }
        />

        <StatsCard
          title="Total Profit"
          value={dashboardData.stats.profit}
          icon={PieChart}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          trend={{
            value: `+${dashboardData.stats.profitPercentage}%`,
            isPositive: true,
            label: 'ROI'
          }}
        />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={dashboardData.recentActivities} />
        
        <InvestmentDistribution
          distribution={dashboardData.investmentDistribution}
          totalInvested={dashboardData.stats.activeInvestment}
        />
      </div>

      {/* Quick Stats */}
      <QuickStats stats={dashboardData.quickStats} />
    </div>
  )
}