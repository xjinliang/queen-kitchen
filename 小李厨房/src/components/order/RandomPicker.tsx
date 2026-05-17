import { useState, useEffect, useRef } from 'react'
import { Shuffle } from 'lucide-react'
import type { Dish } from '../../types'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: (dish: Dish) => void
  getRandomDish: () => Dish | null
}

export default function RandomPicker({ open, onClose, onConfirm, getRandomDish }: Props) {
  const [rolling, setRolling] = useState(false)
  const [displayDish, setDisplayDish] = useState<Dish | null>(null)
  const [result, setResult] = useState<Dish | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (open) {
      startRoll()
    } else {
      stopRoll()
    }
    return stopRoll
  }, [open])

  const stopRoll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = undefined
    }
  }

  const startRoll = () => {
    setRolling(true)
    setResult(null)
    const startTime = Date.now()
    const duration = 2500
    const startInterval = 50

    const tick = () => {
      const elapsed = Date.now() - startTime
      if (elapsed >= duration) {
        stopRoll()
        const final = getRandomDish()
        if (final) {
          setDisplayDish(final)
          setResult(final)
        }
        setRolling(false)
        return
      }

      const progress = elapsed / duration
      const interval = startInterval + progress * progress * 200
      setDisplayDish(getRandomDish())

      timerRef.current = setTimeout(tick, interval)
    }

    tick()
  }

  const handleConfirm = () => {
    if (result) {
      onConfirm(result)
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="随机选菜">
      <div className="flex flex-col items-center py-4">
        {/* Rolling display */}
        <div className="w-full bg-warm-50 rounded-2xl p-8 mb-6 flex flex-col items-center gap-3">
          <div className={`text-5xl transition-all ${rolling ? 'scale-110' : 'scale-100'}`}>
            {displayDish?.image_url ? (
              <img src={displayDish.image_url} alt="" className="w-24 h-24 rounded-xl object-cover" />
            ) : (
              '🎲'
            )}
          </div>
          <h3 className={`text-xl font-bold transition-all ${rolling ? 'text-gray-500' : 'text-primary-500'}`}>
            {displayDish?.name || '...'}
          </h3>
          {displayDish && !rolling && (
            <div className="flex gap-2">
              <span className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded">{displayDish.category}</span>
              <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded">{displayDish.difficulty}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="secondary"
            onClick={rolling ? undefined : startRoll}
            disabled={rolling}
            className="flex-1"
          >
            <Shuffle size={18} />
            重新选
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!result || rolling}
            className="flex-1"
          >
            {rolling ? '选菜中...' : '就这个！'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
