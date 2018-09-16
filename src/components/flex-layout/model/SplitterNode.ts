// tslint:disable:no-any no-string-literal
import AttributeDefinitions from 'components/flex-layout/AttributeDefinitions'
import Orientation from 'components/flex-layout/Orientation'
import Node from 'components/flex-layout/model/Node'
import Model from 'components/flex-layout/model/Model'

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
  setWeight(value: number): void {
    return
  }

  /** @hidden @internal */
  getPrefSize(orientation: Orientation): number {
    return this.model.getSplitterSize()
  }

  /** @hidden @internal */
  updateAttrs(json: any): void {
    return
  }

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
