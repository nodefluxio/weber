import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}
export const Layout = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
