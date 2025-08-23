'use client'

import ListTable from '@/components/section/data-table'
import { columnsJobs } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, JobType } from '@/types/common'
import { Button } from '@/components/ui/button'
import AdminDashboardFormJob from './form-job'
import { useState } from 'react'
import { ValueJobType } from '@/types/common'
import { defaultValueJob } from '@/constants'
import AdminDashboardJobApplicationsTable from './job-applications-table'
import { toast } from 'sonner'

export default function AdminDashboardJobTable() {
  const {
    data: jobs,
    isLoading,
    mutate,
  } = useFetcher<ApiResponse<JobType[]>>({
    path: '/jobs',
  })
  const [valueJob, setValueJob] = useState<ValueJobType>({
    data: defaultValueJob,
    type: '',
  })
  const [jobApplications, setJobApplications] = useState<string>('')

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate()
        toast.success('Delete successful')
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  const handleClickAction = (value: ValueJobType) => {
    if (value?.type === 'delete') {
      handleDelete(value?.data.id)
      return
    }

    if (value?.type === 'view') {
      setJobApplications(value?.data?.id)
      return
    }

    setValueJob({ data: value.data, type: value.type })
  }

  const columns = columnsJobs(handleClickAction)

  return (
    <div className="w-full flex flex-col">
      <div className="pb-4 flex justify-between items-center">
        <p className="text-xl font-semibold">List Jobs</p>
        <Button
          onClick={() => setValueJob({ data: defaultValueJob, type: 'create' })}
        >
          Add Job
        </Button>
      </div>
      <ListTable
        columns={columns}
        data={jobs?.data || []}
        isLoading={isLoading}
      />
      <AdminDashboardFormJob
        open={valueJob}
        onOpen={() => setValueJob({ data: defaultValueJob, type: '' })}
        values={valueJob.data}
        onFinish={() => {
          mutate()
        }}
      />
      <AdminDashboardJobApplicationsTable
        open={jobApplications}
        onOpen={() => setJobApplications('')}
      />
    </div>
  )
}
