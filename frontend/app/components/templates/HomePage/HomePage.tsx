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

type Props = {
  analytics: Service[]
  solutions: Service[]
  innovations: Service[]
}

type HeroContentItem = {
  title: string
  color: Color
  tagLine: string
  secondTitle: string
  description: string
  coverImg: string
  href: string
}

export const HomePage = ({ analytics, solutions, innovations }: Props) => {
  const heroContentItems: Array<HeroContentItem> = [
    {
      title: 'Solutions',
      color: Color.Quaternary,
      tagLine: 'Cool Tag Line',
      secondTitle: 'COOL TITLE MAYBE',
      description: 'Cool Description about these, lorem ipsum',
      coverImg: 'cover1.png',
      href: '/#solutions'
    },
    {
      title: 'Analytics',
      color: Color.Tertiary,
      tagLine: 'Cool Tag Line',
      secondTitle: 'COOL TITLE MAYBE',
      description: 'Cool Description about these, lorem ipsum',
      coverImg: 'cover2.png',
      href: '/#analytics'
    },
    {
      title: 'Innovations',
      color: Color.Quaternary,
      tagLine: 'Cool Tag Line',
      secondTitle: 'COOL TITLE MAYBE',
      description: 'Cool Description about these, lorem ipsum',
      coverImg: 'cover3.png',
      href: '/#new-innovations'
    }
  ]
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
              <div className={styles.heroContentContainer}>
                <div className={styles.texts}>
                  <h1 className={`${styles.titleHero} ${styles[item.color]}`}>
                    {item.title}
                  </h1>
                  <h1 className={styles.tagLine}>{item.tagLine}</h1>
                  <hr />
                  <h3 className={styles.secondTitle}>{item.secondTitle}</h3>
                  <p className={styles.desc}>{item.description}</p>
                  <div className={styles.arrow}>
                    <Link href={item.href}>
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
                    alt="cover-image"
                    priority
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </section>
      <section className={styles.intersection}>
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src="/assets/images/solutions-01.png"
              width={672}
              height={522}
              alt="solutions-01"
            />
          </div>
          <div className={styles.texts}>
            <h1>Solutions</h1>
            <h1>Developed with Catalyst Certified Partner</h1>
          </div>
          <div className={styles.logogramContainer}>
            <Image
              src="/assets/images/nodeflux-logogram.png"
              width={359}
              height={348}
              alt="logogram"
            />
          </div>
        </div>
      </section>
      <section
        id="solutions"
        className={`${styles.solutionsSection} ${styles.sectionPadding}`}>
        <h1 className={styles.titleLine}>Our Solutions</h1>
        <div className={styles.cards}>
          {solutions.map((solution) => (
            <CardFull
              key={solution.id}
              img={`/assets/images/solutions/${solution.thumbnail}`}
              title={solution.name}
              desc={solution.short_description}
              href={`/solutions/${solution.slug}`}
            />
          ))}
        </div>
      </section>
      <section className={styles.intersection}>
        <div className={styles.container}>
          <div className={`${styles.imageContainer} ${styles.imageProduct}`}>
            <Image
              src="/assets/images/products-01.png"
              width={490}
              height={490}
              alt="products-91"
            />
          </div>
          <div className={styles.texts}>
            <h1>Products</h1>
            <h1>Boost Your Bussines Value</h1>
          </div>
          <div className={styles.logogramContainer}>
            <Image
              src="/assets/images/nodeflux-logogram.png"
              width={359}
              height={348}
              alt="logogram"
            />
          </div>
        </div>
      </section>
      <section
        id="analytics"
        className={`${styles.analyticsSection} ${styles.sectionPadding}`}>
        <h1 className={styles.titleLine}>Our Analytics</h1>
        <div className={styles.cards}>
          {analytics.map((analytic) => (
            <Card key={analytic.id} color={Color.Primary}>
              <CardImage
                img={`/assets/images/analytics/${analytic.thumbnail}`}
                width={171}
                height={171}
              />
              <CardContent
                color={Color.Primary}
                title={analytic.name}
                height={'300px'}>
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
              <div className={styles.container}>
                <h1>New Innovations</h1>
                <Image
                  className={styles.image}
                  alt={`image of ${innovation.name}`}
                  src={`/assets/images/innovations/${innovation.thumbnail}`}
                  layout="fill"
                  objectFit="cover"
                  loading="eager"
                />
                <Card className={styles.card}>
                  <CardContent
                    className={styles.cardContent}
                    title={innovation.name}
                    height={'100%'}>
                    {innovation.short_description}
                    <div className={styles.footer}>
                      <Link href={'/innovations/' + innovation.slug} passHref>
                        <Button type="link" color={Color.Secondary}>
                          Try It Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </section>
    </div>
  )
}
