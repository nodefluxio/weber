import { getServiceById } from '../../app/api/analyticsAPI'
import { EkycPage } from '../../app/components/templates/EkycPage/EkycPage'

const EKYC_SOLUTION_ID = 5

interface Props {
  id: number
  name: string
  short_description: string
  long_description: string
}

const Ekyc: React.FC<Props> = ({
  id,
  name,
  short_description,
  long_description
}) => {
  return (
    <>
      <EkycPage
        serviceId={id}
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
    return {
      notFound: true
    }
  }
}

export default Ekyc
