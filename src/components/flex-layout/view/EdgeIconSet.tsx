import * as React from 'react'

import EdgeIcon, { IEdgeIconInfo } from 'components/flex-layout/view/EdgeIcon'

/** @hidden @internal */
interface IEdgeIconSetProps {
  isVisible: boolean
  mainLayoutRect: ClientRect | DOMRect
}
/** @hidden @internal */
interface IEdgeIconSetState {
  edgeSet: IEdgeIconInfo[]
}
/** @hidden @internal */
class EdgeIconSet extends React.Component<IEdgeIconSetProps, IEdgeIconSetState> {
  private static TOP_ICON: number = 0
  private static BOTTOM_ICON: number = 1
  private static LEFT_ICON: number = 2
  private static RIGHT_ICON: number = 3
  private static ICON_WIDTH = 100
  private static ICON_HEIGHT = 10

  constructor(props: IEdgeIconSetProps) {
    super(props)
    this.state = {
      edgeSet: [{}, {}, {}, {}],
    }
  }

  componentWillReceiveProps() {
    const nextEdgeSet = this.calcEdgeSetPosition()
    this.setState({ edgeSet: nextEdgeSet })
  }

  shouldComponentUpdate(nextProps: IEdgeIconSetProps) {
    return nextProps.mainLayoutRect !== this.props.mainLayoutRect
  }

  calcEdgeSetPosition = () => {
    if (!this.props.mainLayoutRect) return [{}, {}, {}, {}]

    const { mainLayoutRect } = this.props
    const calcResult: IEdgeIconInfo[] = [{}, {}, {}, {}]
    const horizonMidPos = (mainLayoutRect.width - EdgeIconSet.ICON_WIDTH) / 2
    const verticalMidPos = (mainLayoutRect.height - EdgeIconSet.ICON_WIDTH) / 2
    calcResult[EdgeIconSet.TOP_ICON].top = 0
    calcResult[EdgeIconSet.TOP_ICON].left = horizonMidPos
    calcResult[EdgeIconSet.TOP_ICON].width = EdgeIconSet.ICON_WIDTH
    calcResult[EdgeIconSet.TOP_ICON].height = EdgeIconSet.ICON_HEIGHT

    calcResult[EdgeIconSet.BOTTOM_ICON].top = mainLayoutRect.height - EdgeIconSet.ICON_HEIGHT
    calcResult[EdgeIconSet.BOTTOM_ICON].left = horizonMidPos
    calcResult[EdgeIconSet.BOTTOM_ICON].width = EdgeIconSet.ICON_WIDTH
    calcResult[EdgeIconSet.BOTTOM_ICON].height = EdgeIconSet.ICON_HEIGHT

    calcResult[EdgeIconSet.LEFT_ICON].top = verticalMidPos
    calcResult[EdgeIconSet.LEFT_ICON].left = 0
    calcResult[EdgeIconSet.LEFT_ICON].width = EdgeIconSet.ICON_HEIGHT
    calcResult[EdgeIconSet.LEFT_ICON].height = EdgeIconSet.ICON_WIDTH

    calcResult[EdgeIconSet.RIGHT_ICON].top = verticalMidPos
    calcResult[EdgeIconSet.RIGHT_ICON].left = mainLayoutRect.width - EdgeIconSet.ICON_HEIGHT
    calcResult[EdgeIconSet.RIGHT_ICON].width = EdgeIconSet.ICON_HEIGHT
    calcResult[EdgeIconSet.RIGHT_ICON].height = EdgeIconSet.ICON_WIDTH

    return calcResult
  }

  render() {
    const { edgeSet } = this.state
    return (
      this.props.isVisible && (
        <React.Fragment>
          <EdgeIcon edgeIconInfo={edgeSet[EdgeIconSet.TOP_ICON]} />
          <EdgeIcon edgeIconInfo={edgeSet[EdgeIconSet.BOTTOM_ICON]} />
          <EdgeIcon edgeIconInfo={edgeSet[EdgeIconSet.LEFT_ICON]} />
          <EdgeIcon edgeIconInfo={edgeSet[EdgeIconSet.RIGHT_ICON]} />
        </React.Fragment>
      )
    )
  }
}

export default EdgeIconSet
