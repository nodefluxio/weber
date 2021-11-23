import Image from 'next/image'
import styles from './AnalyticsResult.module.scss'
import resultMap from './analytics_result.json'
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
          <div className={styles.boundingBoxContainer}>
            <Image src={currentThumbnail} layout="fill" />
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
            mappedResultResponse =
              mappedResultResponse[analyticSlugResultMap.starting_key[i]]
          }
        }
        const fieldList: [] = []
        const fields = analyticSlugResultMap.fields
        if (analyticSlugResultMap.type === 'array') {
          for (let i = 0; i < mappedResultResponse.length; i++) {
            if (i >= analyticSlugResultMap.max_result || i >= 20) break
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
    <div className={`${styles.resultsContainer} ${className}`}>
      {result &&
        displayResult()?.map((item, idx) => <div key={idx}>{item}</div>)}
    </div>
  )
}
