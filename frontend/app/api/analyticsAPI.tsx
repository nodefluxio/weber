import axios, { AxiosError } from "axios"
import { AnalyticsResponse, ServiceByIdResponse } from "../types/responses"

const ERROR_MESSAGE = "Something wrong has happened"

export const getServiceById = async (id: number) => {
  try {
    const res = await axios.get<ServiceByIdResponse>(`/services/${id}`)
    if (res.data.ok) {
      return res.data
    }
  } catch (e) {
    throw new Error(ERROR_MESSAGE)
  }
}

export const postServicePhoto = async (id: number, sessionId: string, photo: string) => {
  try {
    const res = await axios.post<AnalyticsResponse>(`/services/${id}`, {
      session_id: sessionId,
      data: {
        images: [photo]
      }
    })
    if (res.data.ok) {
      const { service_data } = res.data
      if (service_data.job.result.status === "success") {
        return service_data.job.result.result[0]
      } else {
        throw new Error(service_data.job.result.status)
      }
    }
  } catch (e) {
    throw new Error((e as Error).message)
  }
}
