import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useDishes } from '../hooks/useDishes'
import { useAuth } from '../hooks/useAuth'
import DishForm from '../components/dishes/DishForm'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import type { DishInsert } from '../types'

export default function DishFormPage() {
  const { dishId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { getDishById, addDish, updateDish } = useDishes()
  const [submitting, setSubmitting] = useState(false)

  const isEdit = !!dishId
  const dish = isEdit ? getDishById(dishId) : null

  // If editing and dish loaded, redirect if not found
  useEffect(() => {
    if (isEdit && dish === undefined) {
      // Wait for dishes to load; getDishById returns undefined when data not yet loaded
      // vs null when data loaded but not found
    }
  }, [isEdit, dish])

  const handleSubmit = async (data: DishInsert) => {
    setSubmitting(true)
    try {
      const input = { ...data, created_by: user!.id }
      if (isEdit) {
        await updateDish(dishId!, input)
      } else {
        await addDish(input)
      }
      navigate(isEdit ? `/library/${dishId}` : '/library', { replace: true })
    } catch (e: any) {
      throw e
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-semibold">{isEdit ? '编辑菜品' : '添加菜品'}</h2>
      </div>

      {isEdit && !dish ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <DishForm initial={dish} onSubmit={handleSubmit} loading={submitting} />
      )}
    </div>
  )
}
