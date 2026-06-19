import { createApplicationSchema } from '../src/lib/schemas';

describe('Validation Schemas', () => {
  describe('createApplication schema', () => {
    it('should accept a valid application payload', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Software Engineer',
        job_type: 'Full-time' as const,
        status: 'Applied' as const,
        applied_date: '2026-06-01',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should accept payload with optional notes', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Software Engineer',
        job_type: 'Full-time' as const,
        status: 'Applied' as const,
        applied_date: '2026-06-01',
        notes: 'Some notes',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject when company_name is too short', () => {
      const payload = {
        company_name: 'G',
        job_title: 'Software Engineer',
        job_type: 'Full-time' as const,
        status: 'Applied' as const,
        applied_date: '2026-06-01',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject when job_title is empty', () => {
      const payload = {
        company_name: 'Google',
        job_title: '',
        job_type: 'Full-time' as const,
        status: 'Applied' as const,
        applied_date: '2026-06-01',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid job_type', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Contract' as const,
        status: 'Applied' as const,
        applied_date: '2026-06-01',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Full-time' as const,
        status: 'Hired' as const,
        applied_date: '2026-06-01',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid applied_date', () => {
      const payload = {
        company_name: 'Google',
        job_title: 'Engineer',
        job_type: 'Full-time' as const,
        status: 'Applied' as const,
        applied_date: 'not-a-date',
      };
      const result = createApplicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
