import { getServiceBySlug } from '@/api/analyticsAPI'
import { ServiceBySlugResponseData } from '@/types/responses'
import Head from 'next/head'
import { OCRReceiptPage } from '@/templates/OCRReceiptPage/OCRReceiptPage'

const OCRReceipt = ({
  name,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  return (
    <>
      <Head>
        <title>{`Innovation | ${name} - Demo`}</title>
      </Head>
      <OCRReceiptPage
        id={id}
        long_description={long_description}
        name={name}
        slug={slug}
      />
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
