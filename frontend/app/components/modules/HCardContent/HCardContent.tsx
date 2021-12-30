import { ReactNode } from 'react'
import Image from 'next/image'

type Props = {
  title: string
  children: ReactNode
  imgSrc: string
  imgAlt: string
}

export const HCardContent = ({ imgSrc, imgAlt, title, children }: Props) => {
  return (
    <div className="flex">
      <div className="relative w-[128px] h-[128px] mr-12">
        <Image src={imgSrc} alt={imgAlt} layout="fill" objectFit="cover" />
      </div>
      <div className="text-left">
        <h2 className="mb-2">{title}</h2>
        <div className="mb-2">{children}</div>
      </div>
    </div>
  )
}
