import { ReactNode } from 'react'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'

type Props = {
  analyticsName: string
  shortDescription: string
  longDescription: string
  currentStep: number
  openModal: boolean
  children: ReactNode
  onModalClose: () => void
}

export const AnalyticsContainer = ({
  analyticsName,
  shortDescription,
  longDescription,
  currentStep,
  openModal,
  onModalClose,
  children
}: Props) => {
  return (
    <>
      <Modal show={openModal} onClose={onModalClose}>
        <RequestDemoFormPopup />
      </Modal>
      <Banner
        analyticsName={analyticsName}
        shortDescription={shortDescription}
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
