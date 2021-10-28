import { useState } from 'react'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { Banner } from '../../modules/Banner/Banner'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnayticsResult'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { Color } from '../../../types/elements'
import { parseCookies } from 'nookies'
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import { postServicePhoto, SESSION_ID_ERROR } from '../../../api/analyticsAPI'
import Feedback from '../../modules/Review/Review'

type Props = {
  analyticsName: string
  shortDescription: string
  longDescription: string
  examples: string[]
  serviceID: number
}

export const AnalyticsPage = ({
  analyticsName,
  shortDescription,
  longDescription,
  examples,
  serviceID
}: Props) => {

  const [photo, setPhoto] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [result, setResult] = useState<object>()

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
      setResult(res!)
    } catch (err) {
      if ((err as Error).message === SESSION_ID_ERROR) {
        setOpenModal(true)
      } else {
        setErrorMsg((err as Error).message)
      }
    }
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>
      <Banner
        analyticsName={analyticsName}
        shortDescription={shortDescription}
        longDescription={longDescription}
      />
      <div className={styles.container}>
        <Stepper
          steps={['Upload your photo', 'Check your results']}
          activeStep={currentStep}
        />
      </div>
      {currentStep === 1 ? (
        <div className={`${styles.container} ${styles.dropzoneColumns}`}>
          <DropzoneOptions images={examples} onPhotoDrop={setPhoto} />
          {photo && (
            <Button color={Color.Primary} onClick={() => handleAnalytics()}>
              Next Step
            </Button>
          )}
        </div>
      ) :
        result ?
          (
            <div className={`${styles.container} ${styles.dropzoneColumns}`}>
              <AnalyticsResult imageBase64={photo} result={result} errorMsg={errorMsg} />
              <div style={{ marginBottom: "1rem" }}>
                <Button
                  color={Color.Primary}
                  onClick={() => {
                    setCurrentStep(1)
                    setPhoto("")
                    setResult({})
                  }}>
                  Try Again
                </Button>
              </div>
              <Feedback id={serviceID} />
            </div>
          ) :
          <div>Loading result...</div>
      }
    </>
  )
}

export default AnalyticsPage
