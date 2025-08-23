import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import AdminDashboardJobTable from './job-table'

export default function AdminDashboardContainer() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={[{ title: 'Job', value: 5, description: 'Jobs Opening' }]}
        />
        <Separator />
        <AdminDashboardJobTable />
      </div>
    </div>
  )
}
