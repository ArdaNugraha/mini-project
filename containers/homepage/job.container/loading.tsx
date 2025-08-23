import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function JobContainerLoading() {
  return (
    <>
      {[...Array(4).keys()].map((index) => (
        <Card key={String(index)} className="w-full">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-4 w-[250px]" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-[150px]" />
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-4 w-[100px]" />
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
