import { RequestDemoForm } from '../../modules/RequestDemoForm/RequestDemoForm'
import { useRouter } from 'next/router'
import styles from './RequestDemoPage.module.scss'
export const RequestDemoPage = () => {
  const router = useRouter()

  return (
    <div className="sectionContainer">
      <div className="fluidContainer">
        <div className={styles.container}>
          <div className={styles.content}>
            <h1>Try our demo in your browser</h1>
            <p>
              If you are interested in working with us or just want to talk shop
              with some really smart, talented people, let us know! Fill out the
              form below and one of our team members will get back to you right
              away.
            </p>
          </div>
          <div className={styles.formContent}>
            <div className={styles.formCard}>
              <p className={styles.formText}>
                Help us with some basic information so that we can better cater
                to your business needs
              </p>
              <RequestDemoForm onSuccess={() => router.push('/')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
