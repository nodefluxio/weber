import type { AppProps } from 'next/app'
import { Default } from '../app/components/layouts/Default/Default'
import { SmoothScroll } from '@/modules/SmoothScroll/SmoothScroll'
import '../app/styles/global.css'
import '../app/utils/axios/axiosConfig'
import 'swiper/css'
import 'swiper/css/pagination'

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
