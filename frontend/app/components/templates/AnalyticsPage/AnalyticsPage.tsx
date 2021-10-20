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
import useSWR from 'swr'
import axios from 'axios'
import { AnalyticsResponse } from '../../../types/responses'
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
  const [sessionId, setSessionId] = useState('')

  const fetcher = async (url: string) => {
    if (url) {
      try {
        const res = await axios.post<AnalyticsResponse>(url, {
          session_id: sessionId,
          data: {
            images: [photo]
          }
        })
        if (res.data.ok) {
          const { service_data } = res.data
          if (service_data.job.result.status === "success") {
            return service_data.job.result.result[0]
          } else {
            throw new Error(service_data.job.result.status)
          }
        }
      } catch (err) {
        throw new Error('Failed to load')
      }
    }
  }

  const checkSessionId = () => {
    const { session_id } = parseCookies()
    if (session_id) {
      setCurrentStep(2)
      setSessionId(session_id)
    } else {
      setOpenModal(true)
    }
  }

  const { data, error } = useSWR(
    currentStep === 2 ? `services/${serviceID}` : '',
    fetcher
  )

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
      ) : data ? (
        <div className={`${styles.container} ${styles.dropzoneColumns}`}>
          <AnalyticsResult imageBase64={photo} result={data} />
          <Button
            color={Color.Primary}
            onClick={() => {
              setCurrentStep(1)
              setPhoto('')
            }}>
            Try Again
          </Button>
        </div>
      ) : (
        error ? (
          <div>Failed to load. Please reload tab and upload a new photo</div>
        ) : (
          <div>Generating result... If you have been waiting for 15 seconds, please reload tab.</div>
        )
      )}
    </>
  )
}

export default AnalyticsPage
