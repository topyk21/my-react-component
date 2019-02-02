// tslint:disable:no-any max-line-length
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import classNames from 'classnames'

import { JSMap } from 'src/components/flex-layout/lib/Types'
import DragDrop from 'src/components/flex-layout/lib/DragDrop'
import Rect from 'src/components/flex-layout/lib/Rect'
import DockLocation from 'src/components/flex-layout/lib/DockLocation'
import Node from 'src/components/flex-layout/model/Node'
import RowNode from 'src/components/flex-layout/model/RowNode'
import TabNode from 'src/components/flex-layout/model/TabNode'
import TabSetNode from 'src/components/flex-layout/model/TabSetNode'
import BorderNode from 'src/components/flex-layout/model/BorderNode'
import SplitterNode from 'src/components/flex-layout/model/SplitterNode'
import Actions from 'src/components/flex-layout/model/Actions'
import Action from 'src/components/flex-layout/model/Action'
import Model from 'src/components/flex-layout/model/Model'
import BorderSet from 'src/components/flex-layout/model/BorderSet'
import IDraggable from 'src/components/flex-layout/model/IDraggable'
import Splitter from 'src/components/flex-layout/view/Splitter'
import Tab from 'src/components/flex-layout/view/Tab'
import TabSet from 'src/components/flex-layout/view/TabSet'
import BorderTabSet from 'src/components/flex-layout/view/BorderTabSet'

import 'src/components/flex-layout/static/flex-layout.scss'

interface ILayoutProps {
  model: Model
  theme: 'light' | 'dark'
  factory: (node: TabNode) => React.ReactNode
  onAction?: (action: Action) => void
  onRenderTab?: (
    node: TabNode,
    renderValues: { leading: React.ReactNode; content: React.ReactNode }
  ) => void
  onRenderTabSet?: (
    tabSetNode: TabSetNode | BorderNode,
    renderValues: { headerContent?: React.ReactNode; buttons: React.ReactNode[] }
  ) => void
  onModelChange?: (model: Model) => void
}

/**
 * A React component that hosts a multi-tabbed layout
 */
class Layout extends React.Component<ILayoutProps, any> {
  /** @hidden @internal */
  selfRef?: HTMLDivElement

  /** @hidden @internal */
  private model?: Model
  /** @hidden @internal */
  private rect: Rect
  /** @hidden @internal */
  private centerRect?: Rect

  /** @hidden @internal */
  // private start: number = 0;
  /** @hidden @internal */
  // private layoutTime: number = 0;

  /** @hidden @internal */
  private tabIds: string[]
  /** @hidden @internal */
  private newTabJson: any
  /** @hidden @internal */
  private firstMove: boolean = false
  /** @hidden @internal */
  private dragNode?: Node & IDraggable
  /** @hidden @internal */
  private dragDiv?: HTMLDivElement
  /** @hidden @internal */
  private dragDivText: string = ''
  /** @hidden @internal */
  private dropInfo: any
  /** @hidden @internal */
  private outlineDiv?: HTMLDivElement

  /** @hidden @internal */
  private edgeRightDiv?: HTMLDivElement
  /** @hidden @internal */
  private edgeBottomDiv?: HTMLDivElement
  /** @hidden @internal */
  private edgeLeftDiv?: HTMLDivElement
  /** @hidden @internal */
  private edgeTopDiv?: HTMLDivElement
  /** @hidden @internal */
  private fnNewNodeDropped?: () => void

  constructor(props: ILayoutProps) {
    super(props)
    this.model = this.props.model
    this.rect = new Rect(0, 0, 0, 0)
    this.model.setChangeListener(this.onModelChange)
    this.updateRect = this.updateRect.bind(this)
    this.tabIds = []
  }

  /** @hidden @internal */
  componentWillReceiveProps(newProps: ILayoutProps) {
    if (this.model !== newProps.model) {
      if (this.model !== undefined) {
        this.model.setChangeListener(undefined) // stop listening to old model
      }
      this.model = newProps.model
      this.model.setChangeListener(this.onModelChange.bind(this))
      this.forceUpdate()
    }
  }

  /** @hidden @internal */
  componentDidMount() {
    this.updateRect()

    // need to re-render if size changes
    window.addEventListener('resize', this.updateRect)
  }

  /** @hidden @internal */
  componentDidUpdate() {
    this.updateRect()
    // console.log("Layout time: " + this.layoutTime +
    // ms Render time: " + (Date.now() - this.start) + "ms");
  }

  /** @hidden @internal */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRect)
  }

  /** @hidden @internal */
  onModelChange = () => {
    this.forceUpdate()
    if (this.props.onModelChange) {
      this.props.onModelChange(this.model!)
    }
  }

  /** @hidden @internal */
  doAction = (action: Action): void => {
    if (this.props.onAction !== undefined) {
      this.props.onAction(action)
    } else {
      this.model!.doAction(action)
    }
  }

  /** @hidden @internal */
  updateRect = () => {
    const domRect = (this.selfRef as HTMLDivElement).getBoundingClientRect()
    const rect = new Rect(0, 0, domRect.width, domRect.height)
    if (!rect.equals(this.rect)) {
      this.rect = rect
      this.forceUpdate()
    }
  }

  /**
   * Adds a new tab to the given tabset
   * @param tabsetId the id of the tabset where the new tab will be added
   * @param json the json for the new tab node
   */
  addTabToTabSet = (tabsetId: string, json: any) => {
    const tabsetNode = this.model!.getNodeById(tabsetId)
    if (tabsetNode !== undefined) {
      this.doAction(Actions.addNode(json, tabsetId, DockLocation.CENTER, -1))
    }
  }

  /**
   * Adds a new tab to the active tabset (if there is one)
   * @param json the json for the new tab node
   */
  addTabToActiveTabSet = (json: any) => {
    const tabsetNode = this.model!.getActiveTabset()
    if (tabsetNode !== undefined) {
      this.doAction(Actions.addNode(json, tabsetNode.getId(), DockLocation.CENTER, -1))
    }
  }

  /**
   * Adds a new tab by dragging a labeled panel to the drop location, dragging starts immediatelly
   * @param dragText the text to show on the drag panel
   * @param json the json for the new tab node
   * @param onDrop a callback to call when the drag is complete
   */
  addTabWithDragAndDrop = (dragText: string, json: any, onDrop?: () => void) => {
    this.fnNewNodeDropped = onDrop
    this.newTabJson = json
    this.dragStart(
      undefined,
      dragText,
      TabNode.fromJson(json, this.model!),
      true,
      undefined,
      undefined
    )
  }

  /**
   * Adds a new tab by dragging a labeled panel to the drop location, dragging starts when you
   * mouse down on the panel
   *
   * @param dragText the text to show on the drag panel
   * @param json the json for the new tab node
   * @param onDrop a callback to call when the drag is complete
   */
  addTabWithDragAndDropIndirect = (dragText: string, json: any, onDrop?: () => void) => {
    this.fnNewNodeDropped = onDrop
    this.newTabJson = json

    DragDrop.instance.addGlass(this.onCancelAdd)

    this.dragDivText = dragText
    this.dragDiv = document.createElement('div')
    this.dragDiv.className = 'flexlayout__drag_rect'
    this.dragDiv.innerHTML = this.dragDivText
    this.dragDiv.addEventListener('mousedown', this.onDragDivMouseDown)
    this.dragDiv.addEventListener('touchstart', this.onDragDivMouseDown)

    const r = new Rect(10, 10, 150, 50)
    r.centerInRect(this.rect)
    this.dragDiv.style.left = r.x + 'px'
    this.dragDiv.style.top = r.y + 'px'

    const rootdiv = ReactDOM.findDOMNode(this)
    rootdiv!.appendChild(this.dragDiv)
  }

  /** @hidden @internal */
  onCancelAdd = () => {
    const rootdiv = ReactDOM.findDOMNode(this)
    rootdiv!.removeChild(this.dragDiv!)
    this.dragDiv = undefined
    if (this.fnNewNodeDropped !== undefined) {
      this.fnNewNodeDropped()
      this.fnNewNodeDropped = undefined
    }
    DragDrop.instance.hideGlass()
    this.newTabJson = undefined
  }

  /** @hidden @internal */
  onCancelDrag = (wasDragging: boolean) => {
    if (wasDragging) {
      const rootdiv = ReactDOM.findDOMNode(this) as HTMLDivElement

      try {
        rootdiv.removeChild(this.outlineDiv!)
        rootdiv.removeChild(this.dragDiv!)
      } catch (e) {
        return
      }
      this.dragDiv = undefined
      this.hideEdges(rootdiv)
      if (this.fnNewNodeDropped !== undefined) {
        this.fnNewNodeDropped()
        this.fnNewNodeDropped = undefined
      }
      DragDrop.instance.hideGlass()
      this.newTabJson = undefined
    }
  }

  /** @hidden @internal */
  onDragDivMouseDown = (event: Event) => {
    event.preventDefault()
    this.dragStart(
      event,
      this.dragDivText,
      TabNode.fromJson(this.newTabJson, this.model!),
      true,
      undefined,
      undefined
    )
  }

  /** @hidden @internal */
  dragStart = (
    event: Event | undefined,
    dragDivText: string,
    node: Node & IDraggable,
    allowDrag: boolean,
    onClick?: (event: Event) => void,
    onDoubleClick?: (event: Event) => void
  ) => {
    if (this.model!.getMaximizedTabset() !== undefined || !allowDrag) {
      DragDrop.instance.startDrag(
        event,
        undefined,
        undefined,
        undefined,
        undefined,
        onClick,
        onDoubleClick
      )
    } else {
      this.dragNode = node
      this.dragDivText = dragDivText
      DragDrop.instance.startDrag(
        event,
        this.onDragStart,
        this.onDragMove,
        this.onDragEnd,
        this.onCancelDrag,
        onClick,
        onDoubleClick
      )
    }
  }

  /** @hidden @internal */
  onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
    this.dropInfo = undefined
    const rootdiv = ReactDOM.findDOMNode(this) as HTMLElement
    this.outlineDiv = document.createElement('div')
    this.outlineDiv.className = 'flexlayout__outline_rect'
    rootdiv.appendChild(this.outlineDiv)

    if (this.dragDiv === undefined) {
      this.dragDiv = document.createElement('div')
      this.dragDiv.className = 'flexlayout__drag_rect'
      this.dragDiv.innerHTML = this.dragDivText
      rootdiv.appendChild(this.dragDiv)
    }
    // add edge indicators
    this.showEdges(rootdiv)

    if (
      this.dragNode !== undefined &&
      this.dragNode instanceof TabNode &&
      this.dragNode.getTabRect() !== undefined
    ) {
      this.dragNode.getTabRect()!.positionElement(this.outlineDiv)
    }
    this.firstMove = true

    return true
  }

  /** @hidden @internal */
  onDragMove = (event: Event | React.MouseEvent<Element>) => {
    if (!this.firstMove) {
      const speed = this.model!.getAttribute('tabDragSpeed') as number
      this.outlineDiv!.style.transition = `top ${speed}s, left ${speed}s, width ${speed}s, height ${speed}s`
    }
    this.firstMove = false
    const clientRect = this.selfRef!.getBoundingClientRect()
    const mouseEvent = event as React.MouseEvent<HTMLDivElement>
    const pos = {
      x: mouseEvent.clientX - clientRect.left,
      y: mouseEvent.clientY - clientRect.top,
    }

    this.dragDiv!.style.left = pos.x - this.dragDiv!.getBoundingClientRect().width / 2 + 'px'
    this.dragDiv!.style.top = pos.y + 5 + 'px'

    const dropInfo = this.model!.findDropTargetNode(this.dragNode!, pos.x, pos.y)
    if (dropInfo) {
      this.dropInfo = dropInfo
      this.outlineDiv!.className = dropInfo.className
      dropInfo.rect.positionElement(this.outlineDiv!)
    }
  }

  /** @hidden @internal */
  onDragEnd = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    const rootdiv = ReactDOM.findDOMNode(this) as HTMLElement
    rootdiv.removeChild(this.outlineDiv!)
    rootdiv.removeChild(this.dragDiv!)
    this.dragDiv = undefined
    this.hideEdges(rootdiv)
    DragDrop.instance.hideGlass()

    if (this.dropInfo) {
      if (this.newTabJson !== undefined) {
        this.doAction(
          Actions.addNode(
            this.newTabJson,
            this.dropInfo.node.getId(),
            this.dropInfo.location,
            this.dropInfo.index
          )
        )

        if (this.fnNewNodeDropped !== undefined) {
          this.fnNewNodeDropped()
          this.fnNewNodeDropped = undefined
        }
        this.newTabJson = undefined
      } else if (this.dragNode !== undefined) {
        this.doAction(
          Actions.moveNode(
            this.dragNode.getId(),
            this.dropInfo.node.getId(),
            this.dropInfo.location,
            this.dropInfo.index
          )
        )
      }
    }
  }

  /** @hidden @internal */
  showEdges = (rootdiv: HTMLElement) => {
    if (this.model!.isEnableEdgeDock()) {
      const domRect = rootdiv.getBoundingClientRect()
      const r = this.centerRect!
      const size = 100
      const length = size + 'px'
      const radius = '50px'
      const width = '10px'

      this.edgeTopDiv = document.createElement('div')
      this.edgeTopDiv.className = 'flexlayout__edge_rect'
      this.edgeTopDiv.style.top = r.y + 'px'
      this.edgeTopDiv.style.left = r.x + (r.width - size) / 2 + 'px'
      this.edgeTopDiv.style.width = length
      this.edgeTopDiv.style.height = width
      this.edgeTopDiv.style.borderBottomLeftRadius = radius
      this.edgeTopDiv.style.borderBottomRightRadius = radius

      this.edgeLeftDiv = document.createElement('div')
      this.edgeLeftDiv.className = 'flexlayout__edge_rect'
      this.edgeLeftDiv.style.top = r.y + (r.height - size) / 2 + 'px'
      this.edgeLeftDiv.style.left = r.x + 'px'
      this.edgeLeftDiv.style.width = width
      this.edgeLeftDiv.style.height = length
      this.edgeLeftDiv.style.borderTopRightRadius = radius
      this.edgeLeftDiv.style.borderBottomRightRadius = radius

      this.edgeBottomDiv = document.createElement('div')
      this.edgeBottomDiv.className = 'flexlayout__edge_rect'
      this.edgeBottomDiv.style.bottom = domRect.height - r.getBottom() + 'px'
      this.edgeBottomDiv.style.left = r.x + (r.width - size) / 2 + 'px'
      this.edgeBottomDiv.style.width = length
      this.edgeBottomDiv.style.height = width
      this.edgeBottomDiv.style.borderTopLeftRadius = radius
      this.edgeBottomDiv.style.borderTopRightRadius = radius

      this.edgeRightDiv = document.createElement('div')
      this.edgeRightDiv.className = 'flexlayout__edge_rect'
      this.edgeRightDiv.style.top = r.y + (r.height - size) / 2 + 'px'
      this.edgeRightDiv.style.right = domRect.width - r.getRight() + 'px'
      this.edgeRightDiv.style.width = width
      this.edgeRightDiv.style.height = length
      this.edgeRightDiv.style.borderTopLeftRadius = radius
      this.edgeRightDiv.style.borderBottomLeftRadius = radius

      rootdiv.appendChild(this.edgeTopDiv)
      rootdiv.appendChild(this.edgeLeftDiv)
      rootdiv.appendChild(this.edgeBottomDiv)
      rootdiv.appendChild(this.edgeRightDiv)
    }
  }

  /** @hidden @internal */
  hideEdges = (rootdiv: HTMLElement) => {
    if (this.model!.isEnableEdgeDock()) {
      try {
        rootdiv.removeChild(this.edgeTopDiv!)
        rootdiv.removeChild(this.edgeLeftDiv!)
        rootdiv.removeChild(this.edgeBottomDiv!)
        rootdiv.removeChild(this.edgeRightDiv!)
      } catch (e) {
        return
      }
    }
  }

  /** @hidden @internal */
  maximize = (tabsetNode: TabSetNode) => {
    this.doAction(Actions.maximizeToggle(tabsetNode.getId()))
  }

  /** @hidden @internal */
  customizeTab = (
    tabNode: TabNode,
    renderValues: { leading: React.ReactNode; content: React.ReactNode }
  ) => {
    if (this.props.onRenderTab) {
      this.props.onRenderTab(tabNode, renderValues)
    }
  }

  /** @hidden @internal */
  customizeTabSet = (
    tabSetNode: TabSetNode | BorderNode,
    renderValues: { headerContent?: React.ReactNode; buttons: React.ReactNode[] }
  ) => {
    if (this.props.onRenderTabSet) {
      this.props.onRenderTabSet(tabSetNode, renderValues)
    }
  }

  /** @hidden @internal */
  renderBorder = (
    borderSet: BorderSet,
    borderComponents: React.ReactNode[],
    tabComponents: JSMap<React.ReactNode>,
    splitterComponents: React.ReactNode[]
  ) => {
    for (const border of borderSet.getBorders()) {
      if (border.isShowing()) {
        borderComponents.push(
          <BorderTabSet
            key={'border_' + border.getLocation().getName()}
            border={border}
            layout={this}
          />
        )
        const drawChildren = border.getDrawChildren()
        for (let i = 0; i < drawChildren.length; i += 1) {
          const child = drawChildren[i]

          if (child instanceof SplitterNode) {
            splitterComponents.push(<Splitter key={child.getId()} layout={this} node={child} />)
          } else if (child instanceof TabNode) {
            tabComponents[child.getId()] = (
              <Tab
                key={child.getId()}
                layout={this}
                node={child}
                selected={i === border.getSelected()}
                factory={this.props.factory}
              />
            )
          }
        }
      }
    }
  }

  /** @hidden @internal */
  renderChildren = (
    node: RowNode | TabSetNode,
    tabSetComponents: React.ReactNode[],
    tabComponents: JSMap<React.ReactNode>,
    splitterComponents: React.ReactNode[]
  ) => {
    const drawChildren = node.getDrawChildren()

    for (const child of drawChildren!) {
      if (child instanceof SplitterNode) {
        splitterComponents.push(<Splitter key={child.getId()} layout={this} node={child} />)
      } else if (child instanceof TabSetNode) {
        tabSetComponents.push(<TabSet key={child.getId()} layout={this} node={child} />)
        this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents)
      } else if (child instanceof TabNode) {
        const selectedIdx = (child.getParent() as TabSetNode).getSelected()
        const selectedTab = child.getParent()!.getChildren()[selectedIdx]
        if (selectedTab === undefined) {
          return // this should not happen!
        }
        tabComponents[child.getId()] = (
          <Tab
            key={child.getId()}
            layout={this}
            node={child}
            selected={child === selectedTab}
            factory={this.props.factory}
          />
        )
      } else {
        // is row
        this.renderChildren(child as RowNode, tabSetComponents, tabComponents, splitterComponents)
      }
    }
  }

  /** @hidden @internal */
  render() {
    // this.start = Date.now();
    const borderComponents: React.ReactNode[] = []
    const tabSetComponents: React.ReactNode[] = []
    const tabComponents: JSMap<React.ReactNode> = {}
    const splitterComponents: React.ReactNode[] = []

    this.centerRect = this.model!.layout(this.rect)

    this.renderBorder(
      this.model!.getBorderSet(),
      borderComponents,
      tabComponents,
      splitterComponents
    )
    this.renderChildren(this.model!.getRoot(), tabSetComponents, tabComponents, splitterComponents)

    const nextTopIds: string[] = []
    const nextTopIdsMap: JSMap<string> = {}

    // Keep any previous tabs in the same DOM order as before,
    // removing any that have been deleted
    this.tabIds.forEach(t => {
      if (tabComponents[t]) {
        nextTopIds.push(t)
        nextTopIdsMap[t] = t
      }
    })
    this.tabIds = nextTopIds

    // Add tabs that have been added to the DOM
    Object.keys(tabComponents).forEach(t => {
      if (!nextTopIdsMap[t]) {
        this.tabIds.push(t)
      }
    })

    // this.layoutTime = (Date.now() - this.start);
    const layoutClass = classNames('flexlayout__layout', {
      flexlayout__light: this.props.theme === 'light',
      flexlayout__dark: this.props.theme === 'dark',
    })
    return (
      <div ref={self => (this.selfRef = self === null ? undefined : self)} className={layoutClass}>
        {tabSetComponents}
        {this.tabIds.map(t => {
          return tabComponents[t]
        })}
        {borderComponents}
        {splitterComponents}
      </div>
    )
  }
}

export default Layout
