// tslint:disable:no-any
import * as React from 'react'
import styled from 'styled-components'

import { JSMap } from 'components/flex-layout/Types'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import TabNode from 'components/flex-layout/model/TabNode'
import Actions from 'components/flex-layout/model/Actions'
import Layout from 'components/flex-layout/view/Layout'

/** @hidden @internal */
export interface ITabProps {
  layout: Layout
  selected: boolean
  node: TabNode
  factory: (node: TabNode) => React.ReactNode
}
/** @hidden @internal */
interface ITabState {
  isShouldRendering: boolean
}
/** @hidden @internal */
const TabWrapper = styled<{ isSelected: boolean; isMaximized: boolean }, 'div'>('div')`
  overflow: auto;
  box-sizing: border-box;
  display: ${props => (props.isSelected ? 'display' : 'none')};
  z-index: ${props => props.isMaximized && '100'};
`
/** @hidden @internal */
class Tab extends React.Component<ITabProps, ITabState> {
  constructor(props: ITabProps) {
    super(props)
    this.state = { isShouldRendering: props.selected }
  }

  componentDidMount() {
    // console.log("mount " + this.props.node.getName());
  }

  componentWillUnmount() {
    // console.log("unmount " + this.props.node.getName());
  }

  componentWillReceiveProps(newProps: ITabProps) {
    if (!this.state.isShouldRendering && newProps.selected) {
      // load on demand
      this.setState({ isShouldRendering: true })
    }
  }

  onMouseDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const parent = this.props.node.getParent() as TabSetNode
    if (parent.getType() === TabSetNode.TYPE) {
      if (!parent.isActive()) {
        this.props.layout.doAction(Actions.setActiveTabset(parent.getId()))
      }
    }
  }

  render() {
    const node = this.props.node
    const parentNode = node.getParent() as TabSetNode
    const style: JSMap<any> = node.styleWithPosition()
    const child = this.state.isShouldRendering && this.props.factory(node)
    return (
      <TabWrapper
        isMaximized={parentNode.isMaximized()}
        isSelected={this.props.selected}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
        style={style}
      >
        {child}
      </TabWrapper>
    )
  }
}

export default Tab
