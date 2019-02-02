/**
 * Togglebox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import classNames from 'classnames'

import 'src/components/checkbox/Togglebox.scss'

interface IToggleboxProps {
  /** Checkbox id */
  id: string
  /** Checkbox label */
  label: string
  /** Checkbox value */
  value?: string
  /** Checkbox checked flag */
  checked?: boolean
  /** Checkbox checked status change event */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  /** Checkbox wrapper class Name */
  style?: React.CSSProperties
  /** Checkbox width flag. If this flag is on, component width is same with wrapper element */
  fullWidth?: boolean
  /** Checkbox disabled flag */
  disabled?: boolean
}

const Togglebox: React.SFC<IToggleboxProps> = props => {
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
