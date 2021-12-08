import Head from 'next/head'
import { AnalyticsPage } from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useState } from 'react'
import { getServiceBySlug } from '../../app/api/analyticsAPI'
import { ServiceBySlugResponseData } from '../../app/types/responses'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { AnalyticsResult } from '../../app/components/modules/AnalyticsResult/AnalyticsResult'

const Analytics = ({
  name,
  long_description,
  special_instruction,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [result, setResult] = useState<any>()
  const MAX_IMAGE_SIZE = 800000 // 800kB
  return (
    <>
      <Head>
        <title>{`Analytic | ${name} - Demo`}</title>
      </Head>
      <AnalyticsPage
        analyticsName={name}
        longDescription={long_description}
        specialInstruction={special_instruction}
        examples={[
          `/assets/images/analytics/${slug}/example1.jpg`,
          `/assets/images/analytics/${slug}/example2.jpg`,
          `/assets/images/analytics/${slug}/example3.jpg`
        ]}
        serviceID={id}
        slug={slug}
        handleResult={(res) => setResult(res)}
        maxImageSize={MAX_IMAGE_SIZE}
        acceptedFileFormat={'image/jpeg'}>
        <AnalyticsResult result={result} slug={slug} />
      </AnalyticsPage>
    </>
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
