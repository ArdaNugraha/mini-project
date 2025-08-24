import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { usersTable, applicantsTable } from '@/lib/db/schema'
import { getCurrentUser } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user || user.role !== 'applicant') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ambil data gabungan usersTable + applicantsTable
  const data = await db
    .select({
      email: usersTable.email,
      full_name: applicantsTable.full_name,
      phone: applicantsTable.phone,
      socials: applicantsTable.socials,
      min_salary_expectation: applicantsTable.min_salary_expectation,
      max_salary_expectation: applicantsTable.max_salary_expectation,
      summary: applicantsTable.summary,
    })
    .from(usersTable)
    .innerJoin(applicantsTable, eq(usersTable.id, applicantsTable.user_id))
    .where(eq(usersTable.id, user.id))

  if (!data.length) {
    return NextResponse.json({ error: 'Applicant not found' }, { status: 404 })
  }

  return NextResponse.json(data[0])
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user || user.role !== 'applicant') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      full_name,
      phone,
      email,
      password,
      socials,
      min_salary_expectation,
      max_salary_expectation,
      summary,
    } = body

    // Validasi sederhana (tambahkan sesuai kebutuhan)
    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and Full Name are required' },
        { status: 400 },
      )
    }

    // Parse socials jika string
    let parsedSocials = null
    if (socials) {
      if (typeof socials === 'string') {
        try {
          parsedSocials = JSON.parse(socials)
        } catch {
          return NextResponse.json(
            { error: 'Socials must be valid JSON' },
            { status: 400 },
          )
        }
      } else if (typeof socials === 'object') {
        parsedSocials = socials
      } else {
        return NextResponse.json(
          { error: 'Socials must be JSON object or string' },
          { status: 400 },
        )
      }
    }

    // Update email di usersTable
    await db
      .update(usersTable)
      .set({ email, updated_at: new Date() })
      .where(eq(usersTable.id, user.id))

    // Update password jika ada dan hash
    if (password && password.length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await db
        .update(usersTable)
        .set({ password: hashedPassword, updated_at: new Date() })
        .where(eq(usersTable.id, user.id))
    }

    // Update profil di applicantsTable
    await db
      .update(applicantsTable)
      .set({
        full_name,
        phone,
        socials: parsedSocials,
        min_salary_expectation,
        max_salary_expectation,
        summary,
        updated_at: new Date(),
      })
      .where(eq(applicantsTable.user_id, user.id))

    return NextResponse.json({ message: 'Profile updated' })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 },
    )
  }
}
