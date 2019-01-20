// tslint:disable:prefer-template
import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
  selfRef?: HTMLDivElement
  contentsRef?: HTMLDivElement

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
    const r = (this.selfRef as Element).getBoundingClientRect()
    this.props.node.setTabRect(
      new Rect(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height)
    )
  }

  render() {
    const cm = this.props.layout.getClassName
    let classNames =
      cm('flexlayout__border_button') + ' ' + cm('flexlayout__border_button_' + this.props.border)
    const node = this.props.node

    if (this.props.selected) {
      classNames += ' ' + cm('flexlayout__border_button--selected')
    } else {
      classNames += ' ' + cm('flexlayout__border_button--unselected')
    }

    if (this.props.node.getClassName() !== undefined) {
      classNames += ' ' + this.props.node.getClassName()
    }

    let leadingContent

    if (node.getIcon() !== undefined) {
      leadingContent = <img src={node.getIcon()} />
    }

    const content = (
      <div
        ref={ref => (this.contentsRef = ref === null ? undefined : ref)}
        className={cm('flexlayout__border_button_content')}
      >
        {node.getName()}
      </div>
    )

    let closeButton
    if (this.props.node.isEnableClose()) {
      closeButton = (
        <div
          className={cm('flexlayout__border_button_trailing')}
          onMouseDown={this.onCloseMouseDown}
          onClick={this.onClose}
          onTouchStart={this.onCloseMouseDown}
        />
      )
    }

    return (
      <div
        ref={ref => (this.selfRef = ref === null ? undefined : ref)}
        style={{}}
        className={classNames}
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
