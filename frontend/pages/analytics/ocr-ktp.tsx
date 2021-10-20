import type { NextPage } from 'next'
import {
  ServiceByIdErrorResponse,
  ServiceByIdResponse
} from '../../app/types/responses'
import AnalyticsPage from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useEffect, useState } from 'react'
import { getServiceById } from '../../app/api/analyticsAPI'
const OCR: NextPage = () => {
  
  const [data, setData] = useState<ServiceByIdResponse["data"]>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    getServiceById(1)
    .then((res: ServiceByIdResponse|undefined) => {
      setData(res!.data)
    })
    .catch((err) => {
      setError("oke")
    })
  }, [])

  if(error) return <div>An error happened, balik ke homepage</div>
  if(!data) return <div>Hehehe blum load</div>
  else
  return (
    <AnalyticsPage
      analyticsName={data.name}
      shortDescription={data.short_description}
      longDescription={data.long_description}
      examples={[
        '/assets/images/ktp1.jpg',
        '/assets/images/ktp2.jpeg',
        '/assets/images/ktp3.jpg'
      ]}
      serviceID={1}
    />
  )
}

export default OCR
