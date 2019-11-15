import {
  call,
  put,
  select,
  takeLatest,
} from 'redux-saga/effects'

import { makeFetchCall } from 'state/utils'
import {
  formatRawSymbols, getSymbolsURL, getSymbolsFromUrlParam, mapRequestSymbols, mapSymbol,
} from 'state/symbols/utils'
import { getQuery, getTimeFrame } from 'state/query/selectors'
import { getFilterQuery } from 'state/filters/selectors'
import { updateErrorStatus } from 'state/status/actions'
import queryTypes from 'state/query/constants'
import { getQueryLimit, getPageSize } from 'state/query/utils'
import { fetchNext } from 'state/sagas.helper'

import types from './constants'
import actions from './actions'
import { getTargetSymbols, getFundingLoanHistory } from './selectors'

const TYPE = queryTypes.MENU_FLOAN
const LIMIT = getQueryLimit(TYPE)
const PAGE_SIZE = getPageSize(TYPE)

function getReqFLoan({
  smallestMts,
  query,
  targetSymbols,
  filter,
}) {
  const params = getTimeFrame(query, smallestMts)
  params.limit = LIMIT
  params.filter = filter
  if (targetSymbols.length) {
    params.symbol = formatRawSymbols(mapRequestSymbols(targetSymbols))
  }
  return makeFetchCall('getFundingLoanHistory', params)
}

function* fetchFLoan({ payload: symbol }) {
  try {
    let targetSymbols = yield select(getTargetSymbols)
    const symbolsUrl = getSymbolsURL(targetSymbols)
    // set symbol from url
    if (symbol && symbol !== symbolsUrl) {
      targetSymbols = getSymbolsFromUrlParam(symbol).map(mapSymbol)
      yield put(actions.setTargetSymbols(targetSymbols))
    }
    const query = yield select(getQuery)
    const filter = yield select(getFilterQuery, TYPE)
    const { result: resulto, error: erroro } = yield call(getReqFLoan, {
      smallestMts: 0,
      query,
      targetSymbols,
      filter,
    })
    const { result = {}, error } = yield call(fetchNext, resulto, erroro, getReqFLoan, {
      smallestMts: 0,
      query,
      targetSymbols,
      filter,
    })
    yield put(actions.updateFLoan(result, LIMIT, PAGE_SIZE))

    if (error) {
      yield put(actions.fetchFail({
        id: 'status.fail',
        topic: 'floan.title',
        detail: JSON.stringify(error),
      }))
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'floan.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* fetchNextFLoan() {
  try {
    const {
      offset,
      entries,
      smallestMts,
      targetSymbols,
    } = yield select(getFundingLoanHistory)
    // data exist, no need to fetch again
    if (entries.length - LIMIT >= offset) {
      return
    }
    const query = yield select(getQuery)
    const filter = yield select(getFilterQuery, TYPE)
    const { result: resulto, error: erroro } = yield call(getReqFLoan, {
      smallestMts,
      query,
      targetSymbols,
      filter,
    })
    const { result = {}, error } = yield call(fetchNext, resulto, erroro, getReqFLoan, {
      smallestMts,
      query,
      targetSymbols,
      filter,
    })
    yield put(actions.updateFLoan(result, LIMIT, PAGE_SIZE))

    if (error) {
      yield put(actions.fetchFail({
        id: 'status.fail',
        topic: 'floan.title',
        detail: JSON.stringify(error),
      }))
    }
  } catch (fail) {
    yield put(actions.fetchFail({
      id: 'status.request.error',
      topic: 'floan.title',
      detail: JSON.stringify(fail),
    }))
  }
}

function* fetchFLoanFail({ payload }) {
  yield put(updateErrorStatus(payload))
}

export default function* ordersSaga() {
  yield takeLatest(types.FETCH_FLOAN, fetchFLoan)
  yield takeLatest(types.FETCH_NEXT_FLOAN, fetchNextFLoan)
  yield takeLatest(types.FETCH_FAIL, fetchFLoanFail)
}
