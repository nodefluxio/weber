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
    // Error message passed
    if (typeof res !== 'undefined') {
      if (typeof res === 'string') {
        return <div>{res}</div>
      }

      if (isOCRReceipt(res)) {
        return <ReceiptDisplay result={res} />
      } else {
        return (
          <pre>
            <code>{JSON.stringify(res, null, 2)}</code>
          </pre>
        )
      }
    } else {
      return (
        <div>
          {'There is a problem on our analytics. Please use another photo.'}
        </div>
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
        longDescription={long_description}
        examples={[
          `/assets/images/innovations/${slug}/example1.jpg`,
          `/assets/images/innovations/${slug}/example2.jpg`,
          `/assets/images/innovations/${slug}/example3.jpg`
        ]}
        serviceID={id}
        slug={slug}
        handleResult={(res) => setRes(res)}
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
