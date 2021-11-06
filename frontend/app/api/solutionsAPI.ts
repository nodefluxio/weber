import axios, { AxiosError } from 'axios'
import { SESSION_ID_ERROR } from '../constants/message'
import { AnalyticsError, EKYCResultResponse } from '../types/responses'

export const postEKYC = async (
  sessionId: string,
  facePhoto: string,
  ocrPhoto: string
): Promise<EKYCResultResponse | undefined> => {
  try {
    const res = await axios.post<EKYCResultResponse>('/ekyc', {
      session_id: sessionId,
      data: {
        face_liveness: {
          images: [facePhoto]
        },
        ocr_ktp: {
          images: [ocrPhoto]
        },
        face_match: {
          images: [facePhoto, ocrPhoto]
        }
      }
    })

    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError<AnalyticsError>
      if (error && error.response) {
        throw new Error(SESSION_ID_ERROR)
      }
    } else {
      throw new Error((e as Error).message)
    }
  }
}
