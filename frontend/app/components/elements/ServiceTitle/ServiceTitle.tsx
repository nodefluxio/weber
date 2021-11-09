type Props = {
  type: 'Analytic' | 'Solution' | 'Innovation'
  name: string
}

export const ServiceTitle = ({ type, name }: Props) => {
  return (
    <title>{`${type} | ${name} - Demo`}</title>
  )
}
