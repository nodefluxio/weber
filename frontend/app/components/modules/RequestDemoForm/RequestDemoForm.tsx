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
import styles from './RequestDemoForm.module.scss'
import { SelectBox } from '../../elements/SelectBox/SelectBox'
import data from './industry.json'
import { Label } from '@/elements/Label/Label'
import { Modal } from '@/elements/Modal/Modal'

const Industries = data.Industries

type Props = {
  onSuccess: () => void
}

type FormData = {
  email: string
  full_name: string
  company: string
  job_title: string
  industry: string
  terms_and_conditions: boolean
}

export const RequestDemoForm = ({ onSuccess }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [isTermsShown, setIsTermsShown] = useState(false)
  const [termsLang, setTermsLang] = useState<'id' | 'en'>('id')

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

  const renderTnC = () => {
    switch (termsLang) {
      case 'id':
        return (
          <>
            <h2>Syarat dan Ketentuan</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Eu lobortis elementum nibh
              tellus molestie nunc non blandit. Lacus sed turpis tincidunt id
              aliquet risus feugiat in ante. Nulla malesuada pellentesque elit
              eget gravida cum sociis natoque. Orci a scelerisque purus semper
              eget duis at tellus. Nibh cras pulvinar mattis nunc sed. Varius
              vel pharetra vel turpis. Volutpat sed cras ornare arcu dui
              vivamus. Enim nec dui nunc mattis enim. Volutpat consequat mauris
              nunc congue nisi vitae suscipit. Sit amet mattis vulputate enim.
              In aliquam sem fringilla ut. Viverra adipiscing at in tellus. Leo
              a diam sollicitudin tempor id eu nisl nunc mi. Lectus mauris
              ultrices eros in cursus turpis. Convallis a cras semper auctor
              neque vitae. Sit amet facilisis magna etiam tempor orci eu
              lobortis. Accumsan lacus vel facilisis volutpat est velit egestas.
              Sit amet nulla facilisi morbi tempus iaculis urna id volutpat.
              Nunc consequat interdum varius sit amet mattis. Integer eget
              aliquet nibh praesent. Ut tellus elementum sagittis vitae et leo
              duis. Massa ultricies mi quis hendrerit dolor magna eget. Sed
              viverra tellus in hac. Elit pellentesque habitant morbi tristique
              senectus et netus et. In mollis nunc sed id semper risus in
              hendrerit. Proin fermentum leo vel orci porta non pulvinar neque
              laoreet. Quisque id diam vel quam. Elit ut aliquam purus sit amet
              luctus venenatis. Fringilla urna porttitor rhoncus dolor purus non
              enim. Fermentum dui faucibus in ornare quam viverra orci sagittis
              eu. Diam maecenas ultricies mi eget mauris pharetra et ultrices
              neque. Curabitur gravida arcu ac tortor. Nisi lacus sed viverra
              tellus in hac habitasse. Mi sit amet mauris commodo. Quis vel eros
              donec ac odio. Nulla at volutpat diam ut venenatis tellus in metus
              vulputate. Auctor urna nunc id cursus metus aliquam. Iaculis at
              erat pellentesque adipiscing commodo elit at. Nunc sed velit
              dignissim sodales ut eu sem integer vitae. Tellus mauris a diam
              maecenas sed enim ut. Turpis egestas maecenas pharetra convallis
              posuere morbi leo urna. Rhoncus urna neque viverra justo. Proin
              sagittis nisl rhoncus mattis. Sagittis purus sit amet volutpat
              consequat mauris nunc. Sit amet risus nullam eget felis eget nunc
              lobortis. Dolor sit amet consectetur adipiscing. A diam maecenas
              sed enim ut sem viverra aliquet. Varius quam quisque id diam vel.
              Habitant morbi tristique senectus et netus et malesuada fames ac.
              Elit eget gravida cum sociis natoque penatibus et magnis. Dolor
              sit amet consectetur adipiscing elit duis tristique sollicitudin.
              Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Neque
              laoreet suspendisse interdum consectetur libero. Amet consectetur
              adipiscing elit duis tristique sollicitudin nibh sit. Ac tortor
              dignissim convallis aenean. Tortor pretium viverra suspendisse
              potenti nullam ac tortor vitae purus. Sagittis id consectetur
              purus ut. Lorem sed risus ultricies tristique nulla aliquet enim.
              Gravida quis blandit turpis cursus in hac habitasse platea.
              Malesuada fames ac turpis egestas maecenas pharetra convallis
              posuere. Lacus vel facilisis volutpat est velit. Integer quis
              auctor elit sed vulputate mi sit. Vitae auctor eu augue ut lectus
              arcu. In nibh mauris cursus mattis molestie. At in tellus integer
              feugiat scelerisque varius morbi enim. Quam elementum pulvinar
              etiam non quam. Pretium viverra suspendisse potenti nullam ac
              tortor vitae purus faucibus. Et pharetra pharetra massa massa
              ultricies mi quis hendrerit. Quam adipiscing vitae proin sagittis
              nisl rhoncus.
            </p>
          </>
        )
      case 'en':
        return (
          <>
            <h2>Terms and Conditions</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Eu lobortis elementum nibh
              tellus molestie nunc non blandit. Lacus sed turpis tincidunt id
              aliquet risus feugiat in ante. Nulla malesuada pellentesque elit
              eget gravida cum sociis natoque. Orci a scelerisque purus semper
              eget duis at tellus. Nibh cras pulvinar mattis nunc sed. Varius
              vel pharetra vel turpis. Volutpat sed cras ornare arcu dui
              vivamus. Enim nec dui nunc mattis enim. Volutpat consequat mauris
              nunc congue nisi vitae suscipit. Sit amet mattis vulputate enim.
              In aliquam sem fringilla ut. Viverra adipiscing at in tellus. Leo
              a diam sollicitudin tempor id eu nisl nunc mi. Lectus mauris
              ultrices eros in cursus turpis. Convallis a cras semper auctor
              neque vitae. Sit amet facilisis magna etiam tempor orci eu
              lobortis. Accumsan lacus vel facilisis volutpat est velit egestas.
              Sit amet nulla facilisi morbi tempus iaculis urna id volutpat.
              Nunc consequat interdum varius sit amet mattis. Integer eget
              aliquet nibh praesent. Ut tellus elementum sagittis vitae et leo
              duis. Massa ultricies mi quis hendrerit dolor magna eget. Sed
              viverra tellus in hac. Elit pellentesque habitant morbi tristique
              senectus et netus et. In mollis nunc sed id semper risus in
              hendrerit. Proin fermentum leo vel orci porta non pulvinar neque
              laoreet. Quisque id diam vel quam. Elit ut aliquam purus sit amet
              luctus venenatis. Fringilla urna porttitor rhoncus dolor purus non
              enim. Fermentum dui faucibus in ornare quam viverra orci sagittis
              eu. Diam maecenas ultricies mi eget mauris pharetra et ultrices
              neque. Curabitur gravida arcu ac tortor. Nisi lacus sed viverra
              tellus in hac habitasse. Mi sit amet mauris commodo. Quis vel eros
              donec ac odio. Nulla at volutpat diam ut venenatis tellus in metus
              vulputate. Auctor urna nunc id cursus metus aliquam. Iaculis at
              erat pellentesque adipiscing commodo elit at. Nunc sed velit
              dignissim sodales ut eu sem integer vitae. Tellus mauris a diam
              maecenas sed enim ut. Turpis egestas maecenas pharetra convallis
              posuere morbi leo urna. Rhoncus urna neque viverra justo. Proin
              sagittis nisl rhoncus mattis. Sagittis purus sit amet volutpat
              consequat mauris nunc. Sit amet risus nullam eget felis eget nunc
              lobortis. Dolor sit amet consectetur adipiscing. A diam maecenas
              sed enim ut sem viverra aliquet. Varius quam quisque id diam vel.
              Habitant morbi tristique senectus et netus et malesuada fames ac.
              Elit eget gravida cum sociis natoque penatibus et magnis. Dolor
              sit amet consectetur adipiscing elit duis tristique sollicitudin.
              Lectus vestibulum mattis ullamcorper velit sed ullamcorper. Neque
              laoreet suspendisse interdum consectetur libero. Amet consectetur
              adipiscing elit duis tristique sollicitudin nibh sit. Ac tortor
              dignissim convallis aenean. Tortor pretium viverra suspendisse
              potenti nullam ac tortor vitae purus. Sagittis id consectetur
              purus ut. Lorem sed risus ultricies tristique nulla aliquet enim.
              Gravida quis blandit turpis cursus in hac habitasse platea.
              Malesuada fames ac turpis egestas maecenas pharetra convallis
              posuere. Lacus vel facilisis volutpat est velit. Integer quis
              auctor elit sed vulputate mi sit. Vitae auctor eu augue ut lectus
              arcu. In nibh mauris cursus mattis molestie. At in tellus integer
              feugiat scelerisque varius morbi enim. Quam elementum pulvinar
              etiam non quam. Pretium viverra suspendisse potenti nullam ac
              tortor vitae purus faucibus. Et pharetra pharetra massa massa
              ultricies mi quis hendrerit. Quam adipiscing vitae proin sagittis
              nisl rhoncus.
            </p>
          </>
        )
    }
  }

  return (
    <form
      className={styles.form}
      method="post"
      onSubmit={handleSubmit(onSubmit)}>
      <Modal show={isTermsShown} onClose={() => setIsTermsShown(false)}>
        <div className={styles.termsAndConditionsModal}>{renderTnC()}</div>
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
      <TextField
        id="company"
        label="Company"
        placeholder="Company name"
        type="text"
        register={register}
        registerOptions={{
          required: 'required',
          minLength: { value: 5, message: 'minimum length is 5' }
        }}
        errors={errors}
      />
      <div className={styles.divide}>
        <div className={styles.divideLeft}>
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
        <div className={styles.divideRight}>
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
      <div className={styles.terms}>
        <input
          {...register('terms_and_conditions', { required: 'required' })}
          name="terms_and_conditions"
          id="terms_and_conditions"
          type="checkbox"
        />
        <Label id="terms_and_conditions" errors={errors}>
          I have accepted the{' '}
          <a
            onClick={() => {
              setTermsLang('en')
              setIsTermsShown(true)
            }}>
            terms & conditions{' '}
          </a>
          / Saya setuju dengan{' '}
          <a
            onClick={() => {
              setTermsLang('id')
              setIsTermsShown(true)
            }}>
            syarat & kententuan{' '}
          </a>
          yang ada.
        </Label>
      </div>
      <div className={styles.errorMessage}>
        {errorMessage ? `*${errorMessage}` : null}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.submitButton}
          type="submit"
          color={Color.Primary}>
          Submit
        </Button>
      </div>
    </form>
  )
}
