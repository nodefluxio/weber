import { getServiceBySlug } from '@/api/analyticsAPI'
import { CodeSnippet } from '@/elements/CodeSnippet/CodeSnippet'
import { ReceiptDisplay } from '@/modules/ReceiptDisplay/ReceiptDisplay'
import { AnalyticsPage } from '@/templates/AnalyticsPage/AnalyticsPage'
import { ServiceBySlugResponseData } from '@/types/responses'
import { isOCRReceipt } from '@/utils/utils'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'
import Head from 'next/head'
import { useState } from 'react'
import { postInnovation } from './../../app/api/innovationsAPI'

const OCRReceipt = ({
  name,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [res, setRes] = useState()
  const MAX_IMAGE_SIZE = 3000000 // 3MB
  const renderResult = () => {
    // Error message passed
    if (typeof res !== 'undefined') {
      if (typeof res === 'string') {
        return <WarningDiv message={res} />
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
        handlePost={(session_id, photo) => postInnovation(id, session_id, photo)}
        handleResult={(res) => setRes(res)}
        maxImageSize={MAX_IMAGE_SIZE}
        acceptedFileFormat={'image/jpeg, image/png'}>
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
