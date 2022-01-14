import { CardFull } from '@/modules/CardFull/CardFull'
import { ResponsiveImage } from '@/modules/ResponsiveImage/ResponsiveImage'
import { Service } from '@/types/elements'
import { HTMLAttributeAnchorTarget } from 'react'

type Props = {
  solution: Service
  isExternal?: boolean
  isPopup?: boolean
  target?: HTMLAttributeAnchorTarget
  handleClick?: () => void
}

export const SolutionCard = ({
  solution,
  isExternal,
  isPopup,
  target,
  handleClick
}: Props) => {
  return (
    <CardFull
      className="cursor-pointer"
      href={isExternal ? solution.slug : `/solutions/${solution.slug}`}
      isPopUp={isPopup}
      isExternal={isExternal}
      target={target}
      onClick={handleClick}>
      <div className="flex flex-col w-full relative">
        <ResponsiveImage
          className="w-full h-[220px] md:h-[280px] xl:h-[300px] 2xl:h-[380px] mb-2"
          alt={`image of ${solution.name}`}
          src={`/assets/images/solutions/${solution.thumbnail}`}
          objectFit="cover"
          objectPosition="top"
        />
        <div className="px-6 py-4 min-h-[250px] sm:min-h-[230px] md:min-h-[210px] xl:min-h-[180px]">
          <h4 className="mb-2 text-lg">{solution.name}</h4>
          <p className="font-serif ">{solution.short_description}</p>
        </div>
      </div>
    </CardFull>
  )
}
