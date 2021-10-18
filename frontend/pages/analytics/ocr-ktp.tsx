import type { NextPage } from 'next'
import { ServiceByIdErrorResponse, ServiceByIdResponse } from '../../app/types/responses'
import AnalyticsPage from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { Service } from '../../app/types/elements'
import useSWR from 'swr'

const OCR: NextPage = () => {

  const fetcher = async(url: string) => {
    try {
      // Sementara ID nya di hardcode dulu
      // TODO: find alternative
      const res = await axios.get<ServiceByIdResponse>(url)
      if (res.data.ok) {
        return res.data.data
      }
    } catch(err) {
      if (axios.isAxiosError(err)) {
        const e = err as AxiosError<ServiceByIdErrorResponse>
        console.log(e.message)
      } else {
        console.log(err)
      }
    } 
  }

  const { data, error } = useSWR(`/services/1`, fetcher)

  if(error) return <p>Failed to load page :(</p>
  if (!data) return <p>Loading contents...</p>
  else return <AnalyticsPage
                analyticsName={data.name}
                shortDescription={data.short_description}
                longDescription={data.long_description}
                examples={["/assets/images/face.jpg", "/assets/images/face2.jpeg"]}
                serviceID={1}
              />
}

export default OCR