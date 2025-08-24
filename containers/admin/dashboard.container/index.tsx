'use client'

import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import AdminDashboardJobTable from './job-table'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboardContainer() {
  const { data } = useSWR('/api/admin/reports', fetcher, {
    refreshInterval: 1000,
  })

  const reports = [
    {
      title: 'Applicants',
      value: data?.data?.applicants || 0,
      description: 'Total Applicants',
    },
    {
      title: 'Jobs',
      value: data?.data?.jobs || 0,
      description: 'Jobs Opening',
    },
    {
      title: 'Applications',
      value: data?.data?.applications || 0,
      description: 'Submitted Applications',
    },
  ]

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={reports}
          /*items={[{ title: 'Job', value: 5, description: 'Jobs Opening' }]}*/
        />
        <Separator />
        <AdminDashboardJobTable />
      </div>
    </div>
  )
}
