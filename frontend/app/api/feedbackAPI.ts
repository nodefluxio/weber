import { errorHandler } from '@/utils/errorHandler'
import axios from 'axios'
import { StandardResponse } from '../types/responses'

type ReviewReqBody = {
  id: number
  session_id: string
  rating: number
  comment: string
}

export const postFeedback = async ({
  id,
  session_id,
  rating,
  comment
}: ReviewReqBody): Promise<StandardResponse | undefined> => {
  try {
    const res = await axios.post<StandardResponse>(`/feedback/${id}`, {
      session_id,
      rating,
      comment
    })
    if (res.data.ok) {
      return res.data
    }
  } catch (err) {
    errorHandler(err)
  }
}
