import { RequestDemoForm } from '../../modules/RequestDemoForm/RequestDemoForm'
import { useRouter } from 'next/router'
export const RequestDemoPage = () => {
  const router = useRouter()

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
        <RequestDemoForm onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}
