import * as React from 'react'
import { Map } from 'immutable'
import classNames from 'classnames'

import { ThemeCode, LayoutDirection } from 'src/common/type'
import { Layout as FlexLayout, TabNode, Model } from 'src/components/flex-layout'

export interface IContentsProps {
  componentMap: Map<string, JSX.Element>
  closeTab: (componentId: string) => void
  theme: ThemeCode
  layoutDirection: LayoutDirection
  layoutRef: React.Ref<FlexLayout>
  model: Model
}

class Contents extends React.Component<IContentsProps, {}> {
  factoryBuilder = (node: TabNode) => {
    const componentId = node.getId()
    const component = this.props.componentMap.get(componentId)

    const directionClass =
      this.props.layoutDirection === 'column'
        ? 'default-layout__col-base'
        : 'default-layout__row-base'
    const wrapperClass = classNames('default-layout__contents-wrapper', directionClass)

    if (componentId) {
      node.setEventListener('close', () => this.props.closeTab(componentId))
      return <div className={wrapperClass}>{component}</div>
    }
    return null
  }

  render() {
    return <FlexLayout {...this.props} ref={this.props.layoutRef} factory={this.factoryBuilder} />
  }
}

export default Contents
