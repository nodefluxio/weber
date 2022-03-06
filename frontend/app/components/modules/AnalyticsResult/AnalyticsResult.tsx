import Image from 'next/image'
import resultMap from './analytics_result.json'
import styles from './AnalyticsResult.module.css'

type Props = {
  result: any
  slug: string
  className?: string
}

export const AnalyticsResult = ({ result, slug, className }: Props) => {
  const createDisplayResultEl = (
    mappedResultResponse: any,
    fields: any,
    i: number,
    currentThumbnail?: string
  ) => (
    <div key={fields[i].key}>
      {fields[i].fields ? (
        fields[i].fields.map((_: any, j: number) =>
          createDisplayResultEl(
            mappedResultResponse[fields[i].key],
            fields[i].fields,
            j,
            currentThumbnail
          )
        )
      ) : fields[i].hasThumbnail && currentThumbnail ? (
        <div className={styles.field}>
          <div className="w-11 h-11 relative mr-4">
            <Image
              src={currentThumbnail}
              alt="result thumbnail"
              layout="fill"
            />
          </div>
          <div>
            <p className={styles.label}>{fields[i].label}</p>
            <p className={styles.result}>
              {`${mappedResultResponse[fields[i].key]}`}
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.field}>
          <div>
            <p className={styles.label}>{fields[i].label}</p>
            <p className={styles.result}>
              {`${mappedResultResponse[fields[i].key]}`}
            </p>
          </div>
        </div>
      )}
    </div>
  )

  const generateFieldList = (
    fields: any,
    fieldList: any[],
    mappedResultResponse: any,
    currentThumbnail?: string
  ) => {
    for (let i = 0; i < fields.length; i++) {
      fieldList.push(
        createDisplayResultEl(mappedResultResponse, fields, i, currentThumbnail)
      )
    }
  }

  const displayResult = () => {
    if (result) {
      let isPeopleDensity = false
      let isFaceMatchEnrollment = false
      // @ts-ignore
      if (resultMap[slug]) {
        // @ts-ignore
        const analyticSlugResultMap = resultMap[slug]
        let mappedResultResponse = result
        if ('result' in result) {
          if (result.result) {
            mappedResultResponse = result.result
          } else return
        }
        if (analyticSlugResultMap.starting_key) {
          for (let i = 0; i < analyticSlugResultMap.starting_key.length; i++) {
            if (analyticSlugResultMap.starting_key[i] === 'people_density') {
              isPeopleDensity = true
            }
            if (analyticSlugResultMap.starting_key[i] === 'face_match') {
              isFaceMatchEnrollment = true
            }
            mappedResultResponse =
              mappedResultResponse[analyticSlugResultMap.starting_key[i]]
          }
        }
        const fieldList: any[] = []
        if (isPeopleDensity) {
          fieldList.push(
            <div className={styles.field}>
              <div>
                <p className={styles.label}>Count</p>
                <p className={styles.result}>
                  {`${mappedResultResponse.length}`}
                </p>
              </div>
            </div>
          )
        }
        const fields = analyticSlugResultMap.fields
        if (analyticSlugResultMap.type === 'array') {
          for (let i = 0; i < mappedResultResponse.length; i++) {
            const currentMappedResultResponse = mappedResultResponse[i]
            const currentThumbnail = result.thumbnails[i]
            generateFieldList(
              fields,
              fieldList,
              currentMappedResultResponse,
              currentThumbnail
            )
          }
        } else {
          if (isFaceMatchEnrollment) {
            result.thumbnails =
              '/assets/images/analytics/face-match-enrollment/compared.jpg'
          }
          generateFieldList(
            fields,
            fieldList,
            mappedResultResponse,
            result.thumbnails
          )
        }

        return fieldList
      }
    }
  }
  return (
    <div
      className={`w-full max-h-96 overflow-y-auto grid grid-cols-2 ${styles.container} ${className}`}>
      {result &&
        displayResult()?.map((item, idx) => <div key={idx}>{item}</div>)}
    </div>
  )
}
