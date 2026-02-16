// components/dashboard/deposit/CardForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { CreditCard, Lock, Calendar, User, Smartphone } from 'lucide-react'
import { CardDetails } from '@/types/deposit'

interface CardFormProps {
  onSubmit: (details: CardDetails) => void
  isProcessing: boolean
}

export function CardForm({ onSubmit, isProcessing }: CardFormProps) {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardBrand: undefined
  })

  const [isFlipped, setIsFlipped] = useState(false)

  // Detect card brand
  useEffect(() => {
    const number = cardDetails.cardNumber.replace(/\s/g, '')
    if (number.startsWith('4')) {
      setCardDetails(prev => ({ ...prev, cardBrand: 'visa' }))
    } else if (number.startsWith('5')) {
      setCardDetails(prev => ({ ...prev, cardBrand: 'mastercard' }))
    } else if (number.startsWith('3')) {
      setCardDetails(prev => ({ ...prev, cardBrand: 'amex' }))
    } else if (number.startsWith('6')) {
      setCardDetails(prev => ({ ...prev, cardBrand: 'discover' }))
    } else {
      setCardDetails(prev => ({ ...prev, cardBrand: undefined }))
    }
  }, [cardDetails.cardNumber])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardDetails({ ...cardDetails, cardNumber: formatted })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(cardDetails)
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0')
    return month
  })

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString())

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div 
        className="relative h-48 w-full perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front of Card */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-r from-blue-900 to-blue-700 rounded-xl p-6 shadow-xl border border-white/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-blue-200">WealthBridge</p>
                <p className="text-lg font-bold text-white mt-4">
                  {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                </p>
              </div>
              {cardDetails.cardBrand && (
                <div className="text-white">
                  {cardDetails.cardBrand === 'visa' && (
                    <span className="text-xl font-bold">VISA</span>
                  )}
                  {cardDetails.cardBrand === 'mastercard' && (
                    <span className="text-xl font-bold">Mastercard</span>
                  )}
                  {cardDetails.cardBrand === 'amex' && (
                    <span className="text-xl font-bold">AMEX</span>
                  )}
                </div>
              )}
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-blue-300">Card Holder</p>
                  <p className="text-sm font-medium text-white">
                    {cardDetails.cardHolder || 'YOUR NAME'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300">Expires</p>
                  <p className="text-sm font-medium text-white">
                    {cardDetails.expiryMonth || 'MM'}/{cardDetails.expiryYear || 'YY'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-xl rotate-y-180">
            <div className="mt-6">
              <div className="h-12 bg-black/80"></div>
              <div className="px-6 mt-4">
                <div className="flex justify-end">
                  <div className="bg-gray-600 px-4 py-2 rounded">
                    <p className="text-white font-mono">
                      {cardDetails.cvv || '•••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Holder Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={cardDetails.cardHolder}
              onChange={(e) => setCardDetails({ ...cardDetails, cardHolder: e.target.value.toUpperCase() })}
              placeholder="JOHN DOE"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={cardDetails.expiryMonth}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryMonth: e.target.value })}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">MM</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select
                value={cardDetails.expiryYear}
                onChange={(e) => setCardDetails({ ...cardDetails, expiryYear: e.target.value })}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">YY</option>
                {years.map(year => (
                  <option key={year} value={year.slice(-2)}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CVV
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.slice(0, 4) })}
                placeholder="123"
                maxLength={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              Your card details are encrypted and never stored. This is a demo simulation.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Pay with Card'}
        </button>
      </form>
    </div>
  )
}