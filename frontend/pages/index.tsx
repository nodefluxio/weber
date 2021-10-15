import axios from 'axios'
import type { GetStaticProps } from 'next'
import type { Service } from '../app/types/elements'
import type { ServicesGetResponse } from '../app/types/responses'
import { HomePage } from '../app/components/templates/HomePage/HomePage'

type Props = {
  analytics: Service[]
  solutions: Service[]
}

const Home = ({ analytics, solutions }: Props) => {
  return <HomePage analytics={analytics} solutions={solutions} />
}

export const getStaticProps: GetStaticProps = async () => {
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

  return {
    props: { analytics, solutions }
  }
}

export default Home
