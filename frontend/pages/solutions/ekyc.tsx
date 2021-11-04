import { getServiceBySlug } from '../../app/api/analyticsAPI'
import { EkycPage } from '../../app/components/templates/EkycPage/EkycPage'

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
