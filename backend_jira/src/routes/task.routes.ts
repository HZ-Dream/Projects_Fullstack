import { Router } from 'express';
import taskController from '../controllers/task.controller.js';

const router = Router();

router.get('/', taskController.showTask);
router.post('/', taskController.createTask);
router.put('/:idTask', taskController.updateTask);
router.delete('/:idTask', taskController.deleteTask);

export default router;
