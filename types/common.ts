/* eslint-disable @typescript-eslint/no-explicit-any */
import { drawerArray, jobStatusArray } from '@/constants'
import { z } from 'zod'
import { formJobSchema } from './form-schema'

export type JobStatusType = (typeof jobStatusArray)[number]

export type DrawerType = (typeof drawerArray)[number]

export type ValueJobType = {
  data?: z.infer<typeof formJobSchema> | any
  type: DrawerType | string
}

export type ApiResponse<T> = {
  success: boolean
  data: T
}

export type JobType = {
  id: string
  title: string
  description: string
  min_salary_offered: number
  max_salary_offered: number
  is_open: boolean
  is_applied: boolean
  applicants_total: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export type ApplicantType = {
  id: string
  full_name: string
  phone: string
  min_salary_expectation: number
  max_salary_expectation: number
  summary: string
}

export type JobApplicationsType = {
  id: string
  status: string
  created_at: string
  updated_at: string
  applicant: ApplicantType
}

export type ApplicationsType = {
  id: string
  status: string
  created_at: string
  updated_at: string
  job: {
    id: string
    title: string
    description: string
    min_salary_offered: number
    max_salary_offered: number
  }
  status_log: {
    id: string
    note: string
    status: string
    created_at: string
  }[]
}

export type BaseUserType = {
  id: string
  email: string
  password: string
  role: 'admin' | 'applicant'
  created_at: Date | null
  updated_at: Date | null
}

export type UserType = BaseUserType & {
  applicant_id?: string
}
