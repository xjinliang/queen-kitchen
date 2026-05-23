import { X } from 'lucide-react'
import type { MealPlan, Dish, Profile } from '../../types'

interface Props {
  plan: MealPlan & { dish?: Dish; orderer?: Profile }
  onRemove: () => void
}

export default function SelectedDishItem({ plan, onRemove }: Props) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3">
      <div className="w-12 h-12 rounded-lg bg-warm-100 flex items-center justify-center text-xl shrink-0 overflow-hidden">
        {plan.dish?.image_url ? (
          <img src={plan.dish.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          '🥘'
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm truncate">{plan.dish?.name || '未知菜品'}</p>
        <p className="text-xs text-gray-400">由 {plan.orderer?.nickname || '某人'} 点选</p>
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-400 shrink-0">
        <X size={18} />
      </button>
    </div>
  )
}
