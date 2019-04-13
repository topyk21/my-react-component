/**
 * Menu component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import List from '@material-ui/core/List'

import MenuItem from 'src/pages/essentials/default-layout/view/menu/MenuItem'
import { IMenuItem } from 'src/pages/essentials/default-layout/view/menu/types'

interface IMenuProps {
  menuItems: IMenuItem[]
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const Menu: React.SFC<IMenuProps> = props => {
  const parsingPiece: IMenuItem[][] = []
  const itemCnt = props.menuItems.length
  let nextParentIdx = 0
  let groupStartIdx = 0
  while (groupStartIdx + 1 < itemCnt) {
    nextParentIdx =
      props.menuItems.slice(groupStartIdx + 1).findIndex(datum => datum.parentId === '-1') +
      groupStartIdx +
      1
    const partialMenuItems = props.menuItems.slice(groupStartIdx, nextParentIdx)
    parsingPiece.push(partialMenuItems)
    groupStartIdx = nextParentIdx
  }

  return (
    <List component="nav">
      {parsingPiece.map(menuItems => (
        <MenuItem key={menuItems[0].id} menuItems={menuItems} onClick={props.onClick} />
      ))}
    </List>
  )
}

export default Menu
