import * as React from 'react'
import styled from 'styled-components'

import SignInIcon from 'components/auth/SignInIcon'
import SignInBody from 'components/auth/SignInBody'

interface ISignForm {
  pending: boolean
  onSignIn: (e: React.MouseEvent<HTMLElement>) => void
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const Wrapper = styled.div`
  max-width: 280px;
  min-height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: rgba(170, 170, 170, 0.68);
  color: #274c5e;
  transform: translate(-50%, -50%);
`

const SignForm: React.SFC<ISignForm> = props => (
  <React.Fragment>
    <Wrapper>
      <SignInIcon pending={props.pending} />
      <SignInBody
        onSignIn={props.onSignIn}
        onChangeId={props.onChangeId}
        onChangePassword={props.onChangePassword}
      />
    </Wrapper>
  </React.Fragment>
)

export default SignForm
