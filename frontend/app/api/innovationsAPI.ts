import { InnovationResponse } from '@/types/responses'
import axios from 'axios'
import { errorHandler } from '@/utils/errorHandler'

export const postInnovation = async <T>(
  id: number,
  session_id: string,
  photoBase64: string
): Promise<T | undefined> => {
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
      return data.service_data.job as T
    }
  } catch (e) {
    errorHandler(e)
  }
}
