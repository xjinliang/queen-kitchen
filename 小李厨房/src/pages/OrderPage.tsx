import { useState } from 'react'
import { Plus, Shuffle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useMealPlans } from '../hooks/useMealPlans'
import { toDateString } from '../lib/utils'
import type { MealType, Dish } from '../types'
import DateSelector from '../components/order/DateSelector'
import MealTypeTab from '../components/order/MealTypeTab'
import SelectedDishItem from '../components/order/SelectedDishItem'
import DishSearchSelect from '../components/order/DishSearchSelect'
import RandomPicker from '../components/order/RandomPicker'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function OrderPage() {
  const { user } = useAuth()
  const [date, setDate] = useState(new Date())
  const [mealType, setMealType] = useState<MealType>('午餐')
  const [showSearch, setShowSearch] = useState(false)
  const [showRandom, setShowRandom] = useState(false)

  const dateStr = toDateString(date)
  const { plans, loading, addDish, removeDish, getRandomDish } = useMealPlans(dateStr, mealType)

  const selectedIds = plans.map(p => p.dish_id)

  const handleRandomConfirm = (dish: Dish) => {
    addDish(dish.id, user!.id)
  }

  return (
    <div>
      <DateSelector date={date} onChange={setDate} />
      <div className="mt-4">
        <MealTypeTab active={mealType} onChange={setMealType} />
      </div>

      <div className="mt-4 space-y-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : plans.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="还没选菜呢"
            description={`今天${mealType}想吃什么？`}
          />
        ) : (
          plans.map(plan => (
            <SelectedDishItem
              key={plan.id}
              plan={plan}
              onRemove={() => removeDish(plan.id)}
            />
          ))
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setShowSearch(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium active:bg-gray-50 transition-colors"
        >
          <Plus size={18} />
          添加菜品
        </button>
        <button
          onClick={() => setShowRandom(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-xl font-medium active:bg-primary-600 transition-colors"
        >
          <Shuffle size={18} />
          随机选菜
        </button>
      </div>

      <DishSearchSelect
        open={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={(dishId) => addDish(dishId, user!.id)}
        selectedIds={selectedIds}
      />

      <RandomPicker
        open={showRandom}
        onClose={() => setShowRandom(false)}
        onConfirm={handleRandomConfirm}
        getRandomDish={() => getRandomDish(selectedIds)}
      />
    </div>
  )
}
