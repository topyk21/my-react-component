import * as React from 'react'

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@material-ui/core/AppBar'
import MuiToolbar from '@material-ui/core/Toolbar'
import MuiTypography from '@material-ui/core/Typography'

export interface AppBarProps extends MuiAppBarProps {
  title: string
  children: AppBarChildSlots
  onClickTitle?: (e: React.MouseEvent<HTMLElement>) => void
}

interface AppBarChildSlots {
  leftSide?: React.ReactChild
  rightSide?: React.ReactChild
}

const AppBar: React.FC<AppBarProps> = props => (
  <MuiAppBar {...props}>
    <MuiToolbar variant="dense">
      {props.children.leftSide}
      <MuiTypography
        noWrap
        color="inherit"
        className="appbar__title"
        onClick={props.onClickTitle}
        variant="h6"
        style={{ flexGrow: 1 }}
      >
        {props.title}
      </MuiTypography>
      {props.children.rightSide}
    </MuiToolbar>
  </MuiAppBar>
)

export default AppBar
