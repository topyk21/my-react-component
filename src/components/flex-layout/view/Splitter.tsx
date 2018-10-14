// tslint:disable:no-any
import * as React from 'react'
import styled from 'styled-components'

import DragDrop from 'components/flex-layout/DragDrop'
import Orientation from 'components/flex-layout/Orientation'
import Actions from 'components/flex-layout/model/Actions'
import SplitterNode from 'components/flex-layout/model/SplitterNode'
import RowNode from 'components/flex-layout/model/RowNode'
import Layout from 'components/flex-layout/view/Layout'

/** @hidden @internal */
export interface ISplitterProps {
  node: SplitterNode
  layout: Layout
  layoutRef: React.RefObject<HTMLDivElement>
}
/** @hidden @internal */
export interface ISplitterState {
  isDragging: boolean
}
/** @hidden @internal */
const StaticSplitter = styled<{ isHorizontal: boolean }, 'div'>('div')`
  background-color: #ddd;
  cursor: ${props => (props.isHorizontal ? 'ns-resize' : 'ew-resize')};
  &:hover {
    background-color: #ccc;
  }
`
/** @hidden @internal */
// const DraggingSplitter = styled.div`
//   position: absolute;
//   background-color: #2196F3;
//   border-radius: 5px;
//   z-index: 1000;
// `;
/** @hidden @internal */
class Splitter extends React.Component<ISplitterProps, ISplitterState> {
  pBounds?: number[]
  outlineDiv?: HTMLDivElement

  constructor(props: ISplitterProps) {
    super(props)
    this.state = {
      isDragging: false,
    }
  }

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
    const rootdiv = this.props.layoutRef.current!
    this.pBounds = parentNode.getSplitterBounds(this.props.node)
    this.outlineDiv = document.createElement('div')
    this.outlineDiv.style.position = 'absolute'
    this.outlineDiv.style.backgroundColor = '#2196F3'
    this.outlineDiv.style.borderRadius = '5px'
    this.outlineDiv.style.zIndex = '1000'
    this.outlineDiv.style.cursor =
      this.props.node.getOrientation() === Orientation.HORZ ? 'ns-resize' : 'ew-resize'
    this.props.node.getRect().positionElement(this.outlineDiv)
    rootdiv.appendChild(this.outlineDiv)
  }

  onDragCancel = () => {
    const rootdiv = this.props.layoutRef.current!
    rootdiv.removeChild(this.outlineDiv as Element)
  }

  onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    return true
  }

  onDragMove = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const clientRect = this.props.layoutRef.current!.getBoundingClientRect()
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

    const splitSpec = parentNode.calculateSplit(this.props.node, value)
    if (splitSpec !== undefined) {
      this.props.layout.doAction(Actions.adjustSplit(splitSpec))
    }

    const rootdiv = this.props.layoutRef.current!
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
    const isHorizontal = this.props.node.getOrientation() === Orientation.HORZ
    const style = node.styleWithPosition()

    return (
      <StaticSplitter
        style={style}
        isHorizontal={isHorizontal}
        onTouchStart={this.onMouseDown}
        onMouseDown={this.onMouseDown}
      />
    )
  }
}

export default Splitter
