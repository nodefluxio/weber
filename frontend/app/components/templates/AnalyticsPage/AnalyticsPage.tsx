import {
  postServicePhoto,
  SESSION_ID_ERROR
} from '../../../../app/api/analyticsAPI'
import { ReactNode, useState } from 'react'
import { parseCookies } from 'nookies'
import { AnalyticsContainer } from '../../../components/modules/AnalyticsContainer/AnalyticsContainer'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { Button } from '../../elements/Button/Button'
import { AnalyticsResultWrapper } from '../../modules/AnalyticsResultWrapper/AnayticsResultWrapper'
import { Color } from '../../../types/elements'
import styles from './AnalyticsPage.module.scss'

type Props = {
  analyticsName: string
  shortDescription: string
  longDescription: string
  children: ReactNode
  examples: string[]
  serviceID: number
  handleResult: (res: any) => void
  addionalStepOneNode?: ReactNode
}

export const AnalyticsPage: React.FC<Props> = ({
  analyticsName,
  shortDescription,
  longDescription,
  children,
  examples,
  serviceID,
  handleResult,
  addionalStepOneNode
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
      const res = await postServicePhoto(serviceID, session_id, photo)
      handleResult(res)
      setIsResult(true)
    } catch (err) {
      if ((err as Error).message === SESSION_ID_ERROR) {
        setOpenModal(true)
        setCurrentStep(1)
      } else {
        setErrorMsg((err as Error).message)
        setIsResult(false)
      }
    }
  }

  return (
    <AnalyticsContainer
      analyticsName={analyticsName}
      shortDescription={shortDescription}
      longDescription={longDescription}
      currentStep={currentStep}
      openModal={openModal}
      onModalClose={() => setOpenModal(false)}>
      <div className={styles.container}>
        {currentStep === 1 && (
          <div className={styles.dropzoneColumns}>
            {addionalStepOneNode}
            <DropzoneOptions images={examples} onPhotoDrop={setPhoto} />
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
          <AnalyticsResultWrapper
            imageBase64={photo}
            handleTryAgain={() => {
              setCurrentStep(1)
              setPhoto('')
              handleResult(undefined)
              setIsResult(false)
            }}>
            {isResult ? (
              children
            ) : errorMsg ? (
              <div>{errorMsg}</div>
            ) : (
              <div>Loading your results... Please wait</div>
            )}
          </AnalyticsResultWrapper>
        )}
      </div>
    </AnalyticsContainer>
  )
}
