export const noteByStatus = {
  in_progress: 'Application is being processed.',
  not_selected: 'Candidate was not selected.',
  interview: 'Interview scheduled.',
  under_review: 'Application under review.',
  offer_made: 'Job offer has been made.',
  rejected: 'Application was rejected.',
  hired: 'Candidate has been hired.',
} as const

export const jobStatusArray = [
  'in_progress',
  'not_selected',
  'interview',
  'under_review',
  'offer_made',
  'rejected',
  'hired',
] as const

export const drawerArray = ['edit', 'view', 'create', 'delete'] as const

export const defaultValueJob = {
  title: '',
  description: '',
  min_salary_offered: '0',
  max_salary_offered: '0',
  is_open: true,
} as const
