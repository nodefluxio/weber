import { InnovationResponse } from '@/types/responses'
import axios from 'axios'
import { errorHandler } from '@/utils/errorHandler'

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
      if (data.service_data.ok && data.service_data.job.result.result.length > 0) {
        return data.service_data.job.result.result[0]
      } else {
        return data.service_data.message
      }
    }
  } catch (e) {
    errorHandler(e)
  }
}
