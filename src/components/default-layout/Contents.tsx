import * as React from 'react'
import { Map } from 'immutable'

import { Layout as FlexLayout, TabNode, Model } from 'src/components/flex-layout'

interface IContProps {
  theme: 'light' | 'dark'
  layoutRef: React.Ref<FlexLayout>
  model: Model
  componentMap: Map<string, JSX.Element>
  closeTab: (componentId: string) => void
}

const Contents: React.SFC<IContProps> = props => {
  const factoryBuilder = (node: TabNode) => {
    node.setEventListener('close', () => props.closeTab(componentId))
    const componentId = node.getId()
    const component = props.componentMap.get(componentId)

    if (componentId) {
      return <div className="default-layout__contents-wrapper">{component}</div>
    }
    return null
  }

  return (
    <FlexLayout
      theme={props.theme}
      ref={props.layoutRef}
      model={props.model}
      factory={factoryBuilder}
    />
  )
}

export default Contents
