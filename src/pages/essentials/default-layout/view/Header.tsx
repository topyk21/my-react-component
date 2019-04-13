import * as React from 'react'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuIcon from '@material-ui/icons/Menu'

import HorizontalSplitIcon from '@material-ui/icons/HorizontalSplit'
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import HighlightIcon from '@material-ui/icons/Highlight'
import HighlightOutlinedIcon from '@material-ui/icons/HighlightOutlined'

import { ThemeCode, LayoutDirection } from 'src/common/type'

interface IHeaderProps {
  theme: ThemeCode
  searchOptionsLayout: LayoutDirection
  onClickMain: () => void
  onClickSignOutIcon: (e: React.MouseEvent<HTMLElement>) => void
  onClickThemeIcon: (e: React.MouseEvent<HTMLElement>) => void
  onClickSearchOptionsLayoutIcon: (e: React.MouseEvent<HTMLElement>) => void
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
}

const Header: React.SFC<IHeaderProps> = props => (
  <AppBar className="default-layout-header" position="fixed">
    <Toolbar variant="dense">
      <IconButton
        color="inherit"
        className="default-layout-header__menu-btn"
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
        Smart OMS
      </Typography>
      <Tooltip placement="bottom" title="Toggle Theme">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onClickThemeIcon}
        >
          {props.theme === 'light' ? <HighlightIcon /> : <HighlightOutlinedIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title="Toggle Search Option Layout">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onClickSearchOptionsLayoutIcon}
        >
          {props.searchOptionsLayout === 'row' ? <VerticalSplitIcon /> : <HorizontalSplitIcon />}
        </IconButton>
      </Tooltip>
      <Tooltip placement="bottom" title="Logout">
        <IconButton
          className="default-layout-header__btn"
          color="inherit"
          onClick={props.onClickSignOutIcon}
        >
          <AccountCircleIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  </AppBar>
)

export default Header
