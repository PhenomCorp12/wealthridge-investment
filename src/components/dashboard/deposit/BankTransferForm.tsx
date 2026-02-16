// components/dashboard/deposit/BankTransferForm.tsx
'use client'

import { useState } from 'react'
import { Building, Copy, CheckCircle, Clock, Download } from 'lucide-react'

interface BankTransferFormProps {
  amount: number
  onSubmit: () => void
  isProcessing: boolean
}

export function BankTransferForm({ amount, onSubmit, isProcessing }: BankTransferFormProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const bankDetails = {
    bankName: 'WealthBridge Financial Bank',
    accountName: 'WealthBridge Investment Platform',
    accountNumber: '48-7023-4567-8901',
    routingNumber: '026-073-008',
    swiftCode: 'WBIBUS33',
    reference: `DEP-${Date.now().toString().slice(-8)}`
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadInstructions = () => {
    const content = `
WEALTHBRIDGE - BANK TRANSFER INSTRUCTIONS
===========================================
Date: ${new Date().toLocaleDateString()}
Amount: $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}

BANK DETAILS:
------------
Bank Name: ${bankDetails.bankName}
Account Name: ${bankDetails.accountName}
Account Number: ${bankDetails.accountNumber}
Routing Number: ${bankDetails.routingNumber}
SWIFT Code: ${bankDetails.swiftCode}

YOUR REFERENCE:
--------------
Reference Number: ${bankDetails.reference}

INSTRUCTIONS:
------------
1. Log in to your online banking
2. Add ${bankDetails.accountName} as a payee
3. Transfer the exact amount of $${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
4. Include the reference number in the transfer description
5. Click "I've transferred the money" on the platform

Note: Funds typically arrive within 1-3 business days.
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wealthbridge-transfer-${bankDetails.reference}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-6 w-6 text-blue-600" />
          <h3 className="font-semibold text-blue-900">Bank Transfer Instructions</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">Transfer Amount</p>
            <p className="text-3xl font-bold text-blue-900">
              ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(bankDetails).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="text-xs text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="font-mono text-sm font-medium">{value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(value, key)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied === key ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm font-medium text-yellow-800 mb-2">⚠️ Important</p>
            <p className="text-xs text-yellow-700">
              Include the reference number in your transfer description. 
              Funds may take 1-3 business days to reflect.
            </p>
          </div>

          <button
            onClick={downloadInstructions}
            className="w-full py-2 px-4 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Instructions</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-xl border">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h4 className="font-medium text-gray-900">Already transferred?</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Click the button below after you've completed the transfer. We'll verify and credit your account.
        </p>
        <button
          onClick={onSubmit}
          disabled={isProcessing}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </span>
          ) : (
            "✓ I've transferred the money"
          )}
        </button>
      </div>
    </div>
  )
}