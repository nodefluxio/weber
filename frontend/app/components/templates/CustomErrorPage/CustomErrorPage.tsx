import { Color } from '@/types/elements'
import Image from 'next/image'
import styles from './CustomErrorPage.module.scss'
import { ButtonLink } from '@/elements/ButtonLink/ButtonLink'

export const CustomErrorPage = () => {
  return (
    <div className={styles.customErrorDiv}>
      <Image src="/assets/icons/warning.svg" width={120} height={120} />
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist</p>
      <ButtonLink color={Color.Secondary} href="/">
        Back to Home
      </ButtonLink>
    </div>
  )
}
