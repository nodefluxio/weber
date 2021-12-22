import { RequestDemoForm } from '../../modules/RequestDemoForm/RequestDemoForm'
import { useRouter } from 'next/router'

export const RequestDemoPage = () => {
  const router = useRouter()

  return (
    <div
      className="container flex flex-col md:flex-row 
      pt-24 pb-12 md:pt-32 w-[90%] md:w-4/5 mx-auto justify-center">
      <div className="w-full mb-4 md:mr-10 md:w-4/5 md:max-w-md">
        <h1
          className="text-4xl md:text-5xl text-primary-500 
          font-extrabold mb-3 md:mb-5 md:mt-20">
          Try our demo in your browser
        </h1>
        <p className="font-serif md:text-lg">
          If you are interested in working with us or just want to talk shop
          with some really smart, talented people, let us know! Fill out the
          form below and one of our team members will get back to you right
          away.
        </p>
      </div>
      <div className="p-8 shadow-lg rounded">
        <p className="font-serif mb-4 text-sm">
          Help us with some basic information so that we can better cater to
          your business needs
        </p>
        <RequestDemoForm onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}
