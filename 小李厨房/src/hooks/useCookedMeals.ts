import { useRealtime } from './useRealtime'
import { supabase } from '../lib/supabase'
import type { CookedMeal, CookedMealInsert, Dish, Profile } from '../types'

type CookedMealFull = CookedMeal & { dish: Dish; cook: Profile }

export function useCookedMeals() {
  const fetchMeals = async () => {
    const { data, error } = await supabase
      .from('cooked_meals')
      .select('*, dish:dishes(*), cook:profiles!cooked_by(*)')
      .order('cooked_date', { ascending: false })
    if (error) throw error
    return data as CookedMealFull[]
  }

  const { data: meals, loading, error, refresh } = useRealtime<CookedMealFull>(
    'cooked_meals',
    fetchMeals
  )

  const addMeal = async (input: CookedMealInsert) => {
    const { error } = await supabase
      .from('cooked_meals')
      .insert(input)
    if (error) throw error
    refresh()
  }

  const deleteMeal = async (id: string) => {
    const { error } = await supabase
      .from('cooked_meals')
      .delete()
      .eq('id', id)
    if (error) throw error
    refresh()
  }

  return { meals, loading, error, refresh, addMeal, deleteMeal }
}
