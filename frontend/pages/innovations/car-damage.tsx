import { getServiceBySlug } from '@/api/analyticsAPI'
import { CarDamagePage } from '@/templates/CarDamage/CarDamagePage'
import Head from 'next/head'

interface Props {
  id: number
  name: string
  long_description: string
}

const CarDamage = (props: Props) => {
  return (
    <>
      <Head>
        <title>{`Innovation | ${props.name} - Demo`}</title>
      </Head>
      <CarDamagePage {...props} />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('car-damage')
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

export default CarDamage
