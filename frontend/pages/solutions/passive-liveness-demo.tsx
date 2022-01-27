import Head from 'next/head'
import { PassiveLivenessDemoPage } from '@/templates/PassiveLivenessPage/PassiveLivenessDemoPage'
import { getServiceBySlug } from '../../app/api/analyticsAPI'

interface Props {
  //   id: number
  name: string
  long_description: string
}

const Ekyc: React.FC<Props> = ({ name, long_description }) => {
  return (
    <>
      <Head>
        <title>{`Solution | ${name} - Demo`}</title>
      </Head>
      <PassiveLivenessDemoPage
        //   serviceId={id}
        name={name}
        longDesc={long_description}
      />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('passive-liveness-demo')
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

export default Ekyc
