import type { GetStaticProps, NextPage } from 'next'
import { getServiceById } from '../../app/api/analyticsAPI'
import { EkycPage } from '../../app/components/templates/EkycPage/EkycPage'

const EKYC_SOLUTION_ID = 5

interface Props {
  name: string
  short_description: string
  long_description: string
}

const Ekyc: React.FC<Props> = ({
  name,
  short_description,
  long_description
}) => {
  return (
    <>
      <EkycPage
        name={name}
        shortDesc={short_description}
        longDesc={long_description}
      />
    </>
  )
}

export const getStaticProps = async () => {
  try {
    const res = await getServiceById(EKYC_SOLUTION_ID)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return (e as Error).message
  }
}

export default Ekyc
