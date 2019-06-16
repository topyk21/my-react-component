// tslint:disable:no-any no-string-literal no-empty
import AttributeDefinitions from 'anti/flex-layout/lib/AttributeDefinitions'
import Orientation from 'anti/flex-layout/lib/Orientation'

import Node from 'anti/flex-layout/model/Node'
import Model from 'anti/flex-layout/model/Model'

class SplitterNode extends Node {
  static readonly TYPE: string = 'splitter'

  /** @hidden @internal */
  constructor(model: Model) {
    super(model)
    this.fixed = true
    this.attributes['type'] = SplitterNode.TYPE
    model.addNode(this)
  }

  /** @hidden @internal */
  getWidth() {
    return this.model.getSplitterSize()
  }

  /** @hidden @internal */
  getHeight() {
    return this.model.getSplitterSize()
  }

  /** @hidden @internal */
  getWeight(): number {
    return 0
  }

  /** @hidden @internal */
  setWeight(value: number): void {}

  /** @hidden @internal */
  getPrefSize(orientation: Orientation): number {
    return this.model.getSplitterSize()
  }

  /** @hidden @internal */
  updateAttrs(json: any): void {}

  /** @hidden @internal */
  getAttributeDefinitions(): AttributeDefinitions {
    return new AttributeDefinitions()
  }

  /** @hidden @internal */
  toJson(): any {
    return undefined
  }
}

export default SplitterNode
