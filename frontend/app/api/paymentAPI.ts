import axios, { AxiosError } from 'axios'
import { SESSION_ID_ERROR } from '../constants/message'
import {
  ActivationResponse,
  PhoneNumberResponse,
  PaymentResponse,
  CheckLimitResponse,
  StandardResponse
} from '../types/responses'

export const registerAccount = async (
  sessionId: string,
  phoneNum: string,
  name: string,
  haveTwin: boolean,
  photo?: string[] //base64Jpeg
): Promise<PaymentResponse> => {
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
    if (axiosError.response?.status === 401) {
      // Unauthorized
      return {
        ok: false,
        error: 401,
        message: SESSION_ID_ERROR
      }
    }
    return {
      ok: false,
      error: axiosError.response?.status || 500,
      message: axiosError.response?.data.message || 'Server error'
    }
  }
}

export const activateAccount = async (
  sessionId: string,
  pin: string,
  minPayment: number
): Promise<PaymentResponse> => {
  try {
    const res = await axios.patch<ActivationResponse>(`/face-payment/account`, {
      session_id: sessionId,
      pin: pin,
      minimum_payment: minPayment
    })
    if (res.data.ok) {
      return {
        ...res.data
      }
    } else {
      throw new Error(res.data.message)
    }
  } catch (e) {
    const axiosError = e as AxiosError<ActivationResponse>
    console.log(axiosError.message)
    if (axiosError.response?.status === 401) {
      // Unauthorized
      return {
        ok: false,
        error: 401,
        message: SESSION_ID_ERROR
      }
    }
    return {
      ok: false,
      error: axiosError.response?.status || 500,
      message: axiosError.response?.data.message || 'Server error'
    }
  }
}

export const checkLimit = async (
  sessionId: string,
  phone: string,
  amount: number
): Promise<CheckLimitResponse | undefined> => {
  try {
    const res = await axios.post<CheckLimitResponse>(
      `/face-payment/check-limit`,
      {
        session_id: sessionId,
        phone: phone,
        amount: amount
      }
    )
    if (res.data.ok) {
      return {
        ...res.data
      }
    } else {
      throw new Error(res.data.message)
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError<CheckLimitResponse>
      if (error && error.response) {
        throw new Error(SESSION_ID_ERROR)
      }
    } else {
      throw new Error((e as Error).message)
    }
  }
}

export const pay = async (
  sessionId: string,
  phone: string,
  pin: string,
  amount: number,
  image: string
): Promise<StandardResponse | undefined> => {
  try {
    const res = await axios.post<StandardResponse>(`/face-payment/pay`, {
      session_id: sessionId,
      phone: phone,
      pin: pin,
      amount: amount,
      data: {
        image: [image]
      }
    })
    return res.data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const error = e as AxiosError<CheckLimitResponse>
      if (error && error.response) {
        throw new Error(SESSION_ID_ERROR)
      }
    } else {
      throw new Error((e as Error).message)
    }
  }
}
