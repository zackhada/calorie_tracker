import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';
import { estimateCalories } from '../services/claude';
import {
  addMeal,
  getMealsByDate,
  getDailySummary,
  getHistorySummaries,
  deleteMeal,
} from '../services/firestore';

const router = Router();

router.use(authMiddleware);

function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

router.post('/api/log-food', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, date } = req.body;

    if (!description || typeof description !== 'string') {
      res.status(400).json({ error: 'description is required' });
      return;
    }

    const mealDate = date || todayDate();
    const estimate = await estimateCalories(description);

    const meal = await addMeal(req.user.uid, {
      description,
      items: estimate.items,
      totalCalories: estimate.totalCalories,
      date: mealDate,
    });

    res.status(201).json(meal);
  } catch (error) {
    next(error);
  }
});

router.get('/api/meals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = (req.query.date as string) || todayDate();
    const meals = await getMealsByDate(req.user.uid, date);
    res.json(meals);
  } catch (error) {
    next(error);
  }
});

router.get('/api/daily-summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = (req.query.date as string) || todayDate();
    const summary = await getDailySummary(req.user.uid, date);
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

router.get('/api/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate query parameters are required' });
      return;
    }

    const summaries = await getHistorySummaries(
      req.user.uid,
      startDate as string,
      endDate as string
    );
    res.json(summaries);
  } catch (error) {
    next(error);
  }
});

router.delete('/api/meals/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteMeal(req.user.uid, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
