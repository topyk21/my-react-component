import * as React from 'react'
import * as ReactDOM from 'react-dom'

import DragDrop from 'src/components/flex-layout/lib/DragDrop'
import Orientation from 'src/components/flex-layout/lib/Orientation'
import Node from 'src/components/flex-layout/model/Node'
import BorderNode from 'src/components/flex-layout/model/BorderNode'
import Actions from 'src/components/flex-layout/model/Actions'
import SplitterNode from 'src/components/flex-layout/model/SplitterNode'
import RowNode from 'src/components/flex-layout/model/RowNode'
import Layout from 'src/components/flex-layout/view/Layout'

/** @hidden @internal */
interface ISplitterProps {
  layout: Layout
  node: SplitterNode
}

/** @hidden @internal */
class Splitter extends React.Component<ISplitterProps, {}> {
  pBounds?: number[]
  outlineDiv?: HTMLDivElement

  onMouseDown = (
    event: Event | React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    DragDrop.instance.startDrag(
      event as Event,
      this.onDragStart,
      this.onDragMove,
      this.onDragEnd,
      this.onDragCancel
    )
    const parentNode = this.props.node.getParent() as RowNode
    this.pBounds = parentNode.getSplitterBounds(this.props.node)
    const rootdiv = ReactDOM.findDOMNode(this.props.layout) as Element
    this.outlineDiv = document.createElement('div')
    this.outlineDiv.style.position = 'absolute'
    this.outlineDiv.className = 'flexlayout__splitter_drag'
    this.outlineDiv.style.cursor =
      this.props.node.getOrientation() === Orientation.HORZ ? 'ns-resize' : 'ew-resize'
    this.props.node.getRect().positionElement(this.outlineDiv)
    rootdiv.appendChild(this.outlineDiv)
  }

  onDragCancel = (wasDragging: boolean) => {
    const rootdiv = ReactDOM.findDOMNode(this.props.layout) as Element
    rootdiv.removeChild(this.outlineDiv as Element)
  }

  onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    return true
  }

  onDragMove = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const clientRect = (ReactDOM.findDOMNode(this.props.layout) as Element).getBoundingClientRect()
    const mouseEvent = event as React.MouseEvent<HTMLDivElement>
    const pos = {
      x: mouseEvent.clientX - clientRect.left,
      y: mouseEvent.clientY - clientRect.top,
    }
    const outlineDiv = this.outlineDiv as HTMLDivElement

    if (this.props.node.getOrientation() === Orientation.HORZ) {
      outlineDiv.style.top = this.getBoundPosition(pos.y - 4) + 'px'
    } else {
      outlineDiv.style.left = this.getBoundPosition(pos.x - 4) + 'px'
    }
  }

  onDragEnd = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node
    const parentNode = node.getParent() as RowNode
    let value = 0
    const outlineDiv = this.outlineDiv as HTMLDivElement
    if (node.getOrientation() === Orientation.HORZ) {
      value = outlineDiv.offsetTop
    } else {
      value = outlineDiv.offsetLeft
    }

    if (parentNode instanceof BorderNode) {
      const pos = (parentNode as BorderNode).calculateSplit(node, value)
      this.props.layout.doAction(Actions.adjustBorderSplit((node.getParent() as Node).getId(), pos))
    } else {
      const splitSpec = parentNode.calculateSplit(this.props.node, value)
      if (splitSpec !== undefined) {
        this.props.layout.doAction(Actions.adjustSplit(splitSpec))
      }
    }

    const rootdiv = ReactDOM.findDOMNode(this.props.layout) as Element
    rootdiv.removeChild(this.outlineDiv as HTMLDivElement)
  }

  getBoundPosition = (p: number) => {
    const bounds = this.pBounds as number[]
    let rtn = p
    if (p < bounds[0]) {
      rtn = bounds[0]
    }
    if (p > bounds[1]) {
      rtn = bounds[1]
    }

    return rtn
  }

  render() {
    const node = this.props.node
    const style = node.styleWithPosition({
      cursor: this.props.node.getOrientation() === Orientation.HORZ ? 'ns-resize' : 'ew-resize',
    })

    return (
      <div
        style={style}
        onTouchStart={this.onMouseDown}
        onMouseDown={this.onMouseDown}
        className="flexlayout__splitter"
      />
    )
  }
}

export default Splitter
