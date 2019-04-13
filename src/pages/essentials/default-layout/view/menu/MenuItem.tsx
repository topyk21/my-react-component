import * as React from 'react'

import List from '@material-ui/core/List'
import Collapse from '@material-ui/core/Collapse'

import { IMenuItem } from 'src/pages/essentials/default-layout/view/menu/types'
import MenuUnit from 'src/pages/essentials/default-layout/view/menu/MenuUnit'

interface IMenuItemProps {
  menuItems: IMenuItem[]
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
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

  onClickParentMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState((prevState: IMenuItemState) => {
      return { isOpened: !prevState.isOpened }
    })
    this.props.onClick(e)
  }

  render() {
    const { menuItems, onClick } = this.props
    const paerntId = menuItems[0].id
    const parentLabel = menuItems[0].value

    return (
      <React.Fragment>
        <MenuUnit parent id={paerntId} value={parentLabel} onClick={this.onClickParentMenu} />
        {this.hasChild && (
          <Collapse unmountOnExit in={this.state.isOpened} timeout="auto">
            <List disablePadding>
              {menuItems.slice(1).map(datum => (
                <MenuUnit
                  parent={false}
                  key={datum.id}
                  id={datum.id}
                  value={datum.value}
                  onClick={onClick}
                />
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  private hasChild = () => (this.props.menuItems.length === 1 ? false : true)
}

export default MenuItem
