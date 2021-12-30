type Props = {
  onClick: () => void
}

export const HamburgerMenu = ({ onClick }: Props) => {
  return (
    <button
      className="h-6 w-8 relative lg:border-hidden lg:hidden 
    lg:bg-transparent lg:outline-none cursor-pointer 
    after:block after:absolute after:h-[150%] after:w-[150%] 
    after:-top-1/4 after:-left-1/4 border-y-2"
      onClick={onClick}>
      <div
        className="top-1/2 -mt-0.5 after:before:h-0.5 
      after:before:pointer-events-none border-t-2 
      after:before:block after:before:w-full after:before:bg-white 
      after:before:text-white after:before:absolute before:top-px after:-top-2"></div>
    </button>
  )
}
