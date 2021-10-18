import { RequestDemoForm } from '../../modules/RequestDemoForm/RequestDemoForm'
import { useRouter } from 'next/router'
import styles from './RequestDemoPage.module.scss'
export const RequestDemoPage = () => {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div>
        <h1>Request Nodeflux Demo</h1>
      </div>
      <div>
        <RequestDemoForm onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}
