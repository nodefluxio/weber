import { Button } from '@/elements/Button/Button'
import { Modal } from '@/elements/Modal/Modal'
import { Stepper } from '@/elements/Stepper/Stepper'
import { Banner } from '@/modules/Banner/Banner'
import { RequestDemoFormPopup } from '@/modules/RequestDemoFormPopup/RequestDemoFormModal'
import { Color } from '@/types/elements'
import { parseCookies } from 'nookies'
import { useState } from 'react'

type Props = {
  // serviceId: number
  name: string
  longDesc: string
}

export const PassiveLivenessPage = ({ name, longDesc }: Props) => {
  const { session_id } = parseCookies()
  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)

  const nextStep = async () => {
    if (session_id) {
      const page = currentStep + 1

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
            <h3 className="pb-6 text-2xl">Welcome to e-KYC Demo</h3>
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
      </div>
    </>
  )
}
