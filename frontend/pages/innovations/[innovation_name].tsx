import { getServiceBySlug } from '@/api/analyticsAPI'
import { ReceiptDisplay } from '@/modules/ReceiptDisplay/ReceiptDisplay'
import { AnalyticsPage } from '@/templates/AnalyticsPage/AnalyticsPage'
import { ServiceBySlugResponseData } from '@/types/responses'
import { isOCRReceipt } from '@/utils/utils'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { useState } from 'react'

const Innovations = ({
  name,
  short_description,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [res, setRes] = useState()
  const renderResult = () => {
    if (isOCRReceipt(res)) {
      return <ReceiptDisplay result={res} />
    } else {
      // Fallback
      return (
        <pre style={{ maxHeight: '240px', overflowY: 'auto' }}>
          {JSON.stringify(res, null, 2)}
        </pre>
      )
    }
  }

  return (
    <>
      <Head>
        <title>{`Innovation | ${name} - Demo`}</title>
      </Head>
      <AnalyticsPage
        analyticsName={name}
        shortDescription={short_description}
        longDescription={long_description}
        examples={[]}
        serviceID={id}
        slug={slug}
        handleResult={res => setRes(res)}
        isInnovation>
        {renderResult()}
      </AnalyticsPage>
    </>
  )
}

export default Innovations

interface Params extends ParsedUrlQuery {
  innovation_name: string
}

export const getServerSideProps: GetServerSideProps<any, Params> = async ({
  params
}) => {
  if (params) {
    try {
      const res = await getServiceBySlug(params.innovation_name)
      return {
        props: {
          ...res?.data
        }
      }
    } catch (e) {
      console.error(e)
      return { notFound: true }
    }
  } else {
    return { notFound: true }
  }
}
