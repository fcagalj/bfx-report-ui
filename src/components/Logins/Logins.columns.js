import React from 'react'
import {
  Cell,
  TruncatedFormat,
} from '@blueprintjs/table'

import JSONFormat from 'ui/JSONFormat'
import { getColumnWidth } from 'utils/columns'

export default function getColumns(props) {
  const {
    columnsWidth,
    filteredData,
    getFullTime,
    t,
    timeOffset,
  } = props

  return [
    {
      id: 'id',
      name: 'column.id',
      width: getColumnWidth('id', columnsWidth),
      renderer: (rowIndex) => {
        const { id } = filteredData[rowIndex]
        return (
          <Cell tooltip={id}>
            {id}
          </Cell>
        )
      },
      copyText: rowIndex => filteredData[rowIndex].id,
    },
    {
      id: 'time',
      nameStr: `${t('column.date')} (${timeOffset})`,
      width: getColumnWidth('time', columnsWidth),
      renderer: (rowIndex) => {
        const timestamp = getFullTime(filteredData[rowIndex].time)
        return (
          <Cell tooltip={timestamp}>
            <TruncatedFormat>
              {timestamp}
            </TruncatedFormat>
          </Cell>
        )
      },
      copyText: rowIndex => getFullTime(filteredData[rowIndex].time),
    },
    {
      id: 'ip',
      name: 'column.ip',
      width: getColumnWidth('ip', columnsWidth),
      renderer: (rowIndex) => {
        const { ip } = filteredData[rowIndex]
        return (
          <Cell tooltip={ip}>
            {ip}
          </Cell>
        )
      },
      copyText: rowIndex => filteredData[rowIndex].ip,
    },
    {
      id: 'browser',
      name: 'column.browser',
      width: getColumnWidth('browser', columnsWidth),
      renderer: (rowIndex) => {
        const { browser } = filteredData[rowIndex]
        return (
          <Cell tooltip={browser}>
            {browser}
          </Cell>
        )
      },
      copyText: rowIndex => filteredData[rowIndex].browser,
    },
    {
      id: 'version',
      name: 'column.version',
      width: getColumnWidth('version', columnsWidth),
      renderer: (rowIndex) => {
        const { version } = filteredData[rowIndex]
        return (
          <Cell tooltip={version}>
            {version}
          </Cell>
        )
      },
      copyText: rowIndex => filteredData[rowIndex].version,
    },
    {
      id: 'mobile',
      name: 'column.mobile',
      width: getColumnWidth('mobile', columnsWidth),
      renderer: (rowIndex) => {
        const { mobile } = filteredData[rowIndex]
        return (
          <Cell tooltip={mobile}>
            {mobile}
          </Cell>
        )
      },
      copyText: rowIndex => filteredData[rowIndex].mobile,
    },
    {
      id: 'extra',
      name: 'column.meta',
      width: getColumnWidth('extra', columnsWidth),
      renderer: (rowIndex) => {
        const { extra } = filteredData[rowIndex]
        const formattedExtra = JSON.stringify(extra, undefined, 2)

        return (
          <Cell>
            <JSONFormat content={formattedExtra}>
              {formattedExtra}
            </JSONFormat>
          </Cell>
        )
      },
      copyText: rowIndex => JSON.stringify(filteredData[rowIndex].extra, undefined, 2),
    },
  ]
}
