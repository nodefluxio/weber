import { postServicePhoto } from '../../../../app/api/analyticsAPI'
import { ReactNode, useState } from 'react'
import { parseCookies } from 'nookies'
import { AnalyticsContainer } from '../../modules/AnalyticsContainer/AnalyticsContainer'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { Button } from '../../elements/Button/Button'
import { AnalyticsResultWrapper } from '../../modules/AnalyticsResultWrapper/AnayticsResultWrapper'
import Feedback from '../../modules/Feedback/Feedback'
import { Color } from '../../../types/elements'
import styles from './AnalyticsPage.module.scss'
import { CustomError } from 'app/errors/CustomError'
import { Spinner } from 'app/components/elements/Spinner/Spinner'
import { WarningDiv } from '@/elements/WarningDiv/WarningDiv'

type Props = {
  analyticsName: string
  longDescription: string
  children: ReactNode
  examples: string[]
  serviceID: number
  slug: string
  handleResult: (res: any) => void
  maxImageSize: number
  acceptedFileFormat: string
  handlePost?: (session_id: string, photo: string) => Promise<unknown>
  customBannerUrl?: string
}

export const AnalyticsPage: React.FC<Props> = ({
  analyticsName,
  longDescription,
  children,
  examples,
  serviceID,
  slug,
  handleResult,
  maxImageSize,
  acceptedFileFormat,
  handlePost,
  customBannerUrl
}) => {
  const [photo, setPhoto] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [isResult, setIsResult] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleAnalytics = async () => {
    const { session_id } = parseCookies()
    if (session_id) {
      setCurrentStep(2)
      await resolveAnalytics(session_id)
    } else {
      setOpenModal(true)
    }
  }

  const resolveAnalytics = async (session_id: string) => {
    try {
      const res = handlePost
        ? await handlePost(session_id, photo)
        : await postServicePhoto(serviceID, session_id, photo)
      handleResult(res)
      setIsResult(true)
    } catch (err) {
      if (err instanceof CustomError) {
        switch (err.statusCode) {
          case 400:
            setErrorMsg(err.message)
            break
          case 401:
            setOpenModal(true)
            setCurrentStep(1)
            break
          case 500:
            setErrorMsg(
              'Internal server error. Please contact the administrator or try again later'
            )
        }
      }
      setIsResult(false)
    }
  }

  const refreshState = () => {
    setCurrentStep(1)
    setPhoto('')
    setErrorMsg('')
    handleResult(undefined)
    setIsResult(false)
  }

  return (
    <AnalyticsContainer
      analyticsName={analyticsName}
      longDescription={longDescription}
      currentStep={currentStep}
      openModal={openModal}
      slug={slug}
      onModalClose={() => setOpenModal(false)}
      customBannerUrl={customBannerUrl}>
      <div className="container w-[90%] mx-auto pt-6 pb-12">
        {currentStep === 1 && (
          <div className="flex flex-col items-center">
            <DropzoneOptions
              images={examples}
              onPhotoDrop={setPhoto}
              maxSize={maxImageSize}
              acceptedFileFormat={acceptedFileFormat}
            />
            {photo && (
              <div className="mt-8">
                <Button color={Color.Primary} onClick={handleAnalytics}>
                  Next Step
                </Button>
              </div>
            )}
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <AnalyticsResultWrapper
              imageBase64={photo}
              handleTryAgain={() => refreshState()}>
              {isResult ? (
                children
              ) : errorMsg ? (
                <WarningDiv
                  message={errorMsg}
                  className={styles.analyticsWarning}
                />
              ) : (
                <div className={styles.loadingState}>
                  <h3>Loading your results...</h3>
                  <Spinner />
                  <p>Please wait a moment</p>
                </div>
              )}
            </AnalyticsResultWrapper>
            {(isResult || errorMsg) && (
              <Feedback id={serviceID} onTryAgain={() => refreshState()} />
            )}
          </div>
        )}
      </div>
    </AnalyticsContainer>
  )
}
