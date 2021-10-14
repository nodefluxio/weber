import { NextPage } from 'next'
import Image from 'next/image'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { useEffect, useState } from 'react'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'

const AnalyticsPage: NextPage = () => {

  const [photo, setPhoto] = useState()

  useEffect(() => {
    console.log(photo)
  }, [photo])

  return (
    <>
      <div className={`${styles.container} ${styles.intro}`}>
        <div className={styles.title}>
          <h1>OCR KTP</h1>
          <p>Visionaire Cloud is a pay-as-you-go solution, designed to analyze video and image by using leading-edge
            artiﬁcial intelligence and analytics, and turning it into actionable intelligence – whether to strengthen a business
            or as an essential business tool to help organizations streamline operations, improve monitoring and customer experience.</p>
        </div>
        <div style={{ position: "relative", width: "100%" }}>
          <Image
            src={require('./placeholder.jpg')}
            layout="fill"
            objectFit="cover"/>
        </div>
      </div>
      <div className={styles.container}>
        <Stepper/>
      </div>
      <DropzoneOptions onPhotoDrop={setPhoto}/>
    </>
  )
}

export default AnalyticsPage