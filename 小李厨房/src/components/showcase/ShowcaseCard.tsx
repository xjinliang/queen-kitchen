import { useRef, useCallback } from 'react'
import type { CookedMeal, Dish, Profile } from '../../types'
import { formatDate } from '../../lib/utils'
import { Star } from 'lucide-react'

interface Props {
  meal: CookedMeal & { dish?: Dish; cook?: Profile }
  onLongPress?: () => void
}

export default function ShowcaseCard({ meal, onLongPress }: Props) {
  const date = new Date(meal.cooked_date + 'T00:00:00')
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const cookMatch = meal.notes?.match(/^\[(.+?)做\]\s*/)
  const cookLabel = cookMatch ? cookMatch[1] : (meal.cook?.nickname || '某人')
  const displayNotes = meal.notes?.replace(/^\[.+?做\]\s*/, '') || ''

  const onTouchStart = useCallback(() => {
    if (onLongPress) {
      timerRef.current = setTimeout(() => {
        onLongPress()
      }, 600)
    }
  }, [onLongPress])

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }
  }, [])

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchMove={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
    >
      <div className="aspect-square bg-warm-100 overflow-hidden">
        <img src={meal.photo_url} alt={meal.dish?.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm">{meal.dish?.name || '未知菜品'}</h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{cookLabel}</span>
          {meal.rating && (
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-500">
              {Array.from({ length: meal.rating }).map((_, i) => (
                <Star key={i} size={10} fill="currentColor" />
              ))}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-300">{formatDate(date)}</span>
        </div>

        {displayNotes && (
          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{displayNotes}</p>
        )}
      </div>
    </div>
  )
}
