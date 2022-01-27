import { Button } from '@/elements/Button/Button'
import { Modal } from '@/elements/Modal/Modal'
import { Stepper } from '@/elements/Stepper/Stepper'
import { Banner } from '@/modules/Banner/Banner'
import { LivenessReview } from '@/modules/LivenessReview/LivenessReview'
import { RequestDemoFormPopup } from '@/modules/RequestDemoFormPopup/RequestDemoFormModal'
import { Color, FaceLiveness } from '@/types/elements'
import { parseCookies } from 'nookies'
import { useState } from 'react'
import Image from 'next/image'
import { Cam } from '@/modules/Cam/Cam'
import { PL_LOCAL_STORAGE } from 'app/constants/localStorage'
import { getImageFromLocalStorage } from '@/utils/localStorage/localStorage'
import { NodefluxCloudResponse } from '@/types/responses'
import { Spinner } from '@/elements/Spinner/Spinner'
import { CustomError } from 'app/errors/CustomError'

type Props = {
  // serviceId: number
  name: string
  longDesc: string
}

export const PassiveLivenessDemoPage = ({ name, longDesc }: Props) => {
  const { session_id } = parseCookies()

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<NodefluxCloudResponse<FaceLiveness>>()

  const handlePassiveLiveness = async (sessionId: string) => {
    if (sessionId) {
      await resolvePassiveLiveness(sessionId)
      setLoading(false)
    } else {
      setOpenModal(true)
    }
  }

  const resolvePassiveLiveness = async (session_id: string) => {
    try {
      // const res = await postPassiveLiveness(
      //   session_id,
      //   getImageFromLocalStorage(PL_LOCAL_STORAGE, () => setCurrentStep(2))
      // )
      const res: NodefluxCloudResponse<FaceLiveness> = {
        job: {
          result: {
            analytic_type: 'solution',
            result: [{ live: true, liveness: 0.8 }],
            status: 'ok'
          }
        },
        message: 'ok',
        ok: true
      }

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
                //   createVisitorActivities(serviceId, session_id, 20)
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
                // createVisitorActivities(serviceId, session_id, 40)
              }}
              overlayShape="circle"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row justify-around">
              <div className="font-bold m-8">
                <div
                  className="relative mb-4 w-[200px] h-[200px]
              max-w-[45vw] md:w-[225px] md:h-[168.75px] rounded max-h-[vh] md:max-h-[unset]">
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
                <h3 className="pb-6 text-3xl">Liveness result</h3>
                {!loading ? (
                  result?.job.result.result.length === 1 ? (
                    <>
                      <span className="block font-thin text-7xl">{`${Math.trunc(
                        result?.job.result.result[0].liveness * 100
                      )}%`}</span>
                      <p className="font-medium text-2xl">
                        {result?.job.result.result[0].live
                          ? 'Verified'
                          : 'Not Verified'}
                      </p>
                    </>
                  ) : (
                    <p className="font-medium text-2xl">{result?.message}</p>
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
                // createVisitorActivities(serviceId, session_id, 80)
              }}
              disabled={loading}>
              Next
            </Button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">
              Thank you for using the Liveness Demo App
            </h2>
            <span className="text-xl font-semibold mt-10">
              Is our liveness prediction true?
            </span>
            <LivenessReview id={0} className="my-4" />
          </div>
        )}
      </div>
    </>
  )
}
