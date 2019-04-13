import { createAction, handleActions, Action } from 'redux-actions'
import { ThemeCode, LayoutDirection } from 'src/common/type'
/****************** Type ******************/
export type DefaultLayoutReduxState = {
  theme: ThemeCode
  layoutDirection: LayoutDirection
}
/****************** State ******************/
const initialState: DefaultLayoutReduxState = {
  theme: 'light',
  layoutDirection: 'column',
}
/****************** Action ******************/
/** Action types */
enum ActionTypes {
  SET_THEME = 'default-layout/SET_THEME',
  SET_LAYOUT_DIRECTION = 'default-layout/SET_LAYOUT_DIRECTION',
}
/** Payload */
type SetThemePayload = ThemeCode
type SetLayoutDirectionPayload = LayoutDirection
/** Action creators */
export const actionCreators = {
  setTheme: createAction<SetThemePayload>(ActionTypes.SET_THEME),
  setLayoutDirection: createAction<SetLayoutDirectionPayload>(ActionTypes.SET_LAYOUT_DIRECTION),
}
/****************** Redcucer ******************/
// tslint:disable-next-line:no-any
export default handleActions<DefaultLayoutReduxState, any>(
  {
    [ActionTypes.SET_THEME]: (state, action: Action<SetThemePayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        theme: action.payload,
      }
    },
    [ActionTypes.SET_LAYOUT_DIRECTION]: (state, action: Action<SetLayoutDirectionPayload>) => {
      if (!action.payload) return state
      return {
        ...state,
        layoutDirection: action.payload,
      }
    },
  },
  initialState
)
