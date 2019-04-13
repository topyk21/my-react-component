import * as React from 'react'

import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import Menu, { IMenuItem } from 'src/pages/essentials/default-layout/view/menu'

interface IMenuProps {
  menuItems: IMenuItem[]
  mobileMenuOpen: boolean
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
  onClickMenuItem: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

const MenuForm: React.SFC<IMenuProps> = props => (
  <div className="default-layout-menu-form">
    <div className="default-layout-menu-form__header">
      <IconButton>
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <Divider />
    <Menu menuItems={props.menuItems} onClick={props.onClickMenuItem} />
  </div>
)

const MobileMenu: React.SFC<IMenuProps> = props => (
  <Hidden mdUp implementation="css">
    <Drawer
      open={props.mobileMenuOpen}
      variant="temporary"
      anchor="left"
      onClose={props.onToggleMobileMenu}
      PaperProps={{ className: 'default-layout-menu__paper' }}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <MenuForm {...props} />
    </Drawer>
  </Hidden>
)

const DesktopMenu: React.SFC<IMenuProps> = props => (
  <div>
    <Hidden mdDown implementation="css">
      <Drawer
        open
        variant="persistent"
        anchor="left"
        PaperProps={{ className: 'default-layout-menu__paper' }}
      >
        <MenuForm {...props} />
      </Drawer>
    </Hidden>
  </div>
)

const MainMenu: React.SFC<IMenuProps> = props => (
  <nav className="default-layout-menu">
    <MobileMenu {...props} />
    <DesktopMenu {...props} />
  </nav>
)

export default MainMenu
