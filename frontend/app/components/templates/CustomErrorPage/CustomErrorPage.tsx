import { Button } from '@/elements/Button/Button'
import { Color } from '@/types/elements'
import Link from 'next/link'
import Image from 'next/image'
import styles from './CustomErrorPage.module.scss'

export const CustomErrorPage = () => {
  return (
    <div className={styles.customErrorDiv}>
      <Image src="/assets/icons/warning.svg" width={120} height={120} />
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist</p>
      <Link passHref href="/">
        <Button type="link" color={Color.Secondary}>
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
