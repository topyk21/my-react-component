import * as React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuIcon from '@material-ui/icons/Menu'

import SignalWifiOffIcon from '@material-ui/icons/SignalWifiOff'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import HighlightIcon from '@material-ui/icons/Highlight'
import HighlightOutlinedIcon from '@material-ui/icons/HighlightOutlined'

interface IHeaderProps {
  theme: 'light' | 'dark'
  onClickMain: () => void
  onClickSignOut: (e: React.MouseEvent<HTMLElement>) => void
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
  onToggleTheme: (e: React.MouseEvent<HTMLElement>) => void
}

const Header: React.SFC<IHeaderProps> = props => (
  <AppBar className="default-layout-header" position="fixed">
    <Toolbar variant="dense">
      <IconButton
        color="inherit"
        className="default-layout-header__menu-btn"
        aria-label="Open drawer"
        onClick={props.onToggleMobileMenu}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        noWrap
        color="inherit"
        className="default-layout-header__title"
        onClick={props.onClickMain}
        variant="h6"
      >
        Webpage Title
      </Typography>
      <Tooltip placement="bottom" title="Toggle Theme">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onToggleTheme}
        >
          {props.theme === 'light' ? <HighlightIcon /> : <HighlightOutlinedIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title="Logout">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onClickSignOut}
        >
          <SignalWifiOffIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title="Logout">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onClickSignOut}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
)

export default Header
