import axios from 'axios'
import { StandardResponse } from '../types/responses'
import { errorHandler } from '@/utils/errorHandler'

export const postActivities = async (
  serviceId: number,
  sessionId: string,
  completeness: number
) => {
  try {
    const res = await axios.post<StandardResponse>('/activities', {
      service_id: serviceId,
      session_id: sessionId,
      completeness: completeness
    })
    if (res.data.ok) {
      return res.data
    }
  } catch (e) {
    errorHandler(e)
  }
}
