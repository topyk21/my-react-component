import * as React from 'react'

import Checkbox from 'src/components/checkbox'

interface ISelectorListItemProps {
  id: string
  label: string
  isChecked?: boolean
  style?: React.CSSProperties
  onClick?: (itemId: string, itemName: string) => void
}

const SelectorListItem: React.NamedExoticComponent<ISelectorListItemProps> = React.memo(props => {
  const onClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onClick) {
      props.onClick(props.id, props.label)
    }
  }
  return (
    <Checkbox
      fullWidth
      className="selector-item-list"
      style={props.style}
      id={props.id}
      label={props.label}
      checked={props.isChecked}
      onChange={onClick}
    />
  )
})

export default SelectorListItem
