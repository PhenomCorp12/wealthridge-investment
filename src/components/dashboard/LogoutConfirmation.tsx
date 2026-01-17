// components/dashboard/LogoutConfirmation.tsx
'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LogOut,
  X,
  AlertTriangle,
  Power
} from 'lucide-react'
import { useState } from 'react'

interface LogoutConfirmationProps {
  user: any
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function LogoutConfirmation({ user, isOpen, setIsOpen }: LogoutConfirmationProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()

      // Clear session storage if needed
      localStorage.clear()
      sessionStorage.clear()

      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const userName = user?.user_metadata?.full_name || user?.email || 'User'

  return (
    <>
      {isOpen && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60"
            onClick={() => !isLoggingOut && setIsOpen(false)}
          />

          {/* MODAL */}
          <div className="fixed inset-0 flex items-center justify-center z-70 p-4">
            <div
              className="bg-linear-to-br from-gray-800 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-r from-red-500/20 to-red-600/20 
                      flex items-center justify-center border border-red-500/30">
                      <Power className="h-5 w-5 text-red-400" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                      <p className="text-sm text-gray-400">Secure session termination</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    disabled={isLoggingOut}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50 
                    transition-colors disabled:opacity-50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white mb-2">
                      Are you sure you want to log out,
                      <span className="font-semibold"> {userName}</span>?
                    </p>
                    <p className="text-sm text-gray-400">
                      You’ll need to sign in again to access your dashboard and transactions.
                    </p>
                  </div>
                </div>

                
              </div>

              {/* FOOTER */}
              <div className="p-6 border-t border-gray-700 bg-linear-to-t from-gray-900/50 to-transparent">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    disabled={isLoggingOut}
                    className="px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white 
                    bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all 
                    disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-linear-to-r from-red-600 to-red-700 
                    hover:from-red-700 hover:to-red-800 rounded-lg shadow-lg 
                    hover:shadow-red-900/30 transition-all duration-200 flex items-center space-x-2 
                    disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10"
                            stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 
                            0 5.373 0 12h4zm2 5.291A7.962 7.962 0 
                            014 12H0c0 3.042 1.135 5.824 3 
                            7.938l3-2.647z"></path>
                        </svg>
                        <span>Logging out...</span>
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4" />
                        <span>Logout Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  )
}
