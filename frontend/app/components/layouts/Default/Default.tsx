import { ReactNode } from 'react'
import Head from 'next/head'
import { Navbar } from '../../modules/Navbar/Navbar'
import { Footer } from '../Footer/Footer'

type Props = {
  children: ReactNode
}

export const Default = ({ children }: Props) => {
  return (
    <>
      <Head>
        <title>Nodeflux Demo App</title>
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
