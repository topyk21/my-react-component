import * as React from 'react'
import classNames from 'classnames'

import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import RefreshIcon from '@material-ui/icons/Refresh'

import { ISelectorFormProps } from 'src/components/selector/type'

const SelectorForm: React.SFC<ISelectorFormProps> = props => {
  const icons = (
    <InputAdornment className="selector-form__icon-layer" position="end">
      {props.onClickRefreshIcon && (
        <IconButton onClick={props.onClickRefreshIcon}>
          <RefreshIcon />
        </IconButton>
      )}
      <Badge color="secondary" className="selector-form__badge" badgeContent={props.selectedCount}>
        <IconButton onClick={props.onClickClearIcon}>
          <ClearIcon />
        </IconButton>
      </Badge>
    </InputAdornment>
  )

  const textFieldClass = classNames('selector-form', props.textFieldProps.className)
  return (
    <TextField
      {...props.textFieldProps}
      className={textFieldClass}
      InputProps={{
        endAdornment: icons,
        readOnly: true,
        style: { fontSize: 'small' },
      }}
      InputLabelProps={{ shrink: true }}
    />
  )
}

export default SelectorForm
