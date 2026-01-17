import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
