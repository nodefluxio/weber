import styles from './HomePage.module.scss'
import { Color, Service } from '../../../types/elements'
import { Card } from '../../modules/Card/Card'
import { CardFull } from '../../modules/CardFull/CardFull'
import { Carousel } from '../../modules/Carousel/Carousel'
import { CarouselItem } from '../../modules/CarouselItem/CarouselItem'
import Image from 'next/image'
import { CardContent } from '../../modules/CardContent/CardContent'
import { Button } from '../../elements/Button/Button'
import Link from 'next/link'
import { CardImage } from '../../modules/CardImage/CardImage'
import { Navigation } from 'swiper'
import { useMediaQuery } from '@/hooks/useMediaQuery'
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { postActivities } from '@/api/activitiesAPI'
import { parseCookies } from 'nookies'

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

export const HomePage = ({ analytics, solutions, solutionPartners, innovations }: Props) => {
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
        'Creating new innovations to solve more problems in the future.',
      coverImg: 'cover3.png',
      href: '/#new-innovations'
    }
  ]

  const isMobile = useMediaQuery('(max-width: 480px)')

  const { session_id } = parseCookies()

  const createSolutionPartnerActivities = async (
    serviceId: number,
    sessionId: string | undefined
  ) => {
    try {
      const sessionIdOrEmptyString = sessionId || ''
      await postActivities(serviceId, sessionIdOrEmptyString, 100)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <Carousel
          className={styles.caraousel}
          withButton={false}
          vertical={true}
          delay={4000}>
          {heroContentItems.map((item, idx) => (
            <CarouselItem className={styles.carouselItem} key={idx}>
              <div className={`${styles.heroContentContainer} fluidContainer`}>
                <div className={styles.texts}>
                  <h1 className={`${styles.titleHero} ${styles[item.color]}`}>
                    {item.title}
                  </h1>
                  <hr />
                  <h3 className={styles.secondTitle}>{item.secondTitle}</h3>
                  <div className={styles.arrow}>
                    <Link href={item.href} passHref>
                      <img
                        className={styles.arrowImg}
                        src="/assets/icons/arrow-down.svg"
                        alt="arrow-down"
                      />
                    </Link>
                  </div>
                </div>
                <div className={styles.imgContainer}>
                  <Image
                    src={`/assets/images/${item.coverImg}`}
                    layout="fill"
                    objectFit="contain"
                    loading="eager"
                    alt="hero-image"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </section>
      <section className={styles.intersection}>
        <div className={`${styles.container} fluidContainer`}>
          <div className={styles.imageContainer}>
            <Image
              src="/assets/images/solutions-01.png"
              width={672}
              height={522}
              alt="solution-intersection-image"
            />
          </div>
          <div className={styles.texts}>
            <h2>Solutions</h2>
            <h2>Developed with Catalyst Certified Partner</h2>
          </div>
          <div className={styles.logogramContainer}>
            <Image
              src="/assets/images/nodeflux-logogram.png"
              width={359}
              height={348}
              alt="visual of a quarter circle"
            />
          </div>
        </div>
      </section>
      <section
        id="solutions"
        className={`${styles.solutionsSection} ${styles.sectionPadding}`}>
        <div className="fluidContainer">
          <h2 className={styles.titleLine}>Our Solutions</h2>
          <Swiper
            modules={[Navigation]}
            className={styles.swipper}
            navigation={!isMobile}
            centeredSlides={isMobile}
            slidesPerView={'auto'}
            spaceBetween={10}
            grabCursor
            breakpoints={{
              '480': {
                slidesPerView: 2,
                spaceBetween: 20
              },
              '780': {
                slidesPerView: 3,
                spaceBetween: 20
              }
            }}>
            {solutions.map((solution) => (
              <SwiperSlide className={styles.swipperSlide} key={solution.id}>
                <CardFull
                  img={`/assets/images/solutions/${solution.thumbnail}`}
                  title={solution.name}
                  href={`/solutions/${solution.slug}`}>
                  <div className={styles.content}>
                    <h3>{solution.name}</h3>
                    <p>{solution.short_description}</p>
                  </div>
                </CardFull>
              </SwiperSlide>
            ))}
            {solutionPartners.map((solutionPartner) => (
              <SwiperSlide className={styles.swipperSlide} key={solutionPartner.id}>
                <CardFull
                  isExternal={true}
                  target='_blank'
                  onClick={() => createSolutionPartnerActivities(solutionPartner.id, session_id)}
                  img={`/assets/images/solutions/${solutionPartner.thumbnail}`}
                  title={solutionPartner.name}
                  href={solutionPartner.slug}>
                  <div className={styles.content}>
                    <h3>{solutionPartner.name}</h3>
                    <p>{solutionPartner.short_description}</p>
                  </div>
                </CardFull>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      <section className={styles.intersection}>
        <div className={`${styles.container} fluidContainer`}>
          <div className={`${styles.imageContainer} ${styles.imageProduct}`}>
            <Image
              src="/assets/images/products-01.png"
              width={490}
              height={490}
              alt="product-intersection-image"
            />
          </div>
          <div className={styles.texts}>
            <h2>Products</h2>
            <h2>Boost Your Bussines Value</h2>
          </div>
          <div className={styles.logogramContainer}>
            <Image
              src="/assets/images/nodeflux-logogram.png"
              width={359}
              height={348}
              alt="visual of a quarter circle"
            />
          </div>
        </div>
      </section>
      <section
        id="analytics"
        className={`${styles.analyticsSection} ${styles.sectionPadding}`}>
        <h2 className={styles.titleLine}>Our Analytics</h2>
        <div className={styles.cards}>
          {analytics.map((analytic) => (
            <Card key={analytic.id} color={Color.Primary}>
              <CardImage
                className={styles.image}
                layout="fill"
                objectFit="contain"
                img={`/assets/images/analytics/${analytic.thumbnail}`}
                alt={`icon ${analytic.thumbnail}`}
              />
              <CardContent
                className={styles.cardContent}
                color={Color.Primary}
                title={analytic.name}>
                {analytic.short_description}
                <div className={styles.footer}>
                  <Link href={'/analytics/' + analytic.slug} passHref>
                    <Button type="link" color={Color.Secondary}>
                      Try It Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section id="new-innovations" className={styles.newInnovationsSection}>
        <Carousel>
          {innovations.map((innovation) => (
            <CarouselItem key={innovation.id}>
              <div className="fluidContainer">
                <div className={styles.container}>
                  <Image
                    className={styles.image}
                    alt={`image of ${innovation.name}`}
                    src={`/assets/images/innovations/${innovation.thumbnail}`}
                    layout="fill"
                    objectFit="cover"
                    loading="eager"
                  />
                  <div className={styles.cardContainer}>
                    <h2>New Innovations</h2>
                    <Card className={styles.card}>
                      <CardContent
                        className={styles.cardContent}
                        title={innovation.name}
                        height={'100%'}>
                        {innovation.short_description}
                        <div className={styles.footer}>
                          <Link
                            href={'/innovations/' + innovation.slug}
                            passHref>
                            <Button type="link" color={Color.Secondary}>
                              Try It Now
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </section>
    </div>
  )
}
