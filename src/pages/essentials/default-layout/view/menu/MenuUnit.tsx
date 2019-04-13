// tslint:disable:no-any
import * as React from 'react'
import classNames from 'classnames'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

interface IMenuUnitProps {
  parent: boolean
  id: string
  value: string
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const MenuUnit: React.SFC<IMenuUnitProps> = props => {
  const itemClass = classNames('menu-item', {
    'menu-parent-item': props.parent,
    'menu-child-item': !props.parent,
  })

  return (
    <ListItem
      button
      className={itemClass}
      id={props.id}
      value={props.value}
      onClick={props.onClick}
    >
      <ListItemText>{props.value}</ListItemText>
      {props.children}
    </ListItem>
  )
}

export default MenuUnit
