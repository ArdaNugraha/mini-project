/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import { jobApplicationsTable, jobApplicationLogsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq } from 'drizzle-orm'
import { formJobApplicationSchema } from '@/types/form-schema'
import { NextRequest } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json()
  const parse = formJobApplicationSchema.safeParse(body)
  const id = (await params).id

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    const existing = await db
      .select()
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.id, id))
    if (!existing.length) {
      return errorResponse({
        message: 'Job application not found',
        status: 404,
      })
    }

    const [applyJob] = await db
      .update(jobApplicationsTable)
      .set({ ...parse.data, updated_at: new Date() })
      .where(eq(jobApplicationsTable.id, id))
      .returning()

    if (!!applyJob.id) {
      await db.insert(jobApplicationLogsTable).values({
        job_application_id: applyJob.id,
        status: applyJob.status,
        note: noteByStatus[applyJob.status],
      })
    }

    return jsonResponse({ data: applyJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to apply job' })
  }
}
