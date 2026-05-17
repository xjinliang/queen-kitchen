-- 小李厨房 - Supabase 数据库 Schema
-- 在 Supabase SQL Editor 中按顺序执行

-- ============================================
-- 1. 扩展
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. profiles 表 (用户信息)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_auth" ON profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 注册后自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nickname)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', '新用户'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 3. dishes 表 (菜品库)
-- ============================================
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('热菜','凉菜','主食','汤','甜品','早餐','其他')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('简单','中等','困难')),
  recipe TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dishes_updated_at
  BEFORE UPDATE ON dishes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dishes_all_auth" ON dishes
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 4. meal_plans 表 (点菜记录)
-- ============================================
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('午餐','晚餐')),
  ordered_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_date, meal_type, dish_id)
);

CREATE INDEX idx_meal_plans_date ON meal_plans(plan_date);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meal_plans_all_auth" ON meal_plans
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 5. cooked_meals 表 (成品记录)
-- ============================================
CREATE TABLE cooked_meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dish_id UUID NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  cooked_by UUID NOT NULL REFERENCES profiles(id),
  photo_url TEXT NOT NULL,
  notes TEXT DEFAULT '',
  rating INT2 CHECK (rating >= 1 AND rating <= 5),
  cooked_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cooked_meals_date ON cooked_meals(cooked_date DESC);

ALTER TABLE cooked_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cooked_meals_all_auth" ON cooked_meals
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 6. 启用 Realtime (在 Supabase Dashboard 中也需要手动开启)
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE dishes;
ALTER PUBLICATION supabase_realtime ADD TABLE meal_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE cooked_meals;
