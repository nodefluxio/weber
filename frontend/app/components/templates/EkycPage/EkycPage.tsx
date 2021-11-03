import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { postActivities } from '../../../api/activitiesAPI'
import { SESSION_ID_ERROR } from '../../../constants/message'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Modal } from '../../elements/Modal/Modal'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Cam } from '../../modules/Cam/Cam'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import Feedback from '../../modules/Feedback/Feedback'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import styles from './EkycPage.module.scss'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnalyticsResult'
import { getImageFromLocalStorage } from '../../../utils/localStorage/localStorage'

type Props = {
  serviceId: number
  name: string
  shortDesc: string
  longDesc: string
}

export const EkycPage = ({ serviceId, name, shortDesc, longDesc }: Props) => {
  const examples = [
    `/assets/images/analytics/ocr-ktp/example1.jpg`,
    `/assets/images/analytics/ocr-ktp/example2.jpg`,
    `/assets/images/analytics/ocr-ktp/example3.jpg`
  ]

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

  const [ktpPhoto, setKtpPhoto] = useState('')
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

  const changeKtpHandler = (e: any) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (reader.result) {
        setKtpPhoto(reader.result as string)
      }
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
        steps={[
          'Start',
          'Face Liveness',
          'OCR KTP',
          'Face Match 1:1',
          'Result',
          'Finish'
        ]}
        activeStep={currentStep}
      />

      {currentStep === 1 && (
        <div className={styles.container}>
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
        </div>
      )}

      {currentStep === 2 && (
        <div className={styles.container}>
          <div>
            <h3 className={styles.title}>Take A Selfie Photo</h3>
            <Cam localkey="liveness_snapshot" nextStep={() => nextStep(3)} />
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className={styles.dzContainer}>
          <h3 className={styles.title}>KTP Photo</h3>
          <DropzoneOptions images={examples} onPhotoDrop={setKtpPhoto} />
          {ktpPhoto && (
            <div className={styles.buttonContainer}>
              <Button color={Color.Primary} onClick={() => nextStep(4)}>
                Next Step
              </Button>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className={styles.container}>
          <div className={styles.imgContainer}>
            <h3 className={styles.title}>Face Match 1:1</h3>
            <div className={styles.imgItem}>
              <Image
                src={getImageFromLocalStorage('liveness_snapshot', () =>
                  setCurrentStep(2)
                )}
                layout="fill"
                objectFit="contain"
                alt="face liveness snapshot"
              />
            </div>
            <span className={styles.caption}>
              (a) Face Photo 1 (from selfie)
            </span>
            <div className={styles.imgItem}>
              <Image
                src={ktpPhoto}
                layout="fill"
                objectFit="contain"
                alt="ktp image"
              />
            </div>
            <span className={styles.caption}>(b) Face Photo 2 (from ktp)</span>

            <div className={styles.btnGroup}>
              <div className={styles.btnUpload}>
                <Button color={Color.Primary}>Change Photo (b)</Button>
                <input type="file" onChange={(e) => changeKtpHandler(e)} />
              </div>
              <Button color={Color.Primary} onClick={() => nextStep(5)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className={styles.container}>
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
            <Button color={Color.Primary} onClick={() => nextStep(6)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className={styles.container}>
          <div>
            <h3 className={styles.title}>
              Thank you for Using e-KYC Demo App!
            </h3>
            <Feedback id={serviceId} onClick={() => setCurrentStep(1)} />
          </div>
        </div>
      )}
    </>
  )
}
