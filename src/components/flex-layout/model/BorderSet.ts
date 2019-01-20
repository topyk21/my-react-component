// tslint:disable:no-any
import Rect from 'src/components/flex-layout/lib/Rect'
import Orientation from 'src/components/flex-layout/lib/Orientation'
import DropInfo from 'src/components/flex-layout/lib/DropInfo'

import Model from 'src/components/flex-layout/model/Model'
import BorderNode from 'src/components/flex-layout/model/BorderNode'
import Node from 'src/components/flex-layout/model/Node'
import IDraggable from 'src/components/flex-layout/model/IDraggable'

class BorderSet {
  /** @hidden @internal */
  static fromJson(json: any, model: Model) {
    const borderSet = new BorderSet(model)
    borderSet.borders = json.map((borderJson: any) => BorderNode.fromJson(borderJson, model))
    return borderSet
  }
  /** @hidden @internal */
  private model: Model
  /** @hidden @internal */
  private borders: BorderNode[]

  /** @hidden @internal */
  constructor(model: Model) {
    this.model = model
    this.borders = []
  }

  getBorders() {
    return this.borders
  }

  /** @hidden @internal */
  forEachNode(fn: (node: Node, level: number) => void) {
    this.borders.forEach(borderNode => {
      fn(borderNode, 0)
      borderNode.getChildren().forEach(node => {
        node.forEachNode(fn, 1)
      })
    })
  }

  /** @hidden @internal */
  toJson() {
    return this.borders.map(borderNode => borderNode.toJson())
  }

  /** @hidden @internal */
  layoutBorder(outerInnerRects: { inner: Rect; outer: Rect }) {
    const rect = outerInnerRects.outer
    const height = rect.height
    const width = rect.width
    let sumHeight = 0
    let sumWidth = 0
    let adjustableHeight = 0
    let adjustableWidth = 0

    const showingBorders = this.borders.filter(border => border.isShowing())

    // sum size of borders to see they will fit
    for (const border of showingBorders) {
      if (border.isShowing()) {
        border.setAdjustedSize(border.getSize())
        const visible = border.getSelected() !== -1
        if (border.getLocation().getOrientation() === Orientation.HORZ) {
          sumWidth += border.getBorderBarSize() + this.model.getSplitterSize()
          if (visible) {
            sumWidth += border.getSize()
            adjustableWidth += border.getSize()
          }
        } else {
          sumHeight += border.getBorderBarSize() + this.model.getSplitterSize()
          if (visible) {
            sumHeight += border.getSize()
            adjustableHeight += border.getSize()
          }
        }
      }
    }

    // adjust border sizes if too large
    let i = 0
    while (
      (sumWidth > width && adjustableWidth > 0) ||
      (sumHeight > height && adjustableHeight > 0)
    ) {
      const border = showingBorders[i]
      if (border.getSelected() !== -1) {
        // visible
        const size = border.getAdjustedSize()
        if (
          sumWidth > width &&
          adjustableWidth > 0 &&
          border.getLocation().getOrientation() === Orientation.HORZ &&
          size > 0
        ) {
          border.setAdjustedSize(size - 1)
          sumWidth -= 1
          adjustableWidth -= 1
        } else if (
          sumHeight > height &&
          adjustableHeight > 0 &&
          border.getLocation().getOrientation() === Orientation.VERT &&
          size > 0
        ) {
          border.setAdjustedSize(size - 1)
          sumHeight -= 1
          adjustableHeight -= 1
        }
      }
      i = (i + 1) % showingBorders.length
    }

    showingBorders.forEach(border => {
      outerInnerRects.outer = border.layoutBorderOuter(outerInnerRects.outer)
    })

    outerInnerRects.inner = outerInnerRects.outer

    showingBorders.forEach(border => {
      outerInnerRects.inner = border.layoutBorderInner(outerInnerRects.inner)
    })
    return outerInnerRects
  }

  /** @hidden @internal */
  findDropTargetNode(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    for (const border of this.borders) {
      if (border.isShowing()) {
        const dropInfo = border.canDrop(dragNode, x, y)
        if (dropInfo !== undefined) {
          return dropInfo
        }
      }
    }
    return undefined
  }
}

export default BorderSet
