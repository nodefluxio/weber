import { Color, Service } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardFull } from '../../modules/CardFull/CardFull'
import { Carousel } from '../../modules/Carousel/Carousel'
import { CarouselItem } from '../../modules/CarouselItem/CarouselItem'
import { CardContent } from '../../modules/CardContent/CardContent'
import Link from 'next/link'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ResponsiveImage } from '@/modules/ResponsiveImage/ResponsiveImage'
import { parseCookies } from 'nookies'
import { postActivities } from '@/api/activitiesAPI'
import { useState } from 'react'
import { Modal } from '@/elements/Modal/Modal'
import { DownloadApp } from '@/modules/DownloadApp/DownloadApp'
import {
  APP_DOWNLOAD_MODAL_SOLUTION,
  EMAIL_MODAL_SOLUTION
} from '../../../constants/constant'
import { MailConfirmation } from '@/modules/MailConfirmation/MailConfirmation'
import { RequestDemoFormPopup } from '@/modules/RequestDemoFormPopup/RequestDemoFormModal'
import { CustomError } from 'app/errors/CustomError'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'
import { Intersection } from './Intersection'
import { SolutionCard } from '@/modules/SolutionCard/SolutionCard'
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Pagination } from 'swiper'

type Props = {
  analytics: Service[]
  solutions: Service[]
  solutionPartners: Service[]
  innovations: Service[]
}

type HeroContentItem = {
  title: string
  color: Color
  secondTitle: string
  coverImg: string
  href: string
}
SwiperCore.use([Pagination])

export const HomePage = ({
  analytics,
  solutions,
  solutionPartners,
  innovations
}: Props) => {
  const heroContentItems: Array<HeroContentItem> = [
    {
      title: 'Solutions',
      color: Color.Quaternary,
      secondTitle:
        'Creating end-to-end solutions for each use case that the user needs.',
      coverImg: 'cover1.png',
      href: '/#solutions'
    },
    {
      title: 'Analytics',
      color: Color.Tertiary,
      secondTitle:
        'Converting visual data into structured data and suitable for deployment.',
      coverImg: 'cover2.png',
      href: '/#analytics'
    },
    {
      title: 'New Innovations',
      color: Color.Quaternary,
      secondTitle:
        'Experimenting with new ideas and innovations to solve more problems in the future.',
      coverImg: 'cover3.png',
      href: '/#new-innovations'
    }
  ]

  const isMobile = useMediaQuery('(max-width: 640px)')

  const { session_id } = parseCookies()

  const createSolutionPartnerActivities = async (
    serviceId: number,
    sessionId: string | undefined,
    completeness: number
  ) => {
    try {
      const sessionIdOrEmptyString = sessionId || ''
      await postActivities(serviceId, sessionIdOrEmptyString, completeness)
    } catch (e) {
      // Unauthorized
      if (e instanceof CustomError && e.statusCode === 401) {
        throw e
      }
    }
  }

  const handleClickSolutionPartner = async (id: number, name: string) => {
    try {
      if (name === APP_DOWNLOAD_MODAL_SOLUTION) {
        await createSolutionPartnerActivities(id, session_id, 50)
        setCityAppId(id)
        setIsDownloadShown(true)
      } else if (name === EMAIL_MODAL_SOLUTION) {
        try {
          await createSolutionPartnerActivities(id, session_id, 50)
          setEmailSolutionId(id)
          setIsEmailShown(true)
        } catch (e) {
          setIsRequestModalShown(true)
        }
      } else {
        await createSolutionPartnerActivities(id, session_id, 100)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const [isDownloadShown, setIsDownloadShown] = useState<boolean>(false)
  const [isEmailShown, setIsEmailShown] = useState<boolean>(false)
  const [isRequestModalShown, setIsRequestModalShown] = useState<boolean>(false)
  const [emailSolutionId, setEmailSolutionId] = useState<number>(0)
  const [cityAppId, setCityAppId] = useState<number>(0)
  const pagination = {
    clickable: true
  }
  return (
    <>
      {/* Request Form Modal */}
      <Modal
        show={isRequestModalShown}
        onClose={() => setIsRequestModalShown(false)}>
        <RequestDemoFormPopup />
      </Modal>
      {/* (Citizen App) Download badges */}
      <Modal show={isDownloadShown} onClose={() => setIsDownloadShown(false)}>
        <DownloadApp
          appStoreUrl="https://apps.apple.com/id/app/jaki/id1509621798?l=id"
          googlePlayUrl="https://play.google.com/store/apps/details?id=id.go.jakarta.smartcity.jaki&hl=in&gl=US"
          onBadgeClick={() => {
            try {
              createSolutionPartnerActivities(cityAppId, session_id, 100)
            } catch (e) {}
          }}
        />
      </Modal>
      {/* (Sijitu) Send email confirmation */}
      <Modal show={isEmailShown} onClose={() => setIsEmailShown(false)}>
        <MailConfirmation
          handleAccept={() => {
            try {
              createSolutionPartnerActivities(emailSolutionId, session_id, 100)
            } catch (e) {}
          }}
          handleReject={() => setIsEmailShown(false)}
        />
      </Modal>
      <div>
        <section
          id="hero"
          className="flex flex-col items-center justify-center w-full h-screen">
          <Carousel withButton={false} vertical={true} delay={4000}>
            {heroContentItems.map((item, idx) => (
              <CarouselItem
                className="bg-gradient-to-r from-customPurple-100 to-customPurple-900"
                key={idx}>
                <div className="container flex flex-col items-center justify-center w-4/5 h-screen mx-auto sm:flex-row-reverse">
                  <ResponsiveImage
                    className="w-4/5 mx-auto mt-6 mb-4 h-1/3 sm:ml-4 lg:h-full lg:w-1/2 lg:max-h-[400px]"
                    src={`/assets/images/${item.coverImg}`}
                    layout="fill"
                    objectFit="contain"
                    loading="eager"
                    alt="hero-image"
                    priority
                  />
                  <div
                    className="flex flex-col justify-center w-full max-w-xs  
                  text-white lg:max-w-full lg:w-1/2">
                    <h1
                      className={`font-bold mb-1 text-4xl lg:text-5xl xl:text-6xl ${
                        item.color === Color.Tertiary && 'text-tertiary'
                      } ${
                        item.color === Color.Quaternary && 'text-quaternary'
                      }`}>
                      {item.title}
                    </h1>
                    <hr className="my-4 border-2 border-solid rounded-md lg:my-6 w-28 border-secondary-500" />
                    <h3 className="font-medium text lg:text-lg lg:max-w-sm xl:text-xl">
                      {item.secondTitle}
                    </h3>
                    <div className="w-6 mx-auto mt-6 cursor-pointer animate-bounce">
                      <Link href={item.href} passHref>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="w-24"
                          src="/assets/icons/arrow-down.svg"
                          alt="arrow-down"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </Carousel>
        </section>
        <Intersection
          imgSrc="/assets/images/solutions-01.png"
          imgWidth={564}
          imgHeight={425}
          title="Solutions"
          tagLine="Developed with Catalyst Certified Partner"
        />
        <section
          id="solutions"
          className="container mx-auto sm:px-4 section-padding">
          <h2 className="title-line">Solutions</h2>
          <Swiper
            className="w-full max-w-7xl h-[530px] md:h-[490px] xl:h-[540px] 2xl:h-[620px] "
            pagination={pagination}
            centeredSlides={isMobile}
            slidesPerView={'auto'}
            spaceBetween={10}
            grabCursor
            breakpoints={{
              '480': {
                slidesPerView: 2,
                spaceBetween: 20
              },
              '1024': {
                slidesPerView: 3,
                spaceBetween: 20
              }
            }}>
            {solutions.map((solution) => (
              <SwiperSlide key={solution.id} className="custom-swiper-slide">
                <SolutionCard solution={solution} />
              </SwiperSlide>
            ))}
            {solutionPartners.map((solutionPartner) => (
              <SwiperSlide
                key={solutionPartner.id}
                className="custom-swiper-slide">
                <SolutionCard
                  isExternal
                  isPopup={
                    solutionPartner.name === APP_DOWNLOAD_MODAL_SOLUTION ||
                    solutionPartner.name === EMAIL_MODAL_SOLUTION
                  }
                  handleClick={() =>
                    handleClickSolutionPartner(
                      solutionPartner.id,
                      solutionPartner.name
                    )
                  }
                  key={solutionPartner.id}
                  solution={solutionPartner}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
        <Intersection
          imgSrc="/assets/images/products-01.png"
          imgWidth={423}
          imgHeight={425}
          title="Products"
          tagLine="Boost Your Business Value"
        />
        <section
          id="analytics"
          className="container px-4 mx-auto section-padding">
          <h2 className="title-line">Analytics</h2>
          <ul className="flex flex-wrap justify-center">
            {analytics.map((analytic) => (
              <li
                className="w-full pb-6 sm:px-7 sm:pb-8 sm:w-1/2 lg:w-1/3"
                key={analytic.id}>
                <Card>
                  <ResponsiveImage
                    className="flex items-center justify-center w-full h-32 my-10"
                    src={`/assets/images/analytics/${analytic.thumbnail}`}
                    objectFit="contain"
                    alt={`Icon ${analytic.thumbnail}`}
                  />
                  <CardContent className="relative px-6 py-8 sm:h-80 sm:pb-0">
                    <h4 className="mb-2 font-sans text-lg text-white">
                      {analytic.name}
                    </h4>
                    <p className="mb-5 font-serif text-white">
                      {analytic.short_description}
                    </p>
                    <div className="sm:absolute sm:bottom-9">
                      <ButtonLink
                        href={'/analytics/' + analytic.slug}
                        type="link"
                        color={Color.Secondary}>
                        Try It Now
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
        <Intersection
          imgSrc="/assets/images/innovations-01.png"
          imgWidth={443}
          imgHeight={425}
          title="Experiments"
          tagLine="Push the Boundaries with Cutting-edge Technology"
        />
        <section
          id="new-innovations"
          className="container px-4 mx-auto section-padding">
          <h2 className="title-line">New Innovations</h2>
          <div className="flex flex-col mx-auto">
            {innovations.map((innovation) => (
              <div
                key={innovation.id}
                className="flex flex-col-reverse overflow-hidden bg-primary-700 mb-6 sm:mb-4 rounded-3xl sm:flex-row 
                sm:h-[350px] lg:h-80 sm:even:flex-row-reverse">
                <div className="relative w-full px-6 py-8 text-white sm:w-1/2 lg:w-2/5">
                  <h4 className="mb-2 font-sans text-lg">{innovation.name}</h4>
                  <p className="mb-4 font-serif">
                    {innovation.short_description}
                  </p>
                  <div className="sm:absolute sm:bottom-9">
                    <ButtonLink
                      href={'/innovations/' + innovation.slug}
                      color={Color.Secondary}>
                      Try It Now
                    </ButtonLink>
                  </div>
                </div>
                <ResponsiveImage
                  src={`/assets/images/innovations/${innovation.thumbnail}`}
                  objectFit="cover"
                  alt={innovation.thumbnail}
                  className="w-full h-52 sm:h-auto sm:w-1/2 lg:w-3/5 "
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
