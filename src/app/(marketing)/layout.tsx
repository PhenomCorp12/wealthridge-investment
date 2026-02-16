import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../globals.css'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'WealthBridge - Smart Investment Banking',
   description: 'Professional investment banking platform with intelligent portfolio management, secure transactions, and competitive returns.',
   keywords: ['investment', 'banking', 'portfolio', 'stocks', 'bonds', 'wealth management'],
   authors: [{ name: 'WealthBridge' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}


export default function MarketLayout({
  children,
}: {
   children: React.ReactNode
}) {
  return (
     <div lang="en" className="scroll-smooth">
       <div className={`${inter.className} min-h-screen bg-linear-to-b from-gray-50 to-white`}>
         <div className="flex min-h-screen flex-col">
            <Header />
           <main className="flex-1">
             {children}
           </main>
           <Footer />
         </div>
       </div>
     </div>
   )
 }