import { ReactNode } from 'react'
import { Navbar } from '../../modules/Navbar/Navbar'
import { Footer } from '../Footer/Footer'

type Props = {
  children: ReactNode
}

export const Default = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
