import Head from 'next/head'
import { getServiceBySlug } from '../../app/api/analyticsAPI'
import { FaceOcclusionAttributePage } from '@/templates/FaceOcclusionAttributePage/FaceOcclusionAttributePage'
const FaceOcclusionAttribute: React.FC<Props> = ({
  id,
  name,
  slug,
  long_description
}) => {
  return (
    <>
      <Head>
        <title>{`Innovation | ${name} - Demo`}</title>
      </Head>
      <FaceOcclusionAttributePage
        id={id}
        name={name}
        slug={slug}
        long_description={long_description}
      />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await getServiceBySlug('face-occlusion-attribute')
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    return {
      notFound: true
    }
  }
}

export default FaceOcclusionAttribute
