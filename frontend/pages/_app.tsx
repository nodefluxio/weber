import '../app/styles/app.scss'
import type { AppProps } from 'next/app'
import { Default } from '../app/components/layouts/Default/Default'
import '../app/utils/axios/axiosConfig'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Default>
      <Component {...pageProps} />
    </Default>
  )
}
export default MyApp
