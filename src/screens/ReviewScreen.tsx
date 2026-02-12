import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useTransfer } from '../context/TransferContext'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function ReviewScreen() {
  const navigate = useNavigate()
  const { state, setRemark, submitTransfer } = useTransfer()
  const [remark, setRemarkLocal] = useState(state.remark)
  const [submitting, setSubmitting] = useState(false)

  const { fromAccount, toBeneficiary, amount, currency } = state

  const handleSubmit = async () => {
    setRemark(remark)
    setSubmitting(true)
    try {
      await submitTransfer()
      navigate('/transfer/result')
    } finally {
      setSubmitting(false)
    }
  }

  if (!fromAccount || !toBeneficiary || amount <= 0) {
    navigate('/transfer/from')
    return null
  }

  return (
    <Layout title="Review" allowScreenshot>
      <div className="ios-group" style={{ marginBottom: 16 }}>
        <div className="ios-cell">
          <span className="ios-cell-label">From</span>
          <span className="ios-cell-value" style={{ textAlign: 'right' }}>
            {fromAccount.name}<br />
            {fromAccount.number}
          </span>
        </div>
        <div className="ios-cell">
          <span className="ios-cell-label">To</span>
          <span className="ios-cell-value" style={{ textAlign: 'right' }}>
            {toBeneficiary.name}<br />
            {toBeneficiary.bankName} {toBeneficiary.accountNumber}
          </span>
        </div>
        <div className="ios-cell">
          <span className="ios-cell-label">Amount</span>
          <span className="ios-cell-value" style={{ fontWeight: 600, color: 'var(--ios-label)' }}>
            {formatMoney(amount)} {currency}
          </span>
        </div>
        <div className="ios-cell">
          <span className="ios-cell-label">Remark</span>
          <input
            type="text"
            placeholder="Optional"
            maxLength={20}
            value={remark}
            onChange={(e) => setRemarkLocal(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              textAlign: 'right',
              outline: 'none',
              color: 'var(--ios-label)',
              fontSize: 15,
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ios-label-secondary)', marginBottom: 24 }}>
        Funds will be transferred instantly. Please verify the recipient.
      </p>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: 12,
          background: submitting ? 'var(--ios-separator)' : 'var(--ios-link)',
          color: '#fff',
          fontSize: 17,
          fontWeight: 600,
          cursor: submitting ? 'wait' : 'pointer',
        }}
      >
        {submitting ? 'Processing…' : 'Confirm transfer'}
      </button>

      <button
        type="button"
        style={{
          width: '100%',
          marginTop: 12,
          padding: 12,
          color: 'var(--ios-label-secondary)',
          fontSize: 15,
        }}
        onClick={() => navigate(-1)}
      >
        Back to edit
      </button>
    </Layout>
  )
}
