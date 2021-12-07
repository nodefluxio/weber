import axios from 'axios'
import Head from 'next/head'
import type { GetServerSideProps } from 'next'
import type { Service } from '../app/types/elements'
import type { ServicesGetResponse } from '../app/types/responses'
import { HomePage } from '../app/components/templates/HomePage/HomePage'

type Props = {
  analytics: Service[]
  solutions: Service[]
  solutionPartners: Service[]
  innovations: Service[]
}

const Home = ({ analytics, solutions, solutionPartners, innovations }: Props) => {
  return (
    <>
      <Head>
        <title>Nodeflux Demo App</title>
      </Head>
      <HomePage
        analytics={analytics}
        solutions={solutions}
        innovations={innovations}
        solutionPartners={solutionPartners}
      />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const getAllServices = async (): Promise<Service[]> => {
    try {
      const res = await axios.get<ServicesGetResponse>(`/services`)
      return res.data.data
    } catch (error) {
      console.error(error)
      return []
    }
  }
  const services = await getAllServices()
  const analytics = services.filter((service) => service.type === 'analytic')
  const solutions = services.filter((service) => service.type === 'solution')
  const solutionPartners = services.filter((service) => service.type === 'solution-partner')
  const innovations = services.filter(
    (service) => service.type === 'innovation'
  )

  return {
    props: { analytics, solutions, solutionPartners, innovations }
  }
}

export default Home
