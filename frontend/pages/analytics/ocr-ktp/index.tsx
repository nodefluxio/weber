import { AnalyticsPage } from '../../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { getServiceById } from '../../../app/api/analyticsAPI'
import { useState } from 'react'
import { OCRResultResponse } from '../../../app/types/responses'
import { Button } from '../../../app/components/elements/Button/Button'

type Props = {
  name: string
  short_description: string
  long_description: string
}

const OCR_ANALYTICS_ID = 1

const OCR = ({ name, short_description, long_description }: Props) => {
  const [result, setResult] = useState<OCRResultResponse>()
  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        '/assets/images/analytics/ocr-ktp/ktp1.jpg',
        '/assets/images/analytics/ocr-ktp/ktp2.jpeg',
        '/assets/images/analytics/ocr-ktp/ktp3.jpg'
      ]}
      serviceID={OCR_ANALYTICS_ID}
      handleResult={(res) => setResult(res)}>
      {console.log(result)}
      {result && (
        <ul>
          {Object.entries(result).map(([key, value]) => (
            <li key={key}>
              <b>{key}</b>: {value}
            </li>
          ))}
        </ul>
      )}
    </AnalyticsPage>
  )
}

export default OCR

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
