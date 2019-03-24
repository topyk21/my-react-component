/**
 * Checkbox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import classNames from 'classnames'

import { ICheckboxViewProps } from 'src/components/checkbox/types'

const DefaultCheckbox: React.SFC<ICheckboxViewProps> = props => {
  const wrapperWithFullWidth = classNames('cbx__wrapper', {
    'cbx__wrapper-full-width': props.fullWidth,
  })

  return (
    <div className={props.className} style={props.style}>
      <input
        className="hided-cbx"
        type="checkbox"
        id={props.id}
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
      />
      <label className={wrapperWithFullWidth} htmlFor={props.id}>
        <span className="cbx__icon">
          <svg width="12px" height="10px" viewBox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1" />
          </svg>
        </span>
        {props.label}
      </label>
    </div>
  )
}

export default DefaultCheckbox
