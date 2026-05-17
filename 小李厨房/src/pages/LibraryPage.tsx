import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useDishes } from '../hooks/useDishes'
import DishCard from '../components/dishes/DishCard'
import CategoryFilter from '../components/dishes/CategoryFilter'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function LibraryPage() {
  const navigate = useNavigate()
  const { dishes, loading } = useDishes()
  const [category, setCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!category) return dishes
    return dishes.filter(d => d.category === category)
  }, [dishes, category])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <CategoryFilter selected={category} onSelect={setCategory} />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title={dishes.length === 0 ? '还没有菜品' : '该分类下暂无菜品'}
          description={dishes.length === 0 ? '点击下方按钮添加第一道菜吧' : undefined}
          actionLabel={dishes.length === 0 ? '添加菜品' : undefined}
          onAction={dishes.length === 0 ? () => navigate('/library/new') : undefined}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {filtered.map(dish => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={() => navigate(`/library/${dish.id}`)}
            />
          ))}
        </div>
      )}

      {/* FAB - Add dish */}
      <button
        onClick={() => navigate('/library/new')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors active:scale-95 z-30"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
