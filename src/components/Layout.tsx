import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { downloadElementAsImage, receiptFilename } from '../utils/downloadImage'

interface LayoutProps {
  title: string
  children: React.ReactNode
  showBack?: boolean
  rightAction?: React.ReactNode
  /** Show "Screenshot" button */
  allowScreenshot?: boolean
}

export function Layout({ title, children, showBack = true, rightAction, allowScreenshot }: LayoutProps) {
  const navigate = useNavigate()
  const layoutRef = useRef<HTMLDivElement>(null)

  const handleDownloadScreen = async () => {
    if (layoutRef.current) {
      await downloadElementAsImage(layoutRef.current, {
        filename: receiptFilename('Screen'),
        scale: 2,
        backgroundColor: 'var(--ios-bg)',
      })
    }
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/transfer')
    }
  }

  return (
    <div
      ref={layoutRef}
      className="layout ios-safe-top ios-safe-bottom"
      style={{
        height: '100%',
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--ios-bg)',
      }}
    >
      <header
        className="nav-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--ios-bg)',
          borderBottom: '0.5px solid var(--ios-separator)',
          flexShrink: 0,
        }}
      >
        <div style={{ width: 80, display: 'flex', justifyContent: 'flex-start' }}>
          {showBack && (
            <button
              type="button"
              onClick={handleBack}
              style={{
                color: 'var(--ios-link)',
                fontSize: 17,
                fontWeight: 400,
                padding: '4px 0',
              }}
            >
              Back
            </button>
          )}
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 600,
            color: 'var(--ios-label)',
          }}
        >
          {title}
        </h1>
        <div style={{ width: 80, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          {allowScreenshot && (
            <button
              type="button"
              onClick={handleDownloadScreen}
              style={{ color: 'var(--ios-link)', fontSize: 15 }}
              title="Download screen"
            >
              Screenshot
            </button>
          )}
          {rightAction}
        </div>
      </header>
      <main
        style={{
          flex: 1,
          minHeight: 0,
          padding: '16px',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
    </div>
  )
}
