/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import {
  jobApplicationsTable,
  jobsTable,
  applicantsTable,
  jobApplicationLogsTable,
} from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and, param, sql } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const userId = session?.id || ''

  try {
    const [existing] = await db
      .select()
      .from(applicantsTable)
      .where(eq(applicantsTable.user_id, userId))

    if (!existing.id) {
      return errorResponse({ message: 'Applicant data not found', status: 404 })
    }

    const myApplications = await db.execute(sql`
      SELECT
        ja.id,
        ja.status,
        ja.created_at,
        ja.updated_at,
        json_build_object(
          'id', j.id,
          'title', j.title,
          'description', j.description,
          'min_salary_offered', j.min_salary_offered,
          'max_salary_offered', j.max_salary_offered
        ) as job,
        (
          SELECT json_agg(
            json_build_object(
              'id', jl.id,
              'status', jl.status,
              'note', jl.note,
              'created_at', jl.created_at
            )
          )
          FROM ${jobApplicationLogsTable} jl
          WHERE jl.job_application_id = ja.id
        ) AS status_log
      FROM ${jobApplicationsTable} ja
      JOIN ${jobsTable} j ON j.id = ja.job_id
      WHERE ja.applicant_id = ${existing.id}
    `)

    return jsonResponse({ data: myApplications.rows })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch job application' })
  }
}
