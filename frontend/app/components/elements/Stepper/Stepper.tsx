import styles from './Stepper.module.scss'

type Props = {
  steps: string[]
  activeStep: number
  className?: string
}

export const Stepper = ({ steps, activeStep, className }: Props) => {
  return (
    <ol
      className={`flex w-full mx-auto justify-center overflow-hidden ${className}`}>
      {steps.map((step: string, idx: number) => (
        // stepper item
        <li
          className={`flex flex-col text-center ${styles.stepperItem} ${
            idx + 1 === activeStep ? 'flex' : ''
          } ${idx + 1 === activeStep + 1 ? 'flex' : ''}`}
          key={idx}>
          {/* stepper bulletin */}
          <div
            className={`mx-32 sm:mx-[7vw] rounded-full w-8 h-8 ${
              idx + 1 === activeStep ? 'bg-primary-500' : 'bg-primary-200'
            }`}
          />
          <p className="font-medium">{step}</p>
        </li>
      ))}
    </ol>
  )
}
