import axios, { AxiosError } from 'axios'
import { SESSION_ID_ERROR } from '../constants/message'
import { ActivitiesPostResponse } from '../types/responses'

export const postActivities = async (
  serviceId: number,
  sessionId: string,
  completeness: number
) => {
  try {
    const res = await axios.post<ActivitiesPostResponse>('/activities', {
      service_id: serviceId,
      session_id: sessionId,
      completeness: completeness
    })
    if (res.data.ok) {
      return res.data.message
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError<ActivitiesPostResponse>
      if (error && error.response) {
        throw new Error(SESSION_ID_ERROR)
      }
    } else {
      throw new Error((e as Error).message)
    }
  }
}
