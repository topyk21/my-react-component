// tslint:disable:no-any
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'

import Rect from 'components/flex-layout/Rect'
import Actions from 'components/flex-layout/model/Actions'
import TabNode from 'components/flex-layout/model/TabNode'
import Layout from 'components/flex-layout/view/Layout'

/** @hidden @internal */
export interface IBorderButtonProps {
  layout: Layout
  node: TabNode
  selected: boolean
  border: string
}
/** @hidden @internal */
const BorderButtonWrapper = styled<{ isSelected: boolean }, 'div'>('div')`
  display: inline-block;
  cursor: pointer;
  padding: 2px 8px 3px 8px;
  margin: 2px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  vertical-align: top;
  box-sizing: border-box;
  white-space: nowrap;
  color: ${props => (props.isSelected ? 'black' : 'gray')};
  background-color: ${props => (props.isSelected ? '#ddd' : '')};
`
/** @hidden @internal */
const BorderButtonIcon = styled.img`
  display: inline-block;
`
/** @hidden @internal */
const BorderButtonTitle = styled.div`
  display: inline-block;
`
/** @hidden @internal */
const BorderButtonExit = styled.div`
  display: inline-block;
  margin-left: 5px;
`

/** @hidden @internal */
class BorderButton extends React.Component<IBorderButtonProps, {}> {
  private borderButtonRef = React.createRef<any>()

  constructor(props: IBorderButtonProps) {
    super(props)
  }

  componentDidMount() {
    this.updateRect()
  }

  componentDidUpdate() {
    this.updateRect()
  }

  onMouseDown = (
    event: Event | React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    this.props.layout.dragStart(
      event as Event,
      'Move: ' + this.props.node.getName(),
      this.props.node,
      this.props.node.isEnableDrag(),
      this.onClick,
      () => undefined
    )
  }

  onClick = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node
    this.props.layout.doAction(Actions.selectTab(node.getId()))
  }

  onClose = (event: React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node
    this.props.layout.doAction(Actions.deleteTab(node.getId()))
  }

  onCloseMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
  }

  updateRect = () => {
    // record position of tab in border
    const clientRect = (ReactDOM.findDOMNode(this.props.layout) as Element).getBoundingClientRect()
    const r = (this.borderButtonRef.current as Element).getBoundingClientRect()
    this.props.node.setTabRect(
      new Rect(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height)
    )
  }
  /**
   * @returns
   * @memberof BorderButton
   */
  render() {
    const node = this.props.node
    const icon = node.getIcon() && <BorderButtonIcon src={node.getIcon()} />
    const content = <BorderButtonTitle>{node.getName()}</BorderButtonTitle>
    const closeButton = this.props.node.isEnableClose() && (
      <BorderButtonExit
        onClick={this.onClose}
        onMouseDown={this.onCloseMouseDown}
        onTouchStart={this.onCloseMouseDown}
      >
        Χ
      </BorderButtonExit>
    )

    return (
      <BorderButtonWrapper
        isSelected={this.props.selected}
        innerRef={this.borderButtonRef}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        {icon}
        {content}
        {closeButton}
      </BorderButtonWrapper>
    )
  }
}

export default BorderButton
