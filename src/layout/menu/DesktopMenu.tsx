import * as React from 'react'

import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'

import { MenuDatum } from 'layout/Widgets'
import MenuForm from 'layout/menu/MenuForm'

interface IMenuProps {
  menuItems: MenuDatum[]
  onClickMenuItem: (menuDatum: MenuDatum) => void
}

const DesktopMenu: React.FC<IMenuProps> = props => (
  <div>
    <Hidden mdDown implementation="css">
      <Drawer
        open
        variant="persistent"
        anchor="left"
        PaperProps={{ className: 'layout-menu__paper' }}
      >
        <MenuForm {...props} />
      </Drawer>
    </Hidden>
  </div>
)

export default DesktopMenu
