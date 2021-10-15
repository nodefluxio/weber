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
