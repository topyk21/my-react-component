import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'

import Rect from 'src/components/flex-layout/lib/Rect'
import Actions from 'src/components/flex-layout/model/Actions'
import TabNode from 'src/components/flex-layout/model/TabNode'
import Layout from 'src/components/flex-layout/view/Layout'

/** @hidden @internal */
interface IBorderButtonProps {
  layout: Layout
  node: TabNode
  selected: boolean
  border: string
}

/** @hidden @internal */
class BorderButton extends React.Component<IBorderButtonProps, {}> {
  private selfRef = React.createRef<HTMLDivElement>()
  private contentsRef = React.createRef<HTMLDivElement>()

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
      (e: Event) => undefined
    )
  }

  onClick = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node
    this.props.layout.doAction(Actions.selectTab(node.getId()))
  }

  onClose = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const node = this.props.node
    this.props.layout.doAction(Actions.deleteTab(node.getId()))
  }

  onCloseMouseDown = (
    event: Event | React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
  }

  updateRect = () => {
    // record position of tab in border
    const clientRect = (ReactDOM.findDOMNode(this.props.layout) as Element).getBoundingClientRect()
    const r = this.selfRef.current!.getBoundingClientRect()
    this.props.node.setTabRect(
      new Rect(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height)
    )
  }

  render() {
    const borderButtonClass = classNames(
      'flexlayout__border_button',
      'flexlayout__border_button_' + this.props.border,
      {
        'flexlayout__border_button--selected': this.props.selected,
        'flexlayout__border_button--unselected': !this.props.selected,
      }
    )
    const node = this.props.node
    let leadingContent

    if (node.getIcon() !== undefined) {
      leadingContent = <img src={node.getIcon()} />
    }

    const content = (
      <div ref={this.contentsRef} className="flexlayout__border_button_content">
        {node.getName()}
      </div>
    )

    let closeButton
    if (this.props.node.isEnableClose()) {
      closeButton = (
        <div
          className="flexlayout__border_button_trailing"
          onMouseDown={this.onCloseMouseDown}
          onClick={this.onClose}
          onTouchStart={this.onCloseMouseDown}
        />
      )
    }

    return (
      <div
        ref={this.selfRef}
        style={{}}
        className={borderButtonClass}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        {leadingContent}
        {content}
        {closeButton}
      </div>
    )
  }
}

export default BorderButton
