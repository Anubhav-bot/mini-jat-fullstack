import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middlewares/validation';
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController';

const router = Router();

const createSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  notes: z.string().optional(),
});

const updateSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  job_title: z.string().min(1, 'Job title is required').optional(),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']).optional(),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']).optional(),
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
  notes: z.string().optional(),
});

router.get('/', listApplications);
router.get('/:id', getApplication);
router.post('/', validate(createSchema), createApplication);
router.patch('/:id', validate(updateSchema), updateApplication);
router.delete('/:id', deleteApplication);

export default router;
