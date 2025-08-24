import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import ApplicationsTable from './applications-table'

async function getReportSummary() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL_DOMAIN}/api/dashboard/report-summary`,
    { cache: 'no-store', credentials: 'include' },
  )

  if (!res.ok) {
    return { totalApplications: 0, totalJobs: 0 }
  }

  const data = await res.json()
  return {
    totalApplications: data.totalApplications || 0,
    totalJobs: data.totalJobs || 0,
  }
}

export default async function ApplicantDashboardContainer() {
  const { totalApplications, totalJobs } = await getReportSummary()

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={[
            {
              title: 'Applications',
              value: totalApplications,
              description: 'Total applications submitted',
            },
            {
              title: 'Available Jobs',
              value: totalJobs,
              description: 'Open positions available',
            },
          ]}
        />
        <Separator />
        <ApplicationsTable />
      </div>
    </div>
  )
}
