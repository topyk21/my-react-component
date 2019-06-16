import * as React from 'react'

import MuiRadioGroup, { RadioGroupProps as MuiRadioGroupProps } from '@material-ui/core/RadioGroup'
import MuiFormControlLabel, {
  FormControlLabelProps as MuiFormControlLabelProps,
} from '@material-ui/core/FormControlLabel'
import MuiRadio from '@material-ui/core/Radio'

import { Omit } from 'utils/Omit'

export interface RadioControlProps extends MuiRadioGroupProps {
  items: string[]
  muiLabelsProps?: Omit<MuiFormControlLabelProps, 'control' | 'value' | 'label'>
}

const RadioControl: React.SFC<RadioControlProps> = props => (
  <MuiRadioGroup {...props}>
    {props.items.map((item, idx) => (
      <MuiFormControlLabel key={idx} value={item} label={item} control={<MuiRadio />} />
    ))}
  </MuiRadioGroup>
)

export default RadioControl
