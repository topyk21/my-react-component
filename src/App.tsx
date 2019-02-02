import * as React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { hot } from 'react-hot-loader/root'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
// Custom library
import setStoreConfig, { routeHistory } from 'src/lib/redux/redux-store'
import PrivateRoute from 'src/lib/private-route'
// Container components
import SignForm from 'src/components/auth/Container'
// Page components
import RootPage from 'src/pages/RootPage'
// Static
import 'typeface-roboto'
import 'src/scroll.scss'

/** Material-ui theme setting */
const defaultTheme = createMuiTheme({
  typography: { useNextVariants: true },
  palette: { type: 'dark' },
})
/** Get Redux Store */
const mainStore = setStoreConfig()
/** App의 기본 설정들을 위한 Wrapper들을 적용시키는 Functional Component */
const AppWrapper: React.SFC<{}> = props => (
  <Provider store={mainStore.store}>
    <PersistGate loading={null} persistor={mainStore.persistor}>
      <MuiThemeProvider theme={defaultTheme}>
        <CssBaseline>
          <ConnectedRouter history={routeHistory}>{props.children}</ConnectedRouter>
        </CssBaseline>
      </MuiThemeProvider>
    </PersistGate>
  </Provider>
)
/**
 * Routing Entry variable
 * 해당 Library 컨셉은 React Router를 활용한 표시 데이터의 변경이 아닌,
 * React Loadable을 활용하여 Component를 Dynamic Load 해오기에
 * Router 부분의 Code가 짧습니다.
 */
const AppEntry = ({}) => (
  <Switch>
    <Route path="/signin" component={SignForm} />
    <PrivateRoute path="/" isAuth={mainStore.store.getState().auth.isSignIn} component={RootPage} />
  </Switch>
)
/** App 진입점 */
const App = () => (
  <AppWrapper>
    <AppEntry />
  </AppWrapper>
)

export default hot(App)
