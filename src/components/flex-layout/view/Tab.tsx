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
const TabWrapper = styled.div`
  overflow: hidden;
  box-sizing: border-box;
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
      // console.log("load on demand: " + this.props.node.getName());
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
    const style: JSMap<any> = node.styleWithPosition({
      display: this.props.selected ? 'block' : 'none',
    })

    if (parentNode.isMaximized()) {
      style.zIndex = 100
    }

    const child = this.state.isShouldRendering && this.props.factory(node)
    return (
      <TabWrapper onMouseDown={this.onMouseDown} onTouchStart={this.onMouseDown} style={style}>
        {child}
      </TabWrapper>
    )
  }
}

export default Tab
