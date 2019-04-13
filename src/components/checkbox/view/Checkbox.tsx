/**
 * Checkbox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import DefaultCheckbox from 'src/components/checkbox/view/DefaultCheckbox'
import ToggleCheckbox from 'src/components/checkbox/view/ToggleCheckbox'

import { ICheckboxViewProps } from 'src/components/checkbox/types'

interface ICheckboxProps extends ICheckboxViewProps {
  /** Checkbox mode, default는 일반 view, toggle은 toggle view로 제공 */
  mode?: 'default' | 'toggle'
}

const Checkbox: React.SFC<ICheckboxProps> = props =>
  props.mode === 'toggle' ? <ToggleCheckbox {...props} /> : <DefaultCheckbox {...props} />

export default Checkbox
