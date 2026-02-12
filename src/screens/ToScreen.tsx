import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useTransfer } from '../context/TransferContext'
import { mockAccounts, mockBeneficiaries } from '../data/mock'
import type { Beneficiary } from '../types'

export function ToScreen() {
  const navigate = useNavigate()
  const { state, setToBeneficiary } = useTransfer()
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fromAccount = state.fromAccount

  useEffect(() => {
    if (!fromAccount) {
      navigate('/transfer/from')
      return
    }
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 400))
        setBeneficiaries(mockBeneficiaries)
      } catch {
        setError('Failed to load beneficiaries. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [fromAccount, navigate])

  const handleSelect = (ben: Beneficiary) => {
    const sameAccount = fromAccount && mockAccounts.some(
      (a) => a.number.replace(/\s/g, '') === ben.accountNumber.replace(/\s/g, '')
    )
    if (sameAccount) return
    setToBeneficiary(ben)
    navigate('/transfer/amount')
  }

  const isSameAccount = (ben: Beneficiary) => {
    if (!fromAccount) return false
    const fromLast4 = fromAccount.number.replace(/\D/g, '').slice(-4)
    const toLast4 = ben.accountNumber.replace(/\D/g, '').slice(-4)
    return fromLast4.length === 4 && toLast4.length === 4 && fromLast4 === toLast4
  }

  if (!fromAccount) return null

  if (loading) {
    return (
      <Layout title="To" allowScreenshot>
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ios-label-secondary)' }}>
          Loading…
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="To" allowScreenshot>
        <div className="ios-group" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--ios-red)', margin: '0 0 16px' }}>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{ color: 'var(--ios-link)', fontSize: 17 }}
          >
            Retry
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="To" allowScreenshot>
      <p style={{ color: 'var(--ios-label-secondary)', fontSize: 15, marginBottom: 16 }}>
        Select or add a beneficiary (same account not allowed)
      </p>
      <div className="ios-group">
        {beneficiaries.length === 0 ? (
          <div className="ios-cell" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className="ios-cell-label">No beneficiaries</div>
            <div className="ios-cell-value" style={{ marginTop: 4 }}>
              Add a beneficiary to make a transfer
            </div>
            <button
              type="button"
              style={{ color: 'var(--ios-link)', marginTop: 12, fontSize: 15 }}
              onClick={() => alert('Demo: use "Add beneficiary" below or visit a branch.')}
            >
              Add beneficiary
            </button>
          </div>
        ) : (
          beneficiaries.map((ben) => {
            const same = isSameAccount(ben)
            const disabled = same
            return (
              <button
                key={ben.id}
                type="button"
                onClick={() => !same && handleSelect(ben)}
                disabled={disabled}
                className="ios-cell"
                style={{
                  width: '100%',
                  textAlign: 'left',
                  opacity: disabled ? 0.6 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="ios-cell-label">{ben.name}</span>
                    {ben.isVerified && (
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--ios-green)',
                          background: 'rgba(52, 199, 89, 0.15)',
                          padding: '2px 6px',
                          borderRadius: 4,
                        }}
                      >
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="ios-cell-value" style={{ marginTop: 2 }}>
                    {ben.bankName} {ben.accountNumber}
                  </div>
                  {same && (
                    <div style={{ fontSize: 13, color: 'var(--ios-orange)', marginTop: 4 }}>
                      Cannot transfer to self
                    </div>
                  )}
                </div>
                {!disabled && (
                  <span className="ios-cell-chevron">
                    {state.toBeneficiary?.id === ben.id ? '✓' : '›'}
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>
      <button
        type="button"
        style={{
          marginTop: 16,
          color: 'var(--ios-link)',
          fontSize: 17,
        }}
        onClick={() => navigate('/transfer/amount')}
      >
        + Add beneficiary
      </button>
    </Layout>
  )
}
