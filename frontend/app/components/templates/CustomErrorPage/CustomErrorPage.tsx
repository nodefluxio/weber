import { Color } from '@/types/elements'
import Image from 'next/image'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'

export const CustomErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 min-h-[80vh]
                    max-h-[1080px] text-primary-500">
      <Image src="/assets/icons/warning.svg" width={120} height={120} />
      <h1 className="text-2xl font-bold mt-8 mb-3">Page Not Found</h1>
      <p className="font-serif mb-8">
        The page you are looking for does not exist
      </p>
      <ButtonLink color={Color.Secondary} href="/">
        Back to Home
      </ButtonLink>
    </div>
  )
}
