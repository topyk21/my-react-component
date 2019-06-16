/**
 * Switch component
 *
 * @author Hong Young Gi
 */
import * as React from 'react'

import MuiFormControlLabel, {
  FormControlLabelProps as MuiFormControlLabelProps,
} from '@material-ui/core/FormControlLabel'
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@material-ui/core/Switch'

import { Omit } from 'utils/Omit'

export interface SwitchboxProps extends Omit<MuiFormControlLabelProps, 'control'> {
  checkboxProps?: MuiSwitchProps
}

const Switchbox: React.FC<SwitchboxProps> = props => (
  <MuiFormControlLabel {...props} control={<MuiSwitch {...props.checkboxProps} />} />
)

export default Switchbox
