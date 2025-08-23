import { jobStatusArray } from '@/constants'
import { z } from 'zod'

export const formJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  min_salary_offered: z.string().min(1),
  max_salary_offered: z.string().min(1),
  is_open: z.boolean().default(true),
})

export const formSignupSchema = z.object({
  full_name: z.string().min(3),
  phone: z.string().min(10),
  summary: z.string().min(10),
  min_salary_expectation: z.string().min(1),
  max_salary_expectation: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(5),
})

export const formJobApplicationSchema = z.object({
  status: z.enum(jobStatusArray),
})
