import { useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Banner } from '../../modules/Banner/Banner'
import { Cam } from '../../modules/Cam/Cam'
import styles from './EkycPage.module.scss'

export const EkycPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isResult, setIsResult] = useState(false)

  return (
    <>
      <Banner
        analyticsName="Face Liveness"
        shortDescription="hello"
        longDescription="hello2"
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

        {currentStep === 2  && isResult === false && (
          <Cam
            localkey="liveness_snapshot"
            nextStep={() => setIsResult(true)}
          />
        )}

        {currentStep === 2 && isResult === true && (
          <div>
            <span>Liveness Result</span>
            <span>75%</span>
            <Button color={Color.Primary} onClick={() => setCurrentStep(3)}>Next</Button>
            <Button color={Color.Primary} onClick={() => setIsResult(false)}>Try Again</Button>
          </div>
        )}
      </div>
    </>
  )
}
