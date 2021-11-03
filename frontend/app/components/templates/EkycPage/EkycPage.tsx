import { parseCookies } from 'nookies'
import { useState } from 'react'
import { postActivities } from '../../../api/activitiesAPI'
import { SESSION_ID_ERROR } from '../../../constants/message'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Modal } from '../../elements/Modal/Modal'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Cam } from '../../modules/Cam/Cam'
import Feedback from '../../modules/Feedback/Feedback'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import styles from './EkycPage.module.scss'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnalyticsResult'

type Props = {
  serviceId: number
  name: string
  shortDesc: string
  longDesc: string
}

export const EkycPage = ({ serviceId, name, shortDesc, longDesc }: Props) => {
  const dummyOCRResult = {
    agama: 'islam',
    alamat: 'bojong',
    berlaku_hingga: 'senin',
    golongan_darah: 'O',
    jenis_kelamin: 'laki',
    kabupaten_kota: 'bekasi',
    kecamatan: 'rawa',
    kelurahan_desa: 'rawa bebek',
    kewarganegaraan: 'indonesia',
    nama: 'ferdi',
    nik: '2240',
    pekerjaan: 'petani',
    provinsi: 'jawa barat',
    rt_rw: '07/14',
    status_perkawinan: 'cerai',
    tanggal_lahir: '6 okt 2002',
    tempat_lahir: 'bekasi'
  }

  const { session_id } = parseCookies()

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const createVisitorActivities = async (
    serviceId: number,
    sessionId: string,
    completeness: number
  ) => {
    try {
      await postActivities(serviceId, sessionId, completeness)
    } catch (err) {
      if ((err as Error).message === SESSION_ID_ERROR) {
        setOpenModal(true)
      } else {
        console.log((err as Error).message)
      }
    }
  }

  const nextStep = async (page: number) => {
    if (session_id) {
      createVisitorActivities(5, session_id, page)
      setCurrentStep(page)
    } else {
      setOpenModal(true)
    }
  }

  return (
    <>
      <Modal
        show={openModal}
        onClose={() => {
          setOpenModal(false)
        }}>
        <RequestDemoFormPopup />
      </Modal>

      <Banner
        analyticsName={name}
        shortDescription={shortDesc}
        longDescription={longDesc}
      />

      <Stepper
        steps={['Start', 'Face Liveness', 'OCR KTP', 'Result', 'Finish']}
        activeStep={currentStep}
      />

      <div className={styles.container}>
        {currentStep === 1 && (
          <div>
            <h3 className={styles.title}>Welcome to e-KYC Demo</h3>
            <p className={styles.desc}>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => nextStep(2)}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className={styles.title}>Take A Selfie Photo</h3>
            <Cam localkey="liveness_snapshot" nextStep={() => nextStep(3)} />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className={styles.title}>KTP Photo</h3>
            <Cam
              localkey="ktp_snapshot"
              nextStep={() => nextStep(4)}
              videoConstraints={{ facingMode: { ideal: 'environment' } }}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className={styles.result}>
            <div className={styles.percentage}>
              <h3 className={styles.title}>Liveness result</h3>
              <span>93%</span>
              <p>Verified</p>
            </div>
            <div className={styles.percentage}>
              <h3 className={styles.title}>Face Match Result</h3>
              <span>93%</span>
              <p>Verified</p>
            </div>
            <div className={styles.ocrKtp}>
              <h3 className={styles.title}>OCR KTP Result</h3>
              <AnalyticsResult result={dummyOCRResult} slug={'ocr-ktp'} />
            </div>
            <Button color={Color.Primary} onClick={() => nextStep(5)}>
              Next
            </Button>
          </div>
        )}

        {currentStep === 5 && (
          <div className={styles.review}>
            <h3 className={styles.title}>
              Thank you for Using e-KYC Demo App!
            </h3>
            <Feedback id={serviceId} onClick={() => setCurrentStep(1)} />
          </div>
        )}
      </div>
    </>
  )
}
