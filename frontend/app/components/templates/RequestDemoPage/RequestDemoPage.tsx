import { FormEvent } from 'react'
import { RequestDemoForm } from '../../modules/RequestDemoForm/RequestDemoForm'
export const RequestDemoPage = () => {
  const formHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(e.currentTarget.email.value)
  }

  return (
    <div>
      <div>
        <h1>Lorem ipsum dolor</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae libero
          voluptates magni iure perferendis aut adipisci voluptatem mollitia
          voluptate, cupiditate eaque dicta obcaecati corrupti! Itaque atque
          deserunt delectus cum tempore?
        </p>
      </div>
      <div>
        <RequestDemoForm onSubmit={(data) => console.log(data)} />
      </div>
    </div>
  )
}
