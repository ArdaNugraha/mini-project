/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobsTable, jobApplicationsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema } from '@/types/form-schema'
import { sql, eq, and, isNull, desc, isNotNull } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const applicantId = session?.applicant_id || null

  // alias
  const jaAllAlias = alias(jobApplicationsTable, 'ja_all_alias')
  const jaMeAlias = alias(jobApplicationsTable, 'ja_me_alias')

  try {
    const baseQuery = db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        description: jobsTable.description,
        min_salary_offered: jobsTable.min_salary_offered,
        max_salary_offered: jobsTable.max_salary_offered,
        is_open: jobsTable.is_open,
        created_at: jobsTable.created_at,
        updated_at: jobsTable.updated_at,
        deleted_at: jobsTable.deleted_at,
        applicants_total: sql<number>`COUNT(${jaAllAlias.id})`.as(
          'applicants_total',
        ),
        is_applied: applicantId
          ? sql<boolean>`bool_or(${jaMeAlias}.applicant_id IS NOT NULL)`.as(
              'is_applied',
            )
          : sql<object>`false`.as('is_applied'),
      })
      .from(jobsTable)
      .leftJoin(jaAllAlias, eq(jaAllAlias.job_id, jobsTable.id))
      .where(isNull(jobsTable.deleted_at))
      .groupBy(jobsTable.id)
      .orderBy(desc(jobsTable.updated_at))

    if (applicantId) {
      baseQuery.leftJoin(
        jaMeAlias,
        and(
          eq(jaMeAlias.job_id, jobsTable.id),
          eq(jaMeAlias.applicant_id, applicantId),
        ),
      )
    }

    const result = await baseQuery

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const parse = formJobSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    const newJob = await db
      .insert(jobsTable)
      .values({
        title: parse.data.title,
        description: parse.data.description,
        min_salary_offered: Number(parse.data.min_salary_offered),
        max_salary_offered: Number(parse.data.max_salary_offered),
        is_open: true,
      })
      .returning()

    return jsonResponse({ data: newJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to create job' })
  }
}
