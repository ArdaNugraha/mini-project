import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'

export default function HomepageMainContainer() {
  return (
    <div className="container mx-auto flex justify-around items-center py-14">
      <div className="flex justify-center items-center flex-col">
        <p className="text-8xl mb-8 font-semibold text-center">
          Find your job Here!
        </p>
        <Link href="#jobs" target="_self">
          <Button size="lg">
            Explore Jobs <Search />
          </Button>
        </Link>
      </div>
      <Image
        className="hidden lg:block"
        src="/images/job-seeker.svg"
        alt="job-seeker"
        width={800}
        height={800}
        priority
      />
    </div>
  )
}
