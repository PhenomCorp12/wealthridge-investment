// /app/(app)/DashboardClientWrapper.tsx (Client Component)
'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import LogoutConfirmation from '@/components/dashboard/LogoutConfirmation'

export default function DashboardClientWrapper({ 
  children, 
  user 
}: { 
  children: React.ReactNode
  user: any 
}) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const openLogoutModal = () => setIsLogoutOpen(true)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} openLogoutModal={openLogoutModal} />
      
      <div className="flex-1">
        <Header user={user} />
        <main className="p-6">{children}</main>
      </div>

      <LogoutConfirmation 
        user={user}
        isOpen={isLogoutOpen}
        setIsOpen={setIsLogoutOpen}
      />
    </div>
  )
}