import { Router } from 'express';
import { validate } from '../middlewares/validation';
import {
  createApplicationSchema,
  updateApplicationSchema,
  idParamSchema,
  listQuerySchema,
} from '../lib/schemas';
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), listApplications);
router.get('/:id', validate(idParamSchema, 'params'), getApplication);
router.post('/', validate(createApplicationSchema), createApplication);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateApplicationSchema), updateApplication);
router.delete('/:id', validate(idParamSchema, 'params'), deleteApplication);

export default router;
