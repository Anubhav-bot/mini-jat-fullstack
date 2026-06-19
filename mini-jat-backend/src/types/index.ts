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

export interface CreateApplicationDTO {
  company_name: string;
  job_title: string;
  job_type: JobType;
  status: Status;
  applied_date: string;
  notes?: string;
}

export interface UpdateApplicationDTO {
  company_name?: string;
  job_title?: string;
  job_type?: JobType;
  status?: Status;
  applied_date?: string;
  notes?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
