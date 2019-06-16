import * as React from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuIcon from '@material-ui/icons/Menu'

import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import HighlightIcon from '@material-ui/icons/Highlight'
import HighlightOutlinedIcon from '@material-ui/icons/HighlightOutlined'

import AppBar from 'organisms/AppBar'

export interface HeaderProps {
  theme: 'light' | 'dark'
  onClickSignOutIcon?: (e: React.MouseEvent<HTMLElement>) => void
  onClickThemeIcon: (e: React.MouseEvent<HTMLElement>) => void
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
}

const Header: React.FC<HeaderProps> = props => (
  <AppBar className="layout-header" title="Smart OMS Title">
    {{
      leftSide: (
        <IconButton
          color="inherit"
          className="layout-header__menu-icon"
          onClick={props.onToggleMobileMenu}
        >
          <MenuIcon />
        </IconButton>
      ),
      rightSide: (
        <>
          <Tooltip placement="bottom" title="Toggle Theme">
            <IconButton
              className="layout-header__right-side-button"
              color="inherit"
              onClick={props.onClickThemeIcon}
            >
              {props.theme === 'light' ? <HighlightIcon /> : <HighlightOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip placement="bottom" title="Logout">
            <IconButton
              className="layout-header__right-side-button"
              color="inherit"
              onClick={props.onClickSignOutIcon}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    }}
  </AppBar>
)

export default Header
