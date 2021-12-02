import { getServiceBySlug } from '@/api/analyticsAPI'
import { CodeSnippet } from '@/elements/CodeSnippet/CodeSnippet'
import { ReceiptDisplay } from '@/modules/ReceiptDisplay/ReceiptDisplay'
import { AnalyticsPage } from '@/templates/AnalyticsPage/AnalyticsPage'
import { ServiceBySlugResponseData } from '@/types/responses'
import { isOCRReceipt } from '@/utils/utils'
import Head from 'next/head'
import { useState } from 'react'

const OCRReceipt = ({
  name,
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
        return <CodeSnippet lang="json" code={JSON.stringify(res, null, 3)} />
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

export default OCRReceipt

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('ocr-receipt')
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return { notFound: true }
  }
}
