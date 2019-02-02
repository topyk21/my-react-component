/**
 * Default layout component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
// import * as Loadable from 'react-loadable';
import * as shortid from 'shortid'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import { Map } from 'immutable'

import { actionCreators as authActions } from 'src/components/auth/Widgets'
import { Layout as FlexLayout, Model, Actions } from 'src/components/flex-layout'
import { IMenuItem } from 'src/components/menu/types'
import Layout from 'src/components/default-layout/Layout'
import { menuData as menuTestData } from 'src/pages/test/data'
import { parseNestedObjectToFlattern } from 'src/lib/data-parser'

interface IDispatchProps {
  signOut: (e: React.MouseEvent<HTMLElement>) => void
}
interface IContProps extends IDispatchProps {
  /** Page loader props */
  loadPage: (path: string) => JSX.Element
}
interface IContState {
  /** Theme mode */
  curTheme: 'light' | 'dark'
  /** Responsive menu open/close flag */
  mobileMenuOpen: boolean
  /** Menu list. This will appear on the left  */
  menuItems: IMenuItem[]
  /** Flex-layout model. It contains info about the layout */
  model: Model
  /** Flex-layout map. It exists to maintain already loaded pages' state  */
  componentMap: Map<string, JSX.Element>
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  signOut: () => {
    dispatch(authActions.signOut())
    dispatch(push('./signin'))
  },
})

class LayoutContainer extends React.Component<IContProps, IContState> {
  private tabRef = React.createRef<FlexLayout>()
  private mainTabSetId = shortid.generate()
  private model = {
    global: { tabEnableClose: true },
    borders: [
      {
        type: 'border',
        location: 'right',
      },
      {
        type: 'border',
        location: 'bottom',
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          id: this.mainTabSetId,
          weight: 50,
          selected: 0,
          children: [
            {
              type: 'tab',
              name: '',
              enableClose: false,
              enableDrag: false,
            },
          ],
        },
      ],
    },
  }

  constructor(props: IContProps) {
    super(props)
    this.state = {
      curTheme: 'dark',
      model: Model.fromJson(this.model),
      componentMap: Map(),
      mobileMenuOpen: false,
      menuItems: parseNestedObjectToFlattern(menuTestData, 'subMenuItem'),
    }
    // Activate default tabset
    this.state.model.doAction(Actions.setActiveTabset(this.mainTabSetId))
  }

  addTab = (menuName: string, componentPath?: string) => {
    if (!this.tabRef.current) return
    if (!componentPath) return

    const componentId = shortid.generate()
    const component = this.props.loadPage(componentPath)
    const tabModel = {
      id: componentId,
      name: menuName,
      component: componentPath,
    }

    this.tabRef.current.addTabToActiveTabSet(tabModel)
    this.setState({
      componentMap: this.state.componentMap.set(componentId, component),
    })
  }

  closeTab = (componentId: string) => {
    this.setState({
      componentMap: this.state.componentMap.delete(componentId),
    })
  }

  toggleMobileMenu = () => {
    this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen })
  }

  toggleTheme = () => {
    switch (this.state.curTheme) {
      case 'light':
        this.setState({ curTheme: 'dark' })
        break
      case 'dark':
        this.setState({ curTheme: 'light' })
        break
    }
  }

  onShowLayoutClick = () => {
    // tslint:disable-next-line
    console.log(JSON.stringify(this.state.model.toJson(), null, '\t'))
  }

  render() {
    return (
      <Layout
        // theme props
        theme={this.state.curTheme}
        // header
        onClickMain={this.onShowLayoutClick}
        onClickSignOut={this.props.signOut}
        onToggleTheme={this.toggleTheme}
        // menu
        menuItems={this.state.menuItems}
        mobileMenuOpen={this.state.mobileMenuOpen}
        onToggleMobileMenu={this.toggleMobileMenu}
        onClickMenuItem={this.addTab}
        // tab
        contentsRef={this.tabRef}
        model={this.state.model}
        componentMap={this.state.componentMap}
        closeTab={this.closeTab}
      />
    )
  }
}

export default connect<void, IDispatchProps, void>(
  undefined,
  mapDispatchToProps
)(LayoutContainer)
