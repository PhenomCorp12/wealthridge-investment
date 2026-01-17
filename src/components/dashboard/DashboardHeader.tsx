// components/dashboard/DashboardHeader.tsx
import { Calendar } from 'lucide-react'
import Link from 'next/link'

interface DashboardHeaderProps {
  title: string
  description: string
  date?: string
  ctaText?: string
  ctaLink?: string
}

export default function DashboardHeader({ 
  title, 
  description, 
  date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  ctaText = 'New Investment',
  ctaLink = '/dashboard/investment'
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{date}</span>
        </div>
        
        {ctaText && ctaLink && (
          <Link
            href={ctaLink}
            className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow"
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  )
}