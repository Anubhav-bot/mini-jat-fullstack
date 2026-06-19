import { z } from 'zod';

const createSchema = z.object({
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  job_title: z.string().min(1, 'Job title is required'),
  job_type: z.enum(['Internship', 'Full-time', 'Part-time']),
  status: z.enum(['Applied', 'Interviewing', 'Offer', 'Rejected']),
  applied_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format'),
  notes: z.string().optional(),
});

describe('Validation Schemas', () => {
  describe('createApplication schema', () => {
    it('should accept a valid application payload', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Software Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2026-06-01',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should accept payload with optional notes', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Software Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2026-06-01',
        notes: 'Some notes',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject when company_name is too short', () => {
      const payload = {
        company_name: 'G',
        job_title: 'Software Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2026-06-01',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject when job_title is empty', () => {
      const payload = {
        company_name: 'Google',
        job_title: '',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: '2026-06-01',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid job_type', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Contract',
        status: 'Applied',
        applied_date: '2026-06-01',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Full-time',
        status: 'Hired',
        applied_date: '2026-06-01',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid applied_date', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Full-time',
        status: 'Applied',
        applied_date: 'not-a-date',
      };
      const result = createSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
