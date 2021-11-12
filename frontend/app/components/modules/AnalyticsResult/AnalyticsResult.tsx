import Image from 'next/image'
import styles from './AnalyticsResult.module.scss'
import resultMap from './analytics_result.json'
type Props = {
  result: any
  slug: string
}

export const AnalyticsResult = ({ result, slug }: Props) => {
  const createDisplayResultEl = (
    mappedResultResponse: any,
    fields: any,
    i: number,
    currentThumbnail?: string
  ) => (
    <div key={fields[i].key}>
      {fields[i].hasThumbnail && currentThumbnail ? (
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
    i: number,
    j: number,
    fields: any,
    fieldList: any[],
    mappedResultResponse: any,
    currentThumbnail?: string
  ) => {
    for (i; i < fields.length; i++) {
      if (fields[i].new_column) {
        j++
        i++
      }
      if (!fieldList[j]) fieldList[j] = []
      fieldList[j].push(
        createDisplayResultEl(mappedResultResponse, fields, i, currentThumbnail)
      )
    }
  }

  const displayResult = () => {
    if (result) {
      // @ts-ignore
      if (resultMap[slug]) {
        // @ts-ignore
        let analyticSlugResultMap = resultMap[slug]
        let mappedResultResponse = result.result
        if (analyticSlugResultMap.starting_key) {
          mappedResultResponse =
            mappedResultResponse[analyticSlugResultMap.starting_key]
        }
        let i = 0
        let j = 0
        let fieldListColumns: any[] = []
        let fields = analyticSlugResultMap.fields
        if (analyticSlugResultMap.type === 'array') {
          for (let k = 0; k < mappedResultResponse.length; k++) {
            if (k > 5) break
            let currentMappedResultResponse = mappedResultResponse[k]
            let currentThumbnail = result.thumbnails[k]
            generateFieldList(
              i,
              j,
              fields,
              fieldListColumns,
              currentMappedResultResponse,
              currentThumbnail
            )
          }
        } else {
          generateFieldList(
            i,
            j,
            fields,
            fieldListColumns,
            mappedResultResponse
          )
        }

        return fieldListColumns.map((column, i) => (
          <div key={i} className={styles.col}>
            {column}
          </div>
        ))
      }
    }
  }
  return (
    <div className={styles.resultsContainer}>{result && displayResult()}</div>
  )
}
