import * as React from 'react'
import classNames from 'classnames'

import 'src/components/checkbox/Checkbox.scss'

interface ICheckboxProps {
  id: string
  label: string
  value?: string
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  style?: React.CSSProperties
  fullWidth?: boolean
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
