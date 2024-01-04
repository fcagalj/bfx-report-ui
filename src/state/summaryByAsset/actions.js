import types from './constants'

export function fetchData() {
  return {
    type: types.FETCH,
  }
}

export function fetchFail(payload) {
  return {
    type: types.FETCH_FAIL,
    payload,
  }
}

export function refresh() {
  return {
    type: types.REFRESH,
  }
}

export function updateData(payload) {
  return {
    type: types.UPDATE,
    payload,
  }
}

export function setMinimumBalance(payload) {
  return {
    type: types.SET_MIN_BALANCE,
    payload,
  }
}

export function useMinimumBalance(payload) {
  return {
    type: types.USE_MIN_BALANCE,
    payload,
  }
}

export default {
  fetchFail,
  fetchData,
  refresh,
  updateData,
  setMinimumBalance,
  useMinimumBalance,
}
