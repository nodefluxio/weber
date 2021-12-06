import { errorHandler } from '@/utils/errorHandler'
import axios from 'axios'
import { CustomError } from 'app/errors/CustomError'
import { AnalyticsResponse, ServiceBySlugResponse } from '../types/responses'

export const getServiceBySlug = async (slug: string) => {
  try {
    const res = await axios.get<ServiceBySlugResponse>(`/services/${slug}`)
    if (res.data.ok) {
      return res.data
    }
  } catch (e) {
    errorHandler(e)
  }
}

export const postServicePhoto = async <T>(
  id: number,
  sessionId: string,
  photo: string,
  analyticName?: string
) => {
  try {
    const res = await axios.post<AnalyticsResponse<T>>(`/services/${id}`, {
      analytic_name: analyticName,
      session_id: sessionId,
      data: {
        images: [photo]
      }
    })
    if (res.data.ok) {
      const { service_data, thumbnails } = res.data
      if (service_data.job.result.status === 'success' && service_data.job.result.result.length > 0) {
        return { result: service_data.job.result.result[0], thumbnails }
      } else {
        throw new CustomError(400, service_data.message)
      }
    }
  } catch (e) {
    errorHandler(e)
  }
}
