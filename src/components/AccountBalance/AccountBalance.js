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
import { DateInput, TimePrecision } from '@blueprintjs/datetime'
import _sortBy from 'lodash/sortBy'

import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import LineChart from 'ui/Charts/LineChart'
import parseChartData from 'ui/Charts/Charts.helpers'
import { CURRENCIES } from 'ui/Charts/constants'
import TimeframeSelector from 'ui/TimeframeSelector/TimeframeSelector'
import RefreshButton from 'ui/RefreshButton'
import { isValidTimeStamp } from 'state/query/utils'
import {
  momentFormatter, DEFAULT_DATETIME_FORMAT,
} from 'state/utils'
import { platform } from 'var/config'

import { propTypes, defaultProps } from './AccountBalance.props'

class AccountBalance extends PureComponent {
  constructor(props) {
    super(props)

    const { params: { start, end, timeframe } } = props
    this.state = {
      start: start && new Date(start),
      end: end && new Date(end),
      timeframe,
    }
  }

  componentDidMount() {
    const { loading, fetchBalance, params } = this.props
    if (loading) {
      fetchBalance(params)
    }
  }

  handleDateChange = (input, time) => {
    const timestamp = time && time.getTime()
    if (isValidTimeStamp(timestamp) || time === null) {
      this.setState({ [input]: time || null })
    }
  }

  handleQuery = () => {
    const { fetchBalance } = this.props
    const { start, end, timeframe } = this.state
    const params = {
      start: start ? start.getTime() : undefined,
      end: end ? end.getTime() : undefined,
      timeframe,
    }
    fetchBalance(params)
  }

  handleTimeframeChange = (timeframe) => {
    this.setState({ timeframe })
  }

  hasNewTime = () => {
    const { params } = this.props
    const { start: currStart, end: currEnd, timeframe: currTimeframe } = params
    const { start, end, timeframe } = this.state
    const isDiffStart = start ? start.getTime() !== currStart : !!start !== !!currStart
    const isDiffEnd = end ? end.getTime() !== currEnd : !!end !== !!currEnd
    const isDiffTimeframe = timeframe !== currTimeframe
    return isDiffStart || isDiffEnd || isDiffTimeframe
  }

  render() {
    const {
      entries,
      params: { timeframe: currTimeframe },
      loading,
      refresh,
      t,
      timezone,
    } = this.props
    const { start, end, timeframe } = this.state
    const hasNewTime = this.hasNewTime()
    const timePrecision = platform.showSyncMode ? TimePrecision.SECOND : undefined
    const { formatDate, parseDate } = momentFormatter(DEFAULT_DATETIME_FORMAT, timezone)

    const chartData = parseChartData({
      data: _sortBy(entries, ['mts']),
      timeframe: currTimeframe,
    })

    const renderTimeSelection = (
      <Fragment>
        <Tooltip
          content={(
            <span>
              {t('accountbalance.query.startDateTooltip')}
            </span>
          )}
          position={Position.TOP}
        >
          <DateInput
            formatDate={formatDate}
            parseDate={parseDate}
            onChange={date => this.handleDateChange('start', date)}
            value={start}
            timePrecision={timePrecision}
          />
        </Tooltip>
        &nbsp;
        <Tooltip
          content={(
            <span>
              {t('accountbalance.query.endDateTooltip')}
            </span>
          )}
          position={Position.TOP}
        >
          <DateInput
            formatDate={formatDate}
            parseDate={parseDate}
            onChange={date => this.handleDateChange('end', date)}
            value={end}
            timePrecision={timePrecision}
          />
        </Tooltip>
        &nbsp;
        <TimeframeSelector
          currentTimeframe={timeframe}
          onTimeframeSelect={this.handleTimeframeChange}
        />
        &nbsp;
        <Button
          onClick={this.handleQuery}
          intent={hasNewTime ? Intent.PRIMARY : null}
          disabled={!hasNewTime}
        >
          {t('accountbalance.query.title')}
        </Button>
      </Fragment>
    )

    let showContent
    if (loading) {
      showContent = (
        <Loading title='accountbalance.title' />
      )
    } else if (!entries.length) {
      showContent = (
        <Fragment>
          <h4>
            {t('accountbalance.title')}
            &nbsp;
            {renderTimeSelection}
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t('accountbalance.title')}
            &nbsp;
            {renderTimeSelection}
            &nbsp;
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          <LineChart
            data={chartData}
            dataKeys={CURRENCIES}
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

AccountBalance.propTypes = propTypes
AccountBalance.defaultProps = defaultProps

export default withTranslation('translations')(AccountBalance)
