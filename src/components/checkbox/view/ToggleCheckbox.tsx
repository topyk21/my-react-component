/**
 * Togglebox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import { ICheckboxViewProps } from 'src/components/checkbox/types'

const ToggleCheckbox: React.SFC<ICheckboxViewProps> = props => (
  <FormControlLabel {...props.formLabelProps} control={<Switch {...props.checkboxProps} />} />
)

export default ToggleCheckbox
