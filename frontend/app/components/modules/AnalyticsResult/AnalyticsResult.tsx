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
    i: number
  ) => (
    <div key={fields[i].key} className={styles.field}>
      <p className={styles.label}>{fields[i].label}</p>
      {fields[i].fields ? (
        fields[i].fields.map((_: any, j: number) =>
          createDisplayResultEl(
            mappedResultResponse[fields[i].key],
            fields[i].fields,
            j
          )
        )
      ) : (
        <p className={styles.result}>{`${
          mappedResultResponse[fields[i].key]
        }`}</p>
      )}
    </div>
  )

  const generateFieldList = (
    i: number,
    j: number,
    fields: any,
    fieldList: any[],
    mappedResultResponse: any
  ) => {
    for (i; i < fields.length; i++) {
      if (fields[i].new_column) {
        j++
        i++
      }
      if (!fieldList[j]) fieldList[j] = []

      fieldList[j].push(createDisplayResultEl(mappedResultResponse, fields, i))
    }
  }

  const displayResult = () => {
    if (result) {
      // @ts-ignore
      if (resultMap[slug]) {
        // @ts-ignore
        let analyticSlugResultMap = resultMap[slug]
        let mappedResultResponse = result
        if (analyticSlugResultMap.starting_key)
          mappedResultResponse = result[analyticSlugResultMap.starting_key]
        let i = 0
        let j = 0
        let fieldListColumns: any[] = []
        let fields = analyticSlugResultMap.fields
        if (analyticSlugResultMap.type === 'array') {
          mappedResultResponse = mappedResultResponse[0]
        }
        generateFieldList(i, j, fields, fieldListColumns, mappedResultResponse)
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
