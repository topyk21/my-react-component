import * as React from 'react'

import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'

import { MenuDatum } from 'layout/Widgets'
import MenuForm from 'layout/menu/MenuForm'

interface IMenuProps {
  menuItems: MenuDatum[]
  mobileMenuOpen: boolean
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
  onClickMenuItem: (menuDatum: MenuDatum) => void
}

const MobileMenu: React.FC<IMenuProps> = props => (
  <Hidden mdUp implementation="css">
    <Drawer
      open={props.mobileMenuOpen}
      variant="temporary"
      anchor="left"
      onClose={props.onToggleMobileMenu}
      PaperProps={{ className: 'layout-menu__paper' }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <MenuForm {...props} />
    </Drawer>
  </Hidden>
)

export default MobileMenu
