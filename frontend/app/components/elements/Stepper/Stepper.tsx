import styles from './Stepper.module.scss'

type Props = {
  steps: string[]
  activeStep: number
  className?: string
}

export const Stepper = ({ steps, activeStep, className }: Props) => {
  return (
    <>
      <ol
        className={`hidden md:flex w-full mx-auto justify-center overflow-hidden font-serif ${className}`}>
        {steps.map((step: string, idx: number) => (
          // stepper item
          <li
            className={`flex flex-col text-center ${styles.stepperItem} ${
              idx + 1 === activeStep ? 'flex' : ''
            } ${idx + 1 === activeStep + 1 ? 'flex' : ''}`}
            key={idx}>
            {/* stepper bulletin */}
            <div
              className={`flex items-center justify-center mx-32 
              md:mx-[7vw] rounded-full w-7 h-7 ${
                idx + 1 === activeStep ? 'bg-primary-500' : 'bg-neutral-300'
              } font-bold text-neutral-100`}>
              {idx + 1}
            </div>
            <p
              className={`font-medium mt-2 ${
                idx + 1 === activeStep ? 'text-primary-500' : 'text-neutral-300'
              }`}>
              {step}
            </p>
          </li>
        ))}
      </ol>
      {/* Mobile View */}
      <div
        className={`flex flex-row items-center font-serif
                    justify-center md:hidden ${className}`}>
        <div
          className="flex items-center justify-center w-16 h-16 border-4
                        border-primary-500 rounded-full text-lg font-bold">
          {`${activeStep} of ${steps.length}`}
        </div>
        <div className="ml-8 text-right">
          <p className="text-xl font-semibold font-sans">
            {steps[activeStep - 1]}
          </p>
          {activeStep < steps.length && <p>{`Next: ${steps[activeStep]}`}</p>}
        </div>
      </div>
    </>
  )
}
