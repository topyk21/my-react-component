import * as React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

interface ISignInBodyProps {
  pending: boolean
  onSignIn: (e: React.MouseEvent<HTMLElement>) => void
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SignInBody: React.SFC<ISignInBodyProps> = props => (
  <React.Fragment>
    <div className={'sign-in__input-wrapper'}>
      <TextField
        autoComplete="off"
        fullWidth
        autoFocus
        name="id"
        label="ID"
        onChange={props.onChangeId}
      />
      <TextField
        fullWidth
        type="password"
        name="password"
        label="Password"
        onChange={props.onChangePassword}
      />
    </div>
    <div className={'sign-in__button-wrapper'}>
      <Button variant="contained" color="primary" onClick={props.onSignIn} disabled={props.pending}>
        SIGN IN
      </Button>
      <Button variant="contained" color="secondary" disabled={props.pending}>
        SIGN UP
      </Button>
    </div>
  </React.Fragment>
)

export default SignInBody
