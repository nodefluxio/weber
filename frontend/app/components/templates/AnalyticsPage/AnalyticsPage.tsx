import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './AnalyticsPage.module.scss'
import { Stepper } from '../../elements/Stepper/Stepper'
import { Button } from '../../elements/Button/Button'
import { AnalyticsResult } from '../../modules/AnalyticsResult/AnayticsResult'
import { DropzoneOptions } from '../../modules/DropzoneOptions/DropzoneOptions'
import { Color } from '../../../types/elements'
import { parseCookies } from 'nookies'
import useSWR from 'swr'
import axios from 'axios'
import { AnalyticsResponse } from '../../../types/responses'

type Props = {
  analyticsName: string,
  shortDescription: string,
  longDescription: string,
  examples: string[],
  serviceID: number
}

export const AnalyticsPage = ({ analyticsName, shortDescription, longDescription, examples, serviceID }: Props) => {

  const [photo, setPhoto] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  const fetcher = async(url: string) => {
    const { session_id } = parseCookies()
    if(url && session_id) {
      try {
        const res = await axios.post<AnalyticsResponse>(url, {
          session_id: session_id,
          data: {
            images: [photo]
          }
        })
        if (res.data.ok) {
          const { service_data } = res.data
          if(service_data.job.result.status === "success") {
            return service_data.job.result.result[0]
          } else {
            throw new Error("No result available")
          }
        }
      } catch(err) {
        throw new Error("Failed to load")
      }
    }
  }
  var { data, error } = useSWR( currentStep === 2 ? `services/${serviceID}` : "", fetcher)

  return (
    <>
      <div className={`${styles.container} ${styles.intro}`}>
        <div className={styles.title}>
          <h1>{analyticsName}</h1>
          <p>{shortDescription}</p>
          <p>{longDescription}</p>
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
      {/* TODO: Butuh pembenahan... refactor? */}
        {
          currentStep === 1 ?
          <div className={`${styles.container} ${styles.dropzoneColumns}`}>
            <DropzoneOptions
              images={examples}
              onPhotoDrop={setPhoto}
              />
            {
              photo &&
              <Button color={Color.Primary} onClick={() => setCurrentStep(2)}>
                Next Step
              </Button>
            }
          </div>
          : (
            data ?
              <div className={`${styles.container} ${styles.dropzoneColumns}`}>
              <AnalyticsResult
                imageBase64={photo}
                result={data}
              />
              <Button color={Color.Primary} onClick={() => {setCurrentStep(1); setPhoto("")}}>
                Try Again
              </Button>
            </div> : (
              error ? <div>Failed to load, please reload page :(</div> : <div>Please wait for your result...</div>
            )
          )
        }
    </>
  )
}

export default AnalyticsPage