import { FormControlLabelProps } from '@material-ui/core/FormControlLabel'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import { Omit } from 'src/common/type'

type FormLabelProps = Omit<FormControlLabelProps, 'control'>

export interface ICheckboxViewProps {
  formLabelProps: FormLabelProps
  checkboxProps?: CheckboxProps
}
