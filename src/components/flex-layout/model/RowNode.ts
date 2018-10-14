// tslint:disable:no-any no-string-literal prefer-array-literal
import Rect from 'components/flex-layout/Rect'
import AttributeDefinitions from 'components/flex-layout/AttributeDefinitions'
import Orientation from 'components/flex-layout/Orientation'
import DockLocation from 'components/flex-layout/DockLocation'
import DropInfo from 'components/flex-layout/DropInfo'

import SplitterNode from 'components/flex-layout/model/SplitterNode'
import Node from 'components/flex-layout/model/Node'
import Model from 'components/flex-layout/model/Model'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import IDropTarget from 'components/flex-layout/model/IDropTarget'
import IDraggable from 'components/flex-layout/model/IDraggable'

class RowNode extends Node implements IDropTarget {
  static readonly TYPE = 'row'
  /** @hidden @internal */
  private static attributeDefinitions = RowNode.createAttributeDefinitions()
  /** @hidden @internal */
  private static createAttributeDefinitions() {
    const attributeDefinitions = new AttributeDefinitions()
    attributeDefinitions.add('type', RowNode.TYPE, true)
    attributeDefinitions.add('id', undefined)

    attributeDefinitions.add('weight', 100)
    attributeDefinitions.add('width', undefined)
    attributeDefinitions.add('height', undefined)

    return attributeDefinitions
  }
  /** @hidden @internal */
  private drawChildren: Node[]

  /** @hidden @internal */
  constructor(model: Model, json: any) {
    super(model)

    this.dirty = true
    this.drawChildren = []
    RowNode.attributeDefinitions.fromJson(json, this.attributes)
    model.addNode(this)
  }

  getWeight() {
    return this.attributes['weight'] as number
  }

  getWidth() {
    return this.getAttributeAsNumberOrUndefined('width')
  }

  getHeight() {
    return this.getAttributeAsNumberOrUndefined('height')
  }

  /** @hidden @internal */
  setWeight(weight: number) {
    this.attributes['weight'] = weight
  }

  /** @hidden @internal */
  layout(rect: Rect) {
    super.layout(rect)

    const pixelSize = this.rect.getSize(this.getOrientation())

    let totalWeight = 0
    let fixedPixels = 0
    let prefPixels = 0
    let totalPrefWeight = 0
    const drawChildren = this.getDrawChildren() as Array<RowNode | TabSetNode | SplitterNode>

    for (const child of drawChildren) {
      const prefSize = child.getPrefSize(this.getOrientation())
      if (child.isFixed()) {
        if (prefSize !== undefined) {
          fixedPixels += prefSize
        }
      } else {
        if (prefSize === undefined) {
          totalWeight += child.getWeight()
        } else {
          prefPixels += prefSize
          totalPrefWeight += child.getWeight()
        }
      }
    }

    let resizePreferred = false
    let availablePixels = pixelSize - fixedPixels - prefPixels
    if (availablePixels < 0) {
      availablePixels = pixelSize - fixedPixels
      resizePreferred = true
      totalWeight += totalPrefWeight
    }

    // assign actual pixel sizes
    let totalSizeGiven = 0
    let variableSize = 0
    for (const child of drawChildren) {
      const prefSize = child.getPrefSize(this.getOrientation())
      if (child.isFixed()) {
        if (prefSize !== undefined) {
          child.setTempSize(prefSize)
        }
      } else {
        if (prefSize === undefined || resizePreferred) {
          if (totalWeight === 0) {
            child.setTempSize(0)
          } else {
            child.setTempSize(Math.floor(availablePixels * (child.getWeight() / totalWeight)))
          }
          variableSize += child.getTempSize()
        } else {
          child.setTempSize(prefSize)
        }
      }

      totalSizeGiven += child.getTempSize()
    }

    // adjust sizes to exactly fit
    if (variableSize > 0) {
      while (totalSizeGiven < pixelSize) {
        for (const child of drawChildren) {
          const prefSize = child.getPrefSize(this.getOrientation())
          if (
            !child.isFixed() &&
            (prefSize === undefined || resizePreferred) &&
            totalSizeGiven < pixelSize
          ) {
            child.setTempSize(child.getTempSize() + 1)
            totalSizeGiven += 1
          }
        }
      }
    }

    // layout children
    let p = 0
    for (const child of drawChildren) {
      if (this.getOrientation() === Orientation.HORZ) {
        child.layout(new Rect(this.rect.x + p, this.rect.y, child.getTempSize(), this.rect.height))
      } else {
        child.layout(new Rect(this.rect.x, this.rect.y + p, this.rect.width, child.getTempSize()))
      }
      p += child.getTempSize()
    }

    return true
  }

  /** @hidden @internal */
  getSplitterBounds(splitterNode: SplitterNode) {
    const pBounds = [0, 0]
    const drawChildren = this.getDrawChildren() as Array<RowNode | TabSetNode | SplitterNode>
    const p = drawChildren.indexOf(splitterNode)
    if (this.getOrientation() === Orientation.HORZ) {
      pBounds[0] = drawChildren[p - 1].getRect().x
      pBounds[1] = drawChildren[p + 1].getRect().getRight() - splitterNode.getWidth()
    } else {
      pBounds[0] = drawChildren[p - 1].getRect().y
      pBounds[1] = drawChildren[p + 1].getRect().getBottom() - splitterNode.getHeight()
    }
    return pBounds
  }

  /** @hidden @internal */
  calculateSplit(splitter: SplitterNode, splitterPos: number) {
    let rtn
    const drawChildren = this.getDrawChildren() as Array<RowNode | TabSetNode | SplitterNode>
    const p = drawChildren.indexOf(splitter)
    const pBounds = this.getSplitterBounds(splitter)

    const weightedLength = drawChildren[p - 1].getWeight() + drawChildren[p + 1].getWeight()

    const pixelWidth1 = Math.max(0, splitterPos - pBounds[0])
    const pixelWidth2 = Math.max(0, pBounds[1] - splitterPos)

    if (pixelWidth1 + pixelWidth2 > 0) {
      const weight1 = (pixelWidth1 * weightedLength) / (pixelWidth1 + pixelWidth2)
      const weight2 = (pixelWidth2 * weightedLength) / (pixelWidth1 + pixelWidth2)

      rtn = {
        weight1,
        weight2,
        pixelWidth1,
        pixelWidth2,
        node1Id: drawChildren[p - 1].getId(),
        node2Id: drawChildren[p + 1].getId(),
      }
    }

    return rtn
  }

  /** @hidden @internal */
  getDrawChildren() {
    if (this.dirty) {
      this.drawChildren = []

      for (let i = 0; i < this.children.length; i += 1) {
        const child = this.children[i] as RowNode | TabSetNode
        if (i !== 0) {
          const newSplitter = new SplitterNode(this.model)
          newSplitter.setParent(this)
          this.drawChildren.push(newSplitter)
        }
        this.drawChildren.push(child)
      }
      this.dirty = false
    }

    return this.drawChildren
  }

  /** @hidden @internal */
  tidy() {
    // console.log("a", this._model.toString());
    let i = 0
    while (i < this.children.length) {
      const child = this.children[i]
      if (child instanceof RowNode) {
        child.tidy()

        const childChildren = child.getChildren()
        if (childChildren.length === 0) {
          this.removeChild(child)
        } else if (childChildren.length === 1) {
          // hoist child/children up to this level
          const subchild = childChildren[0]
          this.removeChild(child)
          if (subchild instanceof RowNode) {
            let subChildrenTotal = 0
            const subChildChildren = subchild.getChildren()
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < subChildChildren.length; j += 1) {
              const subsubChild = subChildChildren[j] as RowNode | TabSetNode
              subChildrenTotal += subsubChild.getWeight()
            }
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < subChildChildren.length; j += 1) {
              const subsubChild = subChildChildren[j] as RowNode | TabSetNode
              subsubChild.setWeight(
                (child.getWeight() * subsubChild.getWeight()) / subChildrenTotal
              )
              this.addChild(subsubChild, i + j)
            }
          } else {
            subchild.setWeight(child.getWeight())
            this.addChild(subchild, i)
          }
        } else {
          i += 1
        }
      } else if (child instanceof TabSetNode && child.getChildren().length === 0) {
        if (child.isEnableDeleteWhenEmpty()) {
          this.removeChild(child)
        } else {
          i += 1
        }
      } else {
        i += 1
      }
    }

    // add tabset into empty root
    if (this === this.model.getRoot() && this.children.length === 0) {
      const child = new TabSetNode(this.model, { type: 'tabset' })
      this.addChild(child)
    }
    // console.log("b", this._model.toString());
  }

  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    const yy = y - this.rect.y
    const xx = x - this.rect.x
    const w = this.rect.width
    const h = this.rect.height
    const margin = 10 // height of edge rect
    const half = 50 // half width of edge rect
    let dropInfo

    if (this.model.isEnableEdgeDock() && this.parent === undefined) {
      // _root row
      if (x < this.rect.x + margin && (yy > h / 2 - half && yy < h / 2 + half)) {
        const dockLocation = DockLocation.LEFT
        const outlineRect = dockLocation.getDockRect(this.rect)
        outlineRect.width = outlineRect.width / 2
        dropInfo = new DropInfo(
          this,
          outlineRect,
          dockLocation,
          -1,
          'flexlayout__outline_rect_edge'
        )
      } else if (x > this.rect.getRight() - margin && (yy > h / 2 - half && yy < h / 2 + half)) {
        const dockLocation = DockLocation.RIGHT
        const outlineRect = dockLocation.getDockRect(this.rect)
        outlineRect.width = outlineRect.width / 2
        outlineRect.x += outlineRect.width
        dropInfo = new DropInfo(
          this,
          outlineRect,
          dockLocation,
          -1,
          'flexlayout__outline_rect_edge'
        )
      } else if (y < this.rect.y + margin && (xx > w / 2 - half && xx < w / 2 + half)) {
        const dockLocation = DockLocation.TOP
        const outlineRect = dockLocation.getDockRect(this.rect)
        outlineRect.height = outlineRect.height / 2
        dropInfo = new DropInfo(
          this,
          outlineRect,
          dockLocation,
          -1,
          'flexlayout__outline_rect_edge'
        )
      } else if (y > this.rect.getBottom() - margin && (xx > w / 2 - half && xx < w / 2 + half)) {
        const dockLocation = DockLocation.BOTTOM
        const outlineRect = dockLocation.getDockRect(this.rect)
        outlineRect.height = outlineRect.height / 2
        outlineRect.y += outlineRect.height
        dropInfo = new DropInfo(
          this,
          outlineRect,
          dockLocation,
          -1,
          'flexlayout__outline_rect_edge'
        )
      }

      if (dropInfo !== undefined) {
        if (!dragNode.canDockInto(dragNode, dropInfo)) {
          return undefined
        }
      }
    }

    return dropInfo
  }

  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number): void {
    const dockLocation = location
    const parent = dragNode.getParent()

    if (parent) {
      parent.removeChild(dragNode)
    }

    if (parent !== undefined && parent!.getType() === TabSetNode.TYPE) {
      parent.setSelected(0)
    }

    let tabSet: TabSetNode | undefined
    if (dragNode instanceof TabSetNode) {
      tabSet = dragNode
    } else {
      tabSet = new TabSetNode(this.model, {})
      tabSet.addChild(dragNode)
    }
    let size = this.children.reduce(
      (sum, child) => sum + (child as RowNode | TabSetNode).getWeight(),
      0
    )

    if (size === 0) {
      size = 100
    }

    tabSet.setWeight(size / 3)

    if (dockLocation === DockLocation.LEFT) {
      this.addChild(tabSet, 0)
    } else if (dockLocation === DockLocation.RIGHT) {
      this.addChild(tabSet)
    } else if (dockLocation === DockLocation.TOP) {
      const vrow = new RowNode(this.model, {})
      const hrow = new RowNode(this.model, {})
      hrow.setWeight(75)
      tabSet.setWeight(25)
      this.children.forEach(child => {
        hrow.addChild(child)
      })
      this.removeAll()
      vrow.addChild(tabSet)
      vrow.addChild(hrow)
      this.addChild(vrow)
    } else if (dockLocation === DockLocation.BOTTOM) {
      const vrow = new RowNode(this.model, {})
      const hrow = new RowNode(this.model, {})
      hrow.setWeight(75)
      tabSet.setWeight(25)
      this.children.forEach(child => {
        hrow.addChild(child)
      })
      this.removeAll()
      vrow.addChild(hrow)
      vrow.addChild(tabSet)
      this.addChild(vrow)
    }

    this.model.setActiveTabset(tabSet)

    this.model.tidy()
  }

  /** @hidden @internal */
  toJson() {
    const json: any = {}
    RowNode.attributeDefinitions.toJson(json, this.attributes)

    json.children = []
    this.children.forEach(child => {
      json.children.push(child.toJson())
    })

    return json
  }

  /** @hidden @internal */
  // tslint:disable-next-line
  static _fromJson(json: any, model: Model) {
    const newLayoutNode = new RowNode(model, json)

    if (json.children !== undefined) {
      for (const jsonChild of json.children) {
        if (jsonChild.type === TabSetNode.TYPE) {
          const child = TabSetNode.fromJson(jsonChild, model)
          newLayoutNode.addChild(child)
        } else {
          const child = RowNode._fromJson(jsonChild, model)
          newLayoutNode.addChild(child)
        }
      }
    }
    return newLayoutNode
  }

  isEnableDrop() {
    return true
  }

  /** @hidden @internal */
  getPrefSize(orientation: Orientation) {
    let prefSize = this.getWidth()
    if (orientation === Orientation.VERT) {
      prefSize = this.getHeight()
    }
    return prefSize
  }

  /** @hidden @internal */
  getAttributeDefinitions() {
    return RowNode.attributeDefinitions
  }

  /** @hidden @internal */
  updateAttrs(json: any) {
    RowNode.attributeDefinitions.update(json, this.attributes)
  }
}

export default RowNode
