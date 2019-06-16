import Node from 'anti/flex-layout/model/Node'
import IDraggable from 'anti/flex-layout/model/IDraggable'
import DropInfo from 'anti/flex-layout/lib/DropInfo'
import DockLocation from 'anti/flex-layout/lib/DockLocation'

export default interface IDropTarget {
  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined
  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number): void
  /** @hidden @internal */
  isEnableDrop(): boolean
}
