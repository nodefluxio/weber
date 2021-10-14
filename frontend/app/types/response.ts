export type VisitorsPostResponse = {
  data: [
    {
      session_id: string
    }
  ]
  message: string
  ok: boolean
}

export type VisitorsPostErrorResponse = {
  message: string
  ok: boolean
}
