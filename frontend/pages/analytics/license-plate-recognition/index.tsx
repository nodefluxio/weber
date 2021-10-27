import { AnalyticsPage } from '../../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { getServiceById } from '../../../app/api/analyticsAPI'
import { useState } from 'react'
import { LPRResultResponse } from '../../../app/types/responses'

type Props = {
  name: string
  short_description: string
  long_description: string
}

const LPR_ANALYTICS_ID = 2

const LPR = ({ name, short_description, long_description }: Props) => {
  const [result, setResult] = useState<LPRResultResponse>()

  const displayResult = () => {
    const { bounding_box, confidence, detected, license_plate_number } =
      result!.license_plate_recognitions[0]
    return (
      <div>
        <ul>
          <p>Bounding Box</p>
          <li>width : {bounding_box.width}</li>
          <li>height : {bounding_box.height}</li>
          <li>top : {bounding_box.top}</li>
          <li>left : {bounding_box.left}</li>
        </ul>
        <li>confidence: {confidence}</li>
        <li>detected: {detected}</li>
        <li>license_plate_number: {license_plate_number}</li>
      </div>
    )
  }

  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        '/assets/images/analytics/license-plate-recognition/example1.jpg',
        '/assets/images/analytics/license-plate-recognition/example2.jpg',
        '/assets/images/analytics/license-plate-recognition/example3.png'
      ]}
      serviceID={LPR_ANALYTICS_ID}
      handleResult={(res) => setResult(res)}>
      {result && <div>{displayResult()}</div>}
    </AnalyticsPage>
  )
}

export default LPR

export const getStaticProps = async () => {
  try {
    const res = await getServiceById(LPR_ANALYTICS_ID)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return (e as Error).message
  }
}
