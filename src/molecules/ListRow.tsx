import * as React from 'react'

import MuiListItem from '@material-ui/core/ListItem'
import MuiListItemText from '@material-ui/core/ListItemText'

interface ListRowProps {
  className?: string
  label: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent) => void
}

const ListItem: React.FC<ListRowProps> = props => (
  <MuiListItem button className={props.className} style={props.style} onClick={props.onClick}>
    <MuiListItemText>{props.label}</MuiListItemText>
  </MuiListItem>
)

export default ListItem
