import axios from 'axios'
import type { GetServerSideProps } from 'next'
import type { Service } from '../app/types/elements'
import type { ServicesGetResponse } from '../app/types/responses'
import { HomePage } from '../app/components/templates/HomePage/HomePage'

type Props = {
  analytics: Service[]
  solutions: Service[]
  innovations: Service[]
}

const Home = ({ analytics, solutions, innovations }: Props) => {
  return (
    <HomePage
      analytics={analytics}
      solutions={solutions}
      innovations={innovations}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const getAllServices = async (type: string): Promise<Service[]> => {
    try {
      const res = await axios.get<ServicesGetResponse>(`/services?type=${type}`)
      return res.data.data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const analytics = await getAllServices('analytic')
  const solutions = await getAllServices('solution')
  const innovations = await getAllServices('innovation')

  return {
    props: { analytics, solutions, innovations }
  }
}

export default Home
