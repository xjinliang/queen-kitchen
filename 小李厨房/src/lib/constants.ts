import type { DishCategory, Difficulty } from '../types'

export const CATEGORIES: { value: DishCategory; label: string }[] = [
  { value: '热菜', label: '热菜' },
  { value: '凉菜', label: '凉菜' },
  { value: '主食', label: '主食' },
  { value: '汤', label: '汤' },
  { value: '甜品', label: '甜品' },
  { value: '早餐', label: '早餐' },
  { value: '其他', label: '其他' },
]

export const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: '简单', label: '简单' },
  { value: '中等', label: '中等' },
  { value: '困难', label: '困难' },
]

export const PRESET_TAGS = [
  '猪肉', '牛肉', '鸡肉', '鱼', '虾', '蔬菜', '豆腐', '鸡蛋',
  '面食', '米饭', '快手菜', '辣', '清淡', '烤箱', '炖煮', '炒', '蒸', '凉拌',
]
