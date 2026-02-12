import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useTransfer } from '../context/TransferContext'
import {
  MIN_AMOUNT,
  MAX_AMOUNT,
  DAILY_LIMIT_DEFAULT,
  INFT_FEE,
} from '../types'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n)
}

export function AmountScreen() {
  const navigate = useNavigate()
  const { state, setAmount } = useTransfer()
  const [input, setInput] = useState('')
  const [touched, setTouched] = useState(false)

  const fromAccount = state.fromAccount
  const toBeneficiary = state.toBeneficiary

  const amount = useMemo(() => {
    const s = input.replace(/,/g, '').trim()
    if (!s) return 0
    const n = parseFloat(s)
    return Number.isNaN(n) ? 0 : n
  }, [input])

  const dailyRemaining = fromAccount
    ? (fromAccount.dailyLimit ?? DAILY_LIMIT_DEFAULT) - (fromAccount.usedToday ?? 0)
    : MAX_AMOUNT

  const balance = fromAccount?.balance ?? 0
  const maxByBalance = balance
  const maxByDaily = Math.max(0, dailyRemaining)
  const effectiveMax = Math.min(MAX_AMOUNT, maxByBalance, maxByDaily)

  const errors: string[] = []
  if (amount > 0) {
    if (amount < MIN_AMOUNT) errors.push(`Minimum ${MIN_AMOUNT} ${state.currency}`)
    if (amount > effectiveMax) {
      if (amount > balance) errors.push('Insufficient balance')
      else if (amount > dailyRemaining) errors.push('Exceeds daily limit')
      else errors.push(`Maximum ${formatMoney(MAX_AMOUNT)} ${state.currency}`)
    }
  }

  const canProceed = amount >= MIN_AMOUNT && amount <= effectiveMax && amount <= balance

  const handleNext = () => {
    setTouched(true)
    if (!canProceed) return
    setAmount(amount)
    navigate('/transfer/review')
  }

  const setMax = () => {
    const v = Math.min(maxByBalance, maxByDaily, MAX_AMOUNT)
    setInput(String(v))
    setTouched(true)
  }

  if (!fromAccount || !toBeneficiary) {
    navigate('/transfer/from')
    return null
  }

  return (
    <Layout title="Amount" allowScreenshot>
      <p style={{ color: 'var(--ios-label-secondary)', fontSize: 15, marginBottom: 8 }}>
        To: {toBeneficiary.name} · {toBeneficiary.bankName}
      </p>
      <div
        className="ios-group"
        style={{
          padding: '24px 16px',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 15, color: 'var(--ios-label-secondary)', marginBottom: 8 }}>
          Amount ({state.currency})
        </div>
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          value={input}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d.]/g, '')
            const parts = v.split('.')
            if (parts.length > 2) return
            if (parts[1]?.length > 2) return
            setInput(v)
            setTouched(true)
          }}
          onBlur={() => setTouched(true)}
          style={{
            width: '100%',
            fontSize: 32,
            fontWeight: 600,
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            outline: 'none',
            color: 'var(--ios-label)',
          }}
        />
        <div style={{ fontSize: 13, color: 'var(--ios-label-secondary)', marginTop: 8 }}>
          Fee: {formatMoney(INFT_FEE)} (INFT free)
        </div>
      </div>

      {touched && errors.length > 0 && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            background: 'rgba(255, 59, 48, 0.1)',
            borderRadius: 8,
            color: 'var(--ios-red)',
            fontSize: 14,
          }}
        >
          {errors.join('; ')}
        </div>
      )}

      <div className="ios-group" style={{ marginBottom: 24 }}>
        <div className="ios-cell">
          <span className="ios-cell-label">Available balance</span>
          <span className="ios-cell-value">{formatMoney(balance)}</span>
        </div>
        <div className="ios-cell">
          <span className="ios-cell-label">Daily limit remaining</span>
          <span className="ios-cell-value">{formatMoney(Math.max(0, dailyRemaining))}</span>
        </div>
        <button
          type="button"
          className="ios-cell"
          style={{ width: '100%', textAlign: 'left', color: 'var(--ios-link)' }}
          onClick={setMax}
        >
          <span className="ios-cell-label">Transfer all</span>
          <span className="ios-cell-chevron">›</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canProceed}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 12,
          background: canProceed ? 'var(--ios-link)' : 'var(--ios-separator)',
          color: '#fff',
          fontSize: 17,
          fontWeight: 600,
          opacity: canProceed ? 1 : 0.6,
          cursor: canProceed ? 'pointer' : 'not-allowed',
        }}
      >
        Next
      </button>
    </Layout>
  )
}
