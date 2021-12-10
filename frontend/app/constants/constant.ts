import { FaceAttributeLabel, FaceOcclusionLabel } from '@/types/elements'

export const FACE_OCCLUSION_LABEL: Array<FaceOcclusionLabel> = [
  'Forehead',
  'Eyebrow Left',
  'Eyebrow Right',
  'Eye Left',
  'Eye Right',
  'Cheek Left',
  'Cheek Right',
  'Nose',
  'Mouth',
  'Chin'
]
export const FACE_ATTRIBUTE_LABEL: Array<FaceAttributeLabel> = [
  'mask',
  'sunglasses',
  'eyeglasses',
  'helm',
  'cap'
]

export const APP_DOWNLOAD_MODAL_SOLUTION =
  process.env.APP_DOWNLOAD_MODAL_SOLUTION || 'Citizen Apps'

export const EMAIL_MODAL_SOLUTION =
  process.env.EMAIL_MODAL_SOLUTION || 'AML / PEP'
