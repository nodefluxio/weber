import { ReactNode } from 'react'
import { Navbar } from '../../modules/Navbar/Navbar'

type Props = {
  children: ReactNode
}

export const Default = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
