import { createAction, handleActions } from 'redux-actions'
import { CollapseItem } from 'molecules/ListCollapsedRow'
import { ThemeCode } from 'utils/ThemeCode'
/****************** Type ******************/
export interface MenuDatum extends CollapseItem {
  id: string
  value: string
  bindingPath: string
  subItems: MenuDatum[]
}
export type LayoutReduxState = {
  theme: ThemeCode
}
/****************** State ******************/
const initialState: LayoutReduxState = {
  theme: 'light',
}
/****************** Action ******************/
/** Action types */
enum ActionTypes {
  TOGGLE_THEME = 'layout/TOGGLE_THEME',
}
/** Action creators */
export const actionCreators = {
  toggleTheme: createAction(ActionTypes.TOGGLE_THEME),
}
/****************** Redcucer ******************/
export default handleActions<LayoutReduxState, {}>(
  {
    [ActionTypes.TOGGLE_THEME]: state => {
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      }
    },
  },
  initialState
)
