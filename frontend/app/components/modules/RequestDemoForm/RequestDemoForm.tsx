import { Button } from '../../elements/Button/Button'
import { TextField } from '../../elements/TextField/TextField'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Color } from '../../../types/elements'
import axios, { AxiosError } from 'axios'
import {
  StandardResponse,
  VisitorsPostResponse
} from '../../../types/responses'
import { setCookie } from 'nookies'
import { useState } from 'react'
import { SelectBox } from '../../elements/SelectBox/SelectBox'
import data from './industry.json'
import company_data from './company_size.json'
import { Label } from '@/elements/Label/Label'
import { Modal } from '@/elements/Modal/Modal'

const Industries = data.Industries
const { company_size_list } = company_data

type Props = {
  onSuccess: () => void
}

type FormData = {
  email: string
  full_name: string
  company: string
  job_title: string
  industry: string
  company_size: string
  terms_and_conditions: boolean
}

export const RequestDemoForm = ({ onSuccess }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isTermsShown, setIsTermsShown] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setErrorMessage('')
    try {
      const res = await axios.post<VisitorsPostResponse>('/visitors', data)
      if (res.data.ok) {
        const { data } = res.data
        setCookie(null, 'session_id', data[0].session_id, {
          maxAge: data[0].max_age,
          path: '/'
        })
        onSuccess()
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const e = err as AxiosError<StandardResponse>
        setErrorMessage(e.response?.data.message)
      } else {
        console.error(err)
      }
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)}>
      <Modal show={isTermsShown} onClose={() => setIsTermsShown(false)}>
        <h2 className="text-lg mb-2 pr-2">
          Kebijakan Privasi / Privacy Policy
        </h2>
        <div className="max-h-[75vh] overflow-y-auto font-serif pr-2">
          <p className="mb-2 ">
            PT Nodeflux Teknologi Indonesia (&quot;Nodeflux&quot;) berkomitmen
            untuk melindungi dan menghormati privasi anda, dan oleh karenanya
            kami hanya menggunakan informasi pribadi anda untuk melakukan
            demonstrasi produk kami dan memberikan produk dan layanan yang anda
            minta dari kami. Dari waktu ke waktu kami hendak menghubungi anda
            untuk memberikan informasi mengenai produk dan layanan kami serta
            konten lain yang menjadi ketertarikan anda.
          </p>
          <p className="mb-2 italic">
            PT Nodeflux Teknologi Indonesia (&quot;Nodeflux&quot;) is committed
            to protecting and respecting your privacy, and we&apos;ll only use
            your personal information to perform our product demonstrations and
            to provide the products and services you requested from us. From
            time to time, we would like to contact you in order to provide
            information about our products and services, as well as other
            content that may be of interest to you.
          </p>
          <p className="mb-2">
            Selanjutnya, bagi kami tidak ada yang lebih penting dari privasi dan
            keamanan anda. Kami tidak akan pernah menjual atau salah dalam
            menjaga data anda. Silahkan untuk mempelajari komitmen kami dalam
            menjaga privasi anda{' '}
            <a
              className="medium text-blue-900 cursor-pointer underline"
              rel="noopener noreferrer"
              target={'_blank'}
              href="https://drive.google.com/file/d/13vUKTqzyJWIFVydkZmyW1flXiTJ38V5n/view?usp=sharing">
              di sini
            </a>
            .
          </p>
          <p className="mb-2 italic">
            Furthermore, nothing matters more to us than your privacy and
            security. We&apos;ll never sell or mishandle your data. Learn more
            about our commitment to protecting your privacy{' '}
            <a
              className="medium text-blue-900 cursor-pointer underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://drive.google.com/file/d/19AnK4pFPh1oNloJTRNO7Yb-5HoHRTYfF/view?usp=sharing">
              here
            </a>
            .
          </p>
          <p className="mb-2">
            Dengan anda melakukan tick pada &quot;checkbox&quot; di formulir
            yang tersedia, maka anda setuju dengan ketentuan-ketentuan di
            Kebijakan Privasi kami dan memperbolehkan kami untuk menghubungi
            anda di kemudian hari.
          </p>
          <p className="mb-2 italic">
            By ticking the &quot;checkbox&quot; in the form, you agree to the
            terms contained in our Privacy Policy and allow us to contact you in
            the future.
          </p>
        </div>
      </Modal>
      <TextField
        id="email"
        label="Email"
        placeholder="Your business email"
        type="email"
        register={register}
        registerOptions={{
          required: 'required'
        }}
        errors={errors}
      />
      <TextField
        id="full_name"
        label="Full Name"
        placeholder="Your full name"
        type="text"
        register={register}
        registerOptions={{
          required: 'required',
          minLength: { value: 5, message: 'minimum length is 5' },
          maxLength: { value: 40, message: 'maximum length is 40' }
        }}
        errors={errors}
      />
      <div className="flex flex-col md:flex-row w-full justify-between">
        <div className="md:w-[47%]">
          <TextField
            id="job_title"
            label="Job Title"
            placeholder="Job title"
            type="text"
            register={register}
            registerOptions={{
              required: 'required',
              minLength: { value: 5, message: 'minimum length is 5' }
            }}
            errors={errors}
          />
        </div>
        <div className="md:w-[47%]">
          <TextField
            id="company"
            label="Company Name"
            placeholder="Company name"
            type="text"
            register={register}
            registerOptions={{
              required: 'required',
              minLength: { value: 5, message: 'minimum length is 5' }
            }}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full justify-between mb-2">
        <div className="md:w-[47%]">
          <SelectBox
            id="company_size"
            label="Company Size"
            options={company_size_list}
            register={register}
            registerOptions={{ required: 'required' }}
            errors={errors}
          />
        </div>
        <div className="md:w-[47%]">
          <SelectBox
            id="industry"
            label="Industry"
            options={Industries}
            register={register}
            registerOptions={{ required: 'required' }}
            errors={errors}
          />
        </div>
      </div>
      <div className="flex items-start">
        <input
          className="w-5 h-5 mr-4 ml-1 shrink-0 cursor-pointer"
          {...register('terms_and_conditions', { required: 'required' })}
          name="terms_and_conditions"
          id="terms_and_conditions"
          type="checkbox"
        />
        <Label
          className="font-normal font-serif"
          id="terms_and_conditions"
          errors={errors}>
          I agree and accept to this{' '}
          <a
            className="font-medium cursor-pointer text-blue-900"
            onClick={() => {
              setIsTermsShown(true)
            }}>
            terms & conditions{' '}
          </a>
          / Saya setuju dengan{' '}
          <a
            className="font-medium cursor-pointer text-blue-900"
            onClick={() => {
              setIsTermsShown(true)
            }}>
            syarat & kententuan{' '}
          </a>
          yang ada.
        </Label>
      </div>
      <div className="text-red-600 mb-5">
        {errorMessage ? `*${errorMessage}` : null}
      </div>
      <div className="mx-auto min-w-[130px] w-1/3">
        <Button className="w-full py-3" type="submit" color={Color.Primary}>
          Submit
        </Button>
      </div>
    </form>
  )
}
