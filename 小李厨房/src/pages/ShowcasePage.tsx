import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCookedMeals } from '../hooks/useCookedMeals'
import ShowcaseCard from '../components/showcase/ShowcaseCard'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function ShowcasePage() {
  const navigate = useNavigate()
  const { meals, loading, deleteMeal } = useCookedMeals()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await deleteMeal(deleteId)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      {meals.length === 0 ? (
        <EmptyState
          icon="📸"
          title="还没有成品记录"
          description="做完菜记得拍照留念哦"
          actionLabel="记录第一道菜"
          onAction={() => navigate('/showcase/new')}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {meals.map(meal => (
            <ShowcaseCard
              key={meal.id}
              meal={meal}
              onLongPress={() => setDeleteId(meal.id)}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/showcase/new')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors active:scale-95 z-30"
      >
        <Plus size={28} />
      </button>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="删除记录"
        message="确定要删除这条成品记录吗？"
        confirmLabel="删除"
        loading={deleting}
      />
    </div>
  )
}
