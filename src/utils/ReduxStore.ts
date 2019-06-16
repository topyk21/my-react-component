import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { persistStore } from 'redux-persist'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import createRootReducer from 'utils/ReduxReducer'

/** Create browser history for react-router */
export const routeHistory = createBrowserHistory()
/**
 * 아래 코드로 인해 Redux store가 생성되며,
 * react-router, redux-devttol, redux-saga 등의 middleware들을 적용해 준 상태입니다.
 */
const store = createStore(
  createRootReducer(routeHistory),
  // connectRouter(routeHistory)(createRootReducer) /* preload state */,
  composeWithDevTools(applyMiddleware(thunk, routerMiddleware(routeHistory)))
)
const persistor = persistStore(store)

export default () => {
  return { store, persistor }
}
