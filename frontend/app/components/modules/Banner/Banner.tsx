type Props = {
  analyticsName: string
  longDescription: string
  bannerUrl?: string
}

export const Banner = ({
  analyticsName,
  longDescription,
  bannerUrl
}: Props) => {
  return (
    <div
      className="bg-primary-500 py-8 bg-center flex flex-col 
      justify-center bg-no-repeat bg-cover sm:min-h-[360px] text-white"
      style={{
        backgroundImage: `url("${bannerUrl}")`
      }}>
      <div className="container w-4/5 sm:w-11/12 mx-auto mt-10 h-full">
        <div className="max-w-sm sm:max-w-lg">
          <h1 className="text-xl mb-2">{analyticsName}</h1>
          <p className="font-serif">{longDescription}</p>
        </div>
      </div>
    </div>
  )
}
