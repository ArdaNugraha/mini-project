import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Paperclip,
} from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { JobType, JobApplicationsType, ApplicationsType } from '@/types/common'
import { formatRangeRupiah } from '@/utils'
import { ValueJobType } from '@/types/common'
import { Badge } from '@/components/ui/badge'
import { jobStatusArray } from '..'
import { format } from 'date-fns'
import { formatLocal } from '@/lib/date'

export const columnsJobs = (
  onClickAction: ({ data, type }: ValueJobType) => void,
): ColumnDef<JobType>[] => [
  {
    header: 'Open',
    size: 50,
    cell: ({ row }) => (
      <Badge variant={row.original.is_open ? 'default' : 'outline'}>
        {row.original.is_open ? <CheckCircle2 /> : <XCircle />}{' '}
        {row.original.is_open ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <p>{row.getValue('title')}</p>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 200,
    cell: ({ row }) => (
      <p className="whitespace-normal break-words">
        {row.getValue('description')}
      </p>
    ),
  },
  {
    header: 'Salary Offered',
    cell: ({ row }) => (
      <p>{`${formatRangeRupiah(
        row.original.min_salary_offered,
        row.original.max_salary_offered,
      )}`}</p>
    ),
  },
  {
    accessorKey: 'applicants_total',
    header: 'Applicants',
    size: 100,
    cell: ({ row }) => <p>{row.getValue('applicants_total')}</p>,
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onClickAction({
                  data: {
                    id: row.original.id,
                  },
                  type: 'view',
                })
              }
            >
              View Applicants
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onClickAction({
                  data: {
                    ...row.original,
                    min_salary_offered: String(row.original.min_salary_offered),
                    max_salary_offered: String(row.original.max_salary_offered),
                  },
                  type: 'edit',
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                const confirm = window.confirm(
                  'Are you sure want delete this data ?',
                )
                if (confirm) {
                  onClickAction({
                    data: {
                      ...row.original,
                      min_salary_offered: String(
                        row.original.min_salary_offered,
                      ),
                      max_salary_offered: String(
                        row.original.max_salary_offered,
                      ),
                    },
                    type: 'delete',
                  })
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export const columnsJobApplications = (
  onClickAction: ({ id, status }: { id: string; status: string }) => void,
): ColumnDef<JobApplicationsType>[] => [
  {
    header: 'Full Name',
    cell: ({ row }) => <p>{row.original.applicant.full_name}</p>,
  },
  {
    header: 'Phone',
    cell: ({ row }) => <p>{row.original.applicant.phone}</p>,
  },
  {
    header: 'Summary',
    size: 200,
    cell: ({ row }) => (
      <p className="whitespace-normal break-words">
        {row.original.applicant.summary}
      </p>
    ),
  },
  {
    header: 'Salary Expectation',
    cell: ({ row }) => (
      <p>{`${formatRangeRupiah(
        row.original.applicant.min_salary_expectation,
        row.original.applicant.max_salary_expectation,
      )}`}</p>
    ),
  },
  {
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {String(row.original.status).replaceAll('_', ' ')}
      </Badge>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => (
      <Select
        value={row.original.status}
        onValueChange={(value) =>
          onClickAction({ id: row.original.id, status: value })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent className="capitalize">
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {jobStatusArray.map((status) => (
              <SelectItem
                key={status}
                value={status}
                disabled={status === row.original.status}
              >
                {String(status).replaceAll('_', ' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    ),
  },
]

export const columnsApplications: ColumnDef<ApplicationsType>[] = [
  {
    header: 'Job Title',
    cell: ({ row }) => <p>{row.original.job.title}</p>,
  },
  {
    header: 'Job Description',
    cell: ({ row }) => <p>{row.original.job.description}</p>,
  },
  {
    header: 'Job Salary Offered',
    cell: ({ row }) => (
      <p>{`${formatRangeRupiah(
        row.original.job.min_salary_offered,
        row.original.job.max_salary_offered,
      )}`}</p>
    ),
  },
  {
    header: 'Applied At',
    cell: ({ row }) => (
      <p>{format(formatLocal(row.original.created_at), 'dd MMM yyyy hh:mm')}</p>
    ),
  },
  {
    header: 'Status',
    cell: ({ row }) => (
      <Badge className="capitalize">
        {String(row.original.status).replaceAll('_', ' ')}
      </Badge>
    ),
  },
  {
    header: 'Logs',
    cell: ({ row }) => (
      <div>
        <ul className="list-disc space-y-2">
          {row.original.status_log.map((log, index) => (
            <li key={String(index)}>
              <p>
                <Badge
                  variant={
                    row.original.status_log.length - 1 === index
                      ? 'default'
                      : 'secondary'
                  }
                  className="capitalize"
                >
                  {String(log.status).replaceAll('_', ' ')}
                </Badge>{' '}
                <small className="flex items-center gap-1">
                  <Clock size="10" />
                  {format(formatLocal(log.created_at), 'dd MMM yyyy kk:mm')}
                </small>
                <small className="flex items-center gap-1">
                  <Paperclip size="10" />
                  {log.note}
                </small>
              </p>
              <p></p>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
]
