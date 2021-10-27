import { AnalyticsPage } from '../../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { getServiceById } from '../../../app/api/analyticsAPI'
import { useEffect, useState } from 'react'
import { FMEResultResponse } from '../../../app/types/responses'

type Props = {
  name: string
  short_description: string
  long_description: string
}

const FACEMATCH_ANALYTICS_ID = 3

const FaceMatch = ({ name, short_description, long_description }: Props) => {
  const [result, setResult] = useState<FMEResultResponse>()

  const displayResult = () => {
    const { match, similarity } = result!.face_match
    return (
      <div>
        <ul>
          <li>match : {match ? 'true' : 'false'}</li>
          <li>similarity : {similarity}</li>
        </ul>
      </div>
    )
  }
  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        '/assets/images/analytics/face-match-enrollment/barry-allen.jpg',
        '/assets/images/analytics/face-match-enrollment/kokoh.jpg',
        '/assets/images/analytics/face-match-enrollment/jimmy.jpg'
      ]}
      serviceID={FACEMATCH_ANALYTICS_ID}
      handleResult={(res) => setResult(res)}>
      {result && <div>{displayResult()}</div>}
    </AnalyticsPage>
  )
}

export default FaceMatch

export const getStaticProps = async () => {
  try {
    const res = await getServiceById(FACEMATCH_ANALYTICS_ID)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return (e as Error).message
  }
}
