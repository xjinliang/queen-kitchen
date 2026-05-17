export type DishCategory = '热菜' | '凉菜' | '主食' | '汤' | '甜品' | '早餐' | '其他'
export type Difficulty = '简单' | '中等' | '困难'
export type MealType = '午餐' | '晚餐'

export interface Profile {
  id: string
  nickname: string
  avatar_url: string | null
  created_at: string
}

export interface Dish {
  id: string
  name: string
  category: DishCategory
  difficulty: Difficulty
  recipe: string
  image_url: string | null
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface DishInsert {
  name: string
  category: DishCategory
  difficulty: Difficulty
  recipe: string
  image_url: string | null
  tags: string[]
  created_by: string
}

export interface MealPlan {
  id: string
  dish_id: string
  plan_date: string
  meal_type: MealType
  ordered_by: string
  created_at: string
  dish?: Dish
  orderer?: Profile
}

export interface CookedMeal {
  id: string
  dish_id: string
  cooked_by: string
  photo_url: string
  notes: string
  rating: number | null
  cooked_date: string
  created_at: string
  dish?: Dish
  cook?: Profile
}

export interface CookedMealInsert {
  dish_id: string
  cooked_by: string
  photo_url: string
  notes: string
  rating: number | null
  cooked_date: string
}
