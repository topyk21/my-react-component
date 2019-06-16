// tslint:disable:no-any no-string-literal max-line-length no-parameter-reassignment
import Rect from 'anti/flex-layout/lib/Rect'
import AttributeDefinitions from 'anti/flex-layout/lib/AttributeDefinitions'
import Attribute from 'anti/flex-layout/lib/Attribute'
import DockLocation from 'anti/flex-layout/lib/DockLocation'
import DropInfo from 'anti/flex-layout/lib/DropInfo'
import Orientation from 'anti/flex-layout/lib/Orientation'

import Node from 'anti/flex-layout/model/Node'
import Model from 'anti/flex-layout/model/Model'
import TabNode from 'anti/flex-layout/model/TabNode'
import RowNode from 'anti/flex-layout/model/RowNode'
import BorderNode from 'anti/flex-layout/model/BorderNode'
import IDraggable from 'anti/flex-layout/model/IDraggable'
import IDropTarget from 'anti/flex-layout/model/IDropTarget'

class TabSetNode extends Node implements IDraggable, IDropTarget {
  static readonly TYPE = 'tabset'
  /** @hidden @internal */
  static fromJson(json: any, model: Model) {
    const newLayoutNode = new TabSetNode(model, json)

    if (json.children !== undefined) {
      json.children.forEach((jsonChild: any) => {
        const child = TabNode.fromJson(jsonChild, model)
        newLayoutNode.addChild(child)
      })
    }

    if (json.maximized && json.maximized === true) {
      model.setMaximizedTabset(newLayoutNode)
    }

    if (json.active && json.active === true) {
      model.setActiveTabset(newLayoutNode)
    }

    return newLayoutNode
  }
  /** @hidden @internal */
  private static attributeDefinitions: AttributeDefinitions = TabSetNode.createAttributeDefinitions()
  /** @hidden @internal */
  private static createAttributeDefinitions(): AttributeDefinitions {
    const attributeDefinitions = new AttributeDefinitions()
    attributeDefinitions.add('type', TabSetNode.TYPE, true)
    attributeDefinitions.add('id', undefined).setType(Attribute.ID)

    attributeDefinitions.add('weight', 100)
    attributeDefinitions.add('width', undefined)
    attributeDefinitions.add('height', undefined)
    attributeDefinitions.add('selected', 0)
    attributeDefinitions.add('name', undefined).setType(Attribute.STRING)

    attributeDefinitions.addInherited('enableDeleteWhenEmpty', 'tabSetEnableDeleteWhenEmpty')
    attributeDefinitions.addInherited('enableDrop', 'tabSetEnableDrop')
    attributeDefinitions.addInherited('enableDrag', 'tabSetEnableDrag')
    attributeDefinitions.addInherited('enableDivide', 'tabSetEnableDivide')
    attributeDefinitions.addInherited('enableMaximize', 'tabSetEnableMaximize')
    attributeDefinitions.addInherited('classNameTabStrip', 'tabSetClassNameTabStrip')
    attributeDefinitions.addInherited('classNameHeader', 'tabSetClassNameHeader')
    attributeDefinitions.addInherited('enableTabStrip', 'tabSetEnableTabStrip')
    attributeDefinitions.addInherited('borderInsets', 'tabSetBorderInsets')
    attributeDefinitions.addInherited('marginInsets', 'tabSetMarginInsets')

    attributeDefinitions.addInherited('headerHeight', 'tabSetHeaderHeight')
    attributeDefinitions.addInherited('tabStripHeight', 'tabSetTabStripHeight')
    return attributeDefinitions
  }

  /** @hidden @internal */
  private contentRect?: Rect
  /** @hidden @internal */
  private tabHeaderRect?: Rect

  /** @hidden @internal */
  constructor(model: Model, json: any) {
    super(model)

    TabSetNode.attributeDefinitions.fromJson(json, this.attributes)
    model.addNode(this)
  }

  getName() {
    return this.getAttributeAsStringOrUndefined('name')
  }

  getSelected() {
    const selected = this.attributes['selected']
    if (selected !== undefined) {
      return selected as number
    }
    return -1
  }

  getSelectedNode() {
    const selected = this.getSelected()
    if (selected !== -1) {
      return this.children[selected]
    }
    return undefined
  }

  getWeight(): number {
    return this.attributes['weight'] as number
  }

  getWidth() {
    return this.getAttributeAsNumberOrUndefined('width')
  }

  getHeight() {
    return this.getAttributeAsNumberOrUndefined('height')
  }

  isMaximized() {
    return this.model.getMaximizedTabset() === this
  }

  isActive() {
    return this.model.getActiveTabset() === this
  }

  isEnableDeleteWhenEmpty() {
    return this.getAttr('enableDeleteWhenEmpty') as boolean
  }

  isEnableDrop() {
    return this.getAttr('enableDrop') as boolean
  }

  isEnableDrag() {
    return this.getAttr('enableDrag') as boolean
  }

  isEnableDivide() {
    return this.getAttr('enableDivide') as boolean
  }

  isEnableMaximize() {
    return this.getAttr('enableMaximize') as boolean
  }

  isEnableTabStrip() {
    return this.getAttr('enableTabStrip') as boolean
  }

  getClassNameTabStrip() {
    return this.getAttributeAsStringOrUndefined('classNameTabStrip')
  }

  getClassNameHeader() {
    return this.getAttributeAsStringOrUndefined('classNameHeader')
  }

  getHeaderHeight() {
    return this.getAttr('headerHeight') as number
  }

  getTabStripHeight() {
    return this.getAttr('tabStripHeight') as number
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
  canDrop(dragNode: Node & IDraggable, x: number, y: number): DropInfo | undefined {
    let dropInfo

    if (dragNode === this) {
      const dockLocation = DockLocation.CENTER
      const outlineRect = this.tabHeaderRect
      dropInfo = new DropInfo(this, outlineRect!, dockLocation, -1, 'flexlayout__outline_rect')
    } else if (this.contentRect!.contains(x, y)) {
      const dockLocation = DockLocation.getLocation(this.contentRect!, x, y)
      const outlineRect = dockLocation.getDockRect(this.rect)
      dropInfo = new DropInfo(this, outlineRect, dockLocation, -1, 'flexlayout__outline_rect')
    } else if (
      this.children.length > 0 &&
      this.tabHeaderRect !== undefined &&
      this.tabHeaderRect.contains(x, y)
    ) {
      let child = this.children[0] as TabNode
      let r = child.getTabRect()!
      const yy = r.y
      const h = r.height
      let p = this.tabHeaderRect.x
      let childCenter = 0
      for (let i = 0; i < this.children.length; i += 1) {
        child = this.children[i] as TabNode
        r = child.getTabRect()!
        childCenter = r.x + r.width / 2
        if (x >= p && x < childCenter) {
          const dockLocation = DockLocation.CENTER
          const outlineRect = new Rect(r.x - 2, yy, 3, h)
          dropInfo = new DropInfo(this, outlineRect, dockLocation, i, 'flexlayout__outline_rect')
          break
        }
        p = childCenter
      }
      if (dropInfo === undefined) {
        const dockLocation = DockLocation.CENTER
        const outlineRect = new Rect(r.getRight() - 2, yy, 3, h)
        dropInfo = new DropInfo(
          this,
          outlineRect,
          dockLocation,
          this.children.length,
          'flexlayout__outline_rect'
        )
      }
    }

    if (!dragNode.canDockInto(dragNode, dropInfo)) {
      return undefined
    }

    return dropInfo
  }

  /** @hidden @internal */
  layout(rect: Rect) {
    if (this.isMaximized()) {
      rect = (this.model.getRoot() as Node).getRect()
    }

    rect = rect.removeInsets(this.getAttr('marginInsets'))
    this.rect = rect
    rect = rect.removeInsets(this.getAttr('borderInsets'))

    const showHeader = this.getName() !== undefined
    let y = 0
    if (showHeader) {
      y += this.getHeaderHeight()
    }
    if (this.isEnableTabStrip()) {
      this.tabHeaderRect = new Rect(rect.x, rect.y + y, rect.width, this.getTabStripHeight())
      y += this.getTabStripHeight()
    }
    this.contentRect = new Rect(rect.x, rect.y + y, rect.width, rect.height - y)

    this.children.forEach((child, i) => {
      child.layout(this.contentRect!)
      child.setVisible(i === this.getSelected())
    })
  }

  /** @hidden @internal */
  remove(node: TabNode) {
    this.removeChild(node)
    this.model.tidy()
    this.setSelected(Math.max(0, this.getSelected() - 1))
  }

  /** @hidden @internal */
  drop(dragNode: Node & IDraggable, location: DockLocation, index: number) {
    const dockLocation = location

    if (this === dragNode) {
      // tabset drop into itself
      return // dock back to itself
    }

    let dragParent = dragNode.getParent() as BorderNode | TabSetNode
    let fromIndex = 0
    if (dragParent !== undefined) {
      fromIndex = dragParent.removeChild(dragNode)
    }
    // console.log("removed child: " + fromIndex);

    // if dropping a tab back to same tabset and moving to forward position then reduce insertion index
    if (
      dragNode.getType() === TabNode.TYPE &&
      dragParent === this &&
      fromIndex < index &&
      index > 0
    ) {
      index -= 1
    }

    // for the tabset/border being removed from set the selected index
    if (dragParent !== undefined) {
      if (dragParent.getType() === TabSetNode.TYPE) {
        dragParent.setSelected(0)
      } else if (dragParent.getType() === BorderNode.TYPE) {
        if (dragParent.getSelected() !== -1) {
          if (fromIndex === dragParent.getSelected() && dragParent.getChildren().length > 0) {
            dragParent.setSelected(0)
          } else if (fromIndex < dragParent.getSelected()) {
            dragParent.setSelected(dragParent.getSelected() - 1)
          } else if (fromIndex > dragParent.getSelected()) {
            // leave selected index as is
          } else {
            dragParent.setSelected(-1)
          }
        }
      }
    }

    // simple_bundled dock to existing tabset
    if (dockLocation === DockLocation.CENTER) {
      let insertPos = index
      if (insertPos === -1) {
        insertPos = this.children.length
      }

      if (dragNode.getType() === TabNode.TYPE) {
        this.addChild(dragNode, insertPos)
        this.setSelected(insertPos)
        // console.log("added child at : " + insertPos);
      } else {
        dragNode.getChildren().forEach((child, i) => {
          this.addChild(child, insertPos)
          // console.log("added child at : " + insertPos);
          insertPos += 1
        })
      }
      this.model.setActiveTabset(this)
    } else {
      let tabSet: TabSetNode | undefined
      if (dragNode instanceof TabNode) {
        // create new tabset parent
        // console.log("create a new tabset");
        tabSet = new TabSetNode(this.model, {})
        tabSet.addChild(dragNode)
        // console.log("added child at end");
        dragParent = tabSet
      } else {
        tabSet = dragNode as TabSetNode
      }

      const parentRow = this.parent as Node
      const pos = parentRow.getChildren().indexOf(this)

      if (parentRow.getOrientation() === dockLocation.orientation) {
        tabSet.setWeight(this.getWeight() / 2)
        this.setWeight(this.getWeight() / 2)
        // console.log("added child 50% size at: " +  pos + dockLocation.indexPlus);
        parentRow.addChild(tabSet, pos + dockLocation.indexPlus)
      } else {
        // create a new row to host the new tabset (it will go in the opposite direction)
        // console.log("create a new row");
        const newRow = new RowNode(this.model, {})
        newRow.setWeight(this.getWeight())
        newRow.addChild(this)
        this.setWeight(50)
        tabSet.setWeight(50)
        // console.log("added child 50% size at: " +  dockLocation.indexPlus);
        newRow.addChild(tabSet, dockLocation.indexPlus)

        parentRow.removeChild(this)
        parentRow.addChild(newRow, pos)
      }
      this.model.setActiveTabset(tabSet)
    }
    this.model.tidy()
  }

  /** @hidden @internal */
  toJson(): any {
    const json: any = {}
    TabSetNode.attributeDefinitions.toJson(json, this.attributes)
    json.children = this.children.map(child => child.toJson())

    if (this.isActive()) {
      json.active = true
    }

    if (this.isMaximized()) {
      json.maximized = true
    }

    return json
  }

  /** @hidden @internal */
  updateAttrs(json: any) {
    TabSetNode.attributeDefinitions.update(json, this.attributes)
  }

  /** @hidden @internal */
  getAttributeDefinitions() {
    return TabSetNode.attributeDefinitions
  }

  /** @hidden @internal */
  getPrefSize(orientation: Orientation) {
    let prefSize = this.getWidth()
    if (orientation === Orientation.VERT) {
      prefSize = this.getHeight()
    }
    return prefSize
  }
}

export default TabSetNode
