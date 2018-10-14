// tslint:disable:no-any
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'

import Rect from 'components/flex-layout/Rect'
import Layout from 'components/flex-layout/view/Layout'
import Actions from 'components/flex-layout/model/Actions'
import TabNode from 'components/flex-layout/model/TabNode'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import RowNode from 'components/flex-layout/model/RowNode'

/** @hidden @internal */
export interface ITabButtonProps {
  layout: Layout
  node: TabNode
  show: boolean
  selected: boolean
  height: number
}
/** @hidden @internal */
interface ITabButtonState {
  editing: boolean
}
/** @hidden @internal */
const TabButtonWrapper = styled<{ isSelected: boolean; isVisible: boolean; height: number }, 'div'>(
  'div'
)`
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  height: ${props => props.height}px;
  cursor: pointer;
  padding: 2px 8px 3px 8px;
  margin: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  float: left;
  vertical-align: top;
  box-sizing: border-box;
  color: ${props => (props.isSelected ? 'black' : 'gray')};
  font-weight: bold;
  background-color: ${props => (props.isSelected ? '#ddd' : '')};
  &:hover {
    color: black;
  }
`
const TabButtonIcon = styled.img`
  display: inline-block;
`
const TabButtonTitle = styled.div`
  display: inline-block;
`
const TabButtonEditableTitle = styled<{ width: number }, 'input'>('input')`
  width: ${props => props.width}px;
  float: left;
  border: none;
  color: green;
  background-color: white;
  &:focus {
    outline: none;
  }
`
const TabButtonExit = styled.div`
  display: inline-block;
  margin-left: 5px;
  &:hover {
    color: red;
  }
`
/** @hidden @internal */
class TabButton extends React.Component<ITabButtonProps, ITabButtonState> {
  contentWidth: number = 0

  private tabButtonRef = React.createRef<any>()
  private tabButtonTitleRef = React.createRef<any>()

  constructor(props: ITabButtonProps) {
    super(props)
    this.state = { editing: false }
    this.onEndEdit = this.onEndEdit.bind(this)
  }

  componentDidMount() {
    this.updateRect()
  }

  componentDidUpdate() {
    this.updateRect()
    if (this.state.editing) {
      (this.tabButtonTitleRef.current as HTMLInputElement).select()
    }
  }

  onMouseDown = (
    event: Event | React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    this.props.layout.dragStart(
      event as Event,
      'Move: ' + this.props.node.getName(),
      this.props.node,
      this.props.node.isEnableDrag(),
      this.onClick.bind(this),
      this.onDoubleClick.bind(this)
    )
  }

  onClick = (event: Event) => {
    const node = this.props.node
    this.props.layout.doAction(Actions.selectTab(node.getId()))
  }

  onDoubleClick = (event: Event) => {
    if (this.props.node.isEnableRename()) {
      this.setState({ editing: true })
      document.body.addEventListener('mousedown', this.onEndEdit)
      document.body.addEventListener('touchstart', this.onEndEdit)
    } else {
      const parentNode = this.props.node.getParent() as TabSetNode
      if (parentNode.isEnableMaximize()) {
        this.props.layout.maximize(parentNode)
      }
    }
  }

  onEndEdit = (event: Event) => {
    if (event.target !== this.tabButtonTitleRef.current) {
      this.setState({ editing: false })
      document.body.removeEventListener('mousedown', this.onEndEdit)
      document.body.removeEventListener('touchstart', this.onEndEdit)
    }
  }

  onCloseTab = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

    const tab = this.props.node
    const tabSet = tab.getParent() as TabSetNode
    const rowNode = tabSet.getParent() as RowNode

    this.props.layout.doAction(Actions.deleteTab(tab.getId()))
    if (tabSet.getChildren().length === 0) {
      const defaultTabSet = rowNode.getChildren()[0]
      this.props.layout.doAction(Actions.setActiveTabset(defaultTabSet.getId()))
    }
  }

  updateRect() {
    // record position of tab in node
    const clientRect = (ReactDOM.findDOMNode(this.props.layout) as Element).getBoundingClientRect()
    const r = (this.tabButtonRef.current as Element).getBoundingClientRect()
    this.props.node.setTabRect(
      new Rect(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height)
    )
    this.contentWidth = (this.tabButtonTitleRef.current as Element).getBoundingClientRect().width
  }

  onTextBoxKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(event, event.keyCode);
    if (event.keyCode === 27) {
      // esc
      this.setState({ editing: false })
    } else if (event.keyCode === 13) {
      // enter
      this.setState({ editing: false })
      const node = this.props.node
      this.props.layout.doAction(
        Actions.renameTab(node.getId(), (event.target as HTMLInputElement).value)
      )
    }
  }

  doRename = (node: TabNode, newName: string) => {
    this.props.layout.doAction(Actions.renameTab(node.getId(), newName))
  }

  render() {
    const node = this.props.node
    const icon = node.getIcon() && <TabButtonIcon src={node.getIcon()} />
    const content = this.state.editing ? (
      <TabButtonEditableTitle
        width={this.contentWidth}
        innerRef={this.tabButtonTitleRef}
        type="text"
        autoFocus={true}
        defaultValue={node.getName()}
        onKeyDown={this.onTextBoxKeyPress}
      />
    ) : (
      <TabButtonTitle innerRef={this.tabButtonTitleRef}>{node.getName()}</TabButtonTitle>
    )
    const closeButton = this.props.node.isEnableClose() && (
      <TabButtonExit onMouseDown={this.onCloseTab}>Χ</TabButtonExit>
    )

    return (
      <TabButtonWrapper
        isSelected={this.props.selected}
        isVisible={this.props.show}
        height={this.props.height}
        innerRef={this.tabButtonRef}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        {icon}
        {content}
        {closeButton}
      </TabButtonWrapper>
    )
  }
}

export default TabButton
