// /app/(app)/layout.tsx (Server Component)
import { redirect } from 'next/navigation'
import { DashboardProvider } from '@/components/providers/DashboardProvider'
import DashboardClientWrapper from './DashboardClientWrapper'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return <DashboardClientWrapper user={user}>{children}</DashboardClientWrapper>
}