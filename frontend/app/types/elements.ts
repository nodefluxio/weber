export enum Color {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary'
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

export type AnalyticsParam = {
  session_id: string
  data: {
    additional_params: Object
    images: string[]
  }
}

export type AnalyticsResult = {
  message: string
  ok: boolean
  job: {
    result: {
      analytic_type: string
      result: Object[]
      status: string
    }
  }
}

export type ReviewData = {
  rating: number,
  comment: string
}
