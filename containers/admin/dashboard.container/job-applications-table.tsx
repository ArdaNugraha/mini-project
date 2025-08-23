'use client'

import { Drawer, DrawerTitle, DrawerContent } from '@/components/ui/drawer'
import ListTable from '@/components/section/data-table'
import { columnsJobApplications } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, JobApplicationsType } from '@/types/common'
import { toast } from 'sonner'

type AdminDashboardJobApplicationsTableProps = {
  open: string | number
  onOpen: () => void
}

export default function AdminDashboardJobApplicationsTable({
  open,
  onOpen,
}: AdminDashboardJobApplicationsTableProps) {
  const {
    data: jobsApplications,
    isLoading,
    mutate,
  } = useFetcher<ApiResponse<JobApplicationsType[]>>({
    enabled: !!open,
    path: !!open ? `/jobs/${open}/applicants` : '',
  })

  const handleClickAction = async ({
    id,
    status,
  }: {
    id: string
    status: string
  }) => {
    try {
      const response = await fetch(`/api/job-applications/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Update status successful')
        mutate()
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  const columns = columnsJobApplications(handleClickAction)

  return (
    <Drawer open={!!open} onOpenChange={onOpen}>
      <DrawerContent>
        <DrawerTitle className="text-center">
          Detail Job Applications
        </DrawerTitle>

        <div className="max-h-[90vh] overflow-y-auto container p-4 w-full mx-auto">
          <ListTable
            columns={columns}
            data={jobsApplications?.data || []}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
