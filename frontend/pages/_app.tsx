import '../app/styles/app.scss'
import type { AppProps } from 'next/app'
import { Layout } from '../app/components/layouts/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default MyApp
