// tslint:disable
import * as React from 'react'
import { Map } from 'immutable'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { blue, pink } from '@material-ui/core/colors'

import { ThemeCode, LayoutDirection } from 'src/common/type'
import { Layout as FlexLayout, Model } from 'src/components/flex-layout'
import { IMenuItem } from 'src/pages/essentials/default-layout/view/menu'
import Header from 'src/pages/essentials/default-layout/view/Header'
import MainMenu from 'src/pages/essentials/default-layout/view/MainMenu'
import Contents from 'src/pages/essentials/default-layout/view/Contents'

interface ILayoutProps {
  // theme props
  theme: ThemeCode
  layoutDirection: LayoutDirection
  // menu props
  menuItems: IMenuItem[]
  mobileMenuOpen: boolean
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
  onClickMenuItem: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  // header props
  searchOptionsLayout: LayoutDirection
  onClickMain: () => void
  onClickSignOutIcon: (e: React.MouseEvent<HTMLElement>) => void
  onClickThemeIcon: (e: React.MouseEvent<HTMLElement>) => void
  onClickSearchOptionsLayoutIcon: (e: React.MouseEvent<HTMLElement>) => void
  // tab props
  model: Model
  contentsRef: React.Ref<FlexLayout>
  componentMap: Map<string, JSX.Element>
  closeTab: (componentId: string) => void
}

const Layout: React.SFC<ILayoutProps> = props => {
  const layoutTheme = createMuiTheme({
    typography: { useNextVariants: true },
    palette: { type: props.theme, primary: blue, secondary: pink },
  })
  return (
    <MuiThemeProvider theme={layoutTheme}>
      <div className="default-layout">
        <Header {...props} />
        <MainMenu {...props} />
        <main className="default-layout__contents">
          <Contents layoutRef={props.contentsRef} {...props} />
        </main>
      </div>
    </MuiThemeProvider>
  )
}

export default Layout
