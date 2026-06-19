import { Request, Response, NextFunction } from 'express';
import { query, querySingle } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import type { Application, CreateApplicationDTO, UpdateApplicationDTO } from '../types';

export async function listApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const pageStr = req.query.page as string | undefined;
    const limitStr = req.query.limit as string | undefined;

    const page = Math.max(1, parseInt(pageStr || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(limitStr || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status && typeof status === 'string') {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (search && typeof search === 'string') {
      conditions.push(`(company_name ILIKE $${paramIndex} OR job_title ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await querySingle<{ total: string }>(
      `SELECT COUNT(*) as total FROM applications ${whereClause}`,
      params
    );
    const total = parseInt(countResult?.total || '0', 10);

    const applications = await query<Application>(
      `SELECT * FROM applications ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    res.status(200).json({
      data: applications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

export async function getApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      throw new AppError(400, 'Invalid application ID');
    }

    const application = await querySingle<Application>(
      'SELECT * FROM applications WHERE id = $1',
      [id]
    );

    if (!application) {
      throw new AppError(404, 'Application not found');
    }

    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
}

export async function createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = req.body as CreateApplicationDTO;

    const application = await querySingle<Application>(
      `INSERT INTO applications (company_name, job_title, job_type, status, applied_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.company_name, data.job_title, data.job_type, data.status, data.applied_date, data.notes || null]
    );

    res.status(201).location(`/applications/${application!.id}`).json(application);
  } catch (err) {
    next(err);
  }
}

export async function updateApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      throw new AppError(400, 'Invalid application ID');
    }

    const existing = await querySingle<Application>('SELECT * FROM applications WHERE id = $1', [id]);
    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    const data = req.body as UpdateApplicationDTO;

    const fields: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (data.company_name !== undefined) {
      fields.push(`company_name = $${paramIndex++}`);
      params.push(data.company_name);
    }
    if (data.job_title !== undefined) {
      fields.push(`job_title = $${paramIndex++}`);
      params.push(data.job_title);
    }
    if (data.job_type !== undefined) {
      fields.push(`job_type = $${paramIndex++}`);
      params.push(data.job_type);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramIndex++}`);
      params.push(data.status);
    }
    if (data.applied_date !== undefined) {
      fields.push(`applied_date = $${paramIndex++}`);
      params.push(data.applied_date);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramIndex++}`);
      params.push(data.notes);
    }

    if (fields.length === 0) {
      res.status(200).json(existing);
      return;
    }

    fields.push(`updated_at = NOW()`);
    params.push(id);

    const application = await querySingle<Application>(
      `UPDATE applications SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    res.status(200).json(application);
  } catch (err) {
    next(err);
  }
}

export async function deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      throw new AppError(400, 'Invalid application ID');
    }

    const existing = await querySingle<Application>('SELECT * FROM applications WHERE id = $1', [id]);
    if (!existing) {
      throw new AppError(404, 'Application not found');
    }

    await query('DELETE FROM applications WHERE id = $1', [id]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
