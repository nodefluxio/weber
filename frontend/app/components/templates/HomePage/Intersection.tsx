import Image from 'next/image'
type Props = {
  imgSrc: string
  imgWidth: number
  imgHeight: number
  title: string
  tagLine: string
}
export const Intersection = ({
  imgSrc,
  title,
  tagLine,
  imgWidth,
  imgHeight
}: Props) => {
  return (
    <section className="relative py-16 bg-secondary-500 md:py-8">
      <div className="container flex items-center justify-center md:justify-around">
        <div className="hidden w-2/5 md:block">
          <Image
            src={imgSrc}
            width={imgWidth}
            height={imgHeight}
            alt={`${title}-intersection-image`}
          />
        </div>
        <div className="z-10 w-4/5 text-center md:w-1/2">
          <h2 className="mb-5 font-sans text-3xl font-extrabold text-primary-500 md:text-4xl">
            {title}
          </h2>
          <h3 className="font-serif text-2xl font-normal text-white md:text-3xl">
            {tagLine}
          </h3>
        </div>
        <div className="absolute w-16 md:w-20 right-0 -bottom-[5px]">
          <Image
            src="/assets/images/nodeflux-logogram.png"
            width={152}
            height={154}
            alt="visual of a quarter circle"
          />
        </div>
      </div>
    </section>
  )
}
