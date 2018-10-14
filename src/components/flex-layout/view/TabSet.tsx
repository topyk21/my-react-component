// tslint:disable:no-any
import * as React from 'react'
import styled from 'styled-components'

import Actions from 'components/flex-layout/model/Actions'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import TabNode from 'components/flex-layout/model/TabNode'
import Layout from 'components/flex-layout/view/Layout'
import TabButton from 'components/flex-layout/view/TabButton'
import PopupMenu from 'components/flex-layout/view/PopupMenu'

import OverflowImg = require('components/flex-layout/static/images/more.png')
import MaximizeImg = require('components/flex-layout/static/images/maximize.png')
import MinimizeImg = require('components/flex-layout/static/images/restore.png')

/** @hidden @internal */
export interface ITabSetProps {
  layout: Layout
  node: TabSetNode
}
/** @hidden @internal */
interface ITabSetState {
  hideTabsAfter: number
}
/** @hidden @internal */
interface IHiddenTab {
  name: string
  node: TabNode
  index: number
}
const TabToolbar = styled.div`
  top: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`
const TabMaximizeButton = styled<{ isMaximized: boolean }, 'div'>('div')`
  width: 20px;
  height: 20px;
  border: none;
  outline-width: 0;
  background: transparent url(${props => (props.isMaximized ? MinimizeImg : MaximizeImg)}) no-repeat
    center;
`
const TabOverflowButton = styled.div`
  float: left;
  width: 20px;
  height: 15px;
  margin-top: 2px;
  padding-left: 12px;
  border: none;
  font-size: 10px;
  font-family: Arial, sans-serif;
  background: transparent url(${OverflowImg}) no-repeat left;
`
const TabSetWrapper = styled.div`
  overflow: hidden;
  background-color: white;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 2px 2px 4px #aaa;
`
const TabSetHeaderWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  padding: 3px 3px 3px 5px;
  box-shadow: inset 0 0 3px 0 rgba(136, 136, 136, 0.54);
  box-sizing: border-box;
`
const TabSetHeaderOuter = styled<{ isActive: boolean; isMaximized: boolean }, 'div'>('div')`
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  background: ${props =>
    props.isMaximized
      ? 'linear-gradient(#aaa, #eee)'
      : props.isActive
        ? 'linear-gradient(#fff, #aaa)'
        : '#e8e8e8'};
`
const TabSetHeaderInner = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10000px;
`

/** @hidden @internal */
class TabSet extends React.Component<ITabSetProps, ITabSetState> {
  private recalcVisibleTabs: boolean
  private showOverflow: boolean
  private showToolbar: boolean

  private overflowButtonRef = React.createRef<any>()

  constructor(props: ITabSetProps) {
    super(props)
    this.recalcVisibleTabs = true
    this.showOverflow = false
    this.showToolbar = true
    this.state = { hideTabsAfter: 999 }
  }

  componentDidMount() {
    this.updateVisibleTabs()
  }

  componentDidUpdate() {
    this.updateVisibleTabs()
  }

  componentWillReceiveProps(nextProps: ITabSetProps) {
    this.showToolbar = true
    this.showOverflow = false
    this.recalcVisibleTabs = true
    this.setState({ hideTabsAfter: 999 })
  }

  updateVisibleTabs = () => {
    const node = this.props.node

    if (node.isEnableTabStrip() && this.recalcVisibleTabs) {
      let hideTabsAfter = 999
      for (let i = 0; i < node.getChildren().length; i += 1) {
        const child = node.getChildren()[i] as TabNode
        if (child.getTabRect()!.getRight() > node.getRect().getRight() - 20) {
          hideTabsAfter = Math.max(0, i - 1)
          this.showOverflow = node.getChildren().length > 1

          if (i === 0) {
            this.showToolbar = true
            if (child.getTabRect()!.getRight() > node.getRect().getRight() - 20) {
              this.showOverflow = false
            }
          }

          break
        }
      }
      if (this.state.hideTabsAfter !== hideTabsAfter) {
        this.setState({ hideTabsAfter })
      }
      this.recalcVisibleTabs = false
    }
  }

  onOverflowClick = (hiddenTabs: IHiddenTab[], event: React.MouseEvent<HTMLDivElement>) => {
    const element = this.overflowButtonRef.current as Element
    PopupMenu.show(element, hiddenTabs, this.onOverflowItemSelect)
  }

  onOverflowItemSelect = (item: IHiddenTab) => {
    this.props.layout.doAction(Actions.selectTab(item.node.getId()))
  }

  onMouseDown = (
    event: Event | React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const name = this.props.node.getName() ? this.props.node.getName() : ''
    this.props.layout.doAction(Actions.setActiveTabset(this.props.node.getId()))
    this.props.layout.dragStart(
      event as Event,
      'Move tabset : ' + name,
      this.props.node,
      this.props.node.isEnableDrag(),
      () => undefined,
      this.onDoubleClick
    )
  }

  onInterceptMouseDown = (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
  }

  onMaximizeToggle = () => {
    if (this.props.node.isEnableMaximize()) {
      this.props.layout.maximize(this.props.node)
    }
  }

  onDoubleClick = (event: Event) => {
    if (this.props.node.isEnableMaximize()) {
      this.props.layout.maximize(this.props.node)
    }
  }

  render() {
    const node = this.props.node
    const style = node.styleWithPosition()

    if (this.props.node.isMaximized()) {
      style.zIndex = 100
    }

    const tabs = []
    const hiddenTabs: IHiddenTab[] = []
    if (node.isEnableTabStrip()) {
      for (let i = 0; i < node.getChildren().length; i += 1) {
        let isSelected = this.props.node.getSelected() === i
        let child = node.getChildren()[i] as TabNode
        const showTab = this.state.hideTabsAfter >= i
        if (
          this.state.hideTabsAfter === i &&
          this.props.node.getSelected() > this.state.hideTabsAfter
        ) {
          hiddenTabs.push({ name: child.getName(), node: child, index: i })
          child = node.getChildren()[this.props.node.getSelected()] as TabNode
          isSelected = true
        } else if (!showTab && !isSelected) {
          hiddenTabs.push({ name: child.getName(), node: child, index: i })
        }
        if (showTab) {
          tabs.push(
            <TabButton
              layout={this.props.layout}
              node={child}
              key={child.getId()}
              selected={isSelected}
              show={showTab}
              height={node.getTabStripHeight()}
            />
          )
        }
      }
    }
    const buttons: any[] = []
    const toolbar = this.showToolbar && (
      <TabToolbar
        key="toolbar"
        // innerRef={this.tabSetToolbarRef}
        onMouseDown={this.onInterceptMouseDown}
      >
        <TabMaximizeButton
          key="max"
          isMaximized={node.isMaximized()}
          onClick={this.onMaximizeToggle}
        />
      </TabToolbar>
    )
    if (this.showToolbar && this.props.node.isEnableMaximize()) {
      buttons.push(
        <TabMaximizeButton
          key="max"
          isMaximized={node.isMaximized()}
          onClick={this.onMaximizeToggle}
        />
      )
    }

    if (this.showOverflow) {
      tabs.push(
        <TabOverflowButton
          key="overflowbutton"
          innerRef={this.overflowButtonRef}
          onClick={this.onOverflowClick.bind(this, hiddenTabs)}
          onMouseDown={this.onInterceptMouseDown}
        >
          {hiddenTabs.length}
        </TabOverflowButton>
      )
    }

    const showHeader = node.getName() !== undefined
    const isActive = node.isActive()
    const isMaximized = node.isMaximized()
    const header = showHeader && (
      <TabSetHeaderWrapper
        style={{ height: node.getHeaderHeight() + 'px' }}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        {node.getName()}
        {toolbar}
      </TabSetHeaderWrapper>
    )
    const tabStrip = showHeader ? (
      <TabSetHeaderOuter
        isActive={isActive}
        isMaximized={isMaximized}
        style={{
          height: `${node.getTabStripHeight()}px`,
          top: `${node.getHeaderHeight()}px`,
        }}
      >
        <TabSetHeaderInner>{tabs}</TabSetHeaderInner>
      </TabSetHeaderOuter>
    ) : (
      <TabSetHeaderOuter
        isActive={isActive}
        isMaximized={isMaximized}
        style={{ top: '0px', height: `${node.getTabStripHeight()}px` }}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        <TabSetHeaderInner>{tabs}</TabSetHeaderInner>
        {toolbar}
      </TabSetHeaderOuter>
    )

    return (
      <TabSetWrapper style={style}>
        {header}
        {tabStrip}
      </TabSetWrapper>
    )
  }
}

export default TabSet
