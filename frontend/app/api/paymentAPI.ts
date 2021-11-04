import axios from "axios"
import { SESSION_ID_ERROR } from "../constants/message"
import { PhoneNumberResponse } from "../types/responses"

type RegistrationResponse = {
  ok: boolean,
  error?: boolean,
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
    // TODO: uncomment the following lines to test
    // the matching endpoint
    // const res = await axios.post<PhoneNumberResponse>(
    //   `/face-payment/account`,
    //   {
    //     session_id: sessionId,
    //     phone: phoneNum,
    //     name: name,
    //     have_twin: haveTwin,
    //     data: {
    //       images: photo
    //     }
    //   }
    // )
    const res = { data: { ok: true, message: "Photo ok" } }
    if (res.data.ok) {
      return {
        ...res.data
      }
    } else {
      throw new Error(res.data.message)
    }
  } catch (e) {
    return {
      ok: false,
      error: true,
      message: (e as Error).message
    }
  }
}
