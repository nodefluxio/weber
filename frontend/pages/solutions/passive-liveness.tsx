import Head from 'next/head'
import { PassiveLivenessPage } from '@/templates/PassiveLivenessPage/PassiveLivenessPage'
import { getServiceBySlug } from '../../app/api/analyticsAPI'

interface Props {
  id: number
  name: string
  long_description: string
}

const PassiveLiveness: React.FC<Props> = ({ id, name, long_description }) => {
  return (
    <>
      <Head>
        <title>{`Solution | ${name} - Demo`}</title>
      </Head>
      <PassiveLivenessPage
        serviceId={id}
        name={name}
        longDesc={long_description}
      />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('passive-liveness')
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return {
      notFound: true
    }
  }
}

export default PassiveLiveness
