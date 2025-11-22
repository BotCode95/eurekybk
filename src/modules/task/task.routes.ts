import { Router } from 'express';
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask
} from './task.controller';
import { validateJWT } from '../../middlewares/validateJWT';

const router = Router();

router.use(validateJWT);

router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
