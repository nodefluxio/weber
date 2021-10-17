import type { NextPage } from 'next'
import { ServiceByIdErrorResponse, ServiceByIdResponse } from '../../app/types/response'
import AnalyticsPage from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useEffect } from 'react'
import axios, { AxiosError } from 'axios'

const OCR: NextPage = () => {
  
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<ServiceByIdResponse>(`/service/${id}`)
        if (res.data.ok) {
          const { data } = res.data
          // Handle data here
        }
      } catch(err) {
        if (axios.isAxiosError(err)) {
          const e = err as AxiosError<ServiceByIdErrorResponse>
          console.log(e.message)
        } else {
          console.log(err)
        }
      }
    })()
  })

  return <AnalyticsPage
          analyticsName={"OCR KTP"}
          shortDescription={"Visionaire Cloud is a pay-as-you-go solution, designed to analyze video and image by using leading-edge\
          artiﬁcial intelligence and analytics, and turning it into actionable intelligence – whether to strengthen a business\
          or as an essential business tool to help organizations streamline operations, improve monitoring and customer experience."}
          longDescription={""}
          examples={["/assets/images/face.jpg", "/assets/images/face2.jpeg"]}
          />
}

export default OCR