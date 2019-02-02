// tslint:disable:no-any
import * as React from 'react'
import classNames from 'classnames'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

interface IMenuUnitProps {
  parent: boolean
  menuId: string
  parentId?: string
  label: string
  onClick: (menuId: string, parentId?: string) => void
}

const MenuUnit: React.SFC<IMenuUnitProps> = props => {
  const onClick = () => {
    props.onClick(props.menuId, props.parentId)
  }
  const itemClass = classNames('menu-item', {
    'menu-parent-item': props.parent,
    'menu-child-item': !props.parent,
  })
  return (
    <ListItem button className={itemClass} onClick={onClick}>
      <ListItemText>{props.label}</ListItemText>
      {props.children}
    </ListItem>
  )
}

export default MenuUnit
