import Head from 'next/head'
import { getServiceBySlug } from '../../app/api/analyticsAPI'
import { EkycPage } from '../../app/components/templates/EkycPage/EkycPage'

interface Props {
  id: number
  name: string
  long_description: string
}

const Ekyc: React.FC<Props> = ({ id, name, long_description }) => {
  return (
    <>
      <Head>
        <title>{`Solution | ${name} - Demo`}</title>
      </Head>
      <EkycPage serviceId={id} name={name} longDesc={long_description} />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('ekyc')
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
