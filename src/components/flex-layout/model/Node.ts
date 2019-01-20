// tslint:disable:no-any no-string-literal no-parameter-reassignment
import Rect from 'src/components/flex-layout/lib/Rect'
import AttributeDefinitions from 'src/components/flex-layout/lib/AttributeDefinitions'
import Orientation from 'src/components/flex-layout/lib/Orientation'
import DockLocation from 'src/components/flex-layout/lib/DockLocation'
import DropInfo from 'src/components/flex-layout/lib/DropInfo'
import { JSMap } from 'src/components/flex-layout/lib/Types'

import Model from 'src/components/flex-layout/model/Model'
import IDraggable from 'src/components/flex-layout/model/IDraggable'

abstract class Node {
  /** @hidden @internal */
  protected model: Model
  /** @hidden @internal */
  protected attributes: JSMap<any>
  /** @hidden @internal */
  protected parent?: Node
  /** @hidden @internal */
  protected children: Node[]
  /** @hidden @internal */
  protected fixed: boolean
  /** @hidden @internal */
  protected rect: Rect
  /** @hidden @internal */
  protected visible: boolean
  /** @hidden @internal */
  protected listeners: JSMap<(params: any) => void>
  /** @hidden @internal */
  protected dirty: boolean = false
  /** @hidden @internal */
  protected tempSize: number = 0

  /** @hidden @internal */
  protected constructor(model: Model) {
    this.model = model
    this.attributes = {}
    this.children = []
    this.fixed = false
    this.rect = new Rect(0, 0, 0, 0)
    this.visible = false
    this.listeners = {}
  }
  // implemented by subclasses
  /** @hidden @internal */
  abstract updateAttrs(json: any): void
  /** @hidden @internal */
  abstract getAttributeDefinitions(): AttributeDefinitions
  /** @hidden @internal */
  abstract toJson(): any

  getId() {
    let id = this.attributes['id']
    if (id !== undefined) {
      return id as string
    }

    id = this.model.nextUniqueId()
    this.setId(id)

    return id as string
  }

  getModel() {
    return this.model
  }

  getType() {
    return this.attributes['type'] as string
  }

  getParent() {
    return this.parent
  }

  getChildren() {
    return this.children
  }

  getRect() {
    return this.rect
  }

  isVisible() {
    return this.visible
  }

  getOrientation(): Orientation {
    if (this.parent === undefined) {
      return Orientation.HORZ
    }
    return Orientation.flip(this.parent.getOrientation())
  }

  // event can be: resize, visibility, maximize (on tabset), close
  setEventListener(event: string, callback: (params: any) => void) {
    this.listeners[event] = callback
  }

  removeEventListener(event: string) {
    delete this.listeners[event]
  }

  /** @hidden @internal */
  setId(id: string) {
    this.attributes['id'] = id
  }

  /** @hidden @internal */
  fireEvent(event: string, params: any) {
    // console.log(this._type, " fireEvent " + event + " " + JSON.stringify(params));
    if (this.listeners[event] !== undefined) {
      this.listeners[event](params)
    }
  }

  /** @hidden @internal */
  getAttr(name: string) {
    let val = this.attributes[name]

    if (val === undefined) {
      const modelName = this.getAttributeDefinitions().getModelName(name)
      if (modelName !== undefined) {
        val = this.model.getAttribute(modelName)
      }
    }
    // console.log(name + "=" + val);
    return val
  }

  /** @hidden @internal */
  forEachNode(fn: (node: Node, level: number) => void, level: number) {
    fn(this, level)
    level += 1
    this.children.forEach(node => {
      node.forEachNode(fn, level)
    })
  }

  /** @hidden @internal */
  setVisible(visible: boolean) {
    if (visible !== this.visible) {
      this.fireEvent('visibility', { visible })
      this.visible = visible
    }
  }

  /** @hidden @internal */
  setParent(parent: Node) {
    this.parent = parent
  }

  /** @hidden @internal */
  setRect(rect: Rect) {
    this.rect = rect
  }

  /** @hidden @internal */
  setWeight(weight: number) {
    this.attributes['weight'] = weight
  }

  /** @hidden @internal */
  setSelected(index: number) {
    this.attributes['selected'] = index
  }

  /** @hidden @internal */
  isFixed() {
    return this.fixed
  }

  /** @hidden @internal */
  layout(rect: Rect) {
    this.rect = rect
  }

  /** @hidden @internal */
  findDropTargetNode(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    let rtn: DropInfo | undefined
    if (this.rect.contains(x, y)) {
      rtn = this.canDrop(dragNode, x, y)
      if (rtn === undefined) {
        if (this.children.length !== 0) {
          for (const child of this.children) {
            rtn = child.findDropTargetNode(dragNode, x, y)
            if (rtn !== undefined) {
              break
            }
          }
        }
      }
    }

    return rtn
  }

  /** @hidden @internal */
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    return undefined
  }

  /** @hidden @internal */
  canDockInto(dragNode: Node & IDraggable, dropInfo: DropInfo | undefined): boolean {
    if (dropInfo !== undefined) {
      if (dropInfo.location === DockLocation.CENTER && !dropInfo.node.isEnableDrop()) {
        return false
      }

      // prevent named tabset docking into another tabset, since this would lose the header
      if (
        dropInfo.location === DockLocation.CENTER &&
        dragNode.getType() === 'tabset' &&
        dragNode.getName() !== undefined
      ) {
        return false
      }

      if (dropInfo.location !== DockLocation.CENTER && !dropInfo.node.isEnableDivide()) {
        return false
      }

      // finally check model callback to check if drop allowed
      if (this.model.getOnAllowDrop()) {
        return (this.model.getOnAllowDrop() as (dragNode: Node, dropInfo: DropInfo) => boolean)(
          dragNode,
          dropInfo
        )
      }
    }
    return true
  }

  /** @hidden @internal */
  removeChild(childNode: Node) {
    const pos = this.children.indexOf(childNode)
    if (pos !== -1) {
      this.children.splice(pos, 1)
    }
    this.dirty = true
    return pos
  }

  /** @hidden @internal */
  addChild(childNode: Node, pos?: number) {
    if (pos !== undefined) {
      this.children.splice(pos, 0, childNode)
    } else {
      this.children.push(childNode)
      pos = this.children.length - 1
    }
    childNode.parent = this
    this.dirty = true
    return pos
  }

  /** @hidden @internal */
  removeAll() {
    this.children = []
    this.dirty = true
  }

  /** @hidden @internal */
  styleWithPosition(style?: JSMap<any>) {
    if (style === undefined) {
      style = {}
    }
    return this.rect.styleWithPosition(style)
  }

  /** @hidden @internal */
  getTempSize() {
    return this.tempSize
  }

  /** @hidden @internal */
  setTempSize(value: number) {
    this.tempSize = value
  }

  /** @hidden @internal */
  isEnableDivide() {
    return true
  }

  /** @hidden @internal */
  getDrawChildren(): Node[] | undefined {
    return this.children
  }

  /** @hidden @internal */
  toAttributeString() {
    return JSON.stringify(this.attributes, undefined, '\t')
  }

  /** @hidden @internal */
  protected getAttributeAsStringOrUndefined(attr: string) {
    const value = this.attributes[attr]
    if (value !== undefined) {
      return value as string
    }
    return undefined
  }

  /** @hidden @internal */
  protected getAttributeAsNumberOrUndefined(attr: string) {
    const value = this.attributes[attr]
    if (value !== undefined) {
      return value as number
    }
    return undefined
  }
}

export default Node
