import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  const [photo, setPhoto] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const checkSessionId = () => {
    const { session_id } = parseCookies()
    if (session_id) {
      setCurrentStep(2)
    } else {
      setOpenModal(true)
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
      {/* TODO: Butuh pembenahan... refactor? */}
      {currentStep === 1 ? (
        <div className={`${styles.container} ${styles.dropzoneColumns}`}>
          <DropzoneOptions images={examples} onPhotoDrop={setPhoto} />
          {photo && (
            <Button color={Color.Primary} onClick={() => checkSessionId()}>
              Next Step
            </Button>
          )}
        </div>
      ) : (
        <div className={`${styles.container} ${styles.dropzoneColumns}`}>
          <AnalyticsResult imageBase64={photo} serviceID={serviceID}/>
          <Button
            color={Color.Primary}
            onClick={() => {
              setCurrentStep(1)
              setPhoto('')
            }}>
            Try Again
          </Button>
        </div>
      )}
    </>
  )
}

export default AnalyticsPage
