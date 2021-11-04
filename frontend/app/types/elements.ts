export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary'
}

export enum AnalyticsSlug {
  FACE_MATCH_ENROLLMENT = 'face-match-enrollment',
  LICENSE_PLATE_RECOGNITION = 'license-plate-recognition',
  OCR_KTP = 'ocr-ktp'
}

export type Service = {
  id: number
  name: string
  thumbnail: string
  short_description: string
  long_description: string
  slug: string
}

export type RequestDemoFormData = {
  email: string
  full_name: string
  company: string
  job_title: string
  industry: string
}

export type FeedbackData = {
  rating: number
  comment: string
}

export type ShoppingItem = {
  id: string
  quantity: number
  name: string
  image: string
  price: number
}
