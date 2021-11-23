import { errorHandler } from '@/utils/errorHandler'
import axios from 'axios'

import {
  CheckLimitResponse,
  CheckAccountResponse,
  StandardResponse
} from '../types/responses'

export const registerAccount = async (
  sessionId: string,
  phoneNum: string,
  name: string,
  haveTwin: boolean,
  photo?: string[] //base64Jpeg
) => {
  try {
    const res = await axios.post<StandardResponse>(`/face-payment/account`, {
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
    }
  } catch (e) {
    errorHandler(e)
  }
}

export const activateAccount = async (
  sessionId: string,
  pin: string,
  minPayment: number
) => {
  try {
    const res = await axios.patch<StandardResponse>(`/face-payment/account`, {
      session_id: sessionId,
      pin: pin,
      minimum_payment: minPayment
    })
    if (res.data.ok) {
      return {
        ...res.data
      }
    }
  } catch (e) {
    errorHandler(e)
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
        phone,
        amount
      }
    )
    if (res.data.ok) {
      return {
        ...res.data
      }
    }
  } catch (e) {
    errorHandler(e)
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
        images: [image]
      }
    })
    return res.data
  } catch (e) {
    errorHandler(e)
  }
}

export const checkAccount = async (
  sessionId: string
): Promise<CheckAccountResponse | undefined> => {
  try {
    const res = await axios.get<CheckAccountResponse>(
      `/face-payment/account/${sessionId}`
    )
    return {
      ...res.data
    }
  } catch (e) {
    errorHandler(e)
  }
}
