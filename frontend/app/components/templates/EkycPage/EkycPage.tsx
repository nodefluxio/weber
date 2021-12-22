import { parseCookies } from 'nookies'
import { useState } from 'react'
import { postActivities } from '../../../api/activitiesAPI'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Modal } from '../../elements/Modal/Modal'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Cam } from '../../modules/Cam/Cam'
import Feedback from '../../modules/Feedback/Feedback'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnalyticsResult'
import { postEKYC } from '../../../api/solutionsAPI'
import { getImageFromLocalStorage } from '../../../utils/localStorage/localStorage'
import { Spinner } from '../../elements/Spinner/Spinner'
import {
  FL_LOCAL_STORAGE,
  KTP_LOCAL_STORAGE
} from '../../../constants/localStorage'
import { EKYCResultResponse } from '../../../types/responses'
import { CustomError } from 'app/errors/CustomError'

type Props = {
  serviceId: number
  name: string
  longDesc: string
}

export const EkycPage = ({ serviceId, name, longDesc }: Props) => {
  const { session_id } = parseCookies()

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [result, setResult] = useState<EKYCResultResponse>()
  const [loading, setLoading] = useState(true)

  const createVisitorActivities = async (
    serviceId: number,
    sessionId: string,
    completeness: number
  ) => {
    try {
      await postActivities(serviceId, sessionId, completeness)
    } catch (e) {
      if (e instanceof CustomError && e.statusCode === 401) {
        setOpenModal(true)
      } else {
        console.error(e)
      }
    }
  }

  const handleEKYC = async (sessionId: string) => {
    if (sessionId) {
      await resolveEKYC(sessionId)
      setLoading(false)
    } else {
      setOpenModal(true)
    }
  }

  const resolveEKYC = async (session_id: string) => {
    try {
      const res = await postEKYC(
        session_id,
        getImageFromLocalStorage(FL_LOCAL_STORAGE, () => setCurrentStep(2)),
        getImageFromLocalStorage(KTP_LOCAL_STORAGE, () => setCurrentStep(3))
      )

      if (res) {
        setResult(res)
      }
    } catch (e) {
      if (e instanceof CustomError && e.statusCode === 401) {
        setOpenModal(true)
      } else {
        console.error(e)
      }
    }
  }

  const nextStep = async () => {
    if (session_id) {
      const page = currentStep + 1

      if (page === 4) {
        handleEKYC(session_id)
      }

      setCurrentStep(page)
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
        bannerUrl="/assets/images/solutions/ekyc/banner.png"
        analyticsName={name}
        longDescription={longDesc}
      />

      <Stepper
        steps={['Start', 'Face Liveness', 'OCR KTP', 'Result', 'Finish']}
        activeStep={currentStep}
        className="mt-8"
      />

      <div className="container mx-auto w-[90%] md:w-4/5 min-h-[75vh] py-8 flex flex-col justify-center items-center text-center">
        {currentStep === 1 && (
          <div className="flex flex-col items-center">
            <h3 className="pb-6 text-3xl">Welcome to e-KYC Demo</h3>
            <div className="bg-amber-300 w-full md:w-7/12 border border-solid rounded-lg my-8 h-min">
              <p className="m-4 text-lg">
                Please access this demo via <strong>smartphone</strong> or any
                device with at least <strong>HD camera</strong> resolution for{' '}
                <strong>better performance</strong> and{' '}
                <strong>experience</strong>
              </p>
            </div>
            <Button
              color={Color.Primary}
              onClick={() => {
                nextStep()
                createVisitorActivities(serviceId, session_id, 20)
              }}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 className="pb-6 text-3xl">Take A Selfie Photo</h3>
            <Cam
              localkey={FL_LOCAL_STORAGE}
              nextStep={() => {
                nextStep()
                createVisitorActivities(serviceId, session_id, 40)
              }}
              overlayShape="circle"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="pb-6 text-3xl">KTP Photo</h3>
            <Cam
              localkey={KTP_LOCAL_STORAGE}
              nextStep={() => {
                nextStep()
                createVisitorActivities(serviceId, session_id, 60)
              }}
              facingMode="environment"
              overlayShape="rect"
              mirrored={false}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row justify-around mb-8">
              <div className="font-bold m-8">
                <h3 className="pb-6 text-3xl">Liveness result</h3>
                {!loading ? (
                  result?.service_data.face_liveness.job.result.result
                    .length === 1 ? (
                    <>
                      <span className="block font-thin text-7xl">{`${Math.trunc(
                        result.service_data.face_liveness.job.result.result[0]
                          .face_liveness.liveness * 100
                      )}%`}</span>
                      <p className="font-medium text-2xl">
                        {result.service_data.face_liveness.job.result.result[0]
                          .face_liveness.live
                          ? 'Verified'
                          : 'Not Verified'}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-2xl">
                      {result?.service_data.face_liveness.message}
                    </p>
                  )
                ) : (
                  <Spinner className="mx-auto my-8" />
                )}
              </div>

              <div className="font-bold m-8">
                <h3 className="pb-6 text-3xl">Face Match Result</h3>
                {!loading ? (
                  result?.service_data.face_match.job.result.result.length ===
                  1 ? (
                    <>
                      <span className="block font-thin text-7xl">{`${Math.trunc(
                        result.service_data.face_match.job.result.result[0]
                          .face_match.similarity * 100
                      )}%`}</span>
                      <p className="font-medium text-2xl">
                        {result.service_data.face_match.job.result.result[0]
                          .face_match.match
                          ? 'Verified'
                          : 'Not Verified'}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-2xl">
                      {result?.service_data.face_match.message}
                    </p>
                  )
                ) : (
                  <Spinner className="mx-auto my-8" />
                )}
              </div>
            </div>
            <div className="font-bold m-8">
              <h3 className="pb-6 text-3xl">OCR KTP Result</h3>
              <div className="text-left">
                {!loading ? (
                  result?.service_data.ocr_ktp.job.result.result.length ===
                  1 ? (
                    <AnalyticsResult
                      className="ml-[12px]"
                      result={result.service_data.ocr_ktp.job.result.result[0]}
                      slug={'ocr-ktp'}
                    />
                  ) : (
                    <p className="text-center">
                      {result?.service_data.ocr_ktp.message}
                    </p>
                  )
                ) : (
                  <Spinner className="mx-auto my-8" />
                )}
              </div>
            </div>
            <Button
              className="mt-8"
              color={Color.Primary}
              onClick={() => {
                nextStep()
                createVisitorActivities(serviceId, session_id, 80)
              }}
              disabled={loading}>
              Next
            </Button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="w-full">
            <h3 className="mb-12 text-3xl">
              Thank you for Using e-KYC Demo App!
            </h3>
            <Feedback
              id={serviceId}
              onTryAgain={() => setCurrentStep(1)}
              afterSubmit={() => {
                createVisitorActivities(serviceId, session_id, 100)
                setResult(undefined)
                setLoading(true)
                localStorage.removeItem(FL_LOCAL_STORAGE)
                localStorage.removeItem(KTP_LOCAL_STORAGE)
              }}
            />
          </div>
        )}
      </div>
    </>
  )
}
