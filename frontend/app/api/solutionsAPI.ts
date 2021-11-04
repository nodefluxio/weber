import axios, { AxiosError } from 'axios'
import { SESSION_ID_ERROR } from '../constants/message'
import { EKYC } from '../types/elements'
import { AnalyticsError, EKYCResultResponse } from '../types/responses'

export const postEKYC = async (
  sessionId: string,
  facePhoto: string,
  ocrPhoto: string
): Promise<EKYC | undefined> => {
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

    const faceLivenessData =
      res.data.service_data.face_liveness.job.result.result[0].face_liveness
    const faceMatchData =
      res.data.service_data.face_match.job.result.result[0].face_match
    const ocrKtpData = res.data.service_data.ocr_ktp.job.result.result[0]

    if (res.data.ok) {
      return {
        face_liveness: {
          live: faceLivenessData.live,
          liveness: faceLivenessData.liveness
        },
        face_match: {
          match: faceMatchData.match,
          similarity: faceMatchData.similarity
        },
        ocr_ktp: {
          ...ocrKtpData
        }
      }
    }
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
