/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { usersTable, applicantsTable } from '@/lib/db/schema'
import { formSignupSchema } from '@/types/form-schema'
import { errorResponse, jsonResponse } from '@/utils'
import { hashPassword } from '@/helpers'
import { eq } from 'drizzle-orm'

export async function POST(req: Request) {
  const body = await req.json()
  const parse = formSignupSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    // check if email is exist
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parse.data.email))
    if (!!existing.length) {
      return errorResponse({
        message: 'Email is already registered',
        status: 400,
      })
    }

    const result = await db.transaction(async (tx) => {
      // create new user
      const [newUser] = await tx
        .insert(usersTable)
        .values({
          email: parse.data.email,
          password: await hashPassword(parse.data.password),
        })
        .returning()
      if (!newUser?.id) {
        throw new Error('Failed create user')
      }

      // create new participant
      const [newApplicant] = await tx
        .insert(applicantsTable)
        .values({
          user_id: newUser.id,
          full_name: parse.data.full_name,
          phone: parse.data.phone,
          summary: parse.data.summary,
          min_salary_expectation: Number(parse.data.min_salary_expectation),
          max_salary_expectation: Number(parse.data.max_salary_expectation),
        })
        .returning()

      return { user: newUser, applicant: newApplicant }
    })

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to sign up data' })
  }
}
