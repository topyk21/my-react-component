import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'

import Rect from 'src/components/flex-layout/lib/Rect'
import Actions from 'src/components/flex-layout/model/Actions'
import TabNode from 'src/components/flex-layout/model/TabNode'
import RowNode from 'src/components/flex-layout/model/RowNode'
import TabSetNode from 'src/components/flex-layout/model/TabSetNode'
import Layout from 'src/components/flex-layout/view/Layout'

/** @hidden @internal */
interface ITabButtonProps {
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
interface ICloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  onMouseDown: (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => void
}

/** @hidden @internal */
const CloseButton: React.SFC<ICloseButtonProps> = props => (
  <div
    className="flexlayout__tab_button_trailing"
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onMouseDown}
    onClick={props.onClick}
  />
)

/** @hidden @internal */
class TabButton extends React.Component<ITabButtonProps, ITabButtonState> {
  contentWidth: number = 0
  private selfRef = React.createRef<HTMLDivElement>()
  private contentRef = React.createRef<HTMLInputElement>()

  constructor(props: ITabButtonProps) {
    super(props)
    this.state = { editing: false }
    this.onEndEdit = this.onEndEdit
  }

  componentDidMount() {
    this.updateRect()
  }

  componentDidUpdate() {
    this.updateRect()
    if (this.state.editing) {
      this.contentRef.current!.select()
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
      this.onClick,
      this.onDoubleClick
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
    if (event.target !== this.contentRef.current) {
      this.setState({ editing: false })
      document.body.removeEventListener('mousedown', this.onEndEdit)
      document.body.removeEventListener('touchstart', this.onEndEdit)
    }
  }

  onClose = (event: React.MouseEvent<HTMLDivElement>) => {
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

  onCloseMouseDown = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    event.stopPropagation()
  }

  updateRect = () => {
    // record position of tab in node
    const clientRect = (ReactDOM.findDOMNode(this.props.layout) as Element).getBoundingClientRect()
    const r = this.selfRef.current!.getBoundingClientRect()
    this.props.node.setTabRect(
      new Rect(r.left - clientRect.left, r.top - clientRect.top, r.width, r.height)
    )
    this.contentWidth = this.contentRef.current!.getBoundingClientRect().width
  }

  onTextBoxMouseDown = (
    event: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
    // console.log("onTextBoxMouseDown");
    event.stopPropagation()
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
    let leadingContent

    if (node.getIcon() !== undefined) {
      leadingContent = <img src={node.getIcon()} />
    }

    // allow customization of leading contents (icon) and contents
    const renderState = { leading: leadingContent, content: node.getName() }
    this.props.layout.customizeTab(node, renderState)

    const leading = <div className="flexlayout__tab_button_leading">{renderState.leading}</div>

    let content = (
      <div ref={this.contentRef} className="flexlayout__tab_button_content">
        {renderState.content}
      </div>
    )

    if (this.state.editing) {
      const contentStyle = { width: this.contentWidth + 'px' }
      content = (
        <input
          style={contentStyle}
          ref={this.contentRef}
          className="flexlayout__tab_button_textbox"
          type="text"
          autoFocus
          defaultValue={node.getName()}
          onKeyDown={this.onTextBoxKeyPress}
          onMouseDown={this.onTextBoxMouseDown}
          onTouchStart={this.onTextBoxMouseDown}
        />
      )
    }

    let closeButton
    if (this.props.node.isEnableClose()) {
      closeButton = <CloseButton onClick={this.onClose} onMouseDown={this.onCloseMouseDown} />
    }

    const buttonClass = classNames('flexlayout__tab_button', {
      'flexlayout__tab_button--selected': this.props.selected,
      'flexlayout__tab_button--unselected': !this.props.selected,
    })
    return (
      <div
        ref={this.selfRef}
        style={{
          visibility: this.props.show ? 'visible' : 'hidden',
          height: this.props.height,
        }}
        className={buttonClass}
        onMouseDown={this.onMouseDown}
        onTouchStart={this.onMouseDown}
      >
        {leading}
        {content}
        {closeButton}
      </div>
    )
  }
}

export default TabButton
