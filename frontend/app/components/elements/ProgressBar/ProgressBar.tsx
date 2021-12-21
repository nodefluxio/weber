type Props = {
  completed: number
}

export const ProgressBar = ({ completed }: Props) => {
  return (
    <div className="h-5 w-full rounded-full bg-gray-300">
      <div
        className={`h-full rounded-full text-right bg-primary-500 text-white`}
        style={{ width: completed + '%' }}>
        <span
          className="px-1 text-white font-bold"
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={100}>
          {`${completed}%`}
        </span>
      </div>
    </div>
  )
}
