import { Router } from 'express';
import protect from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import {
  createActivityLogSchema,
  updateActivityLogSchema,
  activityLogIdSchema,
} from '../validators/activityLog.validator.js';
import {
  createActivityLog,
  getActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog,
} from '../controllers/activityLog.controller.js';

const router = Router();

router.use(protect);

router.post('/', validate(createActivityLogSchema), createActivityLog);
router.get('/', getActivityLogs);
router.get('/:id', validate(activityLogIdSchema), getActivityLogById);
router.patch('/:id', validate(updateActivityLogSchema), updateActivityLog);
router.delete('/:id', validate(activityLogIdSchema), deleteActivityLog);

export default router;