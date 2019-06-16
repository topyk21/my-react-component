import * as React from 'react'
import classNames from 'classnames'

import MuiList from '@material-ui/core/List'
import MuiCollapse from '@material-ui/core/Collapse'

import ListRow from 'molecules/ListRow'

import 'css/ListCollapsedRow.scss'

export interface CollapseItem {
  value: any
  subItems: any[]
}

interface ListCollapsedRowProps<T extends CollapseItem> {
  depth: number
  item: T
  subItems: T[]
  onClickMenuItem: (item: T) => void
}
interface ListCollapsedRowState {
  open: boolean
}

class ListCollapsedRow<T extends CollapseItem> extends React.Component<
  ListCollapsedRowProps<T>,
  ListCollapsedRowState
> {
  constructor(props: ListCollapsedRowProps<T>) {
    super(props)
    this.state = {
      open: false,
    }
  }

  onClickRow = (e: React.MouseEvent) => {
    e.stopPropagation()
    this.setState({ open: !this.state.open })

    if (this.props.onClickMenuItem) this.props.onClickMenuItem(this.props.item)
  }

  render() {
    const { item, subItems, depth } = this.props
    const hasChild = subItems && subItems.length > 0
    const nextDepth = depth + 1
    const listRowClassName = classNames('list-collapsed-row', {
      'list-collapsed-row__parent': hasChild,
    })
    return (
      <MuiList disablePadding>
        <ListRow
          className={listRowClassName}
          style={{ paddingLeft: nextDepth * 20 }}
          label={item.value}
          onClick={this.onClickRow}
        />
        {hasChild && (
          <MuiCollapse unmountOnExit in={this.state.open} timeout="auto">
            {subItems.map((item, idx) => (
              <ListCollapsedRow
                key={idx}
                depth={nextDepth}
                item={item}
                subItems={item.subItems}
                onClickMenuItem={this.props.onClickMenuItem}
              />
            ))}
          </MuiCollapse>
        )}
      </MuiList>
    )
  }
}

export default ListCollapsedRow
