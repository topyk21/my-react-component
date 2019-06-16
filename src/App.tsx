import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import koLocale from 'date-fns/locale/ko'

import setReduxStore from 'utils/ReduxStore'
import Layout from 'layout/Layout'
import PageLoader from 'pages/PageLoader'

/** Material-ui theme setting */
const defaultTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})
/** Get Redux Store */
const mainStore = setReduxStore()

const AppWrapper: React.FC<{}> = props => (
  <Provider store={mainStore.store}>
    <PersistGate loading={null} persistor={mainStore.persistor}>
      <MuiThemeProvider theme={defaultTheme}>
        <CssBaseline>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
            {props.children}
          </MuiPickersUtilsProvider>
        </CssBaseline>
      </MuiThemeProvider>
    </PersistGate>
  </Provider>
)

const App: React.FC = () => {
  return (
    <AppWrapper>
      <Layout pageLoader={PageLoader} />
    </AppWrapper>
  )
}

export default App
