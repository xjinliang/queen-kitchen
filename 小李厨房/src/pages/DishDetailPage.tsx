import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useDishes } from '../hooks/useDishes'
import { useAuth } from '../hooks/useAuth'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

const difficultyColor: Record<string, string> = {
  '简单': 'green',
  '中等': 'orange',
  '困难': 'red',
}

export default function DishDetailPage() {
  const { dishId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getDishById, deleteDish } = useDishes()
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const dish = getDishById(dishId!)

  if (!dish) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteDish(dish.id)
      navigate('/library', { replace: true })
    } catch {
      setDeleting(false)
      setShowDelete(false)
    }
  }

  // Extract steps from recipe text
  const steps = dish.recipe
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/library/${dish.id}/edit`)}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="rounded-2xl overflow-hidden bg-warm-100 mb-4">
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-6xl">
            🥘
          </div>
        )}
      </div>

      {/* Name & meta */}
      <h1 className="text-2xl font-bold text-gray-800">{dish.name}</h1>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge label={dish.category} color="blue" />
        <Badge label={dish.difficulty} color={difficultyColor[dish.difficulty] || 'gray'} />
        {dish.tags.map(tag => (
          <Badge key={tag} label={tag} color="gray" />
        ))}
      </div>

      {/* Recipe */}
      {steps.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-700 mb-2">做法</h3>
          <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-primary-500 font-medium shrink-0">{i + 1}.</span>
                <span className="text-gray-600 text-sm">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Created by */}
      <p className="text-xs text-gray-400 mt-6">
        由 {dish.created_by === user?.id ? '我' : '保洁'} 创建
      </p>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="删除菜品"
        message={`确定要删除「${dish.name}」吗？此操作不可撤销。`}
        confirmLabel="删除"
        loading={deleting}
      />
    </div>
  )
}
