import { Router } from 'express';
import { check } from 'express-validator';
import { createTask, downloadSummary, stopTheTask } from '../controllers/task';
import { isAuth } from '../middleware/auth';

const router = Router();

router.post(
  '/',
  isAuth,
  check('description', 'Description is Required').notEmpty(),
  createTask
);

router.patch('/stop', isAuth, stopTheTask);

router.post('/summary', isAuth, downloadSummary);

export default router;
