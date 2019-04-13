/**
 * Checkbox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { ICheckboxViewProps } from 'src/components/checkbox/types'

const DefaultCheckbox: React.SFC<ICheckboxViewProps> = props => (
  <FormControlLabel {...props.formLabelProps} control={<Checkbox {...props.checkboxProps} />} />
)

export default DefaultCheckbox
