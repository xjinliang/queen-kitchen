import type { Dish } from '../../types'
import Badge from '../ui/Badge'

const difficultyColor: Record<string, string> = {
  '简单': 'green',
  '中等': 'orange',
  '困难': 'red',
}

export default function DishCard({ dish, onClick }: { dish: Dish; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="aspect-[4/3] bg-warm-100 flex items-center justify-center overflow-hidden">
        {dish.image_url ? (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-3xl">🥘</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm truncate">{dish.name}</h3>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <Badge label={dish.category} color="blue" />
          <Badge label={dish.difficulty} color={difficultyColor[dish.difficulty] || 'gray'} />
          {dish.tags.slice(0, 2).map(tag => (
            <Badge key={tag} label={tag} color="gray" />
          ))}
          {dish.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{dish.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  )
}
