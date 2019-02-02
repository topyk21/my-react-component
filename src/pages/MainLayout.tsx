import * as React from 'react'
import { Layout as FlexLayout, Model } from 'src/components/flex-layout'

import 'src/components/flex-layout/static/flex-layout.scss'

// tslint:disable-next-line
interface IMainLayoutProps {}
interface IMainLayoutState {
  model: Model
}

const initialModel = {
  global: { tabEnableClose: true },
  borders: [
    {
      type: 'border',
      location: 'bottom',
      children: [],
    },
    {
      type: 'border',
      location: 'right',
      children: [],
    },
    {
      type: 'border',
      location: 'left',
      children: [],
    },
    {
      type: 'border',
      location: 'top',
      children: [],
    },
  ],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        id: 'root',
        weight: 50,
        selected: 0,
        children: [
          {
            type: 'tab',
            name: '',
            enableClose: false,
            enableDrag: false,
          },
          {
            type: 'tab',
            name: 'test',
          },
          {
            type: 'tab',
            name: 'test',
          },
          {
            type: 'tab',
            name: 'test',
          },
          {
            type: 'tab',
            name: 'test',
          },
        ],
      },
    ],
  },
}

class MainLayout extends React.Component<IMainLayoutProps, IMainLayoutState> {
  constructor(props: IMainLayoutProps) {
    super(props)
    this.state = { model: Model.fromJson(initialModel) }
  }

  shouldComponentUpdate(nextProps: IMainLayoutProps, nextState: IMainLayoutState) {
    return nextState.model !== this.state.model
  }

  factory = () => {
    return (
      <div>
        <button>Wow!</button>
      </div>
    )
  }

  render() {
    return <FlexLayout theme="dark" model={this.state.model} factory={this.factory} />
  }
}

export default MainLayout
