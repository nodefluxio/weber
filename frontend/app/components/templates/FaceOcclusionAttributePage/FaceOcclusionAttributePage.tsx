import { AnalyticsPage } from '@/templates/AnalyticsPage/AnalyticsPage'
import { useEffect, useState } from 'react'
import { Tabs } from '@/modules/Tabs/Tabs'
import { Tab } from '@/elements/Tab/Tab'
import { postFaceOcclusionAttribute } from '@/api/innovationsAPI'
import { ProgressBar } from '@/elements/ProgressBar/ProgressBar'
import {
  Color,
  FaceAttributeAdditionalLabel,
  FaceAttributeLabel,
  FaceOcclusionLabel
} from '@/types/elements'
import {
  FaceAttributeResultResponse,
  FaceOcclusionResultResponse
} from '@/types/results'
import { NodefluxCloudResponse } from '@/types/responses'
import {
  FACE_ATTRIBUTE_LABEL,
  FACE_OCCLUSION_LABEL,
  MAX_IMAGE_SIZE
} from 'app/constants/constant'
import styles from './FaceOcclusionAttributePage.module.scss'

type Props = {
  id: number
  name: string
  slug: string
  long_description: string
}
type Result = {
  face_occlusion: NodefluxCloudResponse<FaceOcclusionResultResponse>
  face_attribute: NodefluxCloudResponse<FaceAttributeResultResponse>
}

export const FaceOcclusionAttributePage = ({
  id,
  name,
  slug,
  long_description
}: Props) => {
  const [result, setResult] = useState<Result>()
  const [faceOcclusionDetections, setFaceOcclusionDetections] =
    useState<Map<FaceOcclusionLabel, number>>()
  const [faceAttributeDetections, setFaceAttributeDetections] =
    useState<Map<FaceAttributeLabel | FaceAttributeAdditionalLabel, number>>()
  const [faceOcclusionMessage, setFaceOcclusionMessage] = useState<string>()
  const [faceAttributeMessage, setFaceAttributeMessage] = useState<string>()
  const [isFaceOccluded, setIsFaceOccluded] = useState<boolean>()

  useEffect(() => {
    const faceOcclusionMap = new Map<FaceOcclusionLabel, number>()
    const faceAttributeMap = new Map<
      FaceAttributeLabel | FaceAttributeAdditionalLabel,
      number
    >()
    if (result?.face_occlusion.ok) {
      const face_occlusion =
        result.face_occlusion.job.result.result[0].face_occlusion
      setIsFaceOccluded(face_occlusion.occlusion)

      face_occlusion.detections.forEach((detection) =>
        faceOcclusionMap.set(detection.label, detection.confidence)
      )
      setFaceOcclusionDetections(faceOcclusionMap)
    } else setFaceOcclusionMessage(result?.face_occlusion.message)

    if (result?.face_attribute.ok) {
      result.face_attribute.job.result.result[0].face_attribute.occlusion_object.forEach(
        (object) =>
          faceAttributeMap.set(
            object.label,
            parseFloat((object.confidence * 100).toFixed(2))
          )
      )

      result.face_attribute.job.result.result[0].face_attribute.additional_info_object.forEach(
        (object) => {
          faceAttributeMap.set(
            object.label,
            parseFloat((object.confidence * 100).toFixed(2))
          )
        }
      )
      setFaceAttributeDetections(faceAttributeMap)
    } else setFaceAttributeMessage(result?.face_attribute.message)
  }, [result])

  return (
    <AnalyticsPage
      analyticsName={name}
      longDescription={long_description}
      examples={[
        `/assets/images/innovations/${slug}/example1.jpg`,
        `/assets/images/innovations/${slug}/example2.jpg`,
        `/assets/images/innovations/${slug}/example3.jpg`
      ]}
      serviceID={id}
      slug={slug}
      handlePost={(session_id, photo) =>
        postFaceOcclusionAttribute(id, session_id, photo)
      }
      handleResult={(res) => setResult(res)}
      maxImageSize={MAX_IMAGE_SIZE}
      acceptedFileFormat={'image/jpeg, image/png'}
      customBannerUrl={
        '/assets/images/innovations/face-occlusion-attribute/banner.png'
      }>
      {result && (
        <div className={styles.FOAResult}>
          <Tabs>
            <Tab className={styles.tab} title="Face Occlusion">
              <p className={styles.msg}>
                {isFaceOccluded
                  ? 'One or more areas of your face are occluded!'
                  : 'Your face is clear and free from occlusion!'}
              </p>
              {faceOcclusionDetections ? (
                FACE_OCCLUSION_LABEL.map((label, idx) => (
                  <div className={styles.content} key={idx}>
                    <p>{label}</p>
                    <ProgressBar
                      bgColor={Color.Primary}
                      completed={faceOcclusionDetections.get(label) || 0}
                    />
                  </div>
                ))
              ) : (
                <p>{faceOcclusionMessage}</p>
              )}
            </Tab>
            <Tab className={styles.tab} title="Face Attribute">
              {faceAttributeDetections ? (
                FACE_ATTRIBUTE_LABEL.map((label, idx) => (
                  <div className={styles.content} key={idx}>
                    <p>{label}</p>
                    <ProgressBar
                      bgColor={Color.Primary}
                      completed={faceAttributeDetections.get(label) || 0}
                    />
                  </div>
                ))
              ) : (
                <p>{faceAttributeMessage}</p>
              )}
            </Tab>
          </Tabs>
        </div>
      )}
    </AnalyticsPage>
  )
}
