import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Default = ({ children }: Props) => {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
