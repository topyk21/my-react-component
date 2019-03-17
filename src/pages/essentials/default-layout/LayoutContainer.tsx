/**
 * Default layout component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import axios from 'axios'
import * as shortid from 'shortid'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { push } from 'connected-react-router'
import { Map } from 'immutable'

import { parseNestedObjectToFlattern } from 'src/common/DataParser'
import { IReduxState } from 'src/common/GlobalReducer'
import { actionCreators as authActions } from 'src/components/auth/Widgets'
import { Layout as FlexLayout, Model, Actions } from 'src/components/flex-layout'
import { IMenuItem } from 'src/components/menu/types'
import Layout from 'src/pages/essentials/default-layout/Layout'
import {
  actionCreators as layoutActions,
  ThemeCode,
} from 'src/pages/essentials/default-layout/Widgets'

interface IStateProps {
  /** Theme mode */
  curTheme: ThemeCode
}
interface IDispatchProps {
  signOut: () => void
  setTheme: (theme: ThemeCode) => void
}
interface IOwnProps {
  /** Page loader props */
  loadPage: (path: string) => JSX.Element
}
interface IContProps extends IStateProps, IDispatchProps, IOwnProps {}
interface IContState {
  /** Responsive menu open/close flag */
  mobileMenuOpen: boolean
  /** Menu list. This will appear on the left  */
  menuItems: IMenuItem[]
  /** Flex-layout model. It contains info about the layout */
  model: Model
  /** Flex-layout map. It exists to maintain already loaded pages' state  */
  componentMap: Map<string, JSX.Element>
}

class LayoutContainer extends React.Component<IContProps, IContState> {
  private tabRef = React.createRef<FlexLayout>()
  private mainTabSetId = shortid.generate()
  private model = {
    global: { tabEnableClose: true },
    borders: [
      // {
      //     type: 'border',
      //     location: 'right',
      // }
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
      model: Model.fromJson(this.model),
      componentMap: Map(),
      mobileMenuOpen: false,
      menuItems: [],
    }
    // Activate default tabset
    this.state.model.doAction(Actions.setActiveTabset(this.mainTabSetId))
  }

  componentDidMount() {
    axios.get('/test-data/MenuData.json').then(response => {
      const data = parseNestedObjectToFlattern(response.data, 'subMenuItem')
      this.setState({ menuItems: data })
    })
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
    switch (this.props.curTheme) {
      case 'light':
        this.props.setTheme('dark')
        break
      case 'dark':
        this.props.setTheme('light')
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
        theme={this.props.curTheme}
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

const mapStateToProps = (state: IReduxState) => ({
  curTheme: state.defaultLayout.theme,
})

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  signOut: () => {
    dispatch(authActions.signOut())
    dispatch(push('./signin'))
  },
  setTheme: (theme: ThemeCode) => {
    dispatch(layoutActions.setTheme(theme))
  },
})

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer)
