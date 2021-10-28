import { AnalyticsPage } from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useState } from 'react'
import { getServiceBySlug } from '../../app/api/analyticsAPI'
import {
  AnyResultResponse,
  FMEResultResponse,
  LPRResultResponse,
  OCRResultResponse,
  ServiceBySlugResponseData
} from '../../app/types/responses'
import { AnalyticsSlug } from '../../app/types/elements'
import {
  FMEResult,
  LPRResult,
  OCRResult
} from '../../app/components/modules/AnalyticsResult/AnalyticsResult'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

const Analytics = ({
  name,
  short_description,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [result, setResult] = useState<AnyResultResponse>()

  const displayResult = () => {
    if (result)
      switch (slug) {
        case AnalyticsSlug.FACE_MATCH_ENROLLMENT:
          return <FMEResult result={result as FMEResultResponse} />
        case AnalyticsSlug.LICENSE_PLATE_RECOGNITION:
          return <LPRResult result={result as LPRResultResponse} />
        case AnalyticsSlug.OCR_KTP:
          return <OCRResult result={result as OCRResultResponse} />
        default:
          return <div>{result}</div>
      }
  }

  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        `/assets/images/analytics/${slug}/example1.jpg`,
        `/assets/images/analytics/${slug}/example2.jpg`,
        `/assets/images/analytics/${slug}/example3.jpg`
      ]}
      serviceID={id}
      handleResult={(res) => setResult(res)}>
      {result && displayResult()}
    </AnalyticsPage>
  )
}

export default Analytics

interface Params extends ParsedUrlQuery {
  analytic_name: string
}

export const getServerSideProps: GetServerSideProps<any, Params> = async ({
  params
}) => {
  try {
    const res = await getServiceBySlug(params!.analytic_name)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
