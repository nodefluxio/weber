import { useState } from 'react'
import { NextPage } from 'next'
import Image from 'next/image'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { colorChoices } from '../../../types/elements'

const AnalyticsPage: NextPage = () => {

  const [photo, setPhoto] = useState()
  const [analyticsName, setAnalyticsName] = useState("OCR KTP")
  const [description, setDescription] = useState("Visionaire Cloud is a pay-as-you-go solution, designed to analyze video and image by using leading-edge\
      artiﬁcial intelligence and analytics, and turning it into actionable intelligence – whether to strengthen a business\
      or as an essential business tool to help organizations streamline operations, improve monitoring and customer experience.")

  return (
    <>
      <div className={`${styles.container} ${styles.intro}`}>
        <div className={styles.title}>
          <h1>{analyticsName}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.imageIntro}>
          <Image
            src={require("../../../../public/assets/images/placeholder.jpg")}
            layout="fill"
            objectFit="cover" />
        </div>
      </div>
      <div className={styles.container}>
        <Stepper
          steps={["Upload your photo", "Check your results"]}
          activeStep={1}
          />
      </div>
      <div className={`${styles.container} ${styles.dropzoneColumns}`}>
        <DropzoneOptions images={[require("../../../../public/assets/images/face.jpg"),
        require("../../../../public/assets/images/face2.jpeg")]} onPhotoDrop={setPhoto} />
        {/* TODO: Add API Call Handler */}
        <Button color={colorChoices.Primary}>Next Step</Button>
      </div>
    </>
  )
}

export default AnalyticsPage