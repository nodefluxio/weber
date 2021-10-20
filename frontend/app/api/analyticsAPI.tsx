import axios, { AxiosError } from "axios"
import { ServiceByIdResponse } from "../types/responses"

const ERROR_MESSAGE = "Something wrong has happened"

export const getServiceById = async (id: number) => {
  try {
    const res = await axios.get<ServiceByIdResponse>(`/services/${id}`)
    if (res.data.ok) {
      return res.data
    }
  } catch(e) {
    console.log(e)
    throw new Error(ERROR_MESSAGE)
  }
}