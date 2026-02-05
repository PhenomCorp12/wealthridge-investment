// components/providers/DashboardProvider.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'
import { DashboardData } from '@/types/dashboard'
import { useDashboardData } from '@/lib/hooks/useDashboardData'

interface DashboardContextType {
  data: DashboardData
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addTransaction: (transaction: any) => Promise<{ success: boolean; error?: any }>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { data, loading, error, refresh, addTransaction } = useDashboardData()

  return (
    <DashboardContext.Provider value={{ 
      data, 
      loading, 
      error, 
      refresh, 
      addTransaction 
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}