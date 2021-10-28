import styles from './Stepper.module.scss'

type Props = {
  steps: string[]
  activeStep: number
}

export const Stepper = ({ steps, activeStep }: Props) => {
  return (
    <ol className={styles.stepper}>
      {steps.map((step: string, idx: number) => (
        <li
          className={`${styles.stepperItem} ${
            idx + 1 === activeStep ? styles.current : ''
          } ${idx + 1 === activeStep + 1 ? styles.next : ''}`}
          key={idx}>
          <div
            className={`${styles.stepperBulletin} ${
              idx + 1 === activeStep ? styles.active : styles.inactive
            }`}
          />
          <p>{step}</p>
        </li>
      ))}
    </ol>
  )
}
