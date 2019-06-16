import * as React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as shortid from 'shortid'
import { Map } from 'immutable'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'

import { Layout as FlexLayout, Model, Actions } from 'anti/flex-layout'
import Header from 'layout/Header'
import DesktopMenu from 'layout/menu/DesktopMenu'
import MobileMenu from 'layout/menu/MobileMenu'
import Contents from 'layout/Contents'

import { actionCreators as layoutActions, MenuDatum } from 'layout/Widgets'
import { ReduxState } from 'utils/ReduxReducer'
import { ThemeCode } from 'utils/ThemeCode'

import 'css/GlobalScroll.scss'
import 'css/Layout.scss'

interface IStateProps {
  /** Theme mode */
  theme: ThemeCode
}
interface IDispatchProps {
  toggleTheme: () => void
}
interface IOwnProps {
  /** Page loader props */
  pageLoader: (path: string) => JSX.Element
}
interface LayoutProps extends IStateProps, IDispatchProps, IOwnProps {}
interface LayoutState {
  /** Menu list. This will appear on the left side  */
  menuItems: MenuDatum[]
  /** Flex-layout model. It contains info about the layout */
  model: Model
  /** Responsive menu open/close flag */
  mobileMenuOpen: boolean
  /** Flex-layout map. It exists to maintain already loaded pages' state  */
  componentMap: Map<string, JSX.Element>
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  private flexLayoutRef = React.createRef<FlexLayout>()

  constructor(props: LayoutProps) {
    super(props)

    const mainTabSetId = shortid.generate()
    this.state = {
      model: Model.fromJson({
        global: { tabEnableClose: true },
        borders: [], // [{ type: 'border', location: 'right' }],
        layout: {
          type: 'row',
          weight: 100,
          children: [
            {
              type: 'tabset',
              id: mainTabSetId,
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
      }),
      componentMap: Map(),
      mobileMenuOpen: false,
      menuItems: [],
    }
    // Activate default tabset
    this.state.model.doAction(Actions.setActiveTabset(mainTabSetId))
  }

  componentDidMount() {
    axios.get('/test-data/MenuData.json').then(response => {
      this.setState({ menuItems: response.data })
    })
  }

  onToggleMobileMenu = () => {
    this.setState({ mobileMenuOpen: !this.state.mobileMenuOpen })
  }

  onClickMenuItem = (menuDatum: MenuDatum) => {
    this.addTab(menuDatum)
  }

  addTab = (menuDatum: MenuDatum) => {
    if (menuDatum.bindingPath) {
      const componentId = shortid.generate()
      const component = this.props.pageLoader(menuDatum.bindingPath)
      const tabModel = {
        id: componentId,
        name: menuDatum.value,
        component: menuDatum.bindingPath,
      }

      this.setState({ componentMap: this.state.componentMap.set(componentId, component) }, () =>
        this.flexLayoutRef.current!.addTabToActiveTabSet(tabModel)
      )
    }
  }

  closeTab = (componentId: string) => {
    this.setState({ componentMap: this.state.componentMap.delete(componentId) })
  }

  render() {
    const { theme, toggleTheme } = this.props
    const layoutTheme = createMuiTheme({
      palette: { type: theme, primary: blue, secondary: pink },
    })
    return (
      <MuiThemeProvider theme={layoutTheme}>
        <div className="layout">
          <Header
            theme={theme}
            onClickThemeIcon={toggleTheme}
            onToggleMobileMenu={this.onToggleMobileMenu}
          />
          <nav className="layout-menu">
            <DesktopMenu menuItems={this.state.menuItems} onClickMenuItem={this.onClickMenuItem} />
          </nav>
          <main className="layout-contents">
            <Contents
              closeTab={this.closeTab}
              componentMap={this.state.componentMap}
              layoutRef={this.flexLayoutRef}
              model={this.state.model}
              theme={this.props.theme}
            />
          </main>
        </div>
        <MobileMenu
          menuItems={this.state.menuItems}
          mobileMenuOpen={this.state.mobileMenuOpen}
          onClickMenuItem={this.onClickMenuItem}
          onToggleMobileMenu={this.onToggleMobileMenu}
        />
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  theme: state.layout.theme,
})

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => ({
  toggleTheme: () => {
    dispatch(layoutActions.toggleTheme())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout)
