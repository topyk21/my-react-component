import SearchOptions from 'src/pages/essentials/search-options/view/SearchOptionsContainer'
import searchOptionsReducer, {
  actionCreators,
  FluxSearchOptionReduxState as SearchOptionsReduxState,
} from 'src/pages/essentials/search-options/Widgets'

import 'src/pages/essentials/search-options/view/SearchOptions.scss'

export { actionCreators, SearchOptions, searchOptionsReducer, SearchOptionsReduxState }
export default { actionCreators, SearchOptions, searchOptionsReducer }
