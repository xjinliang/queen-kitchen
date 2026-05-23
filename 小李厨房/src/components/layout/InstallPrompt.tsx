import { useState, useEffect } from 'react'
import { X, Share2 } from 'lucide-react'

declare global {
  interface Navigator {
    standalone?: boolean
  }
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferred, setDeferred] = useState<any>(null)

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (navigator.standalone) return

    // Listen for Chrome beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    // Fallback: show after 3 seconds on Android (Huawei may not fire beforeinstallprompt)
    const isAndroid = /android/i.test(navigator.userAgent)
    const timer = isAndroid ? setTimeout(() => {
      if (!sessionStorage.getItem('install-dismissed')) {
        setShow(true)
      }
    }, 3000) : undefined

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (deferred) {
      deferred.prompt()
      const result = await deferred.userChoice
      if (result.outcome === 'accepted') setShow(false)
    } else {
      // Fallback: show instructions
      setShow(false)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    sessionStorage.setItem('install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-3 flex items-center gap-3 animate-slide-up">
      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
        <Share2 size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">添加到主屏幕</p>
        <p className="text-xs text-white/70">像 App 一样使用，体验更好</p>
      </div>
      <button
        onClick={handleInstall}
        className="text-sm bg-white text-primary-500 px-4 py-1.5 rounded-lg font-medium shrink-0"
      >
        添加
      </button>
      <button onClick={handleDismiss} className="text-white/70 shrink-0">
        <X size={18} />
      </button>
    </div>
  )
}
