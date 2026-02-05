// types/dashboard.ts
export type ActivityType = 'deposit' | 'investment' | 'profit' | 'withdrawal'

export interface Activity {
  type: ActivityType
  amount: number
  date: string
  status: string
  option?: string
}

export interface StatsData {
  totalDeposits: number
  totalWithdrawals: number
  activeInvestment: number
  profit: number
  profitPercentage: number
}

export interface DistributionItem {
  option: string
  amount: number
  percentage: number
  color: string
}

export interface QuickStat {
  title: string
  value: string
  icon: 'trending-up' | 'trending-down' | 'calendar'
  gradientFrom: string
  gradientTo: string
  textColor: string
  iconColor: string
}

export interface DashboardData {
  stats: StatsData
  recentActivities: Activity[]
  investmentDistribution: DistributionItem[]
  quickStats: QuickStat[]
}