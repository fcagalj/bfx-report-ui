import React, { PureComponent, Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Elevation,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core'
import _sortBy from 'lodash/sortBy'
import _isEqual from 'lodash/isEqual'

import DateInput from 'ui/DateInput'
import MultiSymbolSelector from 'ui/MultiSymbolSelector'
import ExportButton from 'ui/ExportButton'
import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import Chart from 'ui/Charts/Chart'
import { parseLoanReportChartData } from 'ui/Charts/Charts.helpers'
import TimeFrameSelector from 'ui/TimeFrameSelector'
import RefreshButton from 'ui/RefreshButton'
import queryConstants from 'state/query/constants'
import { checkInit, toggleSymbol } from 'state/utils'
import { isValidTimeStamp } from 'state/query/utils'

import { propTypes, defaultProps } from './LoanReport.props'

const TYPE = queryConstants.MENU_LOAN_REPORT

class LoanReport extends PureComponent {
  componentDidMount() {
    checkInit(this.props, TYPE)
  }

  handleDateChange = (input, time) => {
    const { setParams } = this.props
    const timestamp = time && time.getTime()
    if (isValidTimeStamp(timestamp) || time === null) {
      setParams({ [input]: time ? timestamp : undefined })
    }
  }

  handleQuery = () => {
    const { fetchData } = this.props
    fetchData()
  }

  handleTimeframeChange = (timeframe) => {
    const { setParams } = this.props
    setParams({ timeframe })
  }

  hasChanges = () => {
    const { currentFetchParams, params } = this.props
    return !_isEqual(currentFetchParams, params)
  }

  render() {
    const {
      currentFetchParams: { timeframe: currTimeframe },
      entries,
      targetSymbols,
      params,
      dataReceived,
      pageLoading,
      refresh,
      t,
    } = this.props
    const { start, end, timeframe } = params
    const hasChanges = this.hasChanges()

    const { chartData, dataKeys } = parseLoanReportChartData({
      data: _sortBy(entries, ['mts']),
      timeframe: currTimeframe,
      t,
    })

    const renderTimeSelection = (
      <Fragment>
        <Tooltip
          content={(
            <span>
              {t('query.startDateTooltip')}
            </span>
          )}
          position={Position.TOP}
        >
          <DateInput
            onChange={date => this.handleDateChange('start', date)}
            defaultValue={start}
            daysOnly
          />
        </Tooltip>
        {' '}
        <Tooltip
          content={(
            <span>
              {t('query.endDateTooltip')}
            </span>
          )}
          position={Position.TOP}
        >
          <DateInput
            onChange={date => this.handleDateChange('end', date)}
            defaultValue={end}
            daysOnly
          />
        </Tooltip>
        {' '}
        <TimeFrameSelector
          value={timeframe}
          onChange={this.handleTimeframeChange}
        />
        {' '}
        <Button
          onClick={this.handleQuery}
          intent={hasChanges ? Intent.PRIMARY : null}
          disabled={!hasChanges}
        >
          {t('query.title')}
        </Button>
      </Fragment>
    )

    const renderSymbolSelector = (
      <Fragment>
        {' '}
        <MultiSymbolSelector
          currentFilters={targetSymbols}
          toggleSymbol={symbol => toggleSymbol(TYPE, this.props, symbol)}
        />
      </Fragment>
    )

    let showContent
    if (!dataReceived && pageLoading) {
      showContent = <Loading />
    } else if (!entries.length) {
      showContent = (
        <Fragment>
          <h4>
            {t('loanreport.title')}
            {' '}
            {renderSymbolSelector}
            {' '}
            {renderTimeSelection}
            {' '}
            <ExportButton />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t('loanreport.title')}
            {' '}
            {renderSymbolSelector}
            {' '}
            {renderTimeSelection}
            {' '}
            <ExportButton />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          <Chart
            data={chartData}
            dataKeys={dataKeys}
          />
        </Fragment>
      )
    }
    return (
      <Card elevation={Elevation.ZERO} className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
        {showContent}
      </Card>
    )
  }
}

LoanReport.propTypes = propTypes
LoanReport.defaultProps = defaultProps

export default withTranslation('translations')(LoanReport)
