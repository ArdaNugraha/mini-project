import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { jobApplicationsTable, jobsTable } from '@/lib/db/schema'
import { count, isNull } from 'drizzle-orm'

export async function GET() {
  try {
    const [{ totalApplications }] = await db
      .select({ totalApplications: count() })
      .from(jobApplicationsTable)

    // const count = totalApplications.length

    const [{ totalJobs }] = await db
      .select({ totalJobs: count() })
      .from(jobsTable)
      .where(isNull(jobsTable.deleted_at))

    return NextResponse.json({ totalApplications, totalJobs })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to fetch applications count' },
      { status: 500 },
    )
  }
}
