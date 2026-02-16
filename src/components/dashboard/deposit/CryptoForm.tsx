'use client'

import { useState, useRef, useEffect } from 'react'
import { Zap, Copy, CheckCircle, Upload, AlertCircle, Bitcoin, Coins } from 'lucide-react'
import { CryptoDetails } from '@/types/deposit'
import QRCode from 'qrcode'

interface CryptoFormProps {
  amount: number
  onSubmit: (details: CryptoDetails) => void
  isProcessing: boolean
}

export function CryptoForm({ amount, onSubmit, isProcessing }: CryptoFormProps) {
  const [cryptoDetails, setCryptoDetails] = useState<CryptoDetails>({
    coin: 'bitcoin',
    receiptFile: null,
    receiptPreview: null
  })
  const [copied, setCopied] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const cryptoAddresses = {
    bitcoin: {
      address: 'bc1qnzcqpepaw6s2cs4ttjqunsz5pshzshwdydfsef',
      network: 'Bitcoin (BTC)',
      minAmount: 0.001,
      conversion: 0.000015,
      color: '#f7931a',
      scheme: 'bitcoin:'
    },
    ethereum: {
      address: '0xFf9218F3Ff6131d211fCB28449BFB06E91851E06',
      network: 'Ethereum (ERC-20)',
      minAmount: 0.01,
      conversion: 0.0005,
      color: '#627eea',
      scheme: 'ethereum:'
    },
    usdt: {
      address: 'TJVx4AbtBxvDk1GRkYniqbeBWgTKtSDDr7',
      network: 'USDT (TRC-20)',
      minAmount: 10,
      conversion: 1,
      color: '#26a17b',
      scheme: 'ethereum:'
    }
  }

  const selectedCrypto = cryptoAddresses[cryptoDetails.coin]
  const cryptoAmount = amount * selectedCrypto.conversion

  // Generate QR code when coin or address changes
  useEffect(() => {
    generateQRCode()
  }, [cryptoDetails.coin])

  const generateQRCode = async () => {
    try {
      // Create URI with amount for better wallet compatibility
      const uri = `${selectedCrypto.scheme}${selectedCrypto.address}?amount=${cryptoAmount}`
      
      // Generate QR code with custom styling
      const qrDataUrl = await QRCode.toDataURL(uri, {
        width: 200,
        margin: 2,
        color: {
          dark: selectedCrypto.color,
          light: '#FFFFFF'
        }
      })
      setQrCodeDataUrl(qrDataUrl)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCryptoDetails({
          ...cryptoDetails,
          receiptFile: file,
          receiptPreview: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCryptoDetails({
          ...cryptoDetails,
          receiptFile: file,
          receiptPreview: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (cryptoDetails.receiptFile) {
      onSubmit(cryptoDetails)
    }
  }

  return (
    <div className="space-y-6">
      {/* Coin Selection */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setCryptoDetails({ ...cryptoDetails, coin: 'bitcoin', receiptFile: null, receiptPreview: null })}
          className={`p-4 rounded-xl border transition-all ${
            cryptoDetails.coin === 'bitcoin'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Bitcoin className={`h-6 w-6 mx-auto mb-2 ${
            cryptoDetails.coin === 'bitcoin' ? 'text-orange-500' : 'text-gray-600'
          }`} />
          <p className={`text-sm font-medium ${
            cryptoDetails.coin === 'bitcoin' ? 'text-orange-600' : 'text-gray-700'
          }`}>Bitcoin</p>
          <p className="text-xs text-gray-500">BTC</p>
        </button>

        <button
          onClick={() => setCryptoDetails({ ...cryptoDetails, coin: 'ethereum', receiptFile: null, receiptPreview: null })}
          className={`p-4 rounded-xl border transition-all ${
            cryptoDetails.coin === 'ethereum'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Coins className={`h-6 w-6 mx-auto mb-2 ${
            cryptoDetails.coin === 'ethereum' ? 'text-purple-500' : 'text-gray-600'
          }`} />
          <p className={`text-sm font-medium ${
            cryptoDetails.coin === 'ethereum' ? 'text-purple-600' : 'text-gray-700'
          }`}>Ethereum</p>
          <p className="text-xs text-gray-500">ETH</p>
        </button>

        <button
          onClick={() => setCryptoDetails({ ...cryptoDetails, coin: 'usdt', receiptFile: null, receiptPreview: null })}
          className={`p-4 rounded-xl border transition-all ${
            cryptoDetails.coin === 'usdt'
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Zap className={`h-6 w-6 mx-auto mb-2 ${
            cryptoDetails.coin === 'usdt' ? 'text-green-500' : 'text-gray-600'
          }`} />
          <p className={`text-sm font-medium ${
            cryptoDetails.coin === 'usdt' ? 'text-green-600' : 'text-gray-700'
          }`}>USDT</p>
          <p className="text-xs text-gray-500">TRC-20</p>
        </button>
      </div>

      {/* Deposit Address */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Deposit Address</h3>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {selectedCrypto.network}
          </span>
        </div>

        {/* QR Code */}
        <div className="mb-4 p-4 bg-white rounded-lg border flex items-center justify-center">
          {qrCodeDataUrl ? (
            <img 
              src={qrCodeDataUrl} 
              alt={`${cryptoDetails.coin} QR code`}
              className="w-40 h-40"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-gray-400">Generating...</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Deposit Address</p>
              <p className="font-mono text-sm break-all">{selectedCrypto.address}</p>
            </div>
            <button
              onClick={() => copyToClipboard(selectedCrypto.address, 'address')}
              className="p-2 hover:bg-gray-100 rounded-lg ml-2 shrink-0"
            >
              {copied === 'address' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Amount to send:</span>
            <span className="font-mono font-bold text-gray-900">
              {cryptoAmount.toFixed(cryptoDetails.coin === 'usdt' ? 2 : 6)} {cryptoDetails.coin.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            ≈ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
          </p>
        </div>
      </div>

      {/* Receipt Upload */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Payment Receipt</h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {cryptoDetails.receiptPreview ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                {cryptoDetails.receiptPreview.startsWith('data:image') ? (
                  <img 
                    src={cryptoDetails.receiptPreview} 
                    alt="Receipt preview" 
                    className="max-h-32 rounded-lg border"
                  />
                ) : (
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium">📄 {cryptoDetails.receiptFile?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(cryptoDetails.receiptFile?.size || 0) / 1024} KB
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setCryptoDetails({ ...cryptoDetails, receiptFile: null, receiptPreview: null })}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove file
              </button>
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-1">
                Drag and drop your receipt here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Supports JPG, PNG, or PDF (max 5MB)
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              Send the exact amount to the address above and upload your transaction receipt. 
              Your deposit will be credited after 3 network confirmations.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!cryptoDetails.receiptFile || isProcessing}
          className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Submit & Confirm Deposit'}
        </button>
      </div>
    </div>
  )
}