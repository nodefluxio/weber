import Image from "next/image"
import { parseCookies } from "nookies"
import { useEffect, useState } from "react"
import { postServicePhoto, SESSION_ID_ERROR } from "../../../api/analyticsAPI"
import styles from "./AnalyticsResult.module.scss"
import { Modal } from '../../elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'

type Props = {
  imageBase64: string,
  serviceID: number
}

export const AnalyticsResult = ({ imageBase64, serviceID }: Props) => {

  const [preview, setPreview] = useState("")
  const [result, setResult] = useState<object>()
  const [errorMsg, setErrorMsg] = useState("")
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    setPreview(imageBase64)
    const { session_id } = parseCookies()
    postServicePhoto(serviceID, session_id, imageBase64)
      .then(res => {
        setResult(res!)
        setOpenModal(false)
      })
      .catch(err => {
        if ((err as Error).message === SESSION_ID_ERROR) {
          setOpenModal(true)
        } else {
          setErrorMsg((err as Error).message)
        }
      })
  }, [])

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>
      <div className={styles.result}>
        <div className={styles.resultFlex}>
          <div className={styles.resultImage}>
            {
              preview &&
              <Image
                src={preview}
                layout="fill"
                objectFit="contain"
              />
            }
          </div>
          <div className={styles.resultInfo}>
            {
              result ?
                <div>
                  <p>Results Here</p>
                  <ul>
                    {
                      Object.entries(result).map(([key, value]) => (
                        <li key={key}><b>{key}</b>: {value}</li>
                      ))
                    }
                  </ul>
                </div>
                :
                errorMsg ?
                  <div>{errorMsg}</div>
                  :
                  <div>Loading your results... Please wait</div>
            }
          </div>
        </div>
      </div>
    </>
  )
}