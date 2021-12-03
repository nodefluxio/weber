import {
  CarDamageResponse,
  InnovationResponse,
  FaceOcclusionAttributeResponse
} from '@/types/responses'
import axios from 'axios'
import { errorHandler } from '@/utils/errorHandler'
import { CustomError } from 'app/errors/CustomError'

export const postInnovation = async <T>(
  id: number,
  session_id: string,
  photoBase64: string
): Promise<T | string | undefined> => {
  try {
    const { data } = await axios.post<InnovationResponse<T>>(
      `/services/${id}`,
      {
        session_id: session_id,
        data: {
          additional_params: {
            templates: []
          },
          images: [photoBase64]
        }
      }
    )
    if (data.ok) {
      if (
        data.service_data.ok &&
        data.service_data.job.result.result.length > 0
      ) {
        return data.service_data.job.result.result[0]
      } else {
        return data.service_data.message
      }
    }
  } catch (e) {
    errorHandler(e)
  }
}

export const postFaceOcclusionAttribute = async (
  id: number,
  session_id: string,
  photoBase64: string
) => {
  try {
    const { data } = await axios.post<FaceOcclusionAttributeResponse>(
      `/services/${id}`,
      {
        session_id: session_id,
        data: {
          additional_params: {
            templates: []
          },
          images: [photoBase64]
        }
      }
    )
    if (data.ok) return data.service_data
    else throw new CustomError(200, data.message)
  } catch (e) {
    errorHandler(e)
  }
}

export const postCarDamage = async (
  id: number,
  sessionId: string,
  frontSideImage: string,
  leftSideImage: string,
  rightSideImage: string,
  rearSideImage: string
): Promise<InnovationResponse<CarDamageResponse> | undefined> => {
  try {
    const { data } = await axios.post<InnovationResponse<CarDamageResponse>>(
      `/services/${id}`,
      {
        session_id: sessionId,
        data: {
          images: [frontSideImage, leftSideImage, rightSideImage, rearSideImage]
        }
      }
    )
    if (data.ok) {
      if (
        data.service_data.ok &&
        data.service_data.job.result.result.length > 0
      ) {
        return data
      }
    }
  } catch (e) {
    errorHandler(e)
  }
}
