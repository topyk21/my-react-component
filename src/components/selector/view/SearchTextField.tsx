import * as React from 'react'

import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import DoneAllIcon from '@material-ui/icons/DoneAll'

import { ISearchTextFieldProps } from 'src/components/selector/type'

const ISearchTextFieldProps: React.SFC<ISearchTextFieldProps> = props => (
  <TextField
    {...props.textFieldProps}
    fullWidth
    autoFocus
    InputProps={{
      endAdornment: props.onClickCheckAllIcon && (
        <InputAdornment position="end">
          <IconButton className="search-box__icon" onClick={props.onClickCheckAllIcon}>
            <DoneAllIcon />
          </IconButton>
        </InputAdornment>
      ),
    }}
  />
)

export default ISearchTextFieldProps
