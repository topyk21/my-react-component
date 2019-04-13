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

import { ThemeCode, LayoutDirection } from 'src/common/type'
import { parseNestedObjectToFlattern } from 'src/common/DataParser'
import { IReduxState } from 'src/common/GlobalReducer'

import { actionCreators as authActions } from 'src/components/auth/Widgets'
import { Layout as FlexLayout, Model, Actions } from 'src/components/flex-layout'
import { IMenuItem } from 'src/pages/essentials/default-layout/view/menu'

import Layout from 'src/pages/essentials/default-layout/view/Layout'
import { actionCreators as layoutActions } from 'src/pages/essentials/default-layout/Widgets'

interface IStateProps {
  /** Theme mode */
  theme: ThemeCode
  /** Search options layout mode */
  layoutDirection: LayoutDirection
}
interface IDispatchProps {
  signOut: () => void
  setTheme: (theme: ThemeCode) => void
  setSearchOptionsLayout: (layoutMode: LayoutDirection) => void
}
interface IOwnProps {
  /** Page loader props */
  pageLoader: (path: string) => JSX.Element
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
      {
        type: 'border',
        location: 'right',
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          id: this.mainTabSetId,
          selected: 0,
          children: [
            {
              type: 'tab',
              name: 'Welcome!',
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

  onClickMenuItem = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.addTab(e.currentTarget.id)
  }

  onClickThemeIcon = (e: React.MouseEvent<HTMLElement>) => {
    this.toggleTheme()
  }

  onClickSearchOptionsLayoutIcon = () => {
    this.toggleSearchOptionsLayout()
  }

  onClickMain = () => {
    this.showModelStatus()
  }

  onToggleMobileMenu = () => {
    this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen })
  }

  addTab = (menuId: string) => {
    if (!this.tabRef.current) return

    const menuIdx = this.state.menuItems.findIndex(item => item.id === menuId)
    const targetItem = this.state.menuItems[menuIdx]

    if (targetItem.bindingPath) {
      const componentId = shortid.generate()
      const component = this.props.pageLoader(targetItem.bindingPath)
      const tabModel = {
        id: componentId,
        name: targetItem.value,
        component: targetItem.bindingPath,
      }

      this.setState(
        {
          componentMap: this.state.componentMap.set(componentId, component),
        },
        () => this.tabRef.current!.addTabToActiveTabSet(tabModel)
      )
    }
  }

  closeTab = (componentId: string) => {
    this.setState({
      componentMap: this.state.componentMap.delete(componentId),
    })
  }

  render() {
    return (
      <Layout
        // theme props
        theme={this.props.theme}
        layoutDirection={this.props.layoutDirection}
        // header
        searchOptionsLayout={this.props.layoutDirection}
        onClickMain={this.onClickMain}
        onClickSignOutIcon={this.props.signOut}
        onClickThemeIcon={this.onClickThemeIcon}
        onClickSearchOptionsLayoutIcon={this.onClickSearchOptionsLayoutIcon}
        // menu
        menuItems={this.state.menuItems}
        mobileMenuOpen={this.state.mobileMenuOpen}
        onToggleMobileMenu={this.onToggleMobileMenu}
        onClickMenuItem={this.onClickMenuItem}
        // tab
        contentsRef={this.tabRef}
        model={this.state.model}
        componentMap={this.state.componentMap}
        closeTab={this.closeTab}
      />
    )
  }

  private showModelStatus = () => {
    // tslint:disable-next-line
    console.log(JSON.stringify(this.state.model.toJson(), null, '\t'))
  }

  private toggleTheme = () => {
    switch (this.props.theme) {
      case 'light':
        this.props.setTheme('dark')
        break
      case 'dark':
        this.props.setTheme('light')
        break
    }
  }

  private toggleSearchOptionsLayout = () => {
    switch (this.props.layoutDirection) {
      case 'row':
        this.props.setSearchOptionsLayout('column')
        break
      case 'column':
        this.props.setSearchOptionsLayout('row')
        break
    }
  }
}

const mapStateToProps = (state: IReduxState) => ({
  theme: state.defaultLayout.theme,
  layoutDirection: state.defaultLayout.layoutDirection,
})

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  signOut: () => {
    dispatch(authActions.signOut())
    dispatch(push('./signin'))
  },
  setTheme: (theme: ThemeCode) => {
    dispatch(layoutActions.setTheme(theme))
  },
  setSearchOptionsLayout: (layoutMode: LayoutDirection) => {
    dispatch(layoutActions.setLayoutDirection(layoutMode))
  },
})

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(LayoutContainer)
