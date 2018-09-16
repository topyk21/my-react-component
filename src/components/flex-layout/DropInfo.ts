import Rect from 'components/flex-layout/Rect'
import Node from 'components/flex-layout/model/Node'
import DockLocation from 'components/flex-layout/DockLocation'
import IDropTarget from 'components/flex-layout/model/IDropTarget'

class DropInfo {
  node: Node & IDropTarget
  rect: Rect
  location: DockLocation
  index: number
  className: string

  constructor(
    node: Node & IDropTarget,
    rect: Rect,
    location: DockLocation,
    index: number,
    className: string
  ) {
    this.node = node
    this.rect = rect
    this.location = location
    this.index = index
    this.className = className
  }
}
export default DropInfo
