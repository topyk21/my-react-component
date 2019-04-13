import axios from 'axios'
import { AnyAction } from 'redux'
import { createAction, handleActions, Action } from 'redux-actions'
import { ThunkAction } from 'redux-thunk'

/****************** Service function ******************/
export const getUrl = (itemType: ItemCode) => `https://jsonplaceholder.typicode.com/${itemType}`
/****************** Type ******************/
/** Fetch item type */
type FetchedItem = {
  id: string
  name: string
}
/** Selector item type */
export type FetchingStatus = {
  fetching: boolean
  fetched: boolean
  data: FetchedItem[]
  error?: string
}
/** Server fetch option */
export type ItemCode = FluxItemCode | LazyItemCode
export type FluxItemCode =
  | 'comments'
  | 'users'
  | 'comments1'
  | 'comments2'
  | 'comments3'
  | 'comments4'
  | 'comments5'
  | 'comments6'
  | 'comments7'
  | 'comments8'
  | 'comments9'
  | 'comments0'
  | 'commentsa'
  | 'commentsb'
  | 'commentsc'
  | 'commentsd'
  | 'commentse'
export type LazyItemCode = 'posts' | 'todos'
export const fluxItems: FluxItemCode[] = [
  'comments',
  'users',
  'comments1',
  'comments2',
  'comments3',
  'comments4',
  'comments5',
  'comments6',
  'comments7',
  'comments8',
  'comments9',
  'comments0',
  'commentsa',
  'commentsb',
  'commentsc',
  'commentsd',
  'commentse',
]
export const lazyItems: LazyItemCode[] = ['todos', 'posts']
/** Redux state type */
export type FluxSearchOptionReduxState = { [K in FluxItemCode]: FetchingStatus }
/****************** State ******************/
const initialState: FluxSearchOptionReduxState = {
  comments: { fetching: false, fetched: false, data: [] },
  users: { fetching: false, fetched: false, data: [] },
  comments0: { fetching: false, fetched: false, data: [] },
  comments1: { fetching: false, fetched: false, data: [] },
  comments2: { fetching: false, fetched: false, data: [] },
  comments3: { fetching: false, fetched: false, data: [] },
  comments4: { fetching: false, fetched: false, data: [] },
  comments5: { fetching: false, fetched: false, data: [] },
  comments6: { fetching: false, fetched: false, data: [] },
  comments7: { fetching: false, fetched: false, data: [] },
  comments8: { fetching: false, fetched: false, data: [] },
  comments9: { fetching: false, fetched: false, data: [] },
  commentsa: { fetching: false, fetched: false, data: [] },
  commentsb: { fetching: false, fetched: false, data: [] },
  commentsc: { fetching: false, fetched: false, data: [] },
  commentsd: { fetching: false, fetched: false, data: [] },
  commentse: { fetching: false, fetched: false, data: [] },
}
/****************** Action ******************/
/** Action types */
enum ActionTypes {
  START_FETCH = 'serach-option/START_FETCH',
  FETCH_SUCCESS = 'search-option/FETCH_SUCCESS',
  FETCH_FAIL = 'search-option/FETCH_FAIL',
  DO_FETCH_NEXT_TIME = 'search-option/DO_FETCH_NEXT_TIME',
}
/** Payload */
type StartFetchPayload = string
type FetchSuccessPayload = {
  itemType: FluxItemCode
  data: FetchedItem[]
}
type FetchFailPayload = {
  itemType: FluxItemCode
  error: string
}
type DoFetchNextTimePayload = string
/** Action creators */
export const actionCreators = {
  startFetch: createAction<StartFetchPayload>(ActionTypes.START_FETCH),
  fetchSuccess: createAction<FetchSuccessPayload>(ActionTypes.FETCH_SUCCESS),
  fetchFail: createAction<FetchFailPayload>(ActionTypes.FETCH_FAIL),
  doFetchNextTime: createAction<DoFetchNextTimePayload>(ActionTypes.DO_FETCH_NEXT_TIME),
}
/** Async action */
export const getSearchOptionItems = (
  itemType: FluxItemCode
): ThunkAction<void, FluxSearchOptionReduxState, undefined, AnyAction> => dispatch => {
  const apiUrl = getUrl(itemType)
  dispatch(actionCreators.startFetch(itemType))
  return axios
    .get(apiUrl)
    .then(response => dispatch(actionCreators.fetchSuccess({ itemType, data: response.data })))
    .catch(error => dispatch(actionCreators.fetchFail({ itemType, error })))
}
/****************** Redcucer ******************/
// tslint:disable-next-line:no-any
export default handleActions<FluxSearchOptionReduxState, any>(
  {
    [ActionTypes.START_FETCH]: (state, action: Action<StartFetchPayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          fetching: true,
        },
      }
    },
    [ActionTypes.FETCH_SUCCESS]: (state, action: Action<FetchSuccessPayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        [action.payload.itemType]: {
          fetched: true,
          fetching: false,
          data: action.payload.data,
          error: '',
        },
      }
    },
    [ActionTypes.FETCH_FAIL]: (state, action: Action<FetchFailPayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        [action.payload.itemType]: {
          ...state[action.payload.itemType],
          fetched: false,
          fetching: false,
          error: action.payload.error,
        },
      }
    },
    [ActionTypes.DO_FETCH_NEXT_TIME]: (state, action: Action<DoFetchNextTimePayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          fetched: false,
        },
      }
    },
  },
  initialState
)
