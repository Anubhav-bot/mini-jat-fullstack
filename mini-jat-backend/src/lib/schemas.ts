import { z } from 'zod';

export const createApplicationSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  notes: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  job_title: z.string().min(1, 'Job title is required').optional(),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']).optional(),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']).optional(),
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format').optional(),
  notes: z.string().optional(),
});

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a numeric string'),
});

export const listQuerySchema = z.object({
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']).optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
});

export type CreateApplicationDTO = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationDTO = z.infer<typeof updateApplicationSchema>;
export type ListQueryDTO = z.infer<typeof listQuerySchema>;
