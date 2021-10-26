import { MouseEventHandler, useState } from 'react'
import { Color } from '../../../types/elements'
import { Button } from '../../elements/Button/Button'
import { Cam } from '../../modules/Cam/Cam'
import styles from './FaceLiveness.module.scss'

type Props = {
  nextStep: MouseEventHandler<HTMLButtonElement>
}

export const FaceLiveness = ({nextStep}: Props) => {
  const [isResult, setIsResult] = useState(false)

  return (
    <>
        {isResult === false && (
          <Cam
            localkey="liveness_snapshot"
            nextStep={() => setIsResult(true)}
          />
        )}

        {isResult === true && (
          <div>
            <span>Liveness Result</span>
            <span>75%</span>
            <Button color={Color.Primary} onClick={nextStep}>Next</Button>
            <Button color={Color.Primary} onClick={() => setIsResult(false)}>Try Again</Button>
          </div>
        )}
    </>
  )
}
