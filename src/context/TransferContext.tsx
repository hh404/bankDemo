import { createContext, useContext, useReducer, useCallback } from 'react'
import type { BankAccount, Beneficiary, TransferState } from '../types'

const initialState: TransferState = {
  fromAccount: null,
  toBeneficiary: null,
  amount: 0,
  currency: 'CNY',
  fee: 0,
  remark: '',
  status: 'idle',
  refNo: null,
  errorCode: null,
  errorMessage: null,
  completedAt: null,
}

type Action =
  | { type: 'SET_FROM'; payload: BankAccount | null }
  | { type: 'SET_TO'; payload: Beneficiary | null }
  | { type: 'SET_AMOUNT'; payload: number }
  | { type: 'SET_REMARK'; payload: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: { refNo: string } }
  | { type: 'SUBMIT_FAIL'; payload: { errorCode: string; errorMessage: string } }
  | { type: 'RESET' }

function transferReducer(state: TransferState, action: Action): TransferState {
  switch (action.type) {
    case 'SET_FROM':
      return { ...state, fromAccount: action.payload }
    case 'SET_TO':
      return { ...state, toBeneficiary: action.payload }
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload }
    case 'SET_REMARK':
      return { ...state, remark: action.payload }
    case 'SUBMIT_START':
      return { ...state, status: 'pending', errorCode: null, errorMessage: null }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        status: 'success',
        refNo: action.payload.refNo,
        completedAt: new Date().toISOString(),
        errorCode: null,
        errorMessage: null,
      }
    case 'SUBMIT_FAIL':
      return {
        ...state,
        status: 'failed',
        errorCode: action.payload.errorCode,
        errorMessage: action.payload.errorMessage,
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const TransferContext = createContext<{
  state: TransferState
  setFromAccount: (a: BankAccount | null) => void
  setToBeneficiary: (b: Beneficiary | null) => void
  setAmount: (n: number) => void
  setRemark: (s: string) => void
  submitTransfer: () => Promise<void>
  reset: () => void
} | null>(null)

export function TransferProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(transferReducer, initialState)

  const setFromAccount = useCallback((a: BankAccount | null) => {
    dispatch({ type: 'SET_FROM', payload: a })
  }, [])
  const setToBeneficiary = useCallback((b: Beneficiary | null) => {
    dispatch({ type: 'SET_TO', payload: b })
  }, [])
  const setAmount = useCallback((n: number) => {
    dispatch({ type: 'SET_AMOUNT', payload: n })
  }, [])
  const setRemark = useCallback((s: string) => {
    dispatch({ type: 'SET_REMARK', payload: s })
  }, [])

  const submitTransfer = useCallback(async () => {
    dispatch({ type: 'SUBMIT_START' })
    // 模拟网络延迟与随机成功/失败（便于测试失败 case）
    await new Promise((r) => setTimeout(r, 1500))
    if (Math.random() > 0.85) {
      dispatch({
        type: 'SUBMIT_FAIL',
        payload: {
          errorCode: 'SERVICE_UNAVAILABLE',
          errorMessage: 'INFT service is temporarily unavailable. Please try again later.',
        },
      })
      return
    }
    const refNo = 'INFT' + Date.now().toString(36).toUpperCase()
    dispatch({ type: 'SUBMIT_SUCCESS', payload: { refNo } })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  return (
    <TransferContext.Provider
      value={{
        state,
        setFromAccount,
        setToBeneficiary,
        setAmount,
        setRemark,
        submitTransfer,
        reset,
      }}
    >
      {children}
    </TransferContext.Provider>
  )
}

export function useTransfer() {
  const ctx = useContext(TransferContext)
  if (!ctx) throw new Error('useTransfer must be used within TransferProvider')
  return ctx
}
