import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useDishes } from '../../hooks/useDishes'
import { toDateString } from '../../lib/utils'
import type { CookedMealInsert } from '../../types'
import ImageUploader from '../ui/ImageUploader'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'
import { Star } from 'lucide-react'

interface Props {
  onSubmit: (data: CookedMealInsert) => Promise<void>
  loading: boolean
}

export default function CookedMealForm({ onSubmit, loading }: Props) {
  const { user, profile } = useAuth()
  const { dishes } = useDishes()

  const myName = profile?.nickname || '我'

  const [selectedDishId, setSelectedDishId] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [cookLabel, setCookLabel] = useState(myName)
  const [cookedDate, setCookedDate] = useState(toDateString(new Date()))
  const [rating, setRating] = useState(0)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedDishId) { setError('请选择做了什么菜'); return }
    if (!photoUrl) { setError('请上传成品照片'); return }
    setError('')

    // Store who cooked in notes as a marker for display
    const fullNotes = cookLabel !== myName
      ? `[${cookLabel}做] ${notes}`
      : notes

    await onSubmit({
      dish_id: selectedDishId,
      cooked_by: user!.id,
      photo_url: photoUrl,
      notes: fullNotes,
      rating: rating || null,
      cooked_date: cookedDate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Select dish */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">做了什么菜？</label>
        <select
          value={selectedDishId}
          onChange={e => setSelectedDishId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base bg-white"
          required
        >
          <option value="">点击选择菜品...</option>
          {dishes.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Photo */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">成品照片</label>
        <ImageUploader onUpload={setPhotoUrl} currentUrl={photoUrl} folder="cooked" />
      </div>

      {/* Who cooked */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">谁做的？</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCookLabel(myName)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              cookLabel === myName ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {myName}
          </button>
          <button
            type="button"
            onClick={() => setCookLabel('保洁')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              cookLabel !== myName ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            保洁
          </button>
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">日期</label>
        <input
          type="date"
          value={cookedDate}
          onChange={e => setCookedDate(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-primary-400 text-base"
        />
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm text-gray-500 mb-1">评分</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(rating === i ? 0 : i)}
              className="p-1"
            >
              <Star
                size={28}
                className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label="备注"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="这次做得怎么样？"
      />

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        记录
      </Button>
    </form>
  )
}
