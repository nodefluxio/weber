import { NextPage } from 'next'
import Image from 'next/image'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { useState } from 'react'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'

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
          <h1>{ analyticsName }</h1>
          <p>{ description }</p>
        </div>
        <div style={{ position: "relative", flexBasis: "40%", flexShrink: 0 }}>
          <Image
            src={require("../../../../public/static/images/placeholder.jpg")}
            layout="fill"
            objectFit="cover"/>
        </div>
      </div>
      <div className={styles.container}>
        {/* TODO: bikin variabel buat tentuin step */}
        <Stepper/>
      </div>
      <div className={styles.container} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DropzoneOptions image={[require("../../../../public/static/images/face.jpg"), 
        require("../../../../public/static/images/face2.jpeg")]} onPhotoDrop={setPhoto}/>
        <button style={{ width: "30%" }} onClick={() => console.log("API call here")}>Next Step</button>
      </div>
    </>
  )
}

export default AnalyticsPage