// tslint:disable:no-any prefer-template
import * as React from 'react'
import styled from 'styled-components'

import DragDrop from 'components/flex-layout/DragDrop'
import Rect from 'components/flex-layout/Rect'
import DockLocation from 'components/flex-layout/DockLocation'

import Node from 'components/flex-layout/model/Node'
import RowNode from 'components/flex-layout/model/RowNode'
import TabNode from 'components/flex-layout/model/TabNode'
import TabSetNode from 'components/flex-layout/model/TabSetNode'
import SplitterNode from 'components/flex-layout/model/SplitterNode'
import Actions from 'components/flex-layout/model/Actions'
import Action from 'components/flex-layout/model/Action'
import Model from 'components/flex-layout/model/Model'
import IDraggable from 'components/flex-layout/model/IDraggable'
import DropInfo from 'components/flex-layout/DropInfo'

import Splitter from 'components/flex-layout/view/Splitter'
import Tab from 'components/flex-layout/view/Tab'
import TabSet from 'components/flex-layout/view/TabSet'
import EdgeIconSet from 'components/flex-layout/view/EdgeIconSet'
import DragOutline from 'components/flex-layout/view/DragOutline'

/** @hidden @internal */
interface ILayoutProps {
  model: Model
  factory: (node: TabNode) => React.ReactNode
}
/** @hidden @internal */
interface ILayoutState {
  isDragging: boolean
  dropTargetRect: Rect
}
/** @hidden @internal */
const LayoutWrapper = styled.div`
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  overflow: hidden;
`
/**
 * A React component that hosts a multi-tabbed layout
 */
export class Layout extends React.Component<ILayoutProps, ILayoutState> {
  /** @hidden @internal */
  private layoutRef = React.createRef<HTMLDivElement>()
  /** @hidden @internal */
  private layoutDomRect: ClientRect | DOMRect
  /** @hidden @internal */
  private model?: Model
  /** @hidden @internal */
  private rect: Rect
  /** @hidden @internal */
  private dragNode?: Node & IDraggable
  /** @hidden @internal */
  private dropInfo?: DropInfo

  constructor(props: ILayoutProps) {
    super(props)
    this.state = {
      isDragging: false,
      dropTargetRect: new Rect(0, 0, 0, 0),
    }
    this.model = this.props.model
    this.rect = new Rect(0, 0, 0, 0)
    this.model.setChangeListener(this.onModelChange)
  }

  /** @hidden @internal */
  componentWillReceiveProps(newProps: ILayoutProps) {
    if (this.model !== newProps.model) {
      this.model = newProps.model
      this.forceUpdate()
    }
  }

  /** @hidden @internal */
  shouldComponentUpdate(nextProps: ILayoutProps, nextState: ILayoutState) {
    return (
      nextState.isDragging !== this.state.isDragging ||
      !nextState.dropTargetRect.equals(this.state.dropTargetRect)
    )
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
  }

  /** @hidden @internal */
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRect)
  }

  /** @hidden @internal */
  onModelChange = () => {
    this.forceUpdate()
  }

  /** @hidden @internal */
  doAction = (action: Action): void => {
    this.model!.doAction(action)
  }

  /** @hidden @internal */
  updateRect = () => {
    this.layoutDomRect = this.layoutRef.current!.getBoundingClientRect()
    const nextRect = new Rect(0, 0, this.layoutDomRect.width, this.layoutDomRect.height)
    if (!nextRect.equals(this.rect)) {
      this.rect = nextRect
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
    if (tabsetNode) {
      this.doAction(Actions.addNode(json, tabsetId, DockLocation.CENTER, -1))
    }
  }

  /**
   * Adds a new tab to the active tabset (if there is one)
   * @param json the json for the new tab node
   * @hidden @internal
   */
  addTabToActiveTabSet = (json: any) => {
    const tabsetNode = this.model!.getActiveTabset()
    if (tabsetNode) {
      this.doAction(Actions.addNode(json, tabsetNode.getId(), DockLocation.CENTER, -1))
    }
  }

  /** @hidden @internal */
  dragStart = (
    event: Event | undefined,
    dragDivText: string,
    node: Node & IDraggable | undefined,
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
    return true
  }

  /** @hidden @internal */
  onDragMove = (event: Event | React.MouseEvent<Element>) => {
    const clientRect = this.layoutDomRect
    const mouseEvent = event as React.MouseEvent<HTMLDivElement>
    const pos = {
      x: mouseEvent.clientX - clientRect.left,
      y: mouseEvent.clientY - clientRect.top,
    }
    const dropInfo = this.model!.findDropTargetNode(this.dragNode!, pos.x, pos.y)
    if (dropInfo) {
      const dropTargetRect = dropInfo!.rect.clone()
      // don't change below code position
      this.dropInfo = dropInfo
      this.setState({ dropTargetRect, isDragging: true })
    }
  }

  /** @hidden @internal */
  onDragEnd = (event: Event | React.MouseEvent<HTMLDivElement>) => {
    this.setState({ isDragging: false })

    if (this.dropInfo && this.dragNode) {
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

  /** @hidden @internal */
  onCancelDrag = (wasDragging: boolean) => {
    this.setState({ isDragging: false })

    if (!wasDragging) return
  }

  /** @hidden @internal */
  maximize = (tabsetNode: TabSetNode) => {
    this.doAction(Actions.maximizeToggle(tabsetNode.getId()))
  }

  /** @hidden @internal */
  renderChildren(
    node: RowNode | TabSetNode,
    tabSetComponents: React.ReactNode[],
    tabComponents: React.ReactNode[],
    splitterComponents: React.ReactNode[]
  ) {
    const drawChildren = node.getDrawChildren()

    for (const child of drawChildren!) {
      if (child instanceof SplitterNode) {
        splitterComponents.push(
          <Splitter key={child.getId()} layout={this} layoutRef={this.layoutRef} node={child} />
        )
      } else if (child instanceof TabSetNode) {
        tabSetComponents.push(<TabSet key={child.getId()} layout={this} node={child} />)
        this.renderChildren(child, tabSetComponents, tabComponents, splitterComponents)
      } else if (child instanceof TabNode) {
        const selectedTabIdx = (child.getParent() as TabSetNode).getSelected()
        const selectedTab = child.getParent()!.getChildren()[selectedTabIdx]
        tabComponents.push(
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
    const tabSetComponents: React.ReactNode[] = []
    const tabComponents: React.ReactNode[] = []
    const splitterComponents: React.ReactNode[] = []
    this.model!.layout(this.rect)

    this.renderChildren(this.model!.getRoot(), tabSetComponents, tabComponents, splitterComponents)

    return (
      <LayoutWrapper innerRef={this.layoutRef}>
        <EdgeIconSet mainLayoutRect={this.layoutDomRect} isVisible={this.state.isDragging} />
        <DragOutline dropTargetRect={this.dropInfo!} isVisible={this.state.isDragging} />
        {tabSetComponents}
        {tabComponents}
        {splitterComponents}
      </LayoutWrapper>
    )
  }
}

export default Layout
