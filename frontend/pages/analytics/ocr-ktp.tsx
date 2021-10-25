import AnalyticsPage from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { getServiceById } from '../../app/api/analyticsAPI'

interface Props {
  name: string,
  short_description: string,
  long_description: string
}

const OCR_ANALYTICS_ID = 1

export const getStaticProps = async () => {
  try {
    const res = await getServiceById(OCR_ANALYTICS_ID)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return (e as Error).message
  }
}

const OCR: React.FC<Props> = ({ name, short_description, long_description }) => {

  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        '/assets/images/ktp1.jpg',
        '/assets/images/ktp2.jpeg',
        '/assets/images/ktp3.jpg'
      ]}
      serviceID={OCR_ANALYTICS_ID}
    />
  )
}

export default OCR
