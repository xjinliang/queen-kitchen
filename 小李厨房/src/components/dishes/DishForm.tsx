import { useState, type FormEvent } from 'react'
import type { Dish, DishInsert } from '../../types'
import { CATEGORIES, DIFFICULTIES } from '../../lib/constants'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import ImageUploader from '../ui/ImageUploader'
import TagSelector from './TagSelector'

interface Props {
  initial?: Dish | null
  onSubmit: (data: DishInsert) => Promise<void>
  loading: boolean
}

export default function DishForm({ initial, onSubmit, loading }: Props) {
  const [name, setName] = useState(initial?.name || '')
  const [category, setCategory] = useState(initial?.category || '热菜')
  const [difficulty, setDifficulty] = useState(initial?.difficulty || '简单')
  const [recipe, setRecipe] = useState(initial?.recipe || '')
  const [imageUrl, setImageUrl] = useState(initial?.image_url || '')
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('请输入菜品名称')
      return
    }
    setError('')
    await onSubmit({
      name: name.trim(),
      category: category as DishInsert['category'],
      difficulty: difficulty as DishInsert['difficulty'],
      recipe,
      image_url: imageUrl || null,
      tags,
      created_by: initial?.created_by || '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="菜品名称"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="例：红烧肉"
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="分类"
          value={category}
          onChange={e => setCategory(e.target.value)}
          options={CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
        />
        <Select
          label="难度"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          options={DIFFICULTIES.map(d => ({ value: d.value, label: d.label }))}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">图片</label>
        <ImageUploader
          currentUrl={imageUrl}
          onUpload={setImageUrl}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-1">标签</label>
        <TagSelector selected={tags} onChange={setTags} />
      </div>

      <Textarea
        label="做法 / 步骤"
        value={recipe}
        onChange={e => setRecipe(e.target.value)}
        placeholder="1. 准备食材...&#10;2. ..."
      />

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <Button type="submit" loading={loading} className="w-full">
        {initial ? '保存修改' : '添加菜品'}
      </Button>
    </form>
  )
}
