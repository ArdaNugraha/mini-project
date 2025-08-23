/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import {
  jobApplicationsTable,
  jobsTable,
  jobApplicationLogsTable,
  applicantsTable,
} from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getToken({
    req: req as NextRequest,
    secret: process.env.NEXTAUTH_SECRET!,
  })
  const id = (await params).id
  const applicantId = session?.applicant_id || ''

  if (!session) {
    return errorResponse({ message: 'Unauthorized', status: 401 })
  }

  try {
    const existing = await db
      .select()
      .from(jobsTable)
      .where(and(eq(jobsTable.id, id), eq(jobsTable.is_open, true)))
    if (!existing.length) {
      return errorResponse({ message: 'Job not found', status: 404 })
    }

    const duplicateJobApplications = await db
      .select()
      .from(jobApplicationsTable)
      .where(
        and(
          eq(jobApplicationsTable.job_id, id),
          eq(jobApplicationsTable.applicant_id, applicantId),
        ),
      )
      .limit(1)
    if (duplicateJobApplications.length) {
      return errorResponse({ message: 'Duplicate apply job', status: 404 })
    }

    const [applicant] = await db
      .select()
      .from(applicantsTable)
      .where(eq(applicantsTable.user_id, session.id))

    const [applyJob] = await db
      .insert(jobApplicationsTable)
      .values({
        applicant_id: applicant.id,
        job_id: id,
      })
      .returning()

    if (!!applyJob.id) {
      await db.insert(jobApplicationLogsTable).values({
        job_application_id: applyJob.id,
        status: applyJob.status,
        note: noteByStatus[applyJob.status],
      })
    }

    return jsonResponse({ data: duplicateJobApplications })
  } catch (error) {
    return errorResponse({ message: 'Failed to apply job' })
  }
}
