import { ReactNode } from 'react'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'

type Props = {
  analyticsName: string
  longDescription: string
  currentStep: number
  openModal: boolean
  slug: string
  children: ReactNode
  onModalClose: () => void
}

export const AnalyticsContainer = ({
  analyticsName,
  longDescription,
  currentStep,
  openModal,
  slug,
  onModalClose,
  children
}: Props) => {
  return (
    <>
      <Modal show={openModal} onClose={onModalClose}>
        <RequestDemoFormPopup />
      </Modal>
      <Banner
        bannerUrl={`/assets/images/analytics/${slug}/banner.png`}
        analyticsName={analyticsName}
        longDescription={longDescription}
      />
      <Stepper
        steps={['Upload your photo', 'Check your results']}
        activeStep={currentStep}
      />
      {children}
    </>
  )
}
