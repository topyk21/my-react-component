// tslint:disable:no-any
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'

/** @hidden @internal */
interface IPopupMenuItem {
  index: number
  name: string
}
/** @hidden @internal */
export interface IPopupMenuProps {
  element: Element
  items: IPopupMenuItem[]
  onHide: () => void
  onSelect: (item: IPopupMenuItem) => void
}
/** @hidden @internal */
const PoupupItem = styled.div`
  padding: 2px 10px 2px 10px;
  &:hover {
    background-color: lightgray;
  }
`
/** @hidden @internal */
const PoupupMenuWrapper = styled.div``

/** @hidden @internal */
class PopupMenu extends React.Component<IPopupMenuProps, any> {
  static show(
    triggerElement: Element,
    items: IPopupMenuItem[],
    onSelect: (item: IPopupMenuItem) => void
  ) {
    const triggerRect = triggerElement.getBoundingClientRect()
    const docRect = document.body.getBoundingClientRect()

    const elm = document.createElement('div')
    elm.style.boxShadow = 'inset 0 0 5px rgba(0, 0, 0, .15)'
    elm.style.border = '1px solid lightgrey'
    elm.style.borderRadius = '3px'
    elm.style.position = 'absolute'
    elm.style.zIndex = '1000'
    elm.style.background = 'white'
    elm.style.right = docRect.right - triggerRect.right + 'px'
    elm.style.top = triggerRect.bottom + 'px'
    document.body.appendChild(elm)

    const onHide = () => {
      ReactDOM.unmountComponentAtNode(elm)
      document.body.removeChild(elm)
    }

    ReactDOM.render(
      <PopupMenu element={elm} onSelect={onSelect} onHide={onHide} items={items} />,
      elm
    )
  }

  items: IPopupMenuItem[] = []
  hidden: boolean
  elm?: Element

  constructor(props: IPopupMenuProps) {
    super(props)
    this.hidden = false
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onDocMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onDocMouseUp)
  }

  onDocMouseUp = (event: Event) => setTimeout(() => this.hide(), 0)
  hide = () => {
    if (!this.hidden) {
      this.props.onHide()
      this.hidden = true
    }
  }

  onItemClick = (item: IPopupMenuItem, event: Event) => {
    this.props.onSelect(item)
    this.hide()
    event.stopPropagation()
  }

  render() {
    const items = this.props.items.map(item => (
      <PoupupItem key={item.index} onClick={this.onItemClick.bind(this, item)}>
        {item.name}
      </PoupupItem>
    ))

    return <PoupupMenuWrapper>{items}</PoupupMenuWrapper>
  }
}

/** @hidden @internal */
export default PopupMenu
