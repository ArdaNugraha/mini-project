'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Banknote } from 'lucide-react'
import { formatRangeRupiah } from '@/utils'
import { Button } from '@/components/ui/button'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, JobType } from '@/types/common'
import { useSession } from 'next-auth/react'
import { OctagonAlert } from 'lucide-react'
import { toast } from 'sonner'
import JobContainerLoading from './loading'

export default function HomepageJobContainer() {
  const { data } = useSession()
  const {
    data: jobs,
    isLoading,
    mutate,
  } = useFetcher<ApiResponse<JobType[]>>({
    path: '/jobs',
  })

  const handleApplyJob = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message)
        return
      }

      mutate()
      toast.success('Apply job successful')
    } catch (error) {
      console.log('error => ', error)
    }
  }

  return (
    <div
      className="container mx-auto flex justify-around items-center flex-col py-14"
      id="jobs"
    >
      <h1 className="text-3xl font-semibold tracking-wider uppercase">Jobs</h1>
      {!isLoading && !jobs?.data.length && (
        <div className="flex justify-center items-center mt-10">
          <Alert variant="default">
            <OctagonAlert />
            <AlertTitle>No jobs have been posted</AlertTitle>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full">
        {isLoading && !jobs?.data.length ? (
          <JobContainerLoading />
        ) : (
          jobs?.data?.map((job, index) => (
            <Card key={String(index)} className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  <Badge variant={job.is_open ? 'default' : 'outline'}>
                    {job.is_open ? 'Open' : 'Close'}
                  </Badge>
                </CardDescription>
                <CardDescription className="flex justify-start items-center">
                  <Banknote />{' '}
                  {formatRangeRupiah(
                    job.min_salary_offered,
                    job.max_salary_offered,
                  )}
                </CardDescription>
                <CardDescription>{job.description}</CardDescription>
              </CardHeader>
              <CardFooter hidden={data?.user.role === 'admin' || !job.is_open}>
                <Button
                  disabled={!!job.is_applied}
                  onClick={() => handleApplyJob(job.id)}
                  size="default"
                >
                  {!!job.is_applied ? 'Applied' : 'Apply'}
                  {/* Apply */}
                </Button>
              </CardFooter>
            </Card>
          )) || null
        )}
      </div>
    </div>
  )
}
