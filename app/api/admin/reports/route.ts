import { db } from '@/lib/db'
import {
  jobsTable,
  applicantsTable,
  jobApplicationsTable,
} from '@/lib/db/schema'
import { count, isNull, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const revalidate = 0

export async function GET() {
  try {
    const [jobCount] = await db
      .select({ value: count() })
      .from(jobsTable)
      .where(isNull(jobsTable.deleted_at))

    const [applicantCount] = await db
      .select({ value: count() })
      .from(applicantsTable)
      .innerJoin(
        jobApplicationsTable,
        eq(applicantsTable.id, jobApplicationsTable.applicant_id),
      )
      .innerJoin(jobsTable, eq(jobApplicationsTable.job_id, jobsTable.id))
      .where(isNull(jobsTable.deleted_at))

    const [applicationCount] = await db
      .select({ value: count() })
      .from(jobApplicationsTable)
      .innerJoin(jobsTable, eq(jobApplicationsTable.job_id, jobsTable.id))
      .where(isNull(jobsTable.deleted_at))

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobCount.value,
        applicants: applicantCount.value,
        applications: applicationCount.value,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Internal error' },
      { status: 500 },
    )
  }
}
