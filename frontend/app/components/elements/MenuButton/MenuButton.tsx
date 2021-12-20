type Props = {
  title: string
  disabled: boolean
  onClick: () => void
  className?: string
}

export const MenuButton = ({ title, disabled, onClick, className }: Props) => {
  return (
    <div
      className={`flex bg-primary-500 items-center
      rounded-lg justify-center p-4 text-stone-100
      h-32 w-64 transition-all
      ${
        disabled
          ? 'cursor-not-allowed bg-stone-300'
          : 'cursor-pointer hover:scale-105'
      } ${className}`}
      onClick={() => {
        if (!disabled) onClick()
      }}>
      <span>{title}</span>
    </div>
  )
}
