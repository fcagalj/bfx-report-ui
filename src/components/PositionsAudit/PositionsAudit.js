import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Card, Elevation } from '@blueprintjs/core'
import { isEmpty } from '@bitfinex/lib-js-util-base'

import NoData from 'ui/NoData'
import Loading from 'ui/Loading'
import DataTable from 'ui/DataTable'
import Pagination from 'ui/Pagination'
import { getPath } from 'state/query/utils'
import SectionHeader from 'ui/SectionHeader'
import SectionSwitch from 'ui/SectionSwitch'
import queryConstants from 'state/query/constants'
import { checkInit, checkFetch } from 'state/utils'
import getColumns from 'components/Positions/Positions.columns'

const TYPE = queryConstants.MENU_POSITIONS_AUDIT

class PositionsAudit extends PureComponent {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      amount: PropTypes.number,
      basePrice: PropTypes.number,
      liquidationPrice: PropTypes.number,
      marginFunding: PropTypes.number,
      marginFundingType: PropTypes.number,
      mtsUpdate: PropTypes.number.isRequired,
      pair: PropTypes.string.isRequired,
      pl: PropTypes.number,
      plPerc: PropTypes.number,
    })),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    getFullTime: PropTypes.func.isRequired,
    dataReceived: PropTypes.bool.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    refresh: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    timeOffset: PropTypes.string.isRequired,
  }

  static defaultProps = {
    entries: [],
  }

  componentDidMount() {
    checkInit(this.props, TYPE)
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, TYPE)
  }

  jumpToPositions = (e) => {
    e.preventDefault()
    const { history } = this.props
    history.push(`${getPath(queryConstants.MENU_POSITIONS)}${window.location.search}`)
  }

  render() {
    const {
      t,
      entries,
      refresh,
      timeOffset,
      getFullTime,
      pageLoading,
      dataReceived,
    } = this.props
    const tableColumns = getColumns({
      t,
      timeOffset,
      getFullTime,
      target: TYPE,
      filteredData: entries,
    })

    let showContent
    if (!dataReceived && pageLoading) {
      showContent = <Loading />
    } else if (isEmpty(entries)) {
      showContent = <NoData />
    } else {
      showContent = (
        <div className='data-table-wrapper'>
          <DataTable
            numRows={entries.length}
            tableColumns={tableColumns}
          />
          <Pagination
            target={TYPE}
            loading={pageLoading}
          />
        </div>
      )
    }

    return (
      <Card
        elevation={Elevation.ZERO}
        className='section-positions-audit col-lg-12 col-md-12 col-sm-12 col-xs-12'
      >
        <SectionHeader
          filter={false}
          target={TYPE}
          title='paudit.title'
        />
        <SectionSwitch
          target={TYPE}
          hasSubSections
          refresh={refresh}
        />
        {showContent}
      </Card>
    )
  }
}

export default PositionsAudit
