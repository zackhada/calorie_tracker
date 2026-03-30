import admin from 'firebase-admin';
import { MealDocument, FoodItem, DailySummary } from '../types';

function getFirestore(): admin.firestore.Firestore {
  return admin.firestore();
}

function mealsCollection(userId: string) {
  return getFirestore().collection('users').doc(userId).collection('meals');
}

export async function addMeal(
  userId: string,
  meal: { description: string; items: FoodItem[]; totalCalories: number; date: string }
): Promise<MealDocument> {
  const createdAt = new Date().toISOString();
  const docRef = mealsCollection(userId).doc();

  const mealDoc: MealDocument = {
    id: docRef.id,
    description: meal.description,
    items: meal.items,
    totalCalories: meal.totalCalories,
    date: meal.date,
    createdAt,
  };

  await docRef.set(mealDoc);
  return mealDoc;
}

export async function getMealsByDate(userId: string, date: string): Promise<MealDocument[]> {
  const snapshot = await mealsCollection(userId)
    .where('date', '==', date)
    .orderBy('createdAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => doc.data() as MealDocument);
}

export async function getDailySummary(userId: string, date: string): Promise<DailySummary> {
  const meals = await getMealsByDate(userId, date);

  const summary: DailySummary = {
    date,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealCount: meals.length,
  };

  for (const meal of meals) {
    for (const item of meal.items) {
      summary.totalCalories += item.calories;
      summary.totalProtein += item.protein;
      summary.totalCarbs += item.carbs;
      summary.totalFat += item.fat;
    }
  }

  return summary;
}

export async function deleteMeal(userId: string, mealId: string): Promise<void> {
  await mealsCollection(userId).doc(mealId).delete();
}

export async function getHistorySummaries(
  userId: string,
  startDate: string,
  endDate: string
): Promise<DailySummary[]> {
  const snapshot = await mealsCollection(userId)
    .where('date', '>=', startDate)
    .where('date', '<=', endDate)
    .get();

  const meals = snapshot.docs.map((doc) => doc.data() as MealDocument);

  const byDate = new Map<string, MealDocument[]>();
  for (const meal of meals) {
    const existing = byDate.get(meal.date) || [];
    existing.push(meal);
    byDate.set(meal.date, existing);
  }

  const summaries: DailySummary[] = [];
  for (const [date, dateMeals] of byDate) {
    const summary: DailySummary = {
      date,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      mealCount: dateMeals.length,
    };

    for (const meal of dateMeals) {
      for (const item of meal.items) {
        summary.totalCalories += item.calories;
        summary.totalProtein += item.protein;
        summary.totalCarbs += item.carbs;
        summary.totalFat += item.fat;
      }
    }

    summaries.push(summary);
  }

  summaries.sort((a, b) => b.date.localeCompare(a.date));
  return summaries;
}
