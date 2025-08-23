'use client'

import ListTable from '@/components/section/data-table'
import { columnsApplications } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, ApplicationsType } from '@/types/common'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ApplicationsTable() {
  const { data: myApplications, isLoading } = useFetcher<
    ApiResponse<ApplicationsType[]>
  >({
    path: '/job-applications/me',
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Applications</CardTitle>
        <CardDescription>List of applied jobs</CardDescription>
      </CardHeader>
      <CardContent>
        <ListTable
          columns={columnsApplications}
          data={myApplications?.data || []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
