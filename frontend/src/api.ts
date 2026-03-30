import axios from "axios";
import type { Meal, DailySummary } from "./types";

let tokenGetter: (() => Promise<string>) | null = null;

export function setTokenGetter(getter: () => Promise<string>) {
  tokenGetter = getter;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function logFood(description: string, date: string): Promise<Meal> {
  const { data } = await api.post<Meal>("/api/log-food", { description, date });
  return data;
}

export async function getMeals(date: string): Promise<Meal[]> {
  const { data } = await api.get<Meal[]>("/api/meals", { params: { date } });
  return data;
}

export async function getDailySummary(date: string): Promise<DailySummary> {
  const { data } = await api.get<DailySummary>("/api/daily-summary", { params: { date } });
  return data;
}

export async function getHistory(startDate: string, endDate: string): Promise<DailySummary[]> {
  const { data } = await api.get<DailySummary[]>("/api/history", { params: { startDate, endDate } });
  return data;
}

export async function deleteMeal(id: string): Promise<void> {
  await api.delete(`/api/meals/${id}`);
}
