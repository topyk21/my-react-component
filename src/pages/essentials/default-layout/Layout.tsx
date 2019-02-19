// tslint:disable
import * as React from 'react'
import { Map } from 'immutable'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { teal } from '@material-ui/core/colors'

import { Layout as FlexLayout, Model } from 'src/components/flex-layout'
import { IMenuItem } from 'src/components/menu/types'
import Header from 'src/pages/essentials/default-layout/Header'
import Menu from 'src/pages/essentials/default-layout/Menu'
import Contents from 'src/pages/essentials/default-layout/Contents'

import 'src/pages/essentials/default-layout/Layout.scss'

interface ILayoutProps {
  // theme props
  theme: 'light' | 'dark'
  // menu props
  menuItems: IMenuItem[]
  mobileMenuOpen: boolean
  onToggleMobileMenu: (e: React.MouseEvent<HTMLElement>) => void
  onClickMenuItem: (menuLabel: string, componentPath?: string) => void
  // header props
  onClickMain: () => void
  onClickSignOut: (e: React.MouseEvent<HTMLElement>) => void
  onToggleTheme: (e: React.MouseEvent<HTMLElement>) => void
  // tab props
  model: Model
  contentsRef: React.Ref<FlexLayout>
  componentMap: Map<string, JSX.Element>
  closeTab: (componentId: string) => void
}

const Layout: React.SFC<ILayoutProps> = props => {
  const layoutTheme = createMuiTheme({
    typography: { useNextVariants: true },
    palette: { type: props.theme, primary: teal },
  })
  return (
    <MuiThemeProvider theme={layoutTheme}>
      <div className="default-layout">
        <Header {...props} />
        <Menu {...props} />
        <main className="default-layout__contents">
          <Contents layoutRef={props.contentsRef} {...props} />
        </main>
      </div>
    </MuiThemeProvider>
  )
}

export default Layout
