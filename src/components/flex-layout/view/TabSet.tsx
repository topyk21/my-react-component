// tslint:disable:no-any
import * as React from 'react'
import styled from 'styled-components';

import Actions from 'components/flex-layout/model/Actions'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import TabNode from 'components/flex-layout/model/TabNode'

import Layout from 'components/flex-layout/view/Layout'
import TabButton from 'components/flex-layout/view/TabButton'
import PopupMenu from 'components/flex-layout/view/PopupMenu'

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

/** @hidden @internal */
class TabSet extends React.Component<ITabSetProps, ITabSetState> {
  recalcVisibleTabs: boolean
  showOverflow: boolean
  showToolbar: boolean

  private tabSetToolbarRef = React.createRef<any>()
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
      const toolbarWidth = (this.tabSetToolbarRef.current as Element).getBoundingClientRect().width
      let hideTabsAfter = 999
      for (let i = 0; i < node.getChildren().length; i += 1) {
        const child = node.getChildren()[i] as TabNode
        if (child.getTabRect()!.getRight() > node.getRect().getRight() - (20 + toolbarWidth)) {
          hideTabsAfter = Math.max(0, i - 1)
          // console.log("tabs truncated to:" + hideTabsAfter);
          this.showOverflow = node.getChildren().length > 1

          if (i === 0) {
            this.showToolbar = false
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
    // console.log("hidden tabs: " + hiddenTabs);
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
    let buttons: any[] = []

    // allow customization of header contents and buttons
    const renderState = { buttons, headerContent: node.getName() }
    this.props.layout.customizeTabSet(this.props.node, renderState)
    const headerContent = renderState.headerContent
    buttons = renderState.buttons

    let toolbar
    if (this.showToolbar) {
      if (this.props.node.isEnableMaximize()) {
        buttons.push(
          <button
            key="max"
            className={'flexlayout__tab_toolbar_button-' + (node.isMaximized() ? 'max' : 'min')}
            onClick={this.onMaximizeToggle}
          />
        )
      }
      toolbar = (
        <div
          key="toolbar"
          ref={this.tabSetToolbarRef}
          className="flexlayout__tab_toolbar"
          onMouseDown={this.onInterceptMouseDown}
        >
          {buttons}
        </div>
      )
    }

    if (this.showOverflow) {
      tabs.push(
        <button
          key="overflowbutton"
          ref={this.overflowButtonRef}
          className="flexlayout__tab_button_overflow"
          onClick={this.onOverflowClick.bind(this, hiddenTabs)}
          onMouseDown={this.onInterceptMouseDown}
        >
          {hiddenTabs.length}
        </button>
      )
    }

    const showHeader = node.getName() !== undefined
    let header
    let tabStrip

    let tabStripClasses = 'flexlayout__tab_header_outer'
    if (this.props.node.getClassNameTabStrip() !== undefined) {
      tabStripClasses += ' ' + this.props.node.getClassNameTabStrip()
    }
    if (node.isActive() && !showHeader) {
      tabStripClasses += ' flexlayout__tabset-selected'
    }

    if (node.isMaximized() && !showHeader) {
      tabStripClasses += ' flexlayout__tabset-maximized'
    }

    if (showHeader) {
      let tabHeaderClasses = 'flexlayout__tabset_header'
      if (node.isActive()) {
        tabHeaderClasses += ' flexlayout__tabset-selected'
      }
      if (node.isMaximized()) {
        tabHeaderClasses += ' flexlayout__tabset-maximized'
      }
      if (this.props.node.getClassNameHeader() !== undefined) {
        tabHeaderClasses += ' ' + this.props.node.getClassNameHeader()
      }

      header = (
        <div
          className={tabHeaderClasses}
          style={{ height: node.getHeaderHeight() + 'px' }}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onMouseDown}
        >
          {headerContent}
          {toolbar}
        </div>
      )
      tabStrip = (
        <div
          className={tabStripClasses}
          style={{ height: node.getTabStripHeight() + 'px', top: node.getHeaderHeight() + 'px' }}
        >
          <div className="flexlayout__tab_header_inner">{tabs}</div>
        </div>
      )
    } else {
      tabStrip = (
        <div
          className={tabStripClasses}
          style={{ top: '0px', height: node.getTabStripHeight() + 'px' }}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onMouseDown}
        >
          <div className="flexlayout__tab_header_inner">{tabs}</div>
          {toolbar}
        </div>
      )
    }

    return (
      <div style={style} className="flexlayout__tabset">
        {header}
        {tabStrip}
      </div>
    )
  }
}

export default TabSet
