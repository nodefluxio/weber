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
  short_description,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [result, setResult] = useState<any>()

  return (
    <>
      <Head>
        <title>{`Solution | ${name} - Demo`}</title>
      </Head>
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
