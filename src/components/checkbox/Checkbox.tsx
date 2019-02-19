/**
 * Checkbox component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import classNames from 'classnames'

interface ICheckboxProps {
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
  /** Checkbox wrapper class Name */
  className?: string
  /** Checkbox additional style */
  style?: React.CSSProperties
  /** Checkbox width flag. If this flag is on, component width is same with wrapper element */
  fullWidth?: boolean
  /** Checkbox disabled flag */
  disabled?: boolean
}

const Checkbox: React.SFC<ICheckboxProps> = props => {
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

export default Checkbox
