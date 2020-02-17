import React, { Fragment, PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import {
  Button,
  Card,
  Elevation,
  Intent,
  Position,
  Tooltip,
} from '@blueprintjs/core'
import _isEqual from 'lodash/isEqual'

import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import DateInput from 'ui/DateInput'
import TradesSwitch from 'components/Trades/TradesSwitch'
import PairSelector from 'ui/PairSelector'
import Timeframe from 'ui/CandlesTimeframe'
import ExportButton from 'ui/ExportButton'
import RefreshButton from 'ui/RefreshButton'
import Candlestick from 'ui/Charts/Candlestick'
import queryConstants from 'state/query/constants'
import { isValidTimeStamp } from 'state/query/utils'
import { checkInit, checkFetch } from 'state/utils'

import { propTypes, defaultProps } from './Candles.props'

const TYPE = queryConstants.MENU_CANDLES

class Candles extends PureComponent {
  componentDidMount() {
    checkInit(this.props, TYPE)
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, TYPE)
  }

  hasChanges = () => {
    const { currentFetchParams, params } = this.props
    return !_isEqual(currentFetchParams, params)
  }

  handleDateChange = (input, time) => {
    const { setParams } = this.props
    const timestamp = time && time.getTime()
    if (isValidTimeStamp(timestamp) || time === null) {
      setParams({ [input]: time ? timestamp : undefined })
    }
  }

  handleQuery = () => {
    const { refresh, fetchData } = this.props
    refresh()
    fetchData()
  }

  onPairSelect = (pair) => {
    const { setParams } = this.props
    setParams({ pair })
  }

  onTimeframeChange = (timeframe) => {
    const { setParams } = this.props
    setParams({ timeframe })
  }

  render() {
    const {
      candles,
      dataReceived,
      fetchData,
      pageLoading,
      pairs,
      params,
      refresh,
      t,
      trades,
    } = this.props
    const {
      start, end, pair, timeframe,
    } = params
    const hasChanges = this.hasChanges()

    const renderOptionsSelection = (
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
            value={start && new Date(start)}
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
            value={end && new Date(end)}
          />
        </Tooltip>
        {' '}
        <PairSelector
          currentPair={pair}
          onPairSelect={this.onPairSelect}
          pairs={pairs}
        />
        {' '}
        <Timeframe value={timeframe} onChange={this.onTimeframeChange} />
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

    let showContent
    if (!dataReceived && pageLoading) {
      showContent = (
        <Loading title='candles.title' />
      )
    } else if (!candles.entries.length) {
      showContent = (
        <Fragment>
          <h4>
            {t('candles.title')}
            {' '}
            {renderOptionsSelection}
            {' '}
            <ExportButton />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
            <br />
            <br />
            <TradesSwitch target={TYPE} />
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {t('candles.title')}
            {' '}
            {renderOptionsSelection}
            {' '}
            <ExportButton />
            {' '}
            <RefreshButton handleClickRefresh={refresh} />
            <br />
            <br />
            <TradesSwitch target={TYPE} />
          </h4>
          <Candlestick
            candles={candles}
            trades={trades}
            fetchData={fetchData}
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

Candles.propTypes = propTypes
Candles.defaultProps = defaultProps

export default withTranslation('translations')(Candles)
