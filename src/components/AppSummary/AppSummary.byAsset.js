import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import NoData from 'ui/NoData'
import DataTable from 'ui/DataTable'
import { formatDate } from 'state/utils'
import { fetchData, refresh } from 'state/summaryByAsset/actions'
import {
  getPageLoading,
  getDataReceived,
  getUseMinBalance,
  getMinimumBalance,
  getSummaryByAssetTotal,
  getSummaryByAssetEntries,
} from 'state/summaryByAsset/selectors'
import { getTimezone } from 'state/base/selectors'
import { getTimeRange, getTimeFrame } from 'state/timeRange/selectors'
import { getIsSyncRequired, getIsFirstSyncing } from 'state/sync/selectors'

import SummaryFilters from './AppSummary.filters'
import { getAssetColumns } from './AppSummary.columns'
import { prepareSummaryByAssetData } from './AppSummary.helpers'

const AppSummaryByAsset = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const timezone = useSelector(getTimezone)
  const timeRange = useSelector(getTimeRange)
  const pageLoading = useSelector(getPageLoading)
  const dataReceived = useSelector(getDataReceived)
  const total = useSelector(getSummaryByAssetTotal)
  const isFirstSync = useSelector(getIsFirstSyncing)
  const entries = useSelector(getSummaryByAssetEntries)
  const isSyncRequired = useSelector(getIsSyncRequired)
  const { start, end } = useSelector(getTimeFrame)
  const minimumBalance = useSelector(getMinimumBalance)
  const useMinimumBalance = useSelector(getUseMinBalance)
  const isLoading = isFirstSync || (!dataReceived && pageLoading)

  useEffect(() => {
    if (!dataReceived && !pageLoading && !isSyncRequired) {
      dispatch(fetchData())
    }
  }, [dataReceived, pageLoading, isSyncRequired])

  useEffect(() => {
    dispatch(refresh())
  }, [timeRange])

  const preparedData = useMemo(
    () => prepareSummaryByAssetData(entries, total, t, minimumBalance, useMinimumBalance),
    [entries, total, t, minimumBalance, useMinimumBalance],
  )

  const columns = useMemo(
    () => getAssetColumns({ preparedData, t, isLoading }),
    [preparedData, t, isLoading],
  )

  let showContent
  if (dataReceived && isEmpty(entries)) {
    showContent = <NoData title='summary.no_data' />
  } else {
    showContent = (
      <DataTable
        defaultRowHeight={73}
        tableColumns={columns}
        className='summary-by-asset-table'
        numRows={isLoading ? 3 : preparedData.length}
      />
    )
  }

  return (
    <div className='app-summary-item full-width-item'>
      <div className='app-summary-item-title--row'>
        <div>
          <div className='app-summary-item-title'>
            {t('summary.by_asset.title')}
          </div>
          <div className='app-summary-item-sub-title'>
            {t('summary.by_asset.sub_title')}
            {`${formatDate(start, timezone)} - ${formatDate(end, timezone)}`}
          </div>
        </div>
        <SummaryFilters />
      </div>
      {showContent}
    </div>
  )
}

export default AppSummaryByAsset
