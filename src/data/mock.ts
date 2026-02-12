import type { BankAccount, Beneficiary } from '../types'

const baseAccounts: BankAccount[] = [
  {
    id: 'acc-1',
    name: 'Savings',
    type: 'savings',
    number: '**** 8821',
    balance: 125680.5,
    currency: 'CNY',
    status: 'active',
    dailyLimit: 50000,
    usedToday: 0,
  },
  {
    id: 'acc-2',
    name: 'Current',
    type: 'current',
    number: '**** 3342',
    balance: 8920,
    currency: 'CNY',
    status: 'active',
    dailyLimit: 100000,
    usedToday: 12000,
  },
  {
    id: 'acc-3',
    name: 'Payroll',
    type: 'savings',
    number: '**** 5567',
    balance: 0,
    currency: 'CNY',
    status: 'active',
    dailyLimit: 50000,
    usedToday: 0,
  },
  {
    id: 'acc-4',
    name: 'Savings Plus',
    type: 'savings',
    number: '**** 2234',
    balance: 45000,
    currency: 'CNY',
    status: 'active',
    dailyLimit: 50000,
    usedToday: 0,
  },
  {
    id: 'acc-5',
    name: 'Current USD',
    type: 'current',
    number: '**** 7788',
    balance: 3200,
    currency: 'USD',
    status: 'active',
    dailyLimit: 20000,
    usedToday: 0,
  },
  {
    id: 'acc-6',
    name: 'Joint Account',
    type: 'savings',
    number: '**** 9900',
    balance: 88000,
    currency: 'CNY',
    status: 'active',
    dailyLimit: 100000,
    usedToday: 5000,
  },
  {
    id: 'acc-7',
    name: 'Frozen Savings',
    type: 'savings',
    number: '**** 1122',
    balance: 15000,
    currency: 'CNY',
    status: 'frozen',
    dailyLimit: 50000,
    usedToday: 0,
  },
  {
    id: 'acc-8',
    name: 'Suspended',
    type: 'current',
    number: '**** 3344',
    balance: 200,
    currency: 'CNY',
    status: 'suspended',
    dailyLimit: 50000,
    usedToday: 0,
  },
]

/** Returns accounts list; use emptyList=true (e.g. from ?from=empty) to simulate no accounts */
export function getMockAccounts(emptyList?: boolean): BankAccount[] {
  if (emptyList) return []
  return baseAccounts
}

export const mockAccounts = baseAccounts

export const mockBeneficiaries: Beneficiary[] = [
  {
    id: 'ben-1',
    name: 'John Smith',
    bankName: 'First National Bank',
    bankCode: 'ICBC',
    accountNumber: '6222 **** **** 1234',
    accountType: 'savings',
    isVerified: true,
  },
  {
    id: 'ben-2',
    name: 'Jane Doe',
    bankName: 'City Bank',
    bankCode: 'CCB',
    accountNumber: '6217 **** **** 5678',
    accountType: 'current',
    isVerified: true,
  },
  {
    id: 'ben-3',
    name: 'Bob Wilson',
    bankName: 'Merchant Bank',
    bankCode: 'CMB',
    accountNumber: '6225 **** **** 9012',
    accountType: 'savings',
    isVerified: false,
  },
  {
    id: 'ben-self',
    name: 'Myself',
    bankName: 'Same bank',
    bankCode: 'SAME',
    accountNumber: '**** **** **** 8821',
    accountType: 'savings',
    isVerified: true,
  },
]
