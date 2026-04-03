import { Router } from 'express';
import projectController from '../controllers/project.controller.js';

const router = Router();

router.get('/', projectController.showProject);
router.post('/', projectController.createProject);
router.put('/:idProject', projectController.updateProject);
router.delete('/:idProject', projectController.deleteProject);

export default router;
