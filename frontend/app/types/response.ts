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

export type ServiceGetResponse = {
  data: [
      {
        id: number,
        type: string,
        slug: string,
        name: string,
        short_description: string,
        long_description: string,
        thumbnail: string,
        created_at: string,
        updated_at: string
    }
  ],
  message: string,
  ok: boolean
}
