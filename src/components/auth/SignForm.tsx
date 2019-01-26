import * as React from 'react'

import SignIcon from 'src/components/auth/SignIcon'
import SignInBody from 'src/components/auth/SignInBody'

import 'src/components/auth/Auth.scss'

interface ISignForm {
  pending: boolean
  onSignIn: (e: React.MouseEvent<HTMLElement>) => void
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SignForm: React.SFC<ISignForm> = props => (
  <div className={'sign-form__wrapper'}>
    <SignIcon pending={props.pending} />
    <SignInBody {...props} />
  </div>
)

export default SignForm
