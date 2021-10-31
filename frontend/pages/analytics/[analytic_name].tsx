import { AnalyticsPage } from '../../app/components/templates/AnalyticsPage/AnalyticsPage'
import { useState } from 'react'
import { getServiceBySlug } from '../../app/api/analyticsAPI'
import { ServiceBySlugResponseData } from '../../app/types/responses'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import resultMap from './analytics_result.json'
import React from 'react'
import styles from './[analytic_name].module.scss'

const Analytics = ({
  name,
  short_description,
  long_description,
  id,
  slug
}: ServiceBySlugResponseData) => {
  const [result, setResult] = useState<any>()

  const createDisplayResultEl = (
    mappedResultResponse: any,
    fields: any,
    i: number
  ) => (
    <div className={styles.field}>
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
        return fieldListColumns.map((column) => (
          <div className={styles.col}>{column}</div>
        ))
      }
    }
  }

  return (
    <AnalyticsPage
      analyticsName={name}
      shortDescription={short_description}
      longDescription={long_description}
      examples={[
        `/assets/images/analytics/${slug}/example1.jpg`,
        `/assets/images/analytics/${slug}/example2.jpg`,
        `/assets/images/analytics/${slug}/example3.jpg`
      ]}
      serviceID={id}
      handleResult={(res) => setResult(res)}>
      <div className={styles.resultsContainer}>{result && displayResult()}</div>
    </AnalyticsPage>
  )
}

export default Analytics

interface Params extends ParsedUrlQuery {
  analytic_name: string
}

export const getServerSideProps: GetServerSideProps<any, Params> = async ({
  params
}) => {
  try {
    const res = await getServiceBySlug(params!.analytic_name)
    return {
      props: {
        ...res?.data
      }
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}
