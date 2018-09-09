import * as React from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

interface ISignInBodyProps {
  onSignIn: (e: React.MouseEvent<HTMLElement>) => void
  onChangeId: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
}
const InputsWrapper = styled.div`
  padding: 8px 20px 20px;
`
const ButtonsWrapper = styled.div`
  padding: 8px 20px 20px;
  margin-top: 10px;
  & > button {
    margin-top: 10px;
    width: 100%;
    border-radius: 20px;
  }
`

const SignInBody: React.SFC<ISignInBodyProps> = props => (
  <React.Fragment>
    <InputsWrapper>
      <TextField
        autoComplete="off"
        fullWidth={true}
        autoFocus={true}
        name="id"
        label="ID"
        onChange={props.onChangeId}
      />
      <TextField
        fullWidth={true}
        type="password"
        name="password"
        label="Password"
        onChange={props.onChangePassword}
      />
    </InputsWrapper>
    <ButtonsWrapper>
      <Button variant="raised" color="primary" onClick={props.onSignIn}>
        SIGN IN
      </Button>
      <Button variant="raised" color="secondary">
        SIGN UP
      </Button>
    </ButtonsWrapper>
  </React.Fragment>
)

export default SignInBody
