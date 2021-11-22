// import { getServiceBySlug } from '@/api/analyticsAPI'
import { ReceiptDisplay } from '@/modules/ReceiptDisplay'
import { AnalyticsPage } from '@/templates/AnalyticsPage/AnalyticsPage'
import { ServiceBySlugResponseData } from '@/types/responses'
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
        handleResult={(res) => setRes(res)}
        isInnovation>
        <ReceiptDisplay result={res} />
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
  // const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
  // console.log(params)
  // await delay(500)
  // if (params) {
  //   try {
  // const res = await getServiceBySlug(params.innovation_name)
  //     return {
  //       props: {
  //         ...res?.data
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e)
  //     return { notFound: true }
  //   }
  // } else {
  //   return { notFound: true }
  // }
  try {
    const res: ServiceBySlugResponseData = {
      name: 'OCR Receipt',
      short_description: 'This is a short description',
      long_description: 'This is a long description',
      id: 7,
      slug: 'ocr-receipt',
      type: 'innovation',
      thumbnail: 'ocr-receipt.jpg',
      created_at: '',
      updated_at: ''
    }
    return { props: res }
  } catch (e) {
    return { notFound: true }
  }
}
