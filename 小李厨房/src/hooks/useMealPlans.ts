import { useRealtime } from './useRealtime'
import { supabase } from '../lib/supabase'
import { useDishes } from './useDishes'
import type { MealPlan, MealType, Dish } from '../types'

export function useMealPlans(date: string, mealType: MealType) {
  const { dishes } = useDishes()

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*, dish:dishes(*), orderer:profiles!ordered_by(*)')
      .eq('plan_date', date)
      .eq('meal_type', mealType)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data as (MealPlan & { dish: Dish })[]
  }

  const { data: plans, loading, error, refresh } = useRealtime<MealPlan & { dish: Dish }>(
    'meal_plans',
    fetchPlans,
    [date, mealType]
  )

  const addDish = async (dishId: string, orderedBy: string) => {
    const { error } = await supabase
      .from('meal_plans')
      .insert({
        dish_id: dishId,
        plan_date: date,
        meal_type: mealType,
        ordered_by: orderedBy,
      })
    if (error) throw error
    refresh()
  }

  const removeDish = async (planId: string) => {
    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', planId)
    if (error) throw error
    refresh()
  }

  const isDishSelected = (dishId: string) => plans.some(p => p.dish_id === dishId)

  const getRandomDish = (excludeIds: string[]): Dish | null => {
    const available = dishes.filter(d => !excludeIds.includes(d.id))
    if (available.length === 0) return null
    return available[Math.floor(Math.random() * available.length)]
  }

  return { plans, loading, error, refresh, addDish, removeDish, isDishSelected, getRandomDish }
}
