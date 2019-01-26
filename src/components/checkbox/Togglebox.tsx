import * as React from 'react'
import classNames from 'classnames'

import 'src/components/checkbox/Togglebox.scss'

interface IToggleboxProps {
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
