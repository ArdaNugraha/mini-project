/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobApplicationsTable, applicantsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id

  try {
    const result = await db
      .select({
        id: jobApplicationsTable.id,
        status: jobApplicationsTable.status,
        created_at: jobApplicationsTable.created_at,
        updated_at: jobApplicationsTable.updated_at,
        applicant: {
          id: applicantsTable.id,
          full_name: applicantsTable.full_name,
          socials: applicantsTable.socials,
          phone: applicantsTable.phone,
          min_salary_expectation: applicantsTable.min_salary_expectation,
          max_salary_expectation: applicantsTable.max_salary_expectation,
          summary: applicantsTable.summary,
        },
      })
      .from(jobApplicationsTable)
      .innerJoin(
        applicantsTable,
        eq(applicantsTable.id, jobApplicationsTable.applicant_id),
      )
      .where(eq(jobApplicationsTable.job_id, id))

    return jsonResponse({ data: result })
  } catch (error) {
    console.log('err => ', error)
    return errorResponse({ message: 'Failed to get detail job applications' })
  }
}
