import { StandardResponse } from '@/types/responses'
import axios, { AxiosError } from 'axios'
import { CustomError } from 'app/errors/CustomError'

export const errorHandler = (e: any) => {
  if (axios.isAxiosError(e)) {
    const error = e as AxiosError<StandardResponse>
    if (error && error.response) {
      throw new CustomError(error.response.status, error.response.data.message)
    }
  } else {
    throw e as Error
  }
}
