import type { AppProps } from 'next/app'
import { Default } from '../app/components/layouts/Default/Default'
import { SmoothScroll } from '@/modules/SmoothScroll/SmoothScroll'
import '../app/styles/global.css'
import '../app/utils/axios/axiosConfig'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SmoothScroll>
      <Default>
        <Component {...pageProps} />
      </Default>
    </SmoothScroll>
  )
}
export default MyApp
