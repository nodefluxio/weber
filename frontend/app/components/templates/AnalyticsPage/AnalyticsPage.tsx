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
import { postInnovation } from '@/api/innovationsAPI'
import { CustomError } from 'app/errors/CustomError'
import { Spinner } from 'app/components/elements/Spinner/Spinner'

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
  addionalStepOneNode?: ReactNode
  isInnovation?: boolean
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
  addionalStepOneNode,
  isInnovation
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
      const res = isInnovation
        ? await postInnovation(serviceID, session_id, photo)
        : await postServicePhoto(serviceID, session_id, photo)
      handleResult(res)
      setIsResult(true)
    } catch (err) {
      if (err instanceof CustomError && err.statusCode === 401) {
        setOpenModal(true)
        setCurrentStep(1)
      } else {
        console.error(err)
        setErrorMsg((err as Error).message)
      }
      setIsResult(false)
    }
  }

  const refreshState = () => {
    setCurrentStep(1)
    setPhoto('')
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
      onModalClose={() => setOpenModal(false)}>
      <div className={styles.container}>
        {currentStep === 1 && (
          <div className={styles.dropzoneNButton}>
            {addionalStepOneNode}
            <DropzoneOptions
              images={examples}
              onPhotoDrop={setPhoto}
              maxSize={maxImageSize}
              acceptedFileFormat={acceptedFileFormat}
            />
            {photo && (
              <div className={styles.buttonContainer}>
                <Button color={Color.Primary} onClick={handleAnalytics}>
                  Next Step
                </Button>
              </div>
            )}
          </div>
        )}
        {currentStep === 2 && (
          <>
            <AnalyticsResultWrapper
              imageBase64={photo}
              handleTryAgain={() => refreshState()}>
              {isResult ? (
                children
              ) : errorMsg ? (
                <div>{errorMsg}</div>
              ) : (
                <div className={styles.loadingState}>
                  <h3>Loading your results...</h3>
                  <Spinner />
                  <p>Please wait a moment</p>
                </div>
              )}
            </AnalyticsResultWrapper>
            {isResult && (
              <Feedback id={serviceID} onTryAgain={() => refreshState()} />
            )}
          </>
        )}
      </div>
    </AnalyticsContainer>
  )
}
