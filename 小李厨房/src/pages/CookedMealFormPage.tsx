import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCookedMeals } from '../hooks/useCookedMeals'
import CookedMealForm from '../components/showcase/CookedMealForm'
import type { CookedMealInsert } from '../types'

export default function CookedMealFormPage() {
  const navigate = useNavigate()
  const { addMeal } = useCookedMeals()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: CookedMealInsert) => {
    setSubmitting(true)
    try {
      await addMeal(data)
      navigate('/showcase', { replace: true })
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-lg font-semibold">记录做菜</h2>
      </div>
      <CookedMealForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  )
}
