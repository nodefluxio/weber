import { postInnovation } from '@/api/innovationsAPI'
import { CodeSnippet } from '@/elements/CodeSnippet/CodeSnippet'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'
import { ReceiptDisplay } from '@/modules/ReceiptDisplay/ReceiptDisplay'
import { isOCRReceipt } from '@/utils/utils'
import { MAX_IMAGE_SIZE } from 'app/constants/constant'
import { useState } from 'react'
import { AnalyticsPage } from '../AnalyticsPage/AnalyticsPage'

type Props = {
  name: string
  long_description: string
  id: number
  slug: string
}

export const OCRReceiptPage = ({ name, long_description, id, slug }: Props) => {
  const [res, setRes] = useState()
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
      acceptedFileFormat={'image/jpeg, image/png'}
      customBannerUrl={'/assets/images/innovations/ocr-receipt/banner.png'}>
      {renderResult()}
    </AnalyticsPage>
  )
}
