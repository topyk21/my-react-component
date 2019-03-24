/**
 * Togglebox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import classNames from 'classnames'

import { ICheckboxViewProps } from 'src/components/checkbox/types'

const Togglebox: React.SFC<ICheckboxViewProps> = props => {
  const wrapperWithFullWidth = classNames('tbx__wrapper', {
    'tbx__wrapper-full-width': props.fullWidth,
  })
  return (
    <div className={props.className} style={props.style}>
      <label className={wrapperWithFullWidth}>
        <input
          className="hided-tbx"
          type="checkbox"
          id={props.id}
          value={props.value}
          checked={props.checked}
          onChange={props.onChange}
          disabled={props.disabled}
        />
        <span className={'tbx__label'}>{props.label}</span>
      </label>
    </div>
  )
}
export default Togglebox
