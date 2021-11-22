// import { InnovationResponse } from '@/types/responses'
// import axios from 'axios'

export const postInnovation = async <T>(
  id: number,
  session_id: string,
  photoBase64: string
) => {
  try {
    return {
      address: 'address',
      number: 'number-info',
      info: ['Alfamart BSD'],
      item: [
        {
          qty: 1,
          name: 'Sunlight 200mL',
          price: 15000,
          total: 15000
        }
      ]
    }
    /*
    const res = await axios.post<InnovationResponse<T>>(`/services/${id}`, {
      session_id: session_id,
      data: {
        images: [photoBase64]
      }
    })
    if (res.data.ok) {
      return res.data
    }
    */
  } catch (e) {
    console.error(e)
  }
}
