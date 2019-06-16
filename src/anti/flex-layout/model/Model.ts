// tslint:disable:no-any no-string-literal max-line-length no-parameter-reassignment
import { JSMap } from 'anti/flex-layout/lib/Types'
import DockLocation from 'anti/flex-layout/lib/DockLocation'
import AttributeDefinitions from 'anti/flex-layout/lib/AttributeDefinitions'
import Attribute from 'anti/flex-layout/lib/Attribute'
import Orientation from 'anti/flex-layout/lib/Orientation'
import DropInfo from 'anti/flex-layout/lib/DropInfo'
import Rect from 'anti/flex-layout/lib/Rect'

import Node from 'anti/flex-layout/model/Node'
import RowNode from 'anti/flex-layout/model/RowNode'
import Action from 'anti/flex-layout/model/Action'
import Actions from 'anti/flex-layout/model/Actions'
import TabNode from 'anti/flex-layout/model/TabNode'
import TabSetNode from 'anti/flex-layout/model/TabSetNode'
import BorderSet from 'anti/flex-layout/model/BorderSet'
import BorderNode from 'anti/flex-layout/model/BorderNode'
import IDraggable from 'anti/flex-layout/model/IDraggable'
import IDropTarget from 'anti/flex-layout/model/IDropTarget'

/**
 * Class containing the Tree of Nodes used by the FlexLayout component
 */
class Model {
  /**
   * Loads the model from the given json object
   * @param json the json model to load
   * @returns {Model} a new Model object
   */
  static fromJson(json: any) {
    const model = new Model()
    Model.attributeDefinitions.fromJson(json.global, model.attributes)

    if (json.borders) {
      model.borders = BorderSet.fromJson(json.borders, model)
    }
    model.root = RowNode.fromJson(json.layout, model)
    model.tidy() // initial tidy of node tree
    return model
  }
  /** @hidden @internal */
  private static attributeDefinitions: AttributeDefinitions = Model.createAttributeDefinitions()
  /** @hidden @internal */
  private static createAttributeDefinitions(): AttributeDefinitions {
    const attributeDefinitions = new AttributeDefinitions()
    // splitter
    attributeDefinitions
      .add('splitterSize', 4)
      .setType(Attribute.INT)
      .setFrom(1)
    attributeDefinitions.add('enableEdgeDock', true).setType(Attribute.BOOLEAN)
    attributeDefinitions
      .add('marginInsets', { top: 0, right: 0, bottom: 0, left: 0 })
      .setType(Attribute.JSON)

    // tab
    attributeDefinitions.add('tabEnableClose', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabEnableDrag', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabEnableRename', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabClassName', undefined).setType(Attribute.STRING)
    attributeDefinitions.add('tabIcon', undefined).setType(Attribute.STRING)
    attributeDefinitions.add('tabEnableRenderOnDemand', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabDragSpeed', 0.3).setType(Attribute.NUMBER)

    // tabset
    attributeDefinitions.add('tabSetEnableDeleteWhenEmpty', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabSetEnableDrop', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabSetEnableDrag', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabSetEnableDivide', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabSetEnableMaximize', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('tabSetClassNameTabStrip', undefined).setType(Attribute.STRING)
    attributeDefinitions.add('tabSetClassNameHeader', undefined).setType(Attribute.STRING)
    attributeDefinitions.add('tabSetEnableTabStrip', true).setType(Attribute.BOOLEAN)
    attributeDefinitions
      .add('tabSetHeaderHeight', 24)
      .setType(Attribute.INT)
      .setFrom(0)
    attributeDefinitions
      .add('tabSetTabStripHeight', 24)
      .setType(Attribute.INT)
      .setFrom(0)
    attributeDefinitions
      .add('tabSetMarginInsets', { top: 0, right: 0, bottom: 0, left: 0 })
      .setType(Attribute.JSON)
    attributeDefinitions
      .add('tabSetBorderInsets', { top: 0, right: 0, bottom: 0, left: 0 })
      .setType(Attribute.JSON)

    attributeDefinitions.add('borderBarSize', 25)
    attributeDefinitions.add('borderEnableDrop', true).setType(Attribute.BOOLEAN)
    attributeDefinitions.add('borderClassName', undefined).setType(Attribute.STRING)
    return attributeDefinitions
  }

  /** @hidden @internal */
  private attributes: JSMap<any>
  /** @hidden @internal */
  private idMap: JSMap<Node>
  /** @hidden @internal */
  private nextId: number
  /** @hidden @internal */
  private changeListener?: () => void
  /** @hidden @internal */
  private root?: RowNode
  /** @hidden @internal */
  private borders: BorderSet
  /** @hidden @internal */
  private onAllowDrop?: (dragNode: Node, dropInfo: DropInfo) => boolean
  /** @hidden @internal */
  private maximizedTabSet?: TabSetNode
  /** @hidden @internal */
  private activeTabSet?: TabSetNode
  /** @hidden @internal */
  private borderRects: { inner: Rect; outer: Rect } = {
    inner: Rect.empty(),
    outer: Rect.empty(),
  }

  /**
   * 'private' constructor. Use the static method Model.fromJson(json) to create a model
   *  @hidden @internal
   */

  private constructor() {
    this.attributes = {}
    this.idMap = {}
    this.nextId = 0
    this.borders = new BorderSet(this)
  }

  /** @hidden @internal */
  setChangeListener(listener: (() => void) | undefined) {
    this.changeListener = listener
  }

  /**
   * Get the currently active tabset node
   */
  getActiveTabset() {
    return this.activeTabSet
  }

  /** @hidden @internal */
  setActiveTabset(tabsetNode: TabSetNode) {
    this.activeTabSet = tabsetNode
  }

  /**
   * Get the currently maximized tabset node
   */
  getMaximizedTabset() {
    return this.maximizedTabSet
  }

  /** @hidden @internal */
  setMaximizedTabset(tabsetNode: TabSetNode) {
    this.maximizedTabSet = tabsetNode
  }

  /**
   * Gets the root RowNode of the model
   * @returns {RowNode}
   */
  getRoot() {
    return this.root as RowNode
  }

  /**
   * Gets the
   * @returns {BorderSet|*}
   */
  getBorderSet() {
    return this.borders
  }

  /** @hidden @internal */
  getOuterInnerRects() {
    return this.borderRects
  }

  /**
   * Visits all the nodes in the model and calls the given function for each
   * @param fn a function that takes visited node and a integer level as parameters
   */
  visitNodes(fn: (node: Node, level: number) => void) {
    this.borders.forEachNode(fn)
    this.root!.forEachNode(fn, 0)
  }

  /**
   * Gets a node by its id
   * @param id the id to find
   */
  getNodeById(id: string) {
    return this.idMap[id]
  }

  /**
   * Update the node tree by performing the given action,
   * Actions should be generated via static methods on the Actions class
   * @param action the action to perform
   */
  doAction(action: Action) {
    // console.log(action);
    switch (action.type) {
      case Actions.ADD_NODE: {
        const newNode = new TabNode(this, action.data['json'])
        const toNode = this.idMap[action.data['toNode']] as Node & IDraggable
        if (
          toNode instanceof TabSetNode ||
          toNode instanceof BorderNode ||
          toNode instanceof RowNode
        ) {
          toNode.drop(
            newNode,
            DockLocation.getByName(action.data['location']),
            action.data['index']
          )
        }
        break
      }
      case Actions.MOVE_NODE: {
        const fromNode = this.idMap[action.data['fromNode']] as Node & IDraggable
        if (fromNode instanceof TabNode || fromNode instanceof TabSetNode) {
          const toNode = this.idMap[action.data['toNode']] as Node & IDropTarget
          if (
            toNode instanceof TabSetNode ||
            toNode instanceof BorderNode ||
            toNode instanceof RowNode
          ) {
            toNode.drop(
              fromNode,
              DockLocation.getByName(action.data['location']),
              action.data['index']
            )
          }
        }
        break
      }
      case Actions.DELETE_TAB: {
        const node = this.idMap[action.data['node']]
        if (node instanceof TabNode) {
          delete this.idMap[action.data['node']]
          node.delete()
        }
        break
      }
      case Actions.RENAME_TAB: {
        const node = this.idMap[action.data['node']]
        if (node instanceof TabNode) {
          node.setName(action.data['text'])
        }
        break
      }
      case Actions.SELECT_TAB: {
        const tabNode = this.idMap[action.data['tabNode']]
        if (tabNode instanceof TabNode) {
          const parent = tabNode.getParent() as Node
          const pos = parent.getChildren().indexOf(tabNode)

          if (parent instanceof BorderNode) {
            if (parent.getSelected() === pos) {
              parent.setSelected(-1)
            } else {
              parent.setSelected(pos)
            }
          } else if (parent instanceof TabSetNode) {
            if (parent.getSelected() !== pos) {
              parent.setSelected(pos)
            }
            this.activeTabSet = parent
          }
        }
        break
      }
      case Actions.SET_ACTIVE_TABSET: {
        const tabsetNode = this.idMap[action.data['tabsetNode']]
        if (tabsetNode instanceof TabSetNode) {
          this.activeTabSet = tabsetNode
        }
        break
      }
      case Actions.ADJUST_SPLIT: {
        const node1 = this.idMap[action.data['node1']]
        const node2 = this.idMap[action.data['node2']]

        if (
          (node1 instanceof TabSetNode || node1 instanceof RowNode) &&
          (node2 instanceof TabSetNode || node2 instanceof RowNode)
        ) {
          this.adjustSplitSide(node1, action.data['weight1'], action.data['pixelWidth1'])
          this.adjustSplitSide(node2, action.data['weight2'], action.data['pixelWidth2'])
        }
        break
      }
      case Actions.ADJUST_BORDER_SPLIT: {
        const node = this.idMap[action.data['node']]
        if (node instanceof BorderNode) {
          node.setSize(action.data['pos'])
        }
        break
      }
      case Actions.MAXIMIZE_TOGGLE: {
        const node = this.idMap[action.data['node']]
        if (node instanceof TabSetNode) {
          if (node === this.maximizedTabSet) {
            this.maximizedTabSet = undefined
          } else {
            this.maximizedTabSet = node
            this.activeTabSet = node
          }
        }

        break
      }
      case Actions.UPDATE_MODEL_ATTRIBUTES: {
        this.updateAttrs(action.data['json'])
        break
      }

      case Actions.UPDATE_NODE_ATTRIBUTES: {
        const node = this.idMap[action.data['node']]
        node.updateAttrs(action.data['json'])
        break
      }
    }

    this.updateIdMap()

    if (this.changeListener !== undefined) {
      this.changeListener()
    }
  }

  /** @hidden @internal */
  updateIdMap() {
    // regenerate idMap to stop it building up
    this.idMap = {}
    this.visitNodes(node => (this.idMap[node.getId()] = node))
    // console.log(JSON.stringify(Object.keys(this._idMap)));
  }

  /** @hidden @internal */
  adjustSplitSide(node: TabSetNode | RowNode, weight: number, pixels: number) {
    node.setWeight(weight)
    if (node.getWidth() !== undefined && node.getOrientation() === Orientation.VERT) {
      node.updateAttrs({ width: pixels })
    } else if (node.getHeight() !== undefined && node.getOrientation() === Orientation.HORZ) {
      node.updateAttrs({ height: pixels })
    }
  }

  /**
   * Converts the model to a json object
   * @returns {*} json object that represents this model
   */
  toJson() {
    const json: any = { global: {}, layout: {} }
    Model.attributeDefinitions.toJson(json.global, this.attributes)

    // save state of nodes
    this.visitNodes(node => {
      node.fireEvent('save', undefined)
    })

    json.borders = this.borders.toJson()
    json.layout = (this.root as RowNode).toJson()
    return json
  }

  getSplitterSize() {
    return this.attributes['splitterSize'] as number
  }

  isEnableEdgeDock() {
    return this.attributes['enableEdgeDock'] as boolean
  }

  /** @hidden @internal */
  addNode(node: Node) {
    const id = node.getId()
    if (this.idMap[id] !== undefined) {
      // tslint:disable-next-line
      throw `Error: each node must have a unique id, duplicate id: '${node.getId()}'`
    }

    if (node.getType() !== 'splitter') {
      this.idMap[id] = node
    }
  }

  /** @hidden @internal */
  layout(rect: Rect) {
    // let start = Date.now();
    this.borderRects = this.borders.layoutBorder({ outer: rect, inner: rect })
    rect = this.borderRects.inner.removeInsets(this.getAttribute('marginInsets'))
    this.root!.layout(rect)
    return rect
    // console.log("layout time: " + (Date.now() - start));
  }

  /** @hidden @internal */
  findDropTargetNode(dragNode: Node & IDraggable, x: number, y: number) {
    let node = (this.root as RowNode).findDropTargetNode(dragNode, x, y)
    if (node === undefined) {
      node = this.borders.findDropTargetNode(dragNode, x, y)
    }
    return node
  }

  /** @hidden @internal */
  tidy() {
    // console.log("before _tidy", this.toString());
    if (this.root) this.root.tidy()
    // console.log("after _tidy", this.toString());
  }

  /** @hidden @internal */
  updateAttrs(json: any) {
    Model.attributeDefinitions.update(json, this.attributes)
  }

  /** @hidden @internal */
  nextUniqueId() {
    this.nextId += 1
    while (this.idMap['#' + this.nextId] !== undefined) {
      this.nextId += 1
    }

    return '#' + this.nextId
  }

  /** @hidden @internal */
  getAttribute(name: string): any {
    return this.attributes[name]
  }

  /**
   * Sets a function to allow/deny dropping a node
   * @param onAllowDrop function that takes the drag node and DropInfo and returns true if the drop is allowed
   */
  setOnAllowDrop(onAllowDrop: (dragNode: Node, dropInfo: DropInfo) => boolean) {
    this.onAllowDrop = onAllowDrop
  }

  /** @hidden @internal */
  getOnAllowDrop() {
    return this.onAllowDrop
  }

  toString() {
    return JSON.stringify(this.toJson())
  }
}

export default Model
