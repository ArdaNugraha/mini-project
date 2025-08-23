/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobApplicationsTable, jobApplicationLogsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const [getByIdJobApplication] = await db
      .select()
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.id, id))

    const jobApplicationLogs = await db
      .select()
      .from(jobApplicationLogsTable)
      .where(eq(jobApplicationLogsTable.job_application_id, id))

    const result = {
      ...getByIdJobApplication,
      status_logs: jobApplicationLogs,
    }

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch job application' })
  }
}
