export interface BankAccount {
  id: string
  name: string
  type: 'savings' | 'current'
  number: string
  balance: number
  currency: string
  status: 'active' | 'frozen' | 'suspended'
  dailyLimit?: number
  usedToday?: number
}

export interface Beneficiary {
  id: string
  name: string
  bankName: string
  bankCode: string
  accountNumber: string
  accountType: 'savings' | 'current'
  isVerified?: boolean
}

export interface TransferState {
  fromAccount: BankAccount | null
  toBeneficiary: Beneficiary | null
  amount: number
  currency: string
  fee: number
  remark: string
  status: 'idle' | 'pending' | 'success' | 'failed'
  refNo: string | null
  errorCode: string | null
  errorMessage: string | null
  completedAt: string | null
}

export type TransferStep = 'from' | 'to' | 'amount' | 'review' | 'result'

export const DAILY_LIMIT_DEFAULT = 50000
export const MIN_AMOUNT = 1
export const MAX_AMOUNT = 50000
export const INFT_FEE = 0
