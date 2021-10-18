import { Service } from './elements'

export type ServicesGetResponse = {
  data: Service[]
  message: string
  ok: boolean
}

export type VisitorsPostResponse = {
  data: [
    {
      session_id: string
      max_age: number
    }
  ]
  message: string
  ok: boolean
}

export type VisitorsPostErrorResponse = {
  message: string
  ok: boolean
}

export type ServiceByIdResponse = {
  data: {
    id: number,
    type: string,
    slug: string,
    name: string,
    short_description: string,
    long_description: string,
    thumbnail: string,
    created_at: string,
    updated_at: string
  },
  message: string,
  ok: boolean
}

export type ServiceByIdErrorResponse = {
  message: string,
  ok: boolean
}

export type AnalyticsResponse = {
  message: string,
  ok: boolean,
  service_data: {
    job: {
      result: {
        analytic_type: string,
        result: Object[]
      }
    }
  }
}
