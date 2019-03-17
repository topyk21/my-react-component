import { createAction, handleActions, Action } from 'redux-actions'
/****************** Type ******************/
export type ThemeCode = 'light' | 'dark'
export type DefaultLayoutReduxState = { theme: ThemeCode }
/****************** State ******************/
const initialState: DefaultLayoutReduxState = {
  theme: 'light',
}
/****************** Action ******************/
/** Action types */
enum ActionTypes {
  SET_THEME = 'default-layout/SET_THEME',
}
/** Payload */
type SetThemePayload = ThemeCode
/** Action creators */
export const actionCreators = {
  setTheme: createAction<SetThemePayload>(ActionTypes.SET_THEME),
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
  },
  initialState
)
