import * as React from 'react'

import { JSMap } from 'anti/flex-layout/lib/Types'
import TabSetNode from 'anti/flex-layout/model/TabSetNode'
import TabNode from 'anti/flex-layout/model/TabNode'
import Actions from 'anti/flex-layout/model/Actions'
import Layout from 'anti/flex-layout/view/Layout'

/** @hidden @internal */
interface ITabProps {
  layout: Layout
  selected: boolean
  node: TabNode
  factory: (node: TabNode) => React.ReactNode
}
/** @hidden @internal */
interface ITabState {
  renderComponent: boolean
}

/** @hidden @internal */
class Tab extends React.Component<ITabProps, ITabState> {
  constructor(props: ITabProps) {
    super(props)
    this.state = { renderComponent: !props.node.isEnableRenderOnDemand() || props.selected }
  }

  componentDidMount() {
    // console.log("mount " + this.props.node.getName());
  }

  componentWillUnmount() {
    // console.log("unmount " + this.props.node.getName());
  }

  componentWillReceiveProps(newProps: ITabProps) {
    if (!this.state.renderComponent && newProps.selected) {
      // load on demand
      // console.log("load on demand: " + this.props.node.getName());
      this.setState({ renderComponent: true })
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
    // tslint:disable-next-line:no-any
    const style: JSMap<any> = node.styleWithPosition({
      display: this.props.selected ? 'block' : 'none',
    })

    if (parentNode.isMaximized()) {
      style.zIndex = 100
    }

    let child
    if (this.state.renderComponent) {
      child = this.props.factory(node)
    }

    return (
      <div
        className="flexlayout__tab"
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
        style={style}
      >
        {child}
      </div>
    )
  }
}

export default Tab
