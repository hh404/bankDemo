import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'

export function TransferHome() {
  const navigate = useNavigate()

  return (
    <Layout title="Transfer" showBack={false} allowScreenshot>
      <p style={{ color: 'var(--ios-label-secondary)', fontSize: 15, marginBottom: 20 }}>
        Choose transfer type
      </p>
      <div className="ios-group">
        <button
          type="button"
          className="ios-cell"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => navigate('/transfer/from')}
        >
          <div>
            <div className="ios-cell-label">INFT instant transfer</div>
            <div className="ios-cell-value" style={{ marginTop: 2 }}>
              No fee · Real-time
            </div>
          </div>
          <span className="ios-cell-chevron">›</span>
        </button>
        <div className="ios-cell" style={{ opacity: 0.7 }}>
          <div>
            <div className="ios-cell-label">Standard transfer</div>
            <div className="ios-cell-value" style={{ marginTop: 2 }}>
              1–3 business days
            </div>
          </div>
          <span style={{ fontSize: 13, color: 'var(--ios-label-secondary)' }}>Coming soon</span>
        </div>
      </div>
    </Layout>
  )
}
