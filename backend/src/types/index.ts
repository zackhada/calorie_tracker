export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieEstimate {
  items: FoodItem[];
  totalCalories: number;
}

export interface MealDocument {
  id: string;
  description: string;
  items: FoodItem[];
  totalCalories: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
}

declare global {
  namespace Express {
    interface Request {
      user: {
        uid: string;
        email: string;
        name: string;
      };
    }
  }
}
