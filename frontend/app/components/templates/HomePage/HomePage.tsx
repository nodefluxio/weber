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

export const HomePage = ({ analytics, solutions, innovations }: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <Image
          src="/assets/images/cover.jpg"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="people from cct view"
          priority
        />
        <h1>Experiencing nodeflux's analytics and solutions through web browser</h1>
      </div>
      <section className={`${styles.productsSection} ${styles.sectionPadding}`}>
        <h1 className={styles.titleLine}>Our Product</h1>
        <div className={styles.productCards}>
          <Card
            className={`${styles.card} ${styles.visionaire}`}
            color={Color.Secondary}>
            <CardImage
              className={styles.cardImage}
              img={`/assets/images/visionaire-logo.png`}
              width={341}
              height={110}
            />
            <CardContent className={styles.cardContent} color={Color.Secondary}>
              VisionAIre represents years of experience in AI. It is positioned
              as the core - the brain - of vision AI implementation across all
              of Nodeflux’s solutions and deployments. Going forward, VisionAIre
              sits at the heart of all vision AI-related solutions and
              deployments, acting as the core that holds everything.
            </CardContent>
          </Card>
          <Card
            className={`${styles.card} ${styles.identifai}`}
            color={Color.Tertiary}>
            <CardImage
              className={styles.cardImage}
              img={`/assets/images/identifai-logo.png`}
              width={246}
              height={110}
            />
            <CardContent className={styles.cardContent} color={Color.Tertiary}>
              IdentifAI provide e-KYC for business solutions to identify,
              recognize, detect, and verify data without direct physical
              contact. We are collaborating with Dukcapil (Data Kepedudukan dan
              Catatan Sipil) Kemendagri and financial services across Indonesia
              to simplify user registration and validation with AI based
              technology.
            </CardContent>
          </Card>
        </div>
      </section>
      <section className={styles.awardsSection}>
        <h1 className={styles.title}>Awards and Recognition</h1>
        <div className={`${styles.whiteContainer} ${styles.awardsContainer}`}>
          <Image src="/assets/images/nvidia-logo.png" width={277} height={50} />
          <Image
            src="/assets/images/satu-indonesia-logo.png"
            width={190}
            height={93}
          />
          <Image src="/assets/images/bia-logo.png" width={149} height={76} />
          <Image
            src="/assets/images/identik-logo.png"
            width={147}
            height={74}
          />
        </div>
        <div
          className={`${styles.whiteContainer} ${styles.recognitionsContainer}`}>
          <Image src="/assets/images/nist-logo.png" width={169} height={44} />
          <h4>INDUSTRY TEST SCORE</h4>
          <h3>Ranked Top 30th Percentile in NIST Leader Board</h3>
          <p>
            Nodeflux passed the US National Institute of Standard and Technology
            (NIST) Face-Recognition Vendor Test (updated 2019)
          </p>
        </div>
      </section>
      <section className={`${styles.ourDemoSection} ${styles.sectionPadding}`}>
        <div className={styles.texts}>
          <h1 className={styles.title}>Our Demo Offers</h1>
          <h1 className={styles.title}>Try Now</h1>
        </div>
        <div className={styles.cards}>
          <CardFull
            img="/assets/images/smartcity.png"
            title="Solutions"
            desc="Through Intelligence Video Analytics (IVA) we developed wide range of analytic to help solve our client’s most challenging issues."
            href="#solutions"
          />
          <CardFull
            img="/assets/images/smartcity.png"
            title="Analytics"
            desc="Through Intelligence Video Analytics (IVA) we developed wide range of analytic to help solve our client’s most challenging issues."
            href="#analytics"
          />
          <CardFull
            img="/assets/images/smartcity.png"
            title="New Innovations"
            desc="Through Intelligence Video Analytics (IVA) we developed wide range of analytic to help solve our client’s most challenging issues."
            href="#new-innovations"
          />
        </div>
      </section>
      <section className={styles.intersection}>
        <div className={styles.container}>
          <div className={styles.imageContainer}>
            <Image
              src="/assets/images/solutions-01.png"
              width={672}
              height={522}
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
      <section id="new-innovations">
        <Carousel>
          {innovations.map((innovation) => (
            <CarouselItem
              key={innovation.id}
              img={`/assets/images/innovations/${innovation.thumbnail}`}
              title={innovation.name}
              desc={innovation.short_description}
              slug={innovation.slug}
            />
          ))}
        </Carousel>
      </section>
    </div>
  )
}
