/**
 * Checkbox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import DefaultCheckbox from 'src/components/checkbox/DefaultCheckbox'
import ToggleCheckbox from 'src/components/checkbox/ToggleCheckbox'
import { ICheckboxViewProps } from 'src/components/checkbox/types'

interface ICheckboxProps extends ICheckboxViewProps {
  mode?: 'default' | 'toggle'
}

const Checkbox: React.SFC<ICheckboxProps> = props =>
  props.mode === 'toggle' ? <ToggleCheckbox {...props} /> : <DefaultCheckbox {...props} />

export default Checkbox
