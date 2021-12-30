import { Fragment, useEffect, useState } from 'react'
import { parseCookies } from 'nookies'
import { CustomError } from 'app/errors/CustomError'
import { Modal } from '@/elements/Modal/Modal'
import { RequestDemoFormPopup } from '../../modules/RequestDemoFormPopup/RequestDemoFormModal'
import { Banner } from '@/modules/Banner/Banner'
import { Stepper } from '@/elements/Stepper/Stepper'
import { HorizontalCard } from '@/modules/HorizontalCard/HorizontalCard'
import { CarDamage, Color } from '@/types/elements'
import { HCardContent } from '@/modules/HCardContent/HCardContent'
import { ResponsiveImage } from '@/modules/ResponsiveImage/ResponsiveImage'
import { Button } from '@/elements/Button/Button'
import { postCarDamage } from '@/api/innovationsAPI'
import { Spinner } from '@/elements/Spinner/Spinner'
import { CarDamageResponse, InnovationResponse } from '@/types/responses'
import Feedback from '@/modules/Feedback/Feedback'
import { getKeyValue } from '@/utils/utils'

type Props = {
  id: number
  name: string
  long_description: string
}

const CAR_DAMAGE_SAMPLES: CarDamage<string[]> = {
  front: [
    '/assets/images/innovations/car-damage/front_good.jpg',
    '/assets/images/innovations/car-damage/front_minor.jpg',
    '/assets/images/innovations/car-damage/front_moderate.jpg',
    '/assets/images/innovations/car-damage/front_severe.jpg'
  ],
  left: [
    '/assets/images/innovations/car-damage/side_good.jpg',
    '/assets/images/innovations/car-damage/side_minor.jpg',
    '/assets/images/innovations/car-damage/side_moderate.jpg',
    '/assets/images/innovations/car-damage/side_severe.jpg'
  ],
  right: [
    '/assets/images/innovations/car-damage/side_good.jpg',
    '/assets/images/innovations/car-damage/side_minor.jpg',
    '/assets/images/innovations/car-damage/side_moderate.jpg',
    '/assets/images/innovations/car-damage/side_severe.jpg'
  ],
  rear: [
    '/assets/images/innovations/car-damage/rear_good.jpg',
    '/assets/images/innovations/car-damage/rear_minor.jpg',
    '/assets/images/innovations/car-damage/rear_moderate.jpg',
    '/assets/images/innovations/car-damage/rear_severe.jpg'
  ]
}

export const CarDamagePage = ({ id, name, long_description }: Props) => {
  const { session_id } = parseCookies()

  const [currentStep, setCurrentStep] = useState(1)
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<InnovationResponse<CarDamageResponse>>()
  const [selectedImage, setSelectedImage] = useState<CarDamage<string>>({
    front: '',
    left: '',
    right: '',
    rear: ''
  })
  const [validationError, setValidationError] = useState<CarDamage<string>>({
    front: '',
    left: '',
    right: '',
    rear: ''
  })

  useEffect(() => {
    let errors: CarDamage<string> = validationError

    Object.entries(selectedImage).forEach((side) => {
      if (side[1] !== '') {
        errors = {
          ...errors,
          [side[0]]: ''
        }
      }
    })

    setValidationError(errors)
  }, [selectedImage])

  const validateSelectedImage = (selectedImage: CarDamage<string>) => {
    let isValid = true
    let errors: CarDamage<string> = validationError

    Object.entries(selectedImage).forEach((side) => {
      if (side[1] === '') {
        errors = {
          ...errors,
          [side[0]]: 'Please choose image for this side'
        }
        isValid = false
      }
    })

    setValidationError(errors)
    return isValid
  }

  const handleCarDamage = async (sessionId: string) => {
    if (sessionId) {
      setCurrentStep(2)
      await resolveCarDamage(sessionId)
      setLoading(false)
    } else {
      setOpenModal(true)
    }
  }

  const resolveCarDamage = async (sessionId: string) => {
    try {
      let selectedImageBase64: CarDamage<string> = {
        front: '',
        left: '',
        right: '',
        rear: ''
      }

      await Promise.all(
        Object.entries(selectedImage).map(async (side) => {
          const blob = await (await fetch(side[1])).blob()

          const base64 = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.readAsDataURL(blob)
          })

          selectedImageBase64 = {
            ...selectedImageBase64,
            ...{ [side[0]]: base64 }
          }
        })
      )

      const res = await postCarDamage(
        id,
        sessionId,
        selectedImageBase64.front,
        selectedImageBase64.left,
        selectedImageBase64.right,
        selectedImageBase64.rear
      )

      setResult(res)
    } catch (e) {
      if (e instanceof CustomError && e.statusCode === 401) {
        setCurrentStep(1)
        setOpenModal(true)
      } else {
        console.error(e)
      }
    }
  }

  return (
    <>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <RequestDemoFormPopup />
      </Modal>

      <Banner
        bannerUrl="/assets/images/innovations/car-damage/banner.jpg"
        analyticsName={name}
        longDescription={long_description}
      />

      <Stepper
        className="mt-8 mb-4"
        steps={['Enter Your Image', 'Result']}
        activeStep={currentStep}
      />

      <div className="container mx-auto w-4/5 min-h-[60vh] md:w-3/5 md:min-h-[70vh] lg:w-2/5 lg:min-h[80vh]  flex flex-col justify-center items-center text-left py-8">
        {currentStep === 1 && (
          <>
            <p className="text-lg">Select image for each part:</p>
            {Object.entries(CAR_DAMAGE_SAMPLES).map((sample, i) => (
              <Fragment key={i}>
                <HorizontalCard
                  title={sample[0][0].toUpperCase() + sample[0].substring(1)}
                  className={
                    getKeyValue(sample[0])(validationError) &&
                    'border-4 border-solid border-error'
                  }>
                  {sample[1].map((imgSrc, j) => (
                    <ResponsiveImage
                      key={j}
                      onClick={() => {
                        setSelectedImage({
                          ...selectedImage,
                          ...{ [sample[0]]: imgSrc }
                        })
                      }}
                      src={imgSrc}
                      alt={`${sample[0]} car damage sample no. ${j + 1}`}
                      className={`w-[64px] md:w-[96px] lg:w-[128px] h-[64px] md:h-[96px] lg:h-[128px] relative cursor-pointer ${
                        imgSrc === getKeyValue(sample[0])(selectedImage)
                          ? 'border-4 border-solid border-primary-500'
                          : ''
                      }`}
                      objectFit="cover"
                    />
                  ))}
                </HorizontalCard>
                {getKeyValue(sample[0])(validationError) && (
                  <span className="mt-4 text-error">
                    {getKeyValue(sample[0])(validationError)}
                  </span>
                )}
              </Fragment>
            ))}
            <Button
              color={Color.Primary}
              className="mt-12"
              onClick={() =>
                validateSelectedImage(selectedImage) &&
                handleCarDamage(session_id)
              }>
              Next Step
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            {!loading ? (
              <>
                {result ? (
                  <>
                    <div className="mb-8">
                      {Object.entries(selectedImage).map(
                        (selectedImageSide, i) => (
                          <HorizontalCard key={i} className="mb-4">
                            <HCardContent
                              imgSrc={selectedImageSide[1]}
                              imgAlt={`${selectedImageSide[0]} side image`}
                              title={`${
                                selectedImageSide[0][0].toUpperCase() +
                                selectedImageSide[0].substring(1)
                              } Side`}>
                              <>
                                <p>{`Status: ${result.service_data.job.result.result[0].car_damage_assessment[i].damage}`}</p>
                                <p>{`Severity: ${result.service_data.job.result.result[0].car_damage_assessment[i].severity}`}</p>
                                <p>{`Score: ${result.service_data.job.result.result[0].car_damage_assessment[i].score}`}</p>
                              </>
                            </HCardContent>
                          </HorizontalCard>
                        )
                      )}
                      <p className="text-lg">{`Total Score: ${result.service_data.job.result.result[0].total_score}`}</p>
                      <p className="text-lg">{`Recomendation: ${result.service_data.job.result.result[0].recommendation}`}</p>
                    </div>
                  </>
                ) : (
                  <h2 className="text-error">Oops, Something Went Wrong</h2>
                )}
                <Feedback id={id} onTryAgain={() => setCurrentStep(1)} />
              </>
            ) : (
              <Spinner />
            )}
          </>
        )}
      </div>
    </>
  )
}
