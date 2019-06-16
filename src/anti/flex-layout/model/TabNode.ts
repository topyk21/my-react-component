// tslint:disable:no-any no-string-literal max-line-length
import AttributeDefinitions from 'anti/flex-layout/lib/AttributeDefinitions'
import Attribute from 'anti/flex-layout/lib/Attribute'
import Rect from 'anti/flex-layout/lib/Rect'
import { JSMap } from 'anti/flex-layout/lib/Types'

import Node from 'anti/flex-layout/model/Node'
import TabSetNode from 'anti/flex-layout/model/TabSetNode'
import BorderNode from 'anti/flex-layout/model/BorderNode'
import Model from 'anti/flex-layout/model/Model'
import IDraggable from 'anti/flex-layout/model/IDraggable'

class TabNode extends Node implements IDraggable {
  static readonly TYPE = 'tab'
  /** @hidden @internal */
  static fromJson(json: any, model: Model) {
    const newLayoutNode = new TabNode(model, json)
    return newLayoutNode
  }
  /** @hidden @internal */
  private static attributeDefinitions: AttributeDefinitions = TabNode.createAttributeDefinitions()
  /** @hidden @internal */
  private static createAttributeDefinitions(): AttributeDefinitions {
    const attributeDefinitions = new AttributeDefinitions()
    attributeDefinitions.add('type', TabNode.TYPE, true)
    attributeDefinitions.add('id', undefined).setType(Attribute.ID)

    attributeDefinitions.add('name', '[Unnamed Tab]').setType(Attribute.STRING)
    attributeDefinitions.add('component', undefined).setType(Attribute.STRING)
    attributeDefinitions.add('config', undefined).setType(Attribute.JSON)

    attributeDefinitions.addInherited('enableClose', 'tabEnableClose').setType(Attribute.BOOLEAN)
    attributeDefinitions.addInherited('enableDrag', 'tabEnableDrag').setType(Attribute.BOOLEAN)
    attributeDefinitions.addInherited('enableRename', 'tabEnableRename').setType(Attribute.BOOLEAN)
    attributeDefinitions.addInherited('className', 'tabClassName').setType(Attribute.STRING)
    attributeDefinitions.addInherited('icon', 'tabIcon').setType(Attribute.STRING)
    attributeDefinitions
      .addInherited('enableRenderOnDemand', 'tabEnableRenderOnDemand')
      .setType(Attribute.BOOLEAN)
    return attributeDefinitions
  }

  /** @hidden @internal */
  private tabRect?: Rect
  /** @hidden @internal */
  private extra: JSMap<any>

  /** @hidden @internal */
  constructor(model: Model, json: any) {
    super(model)

    this.extra = {} // extra data added to node not saved in json

    TabNode.attributeDefinitions.fromJson(json, this.attributes)
    model.addNode(this)
  }

  getTabRect() {
    return this.tabRect
  }

  /** @hidden @internal */
  setTabRect(rect: Rect) {
    this.tabRect = rect
  }

  getName() {
    return this.getAttr('name') as string
  }

  getComponent() {
    return this.getAttributeAsStringOrUndefined('component')
  }

  /**
   * Returns the config attribute that can be used to store node specific data that
   * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
   * than directly, for example:
   * this.state.model.doAction(
   *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
   */
  getConfig() {
    return this.attributes['config']
  }

  /**
   * Returns an object that can be used to store transient node specific data that will
   * NOT be saved in the json.
   */
  getExtraData() {
    return this.extra
  }

  getIcon() {
    return this.getAttributeAsStringOrUndefined('icon')
  }

  isEnableClose() {
    return this.getAttr('enableClose') as boolean
  }

  isEnableDrag() {
    return this.getAttr('enableDrag') as boolean
  }

  isEnableRename() {
    return this.getAttr('enableRename') as boolean
  }

  getClassName() {
    return this.getAttributeAsStringOrUndefined('className')
  }

  isEnableRenderOnDemand() {
    return this.getAttr('enableRenderOnDemand') as boolean
  }

  /** @hidden @internal */
  setName(name: string) {
    this.attributes['name'] = name
  }

  /** @hidden @internal */
  layout(rect: Rect) {
    if (!rect.equals(this.rect)) {
      this.fireEvent('resize', { rect })
    }
    this.rect = rect
  }

  /** @hidden @internal */
  delete() {
    const parent = this.parent as TabSetNode | BorderNode
    parent.remove(this)
    this.fireEvent('close', {})
  }

  /** @hidden @internal */
  toJson() {
    const json = {}
    TabNode.attributeDefinitions.toJson(json, this.attributes)
    return json
  }

  /** @hidden @internal */
  updateAttrs(json: any) {
    TabNode.attributeDefinitions.update(json, this.attributes)
  }

  /** @hidden @internal */
  getAttributeDefinitions() {
    return TabNode.attributeDefinitions
  }
}

export default TabNode
