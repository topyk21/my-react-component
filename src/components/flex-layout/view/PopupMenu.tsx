import * as React from 'react'
import * as ReactDOM from 'react-dom'

/** @hidden @internal */
interface IPopupMenuProps {
  element: Element
  items: IPoupMenuItem[]
  onHide: () => void
  onSelect: (item: { index: number; name: string }) => void
}
/** @hidden @internal */
interface IPoupMenuItem {
  index: number
  name: string
}

/** @hidden @internal */
class PopupMenu extends React.Component<IPopupMenuProps, {}> {
  static show = (
    triggerElement: React.RefObject<HTMLButtonElement>,
    items: IPoupMenuItem[],
    onSelect: (item: { index: number; name: string }) => void
  ) => {
    const triggerRect = triggerElement.current!.getBoundingClientRect()
    const docRect = document.body.getBoundingClientRect()

    const elm = document.createElement('div')
    elm.className = 'flexlayout__popup_menu_container'
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
  items: IPoupMenuItem[] = []
  hidden: boolean = true
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

  onItemClick = (item: IPoupMenuItem, event: Event) => {
    this.props.onSelect(item)
    this.hide()
    event.stopPropagation()
  }

  render() {
    const items = this.props.items.map(item => (
      <div
        key={item.index}
        className="flexlayout__popup_menu_item"
        onClick={this.onItemClick.bind(this, item)}
      >
        {item.name}
      </div>
    ))

    return <div className="flexlayout__popup_menu">{items}</div>
  }
}

/** @hidden @internal */
export default PopupMenu
