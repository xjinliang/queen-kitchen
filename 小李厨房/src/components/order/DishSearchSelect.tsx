import { useState } from 'react'
import { Search } from 'lucide-react'
import { useDishes } from '../../hooks/useDishes'
import Modal from '../ui/Modal'

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (dishId: string) => void
  selectedIds: string[]
}

export default function DishSearchSelect({ open, onClose, onSelect, selectedIds }: Props) {
  const [search, setSearch] = useState('')
  const { dishes } = useDishes()

  const filtered = dishes.filter(d => {
    const matchSearch = !search || d.name.includes(search)
    return matchSearch
  })

  return (
    <Modal open={open} onClose={onClose} title="选择菜品">
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜索菜品..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base"
          autoFocus
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          {search ? '没有找到匹配的菜品' : '菜品库为空，请先添加菜品'}
        </p>
      ) : (
        <div className="space-y-1 max-h-60 overflow-y-auto">
          {filtered.map(dish => {
            const selected = selectedIds.includes(dish.id)
            return (
              <button
                key={dish.id}
                onClick={() => { onSelect(dish.id); onClose() }}
                disabled={selected}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                  selected
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    : 'hover:bg-warm-50 active:bg-warm-100'
                }`}
              >
                <span className="text-xl shrink-0">
                  {dish.image_url ? (
                    <img src={dish.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    '🥘'
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-gray-800 text-sm">{dish.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{dish.category}</span>
                </div>
                {selected && <span className="text-xs text-gray-300">已选</span>}
              </button>
            )
          })}
        </div>
      )}
    </Modal>
  )
}
