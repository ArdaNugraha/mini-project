import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'applicant'])

export const jobApplicationStatusEnum = pgEnum('job_application_status', [
  'in_progress',
  'not_selected',
  'interview',
  'under_review',
  'offer_made',
  'rejected',
  'hired',
])

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar({ length: 100 }).notNull(),
  password: text().notNull(),
  role: userRoleEnum('role').notNull().default('applicant'),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const applicantsTable = pgTable('applicants', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => usersTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  full_name: text('full_name').notNull(),
  phone: varchar({ length: 13 }).notNull(),
  socials: jsonb('socials'),
  min_salary_expectation: integer('min_salary_expectation').notNull(),
  max_salary_expectation: integer('max_salary_expectation').notNull(),
  summary: text('summary').notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const jobsTable = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  description: text('description').notNull(),
  min_salary_offered: integer('min_salary_offered').notNull(),
  max_salary_offered: integer('max_salary_offered').notNull(),
  is_open: boolean('is_open').notNull().default(true),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
  deleted_at: timestamp(),
})

export const jobApplicationsTable = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicant_id: uuid('applicant_id').references(() => applicantsTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  job_id: uuid('job_id').references(() => jobsTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  status: jobApplicationStatusEnum('status').notNull().default('in_progress'),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
  updated_at: timestamp({ withTimezone: true }).defaultNow(),
})

export const jobApplicationLogsTable = pgTable('job_application_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  job_application_id: uuid('job_application_id').references(
    () => jobApplicationsTable.id,
    {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
  ),
  status: jobApplicationStatusEnum('status').notNull(),
  note: text('note').notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow(),
})

// INSERT INTO users (email, password, role) VALUES ('admin@mail.com', '$2a$12$WrVGbnSYAQr.RpVIISQExepfZnNVpkTkd8o7Fh.JuacCN9O2/Jjmy', 'admin');
