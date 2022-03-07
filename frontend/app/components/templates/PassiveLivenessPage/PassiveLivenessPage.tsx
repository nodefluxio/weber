import { Button } from '@/elements/Button/Button'
import { Modal } from '@/elements/Modal/Modal'
import { Stepper } from '@/elements/Stepper/Stepper'
import { Banner } from '@/modules/Banner/Banner'
import { LivenessReview } from '@/modules/LivenessReview/LivenessReview'
import { RequestDemoFormPopup } from '@/modules/RequestDemoFormPopup/RequestDemoFormModal'
import { Color } from '@/types/elements'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import Image from 'next/image'
import { Cam } from '@/modules/Cam/Cam'
import { PL_LOCAL_STORAGE } from 'app/constants/localStorage'
import { FACE_LIVENESS_THRESHOLD } from 'app/constants/constant'
import { getImageFromLocalStorage } from '@/utils/localStorage/localStorage'
import { PassiveLivenessV4 } from '@/types/responses'
import { Spinner } from '@/elements/Spinner/Spinner'
import { CustomError } from 'app/errors/CustomError'
import { postPassiveLiveness } from '@/api/solutionsAPI'
import { postActivities } from '@/api/activitiesAPI'

type Props = {
  serviceId: number
  name: string
  longDesc: string
}

export const PassiveLivenessPage = ({ serviceId, name, longDesc }: Props) => {
  const { session_id } = parseCookies()

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState<PassiveLivenessV4>()

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

  const handlePassiveLiveness = async (sessionId: string) => {
    if (sessionId) {
      await resolvePassiveLiveness(sessionId)
      setIsLoading(false)
    } else {
      setOpenModal(true)
    }
  }

  const resolvePassiveLiveness = async (session_id: string) => {
    try {
      const res = await postPassiveLiveness(
        session_id,
        getImageFromLocalStorage(PL_LOCAL_STORAGE, () => setCurrentStep(2))
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

      if (page === 3) {
        handlePassiveLiveness(session_id)
      }

      setCurrentStep(page)
    } else {
      setOpenModal(true)
    }
  }

  const calculateLiveness = (livenessScore: number): boolean => {
    if (livenessScore < FACE_LIVENESS_THRESHOLD) {
      return false;
    }

    return true;
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>

      <Banner
        bannerUrl="/assets/images/solutions/passive-liveness/banner.png"
        analyticsName={name}
        longDescription={longDesc}
      />

      <Stepper
        steps={['Start', 'Face Liveness', 'Result', 'Finish']}
        activeStep={currentStep}
        className="mt-8"
      />

      <div className="container mx-auto w-[90%] md:w-4/5 min-h-[75vh] py-8 flex flex-col justify-center items-center text-center">
        {currentStep === 1 && (
          <div className="flex flex-col items-center">
            <h3 className="pb-6 text-2xl">Welcome to Liveness Demo App</h3>
            <div className="bg-secondary-500 w-full md:w-7/12 border border-solid rounded-lg my-8 h-min">
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
                createVisitorActivities(serviceId, session_id, 30)
              }}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="md:w-9/12 lg:w-6/12 2xl:w-4/12">
            <h3 className="pb-6 text-3xl">Take A Selfie Photo</h3>
            <p className="pb-4">
              Please take a selfie and position your face according to the
              frame. Your photo will be used for face liveness and face match
              tests.
            </p>
            <Cam
              localkey={PL_LOCAL_STORAGE}
              nextStep={() => {
                nextStep()
                createVisitorActivities(serviceId, session_id, 70)
              }}
              overlayShape="circle"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col justify-center">
              <div className="mb-12">
                <div
                  className="relative mb-12 mx-auto w-[200px] h-[200px]
               md:w-[225px] md:h-[168.75px] rounded ">
                  <Image
                    className="rounded"
                    src={getImageFromLocalStorage(PL_LOCAL_STORAGE, () =>
                      setCurrentStep(1)
                    )}
                    layout="fill"
                    objectFit="fill"
                    alt="captured photos"
                  />
                </div>
                <h3 className="pb-6 text-3xl font-bold font-sans">
                  Liveness result
                </h3>
                {!isLoading ? (
                  result?.service_data.job.result.result.length === 1 ? (
                    <>
                      <h4 className="block text-7xl mb-4">{`${Math.trunc(
                        result?.service_data.job.result.result[0].face_liveness
                          .liveness * 100
                      )}%`}</h4>
                      <p className="text-2xl font-serif">
                        {calculateLiveness(result?.service_data.job.result.result[0].face_liveness
                          .liveness)
                          ? 'Verified'
                          : 'Not Verified'}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium font-serif text-2xl">
                      {result?.service_data.message}
                    </p>
                  )
                ) : (
                  <Spinner className="mx-auto my-8" />
                )}
              </div>
            </div>

            <Button
              color={Color.Primary}
              onClick={() => {
                nextStep()
              }}
              disabled={isLoading}>
              Next
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col">
            <LivenessReview
              id={serviceId}
              onChosen={() => {
                createVisitorActivities(serviceId, session_id, 100)
                localStorage.removeItem(PL_LOCAL_STORAGE)
                setResult(undefined)
                setIsLoading(true)
              }}
              onTryAgain={() => {
                setCurrentStep(1)
              }}
              jobId={result?.service_data.job.id || 'jobId'}
            />
          </div>
        )}
      </div>
    </>
  )
}
