export const JobType = {
  INTERNSHIP: 'Internship',
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const Status = {
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
} as const;

export type Status = (typeof Status)[keyof typeof Status];

export interface Application {
  id: number;
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export type CreateApplicationDTO = import('../lib/schemas').CreateApplicationDTO;
export type UpdateApplicationDTO = import('../lib/schemas').UpdateApplicationDTO;
