import * as React from 'react'
import classNames from 'classnames'
import AccountCircle from '@material-ui/icons/AccountCircle'

interface ISignIconProps {
  pending: boolean
}

const SignIcon: React.SFC<ISignIconProps> = props => {
  const iconClass = classNames('sign-form__icon', {
    'sign-form__icon-pending': props.pending,
  })

  return (
    <div className="sign-form__icon-wrapper">
      <AccountCircle className={iconClass} />
    </div>
  )
}

export default SignIcon
