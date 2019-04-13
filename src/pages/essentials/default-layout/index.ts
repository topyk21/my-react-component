import DefaultLayout from 'src/pages/essentials/default-layout/view/LayoutContainer'
import defaultLayoutReducer, {
  DefaultLayoutReduxState,
  actionCreators,
} from 'src/pages/essentials/default-layout/Widgets'

import 'src/pages/essentials/default-layout/view/Layout.scss'

export { DefaultLayout, DefaultLayoutReduxState, defaultLayoutReducer, actionCreators }

export default {
  DefaultLayout,
  defaultLayoutReducer,
  actionCreators,
}
