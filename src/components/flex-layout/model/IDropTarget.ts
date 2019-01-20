import Node from 'src/components/flex-layout/model/Node'
import IDraggable from 'src/components/flex-layout/model/IDraggable'
import DropInfo from 'src/components/flex-layout/lib/DropInfo'
import DockLocation from 'src/components/flex-layout/lib/DockLocation'

export default interface IDropTarget {
  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined
  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number): void
  /** @hidden @internal */
  isEnableDrop(): boolean
}
