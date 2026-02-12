import { Routes, Route, Navigate } from 'react-router-dom'
import { TransferProvider } from './context/TransferContext'
import { FromScreen } from './screens/FromScreen'
import { ToScreen } from './screens/ToScreen'
import { AmountScreen } from './screens/AmountScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { ResultScreen } from './screens/ResultScreen'
import { TransferHome } from './screens/TransferHome'

function TransferFlow() {
  return (
    <Routes>
      <Route path="/" element={<TransferHome />} />
      <Route path="/from" element={<FromScreen />} />
      <Route path="/to" element={<ToScreen />} />
      <Route path="/amount" element={<AmountScreen />} />
      <Route path="/review" element={<ReviewScreen />} />
      <Route path="/result" element={<ResultScreen />} />
      <Route path="*" element={<Navigate to="/transfer" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <TransferProvider>
      <div style={{ maxWidth: 420, margin: '0 auto', height: '100%', minHeight: '100%', background: 'var(--ios-bg)' }}>
        <Routes>
          <Route path="/transfer/*" element={<TransferFlow />} />
          <Route path="/" element={<Navigate to="/transfer" replace />} />
          <Route path="*" element={<Navigate to="/transfer" replace />} />
        </Routes>
      </div>
    </TransferProvider>
  )
}
