import * as React from 'react'
import styled from 'styled-components'

import AccountCircle from '@material-ui/icons/AccountCircle'

interface ISignInIconProps {
  pending: boolean
}
const Wrapper = styled.div`
  height: 200px;
  padding: 10%;
  & > svg {
    color: white;
    width: 100%;
    height: 100%;
  }
  & > .pending {
    animation: blink 1s linear infinite;
  }
  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`

const SignInIcon: React.SFC<ISignInIconProps> = props => (
  <Wrapper>
    <AccountCircle className={props.pending ? 'pending' : ''} />
  </Wrapper>
)

export default SignInIcon
