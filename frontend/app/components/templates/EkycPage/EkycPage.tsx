import { useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { FaceLiveness } from '../../modules/FaceLiveness/FaceLiveness'
import styles from './EkycPage.module.scss'

type Props = {
  name: string,
  shortDesc: string,
  longDesc: string
}

export const EkycPage = ({name, shortDesc, longDesc}: Props) => {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <>
      <Banner
        analyticsName={name}
        shortDescription={shortDesc}
        longDescription={longDesc}
      />
      <Stepper
        steps={['Start', 'Face Liveness', 'OCR KTP', 'Face Match', 'Finish']}
        activeStep={currentStep}
      />

      <div className={styles.container}>
        {currentStep === 1 && (
          <div>
            <h3>Welcome to e-KYC Demo</h3>
            <p>
              Please access this demo via smartphone or any device with at least
              HD camera resolution for better performance and experience
            </p>
            <Button color={Color.Primary} onClick={() => setCurrentStep(2)}>
              Start
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <FaceLiveness nextStep={() => setCurrentStep(2)} />
        )}
      </div>
    </>
  )
}
