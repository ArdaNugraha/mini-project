import HomepageMainContainer from '@/containers/homepage/main.container'
import HomepageFeatureContainer from '@/containers/homepage/feature.container'
import HomepageJobContainer from '@/containers/homepage/job.container'

export default function Home() {
  return (
    <div>
      <HomepageMainContainer />
      <HomepageFeatureContainer />
      <HomepageJobContainer />
    </div>
  )
}
