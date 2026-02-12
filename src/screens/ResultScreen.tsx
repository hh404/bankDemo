import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useTransfer } from '../context/TransferContext'
import { downloadElementAsImage, receiptFilename } from '../utils/downloadImage'

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function formatTime(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function ResultScreen() {
  const navigate = useNavigate()
  const { state, reset } = useTransfer()
  const receiptRef = useRef<HTMLDivElement>(null)

  const success = state.status === 'success'
  const { fromAccount, toBeneficiary, amount, currency, refNo, completedAt, errorMessage } = state

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return
    await downloadElementAsImage(receiptRef.current, {
      filename: receiptFilename('INFT_Receipt'),
      scale: 2,
      backgroundColor: '#ffffff',
    })
  }

  const handleDownloadScreen = async () => {
    const wrapper = document.querySelector('.layout')
    if (wrapper && wrapper instanceof HTMLElement) {
      await downloadElementAsImage(wrapper, {
        filename: receiptFilename('INFT_Screen'),
        scale: 2,
        backgroundColor: 'var(--ios-bg)',
      })
    }
  }

  const handleNewTransfer = () => {
    reset()
    navigate('/transfer/from')
  }

  if (!fromAccount && !toBeneficiary && state.status === 'idle') {
    navigate('/transfer/from')
    return null
  }

  return (
    <Layout title={success ? 'Transfer complete' : 'Transfer result'} showBack={!success}>
      <div ref={receiptRef} className="ios-group" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: success ? 'var(--ios-green)' : 'var(--ios-red)',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 28,
            }}
          >
            {success ? '✓' : '✕'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            {success ? 'Transfer successful' : 'Transfer failed'}
          </div>
          {!success && errorMessage && (
            <div style={{ fontSize: 14, color: 'var(--ios-red)', marginTop: 8 }}>
              {errorMessage}
            </div>
          )}
        </div>

        {success && (
          <>
            <div className="ios-cell">
              <span className="ios-cell-label">Amount</span>
              <span className="ios-cell-value" style={{ fontWeight: 600, color: 'var(--ios-label)' }}>
                {formatMoney(amount)} {currency}
              </span>
            </div>
            <div className="ios-cell">
              <span className="ios-cell-label">To</span>
              <span className="ios-cell-value" style={{ textAlign: 'right' }}>
                {toBeneficiary?.name}<br />
                {toBeneficiary?.bankName} {toBeneficiary?.accountNumber}
              </span>
            </div>
            <div className="ios-cell">
              <span className="ios-cell-label">Date & time</span>
              <span className="ios-cell-value">{formatTime(completedAt)}</span>
            </div>
            <div className="ios-cell">
              <span className="ios-cell-label">Reference</span>
              <span className="ios-cell-value">{refNo ?? '—'}</span>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="button"
          onClick={handleDownloadReceipt}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            background: 'var(--ios-group)',
            color: 'var(--ios-link)',
            fontSize: 17,
            fontWeight: 500,
            boxShadow: 'var(--shadow)',
          }}
        >
          Download receipt (image)
        </button>
        <button
          type="button"
          onClick={handleDownloadScreen}
          style={{
            width: '100%',
            padding: 14,
            borderRadius: 12,
            background: 'var(--ios-group)',
            color: 'var(--ios-link)',
            fontSize: 17,
            fontWeight: 500,
            boxShadow: 'var(--shadow)',
          }}
        >
          Download screen
        </button>
        {success && (
          <button
            type="button"
            onClick={handleNewTransfer}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 12,
              background: 'var(--ios-link)',
              color: '#fff',
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            Transfer again
          </button>
        )}
        {!success && (
          <button
            type="button"
            onClick={() => navigate('/transfer/review')}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 12,
              background: 'var(--ios-link)',
              color: '#fff',
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/transfer')}
          style={{
            width: '100%',
            padding: 12,
            color: 'var(--ios-label-secondary)',
            fontSize: 15,
          }}
        >
          Back to transfer
        </button>
      </div>
    </Layout>
  )
}
