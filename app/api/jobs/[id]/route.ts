/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema } from '@/types/form-schema'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    // query detail job
    const [existing] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id))

    // if detail job not found
    if (!existing.id) {
      return errorResponse({ message: 'Detail job not found', status: 404 })
    }

    return jsonResponse({ data: existing })
  } catch (error) {
    return errorResponse({ message: 'Failed to get detail job' })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await req.json()
  const parse = formJobSchema.safeParse(body)
  const id = (await params).id

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
    })
  }

  try {
    const updateJob = await db
      .update(jobsTable)
      .set({
        title: parse.data.title,
        description: parse.data.description,
        min_salary_offered: Number(parse.data.min_salary_offered),
        max_salary_offered: Number(parse.data.max_salary_offered),
        is_open: parse.data.is_open,
        updated_at: new Date(),
      })
      .where(eq(jobsTable.id, id))
      .returning()

    // if data not found
    if (updateJob.length === 0) {
      return errorResponse({ message: 'Detail job not found', status: 404 })
    }

    return jsonResponse({ data: updateJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to update job' })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const deleteJob = await db
      .update(jobsTable)
      .set({ deleted_at: new Date() })
      .where(eq(jobsTable.id, id))
      .returning()

    // if data not found
    if (deleteJob.length === 0) {
      return errorResponse({ message: 'Detail job not found', status: 404 })
    }

    return jsonResponse({ data: deleteJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to delete job' })
  }
}
