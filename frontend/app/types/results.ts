import {
  FaceOcclusionDetection,
  FaceAttributeAdditionalLabel,
  FaceAttributeLabel
} from './elements'

export type FaceOcclusionResultResponse = {
  face_occlusion: {
    detections: Array<FaceOcclusionDetection>
    inference_time_seconds: number
    occlusion: true
  }
}
export type FaceAttributeResultResponse = {
  face_attribute: {
    additional_info_object: Array<{
      label: FaceAttributeAdditionalLabel
      confidence: number
    }>
    attribute_detected: boolean
    occlusion_object: Array<{
      label: FaceAttributeLabel
      confidence: number
    }>
  }
}
