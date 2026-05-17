import { useRealtime } from './useRealtime'
import { supabase } from '../lib/supabase'
import type { Dish, DishInsert } from '../types'

export function useDishes() {
  const fetchDishes = async () => {
    const { data, error } = await supabase
      .from('dishes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data as Dish[]
  }

  const { data: dishes, loading, error, refresh, mutate } = useRealtime<Dish>('dishes', fetchDishes)

  const addDish = async (input: DishInsert): Promise<Dish | null> => {
    const { data, error } = await supabase
      .from('dishes')
      .insert(input)
      .select()
      .single()
    if (error) throw error
    refresh()
    return data as Dish
  }

  const updateDish = async (id: string, input: Partial<DishInsert>) => {
    const { error } = await supabase
      .from('dishes')
      .update(input)
      .eq('id', id)
    if (error) throw error
    refresh()
  }

  const deleteDish = async (id: string) => {
    const { error } = await supabase
      .from('dishes')
      .delete()
      .eq('id', id)
    if (error) throw error
    refresh()
  }

  const getDishById = (id: string) => dishes.find(d => d.id === id)

  return { dishes, loading, error, refresh, mutate, addDish, updateDish, deleteDish, getDishById }
}
