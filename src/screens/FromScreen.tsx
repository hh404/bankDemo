import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useTransfer } from '../context/TransferContext'
import { getMockAccounts } from '../data/mock'
import type { BankAccount } from '../types'

function formatBalance(balance: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'CNY' ? 'CNY' : currency,
    minimumFractionDigits: 2,
  }).format(balance)
}

export function FromScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { state, setFromAccount } = useTransfer()
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const emptyDemo = searchParams.get('from') === 'empty'

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        await new Promise((r) => setTimeout(r, 600))
        const list = getMockAccounts(emptyDemo)
        setAccounts(list)
      } catch {
        setError('Failed to load accounts. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [emptyDemo])

  const handleSelect = (account: BankAccount) => {
    if (account.status !== 'active') return
    setFromAccount(account)
    navigate('/transfer/to')
  }

  if (loading) {
    return (
      <Layout title="From Account" allowScreenshot>
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ios-label-secondary)' }}>
          <div style={{ marginBottom: 12 }}>Loading…</div>
          <div style={{ fontSize: 14 }}>Fetching your accounts</div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="From Account" allowScreenshot>
        <div className="ios-group" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--ios-red)', margin: '0 0 16px' }}>{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              color: 'var(--ios-link)',
              fontSize: 17,
            }}
          >
            Retry
          </button>
        </div>
      </Layout>
    )
  }

  if (accounts.length === 0) {
    return (
      <Layout title="From Account" allowScreenshot>
        <div
          className="ios-group"
          style={{
            padding: 32,
            textAlign: 'center',
            marginTop: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--ios-separator)',
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ios-label-secondary)',
              fontSize: 28,
            }}
          >
            —
          </div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>No accounts</div>
          <p style={{ color: 'var(--ios-label-secondary)', fontSize: 15, margin: '0 0 20px' }}>
            You don’t have any accounts yet. Open an account to start transferring.
          </p>
          <button
            type="button"
            onClick={() => alert('Demo: open account flow would start here.')}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              background: 'var(--ios-link)',
              color: '#fff',
              fontSize: 17,
              fontWeight: 500,
            }}
          >
            Open an account
          </button>
          <p style={{ fontSize: 13, color: 'var(--ios-label-secondary)', marginTop: 16 }}>
            Demo: add <code style={{ background: 'var(--ios-bg)', padding: '2px 6px', borderRadius: 4 }}>?from=empty</code> to URL to see this state.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="From Account" allowScreenshot>
      <p style={{ color: 'var(--ios-label-secondary)', fontSize: 15, marginBottom: 16 }}>
        Choose the account to debit
      </p>
      <div className="ios-group">
        {accounts.map((acc) => {
          const disabled = acc.status !== 'active'
          const isSelected = state.fromAccount?.id === acc.id
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => handleSelect(acc)}
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
                <div className="ios-cell-label">{acc.name}</div>
                <div className="ios-cell-value" style={{ marginTop: 2 }}>
                  {acc.number} · {formatBalance(acc.balance, acc.currency)}
                </div>
                {acc.status === 'frozen' && (
                  <div style={{ fontSize: 13, color: 'var(--ios-orange)', marginTop: 4 }}>
                    Frozen
                  </div>
                )}
                {acc.status === 'suspended' && (
                  <div style={{ fontSize: 13, color: 'var(--ios-red)', marginTop: 4 }}>
                    Suspended
                  </div>
                )}
                {acc.balance === 0 && acc.status === 'active' && (
                  <div style={{ fontSize: 13, color: 'var(--ios-orange)', marginTop: 4 }}>
                    Insufficient balance
                  </div>
                )}
              </div>
              {!disabled && (
                <span className="ios-cell-chevron">{isSelected ? '✓' : '›'}</span>
              )}
            </button>
          )
        })}
      </div>
      <p style={{ fontSize: 13, color: 'var(--ios-label-secondary)', marginTop: 16 }}>
        INFT transfers are instant. Limits are set per account.
      </p>
    </Layout>
  )
}
