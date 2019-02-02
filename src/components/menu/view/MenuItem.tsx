import * as React from 'react'

import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'

import { IMenuItem } from 'src/components/menu/types'
import MenuUnit from 'src/components/menu/view/MenuUnit'

interface IMenuItemProps {
  menuItems: IMenuItem[]
  onClick: (menuId: string, parentId?: string) => void
}
interface IMenuItemState {
  isOpened: boolean
}

class MenuItem extends React.Component<IMenuItemProps, IMenuItemState> {
  constructor(props: IMenuItemProps) {
    super(props)
    this.state = {
      isOpened: false,
    }
  }

  onClickParentMenu = (menuId: string) => {
    this.setState((prevState: IMenuItemState) => {
      return { isOpened: !prevState.isOpened }
    })
    this.props.onClick(menuId)
  }

  render() {
    const { menuItems, onClick } = this.props
    const hasChild = menuItems.length === 1 ? false : true
    const paerntId = menuItems[0].id
    const parentLabel = menuItems[0].label

    return (
      <React.Fragment>
        <MenuUnit parent menuId={paerntId} label={parentLabel} onClick={this.onClickParentMenu} />
        {hasChild && (
          <Collapse unmountOnExit in={this.state.isOpened} timeout="auto">
            <List disablePadding>
              {menuItems.slice(1).map(datum => (
                <MenuUnit
                  parent={false}
                  parentId={paerntId}
                  key={datum.id}
                  menuId={datum.id}
                  label={datum.label}
                  onClick={onClick}
                />
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }
}

export default MenuItem
