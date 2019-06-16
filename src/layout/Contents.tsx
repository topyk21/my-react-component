import * as React from 'react'
import { Map } from 'immutable'

import { Layout as FlexLayout, TabNode, Model } from 'anti/flex-layout'
import { ThemeCode } from 'utils/ThemeCode'

export interface IContentsProps {
  componentMap: Map<string, JSX.Element>
  closeTab: (componentId: string) => void
  theme: ThemeCode
  layoutRef: React.Ref<FlexLayout>
  model: Model
}

class Contents extends React.Component<IContentsProps, {}> {
  factoryBuilder = (node: TabNode) => {
    const componentId = node.getId()
    const component = this.props.componentMap.get(componentId)

    if (componentId) {
      node.setEventListener('close', () => this.props.closeTab(componentId))
      return <div className="layout-contents__wrapper">{component}</div>
    }
    return null
  }

  render() {
    return <FlexLayout {...this.props} ref={this.props.layoutRef} factory={this.factoryBuilder} />
  }
}

export default Contents
