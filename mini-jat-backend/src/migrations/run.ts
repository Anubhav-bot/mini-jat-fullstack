import dotenv from 'dotenv';
dotenv.config();

import pool from '../config/database';
import type { QueryResult } from 'pg';

const migrations = [
  {
    name: '001_create_applications',
    sql: `
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        job_type VARCHAR(20) NOT NULL CHECK (job_type IN ('Internship', 'Full-time', 'Part-time')),
        status VARCHAR(20) NOT NULL CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected')),
        applied_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_applications_company_name ON applications(company_name);
      CREATE INDEX IF NOT EXISTS idx_applications_job_title ON applications(job_title);
    `,
  },
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('CREATE TABLE IF NOT EXISTS _migrations (id SERIAL PRIMARY KEY, name VARCHAR(255) UNIQUE NOT NULL, run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW())');

    for (const migration of migrations) {
      const existing: QueryResult = await client.query('SELECT id FROM _migrations WHERE name = $1', [migration.name]);
      if (existing.rows.length === 0) {
        console.log(`Running migration: ${migration.name}`);
        await client.query(migration.sql);
        await client.query('INSERT INTO _migrations (name) VALUES ($1)', [migration.name]);
        console.log(`Migration ${migration.name} completed`);
      } else {
        console.log(`Skipping migration: ${migration.name} (already run)`);
      }
    }

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
