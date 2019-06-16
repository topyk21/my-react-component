import Rect from 'anti/flex-layout/lib/Rect'
import DockLocation from 'anti/flex-layout/lib/DockLocation'
import Node from 'anti/flex-layout/model/Node'
import IDropTarget from 'anti/flex-layout/model/IDropTarget'

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
