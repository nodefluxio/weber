import Head from 'next/head'
import { CustomErrorPage } from '@/templates/CustomErrorPage/CustomErrorPage'

const CustomError = () => {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
      </Head>
      <CustomErrorPage />
    </>
  )
}

export default CustomError
