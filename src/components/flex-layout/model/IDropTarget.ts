import DropInfo from 'components/flex-layout/DropInfo'
import DockLocation from 'components/flex-layout/DockLocation'

import Node from 'components/flex-layout/model/Node'
import IDraggable from 'components/flex-layout/model/IDraggable'

export default interface IDropTarget {
  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined
  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number): void
  /** @hidden @internal */
  isEnableDrop(): boolean
}
