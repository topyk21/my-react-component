import * as React from 'react'

import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import ListCollapsedRow from 'molecules/ListCollapsedRow'
import { MenuDatum } from 'layout/Widgets'

interface IMenuProps {
  menuItems: MenuDatum[]
  onClickMenuItem: (menuDatum: MenuDatum) => void
}

const MenuForm: React.FC<IMenuProps> = props => (
  <div className="layout-menu__form">
    <div className="layout-menu__form-header">
      <IconButton>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    {props.menuItems.map(item => (
      <ListCollapsedRow<MenuDatum>
        depth={0}
        item={item}
        key={item.id}
        subItems={item.subItems}
        onClickMenuItem={props.onClickMenuItem}
      />
    ))}
  </div>
)

export default MenuForm
