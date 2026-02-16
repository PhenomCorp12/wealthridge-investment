// types/deposit.ts
export type DepositMethodType = 'card' | 'bank' | 'crypto'

export interface DepositMethod {
  id: DepositMethodType
  name: string
  icon: any
  description: string
  fee: number
  processingTime: string
  color: string
  bgColor: string
  iconColor: string
}

export interface CardDetails {
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  cardBrand?: string
}

export interface CryptoDetails {
  coin: 'bitcoin' | 'ethereum' | 'usdt'
  receiptFile: File | null
  receiptPreview: string | null
  transactionId?: string
}

export interface DepositStats {
  availableBalance: number
  totalDeposits: number
  depositLimit: number
}