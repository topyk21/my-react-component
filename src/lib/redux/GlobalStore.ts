import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

import createRootReducer, { persistConfig } from 'src/lib/redux/GlobalReducer'

/** Redux의 async ajax 지원을 위한 open source로 redux-saga 채택  */
const saga = createSagaMiddleware()
/** Create browser history for react-router */
export const routeHistory = createBrowserHistory()
/**
 * 아래 코드로 인해 Redux store가 생성되며,
 * react-router, redux-devttol, redux-saga 등의 middleware들을 적용해 준 상태입니다.
 */
const store = createStore(
  createRootReducer(routeHistory),
  // connectRouter(routeHistory)(createRootReducer) /* preload state */,
  composeWithDevTools(applyMiddleware(saga, routerMiddleware(routeHistory)))
)
const persistor = persistStore(store)

export default () => {
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./GlobalReducer')
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer(routeHistory)))
    })
  }
  return { store, persistor }
}
