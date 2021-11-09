import { NextPage } from 'next'
import Head from 'next/head'
import { RequestDemoPage } from '../../app/components/templates/RequestDemoPage/RequestDemoPage'

export const RequestDemo: NextPage = () => {
  return (
    <>
      <Head>
        <title>Request Nodeflux Demo Form</title>
      </Head>
      <RequestDemoPage />
    </>
  )
}

export default RequestDemo
