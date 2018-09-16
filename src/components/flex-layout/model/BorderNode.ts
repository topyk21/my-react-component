// tslint:disable:no-any no-string-literal no-parameter-reassignment
import Rect from 'components/flex-layout/Rect'
import DockLocation from 'components/flex-layout/DockLocation'
import Orientation from 'components/flex-layout/Orientation'
import DropInfo from 'components/flex-layout/DropInfo'
import Attribute from 'components/flex-layout/Attribute'
import AttributeDefinitions from 'components/flex-layout/AttributeDefinitions'

import Node from 'components/flex-layout/model/Node'
import Model from 'components/flex-layout/model/Model'
import TabNode from 'components/flex-layout/model/TabNode'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import SplitterNode from 'components/flex-layout/model/SplitterNode'
import IDropTarget from 'components/flex-layout/model/IDropTarget'
import IDraggable from 'components/flex-layout/model/IDraggable'

class BorderNode extends Node implements IDropTarget {
  static readonly TYPE = 'border'
  /** @hidden @internal */
  private static attributeDefinitions = BorderNode.createAttributeDefinitions()
  /** @hidden @internal */
  private static createAttributeDefinitions() {
    const attributeDefinitions = new AttributeDefinitions()
    attributeDefinitions.add('type', BorderNode.TYPE, true)

    attributeDefinitions.add('size', 200)
    attributeDefinitions.add('selected', -1)
    attributeDefinitions.add('show', true).setType(Attribute.BOOLEAN)

    attributeDefinitions
      .addInherited('barSize', 'borderBarSize')
      .setType(Attribute.INT)
      .setFrom(0)
    attributeDefinitions.addInherited('enableDrop', 'borderEnableDrop').setType(Attribute.BOOLEAN)
    attributeDefinitions.addInherited('className', 'borderClassName').setType(Attribute.STRING)
    return attributeDefinitions
  }
  /** @hidden @internal */
  private contentRect?: Rect
  /** @hidden @internal */
  private tabHeaderRect?: Rect
  /** @hidden @internal */
  private location: DockLocation
  /** @hidden @internal */
  private drawChildren: Node[]
  /** @hidden @internal */
  private adjustedSize: number = 0

  /** @hidden @internal */
  constructor(location: DockLocation, json: any, model: Model) {
    super(model)

    this.location = location
    this.drawChildren = []
    this.attributes['id'] = `border_${location.getName()}`
    BorderNode.attributeDefinitions.fromJson(json, this.attributes)
    model.addNode(this)
  }

  getLocation() {
    return this.location
  }

  getTabHeaderRect() {
    return this.tabHeaderRect
  }

  getContentRect() {
    return this.contentRect
  }

  isEnableDrop() {
    return this.getAttr('enableDrop') as boolean
  }

  getClassName() {
    return this.getAttributeAsStringOrUndefined('className')
  }

  getBorderBarSize() {
    return this.getAttr('barSize') as number
  }

  getSize() {
    return this.attributes['size'] as number
  }

  getSelected(): number {
    return this.attributes['selected'] as number
  }

  getSelectedNode(): Node | undefined {
    if (this.getSelected() !== -1) {
      return this.children[this.getSelected()]
    }
    return undefined
  }

  getOrientation() {
    return this.location.getOrientation()
  }

  isMaximized() {
    return false
  }

  isShowing() {
    return this.attributes['show'] as boolean
  }

  /** @hidden @internal */
  setSelected(index: number) {
    this.attributes['selected'] = index
  }

  /** @hidden @internal */
  setSize(pos: number) {
    this.attributes['size'] = pos
  }

  /** @hidden @internal */
  updateAttrs(json: any) {
    BorderNode.attributeDefinitions.update(json, this.attributes)
  }

  /** @hidden @internal */
  getDrawChildren() {
    return this.drawChildren
  }

  /** @hidden @internal */
  setAdjustedSize(size: number) {
    this.adjustedSize = size
  }

  /** @hidden @internal */
  getAdjustedSize() {
    return this.adjustedSize
  }

  /** @hidden @internal */
  layoutBorderOuter(outer: Rect) {
    const split1 = this.location.split(outer, this.getBorderBarSize()) // split border outer
    this.tabHeaderRect = split1.start
    return split1.end
  }

  /** @hidden @internal */
  layoutBorderInner(inner: Rect) {
    this.drawChildren = []
    const location = this.location

    // split off tab contents
    const split1 = location.split(inner, this.adjustedSize + this.model.getSplitterSize())
    // split contents into content and splitter
    const split2 = location.reflect().split(split1.start, this.model.getSplitterSize())

    this.contentRect = split2.end

    this.children.forEach((child, i) => {
      child.layout(this.contentRect!)
      child.setVisible(i === this.getSelected())
      this.drawChildren.push(child)
    })

    if (this.getSelected() === -1) {
      return inner
    }
    const newSplitter = new SplitterNode(this.model)
    newSplitter.setParent(this)
    newSplitter.setRect(split2.start)
    this.drawChildren.push(newSplitter)

    return split1.end
  }

  /** @hidden @internal */
  remove(node: TabNode) {
    if (this.getSelected() !== -1) {
      const selectedNode = this.children[this.getSelected()]
      if (node === selectedNode) {
        this.setSelected(-1)
        this.removeChild(node)
      } else {
        this.removeChild(node)
        for (let i = 0; i < this.children.length; i += 1) {
          if (this.children[i] === selectedNode) {
            this.setSelected(i)
            break
          }
        }
      }
    } else {
      this.removeChild(node)
    }
  }

  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    if (dragNode.getType() !== TabNode.TYPE) {
      return undefined
    }

    let dropInfo
    const dockLocation = DockLocation.CENTER

    if (this.tabHeaderRect!.contains(x, y)) {
      if (this.location.orientation === Orientation.VERT) {
        if (this.children.length > 0) {
          let child = this.children[0]
          let childRect = (child as TabNode).getTabRect()!
          const childY = childRect.y
          const childHeight = childRect.height

          let pos = this.tabHeaderRect!.x
          let childCenter = 0
          for (let i = 0; i < this.children.length; i += 1) {
            child = this.children[i]
            childRect = (child as TabNode).getTabRect()!
            childCenter = childRect.x + childRect.width / 2
            if (x >= pos && x < childCenter) {
              const outlineRect = new Rect(childRect.x - 2, childY, 3, childHeight)
              dropInfo = new DropInfo(
                this,
                outlineRect,
                dockLocation,
                i,
                'flexlayout__outline_rect'
              )
              break
            }
            pos = childCenter
          }
          if (dropInfo === undefined) {
            const outlineRect = new Rect(childRect.getRight() - 2, childY, 3, childHeight)
            dropInfo = new DropInfo(
              this,
              outlineRect,
              dockLocation,
              this.children.length,
              'flexlayout__outline_rect'
            )
          }
        } else {
          const outlineRect = new Rect(this.tabHeaderRect!.x + 1, this.tabHeaderRect!.y + 2, 3, 18)
          dropInfo = new DropInfo(this, outlineRect, dockLocation, 0, 'flexlayout__outline_rect')
        }
      } else {
        if (this.children.length > 0) {
          let child = this.children[0]
          let childRect = (child as TabNode).getTabRect()!
          let pos = this.tabHeaderRect!.y
          let childCenter = 0
          const childX = childRect.x
          const childWidth = childRect.width
          for (let i = 0; i < this.children.length; i += 1) {
            child = this.children[i]
            childRect = (child as TabNode).getTabRect()!
            childCenter = childRect.y + childRect.height / 2
            if (y >= pos && y < childCenter) {
              const outlineRect = new Rect(childX, childRect.y - 2, childWidth, 3)
              dropInfo = new DropInfo(
                this,
                outlineRect,
                dockLocation,
                i,
                'flexlayout__outline_rect'
              )
              break
            }
            pos = childCenter
          }
          if (dropInfo === undefined) {
            const outlineRect = new Rect(childX, childRect.getBottom() - 2, childWidth, 3)
            dropInfo = new DropInfo(
              this,
              outlineRect,
              dockLocation,
              this.children.length,
              'flexlayout__outline_rect'
            )
          }
        } else {
          const outlineRect = new Rect(this.tabHeaderRect!.x + 2, this.tabHeaderRect!.y + 1, 18, 3)
          dropInfo = new DropInfo(this, outlineRect, dockLocation, 0, 'flexlayout__outline_rect')
        }
      }
      if (!dragNode.canDockInto(dragNode, dropInfo)) {
        return undefined
      }
    } else if (this.getSelected() !== -1 && this.contentRect!.contains(x, y)) {
      const outlineRect = this.contentRect
      dropInfo = new DropInfo(this, outlineRect!, dockLocation, -1, 'flexlayout__outline_rect')
      if (!dragNode.canDockInto(dragNode, dropInfo)) {
        return undefined
      }
    }

    return dropInfo
  }

  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number): void {
    let fromIndex = 0
    const parent: Node | undefined = dragNode.getParent()
    if (parent !== undefined) {
      fromIndex = parent.removeChild(dragNode)
    }

    // if dropping a tab back to same tabset and moving
    // to forward position then reduce insertion index
    if (dragNode.getType() === TabNode.TYPE && parent === this && fromIndex < index && index > 0) {
      index -= 1
    }

    // for the tabset/border being removed from set the selected index
    if (parent !== undefined) {
      if (parent instanceof TabSetNode) {
        parent.setSelected(0)
      } else if (parent instanceof BorderNode) {
        if (parent.getSelected() !== -1) {
          if (fromIndex === parent.getSelected() && parent.children.length > 0) {
            parent.setSelected(0)
          } else if (fromIndex < parent.getSelected()) {
            parent.setSelected(parent.getSelected() - 1)
          } else if (fromIndex > parent.getSelected()) {
            // leave selected index as is
          } else {
            parent.setSelected(-1)
          }
        }
      }
    }

    // simple_bundled dock to existing tabset
    let insertPos = index
    if (insertPos === -1) {
      insertPos = this.children.length
    }

    if (dragNode.getType() === TabNode.TYPE) {
      this.addChild(dragNode, insertPos)
    }

    if (this.getSelected() !== -1) {
      // already open
      this.setSelected(insertPos)
    }

    this.model.tidy()
  }

  /** @hidden @internal */
  toJson() {
    const json: any = {}
    BorderNode.attributeDefinitions.toJson(json, this.attributes)
    json.location = this.location.getName()
    json.children = this.children.map(child => (child as TabNode).toJson())
    return json
  }

  /** @hidden @internal */
  // tslint:disable-next-line
  static fromJson(json: any, model: Model) {
    const location = DockLocation.getByName(json.location)
    const border = new BorderNode(location, json, model)
    if (json.children) {
      border.children = json.children.map((jsonChild: any) => {
        const child = TabNode._fromJson(jsonChild, model)
        child.setParent(border)
        return child
      })
    }

    return border
  }

  /** @hidden @internal */
  getSplitterBounds(splitter: SplitterNode) {
    const pBounds = [0, 0]
    const outerRect = this.model.getOuterInnerRects().outer
    const innerRect = this.model.getOuterInnerRects().inner
    if (this.location === DockLocation.TOP) {
      pBounds[0] = outerRect.y
      pBounds[1] = innerRect.getBottom() - splitter.getHeight()
    } else if (this.location === DockLocation.LEFT) {
      pBounds[0] = outerRect.x
      pBounds[1] = innerRect.getRight() - splitter.getWidth()
    } else if (this.location === DockLocation.BOTTOM) {
      pBounds[0] = innerRect.y
      pBounds[1] = outerRect.getBottom() - splitter.getHeight()
    } else if (this.location === DockLocation.RIGHT) {
      pBounds[0] = innerRect.x
      pBounds[1] = outerRect.getRight() - splitter.getWidth()
    }
    return pBounds
  }

  /** @hidden @internal */
  calculateSplit(splitter: SplitterNode, splitterPos: number) {
    const pBounds = this.getSplitterBounds(splitter)
    if (this.location === DockLocation.BOTTOM || this.location === DockLocation.RIGHT) {
      return Math.max(0, pBounds[1] - splitterPos)
    }
    return Math.max(0, splitterPos - pBounds[0])
  }

  /** @hidden @internal */
  getAttributeDefinitions() {
    return BorderNode.attributeDefinitions
  }
}

export default BorderNode
