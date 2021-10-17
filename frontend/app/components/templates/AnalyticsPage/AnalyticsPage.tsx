import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnayticsResult'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { colorChoices } from '../../../types/elements'

type Props = {
  analyticsName: string,
  shortDescription: string,
  longDescription: string,
  examples: string[]
}

export const AnalyticsPage = ({ analyticsName, shortDescription, longDescription, examples }: Props) => {

  const [photo, setPhoto] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <>
      <div className={`${styles.container} ${styles.intro}`}>
        <div className={styles.title}>
          <h1>{analyticsName}</h1>
          <p>{shortDescription}</p>
        </div>
        <div className={styles.imageIntro}>
          <Image
            src={"/assets/images/placeholder.jpg"}
            layout="fill"
            objectFit="cover" />
        </div>
      </div>
      <div className={styles.container}>
        <Stepper
          steps={["Upload your photo", "Check your results"]}
          activeStep={currentStep}
          />
      </div>
        {
          currentStep === 1 ?
          <div className={`${styles.container} ${styles.dropzoneColumns}`}>
            <DropzoneOptions
              images={examples}
              onPhotoDrop={setPhoto}
              />
            {
              photo &&
              <Button color={colorChoices.Primary} onClick={() => setCurrentStep(2)}>
                Next Step
              </Button>
            }
          </div>
          :
          <div className={`${styles.container} ${styles.dropzoneColumns}`}>
            <AnalyticsResult
              imageBase64={photo}
            />
            <Button color={colorChoices.Primary} onClick={() => {setCurrentStep(1); setPhoto("")}}>
              Try Again
            </Button>
          </div>
        }
    </>
  )
}

export default AnalyticsPage