import axios, { AxiosError } from 'axios'
import { SESSION_ID_ERROR } from '../constants/message'
import { PhoneNumberResponse } from '../types/responses'

type RegistrationResponse = {
  ok: boolean
  error?: number
  message: string
}

export const registerAccount = async (
  sessionId: string,
  phoneNum: string,
  name?: string,
  haveTwin?: boolean,
  photo?: string[] //base64Jpeg
): Promise<RegistrationResponse> => {
  try {
    const res = await axios.post<PhoneNumberResponse>(`/face-payment/account`, {
      session_id: sessionId,
      phone: phoneNum,
      full_name: name,
      have_twin: haveTwin,
      data: {
        images: photo
      }
    })
    if (res.data.ok) {
      return {
        ...res.data
      }
    } else {
      throw new Error(res.data.message)
    }
  } catch (e) {
    const axiosError = e as AxiosError<PhoneNumberResponse>
    if (axiosError.response?.status === 401) { // Unauthorized
      return {
        ok: false,
        error: 401,
        message: SESSION_ID_ERROR
      }
    }
    return {
      ok: false,
      error: axiosError.response?.status || 500,
      message: axiosError.response?.data.message || "Server error"
    }
  }
}
