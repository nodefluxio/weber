import styles from "./Stepper.module.scss"

export const Stepper = () => {
  return (
    <ol className={styles.stepper}>
      <li className={styles.stepper__item}>
        <h3>Step 1</h3>
        <p>Upload your photo</p>
      </li>
      <li className={styles.stepper__item}>
        <h3>Step 2</h3>
        <p>Check your result</p>
      </li>
    </ol>
  )
}