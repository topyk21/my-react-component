import * as React from 'react'
import styled from 'styled-components'

import Rect from 'components/flex-layout/Rect'
import DropInfo from 'components/flex-layout/DropInfo'

/** @hidden @internal */
interface IDragOutlineProps {
  dropTargetRect: DropInfo
  isVisible: boolean
}

const OutlineWrapper = styled<{ rectPos: Rect }, 'div'>('div')`
  position: absolute;
  top: ${props => props.rectPos.getTop()}px;
  left: ${props => props.rectPos.getLeft()}px;
  width: ${props => props.rectPos.getWidth()}px;
  height: ${props => props.rectPos.getHeight()}px;
  transition: 0.2s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  cursor: move;
  border: 2px solid #2196f3;
  background-color: rgba(33, 150, 243, 0.2);
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1000;
  box-sizing: border-box;
`
const Outer = styled.div`
  display: table;
  width: 100%;
  height: 100%;
`
const Inner = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`
const TextCentered = styled.div`
  position: relative;
  display: inline-block;
  width: 50%;
  color: black;
  font-size: 1rem;
`

class DragOutline extends React.PureComponent<IDragOutlineProps, {}> {
  constructor(props: IDragOutlineProps) {
    super(props)
  }

  render() {
    return (
      this.props.isVisible && (
        <OutlineWrapper rectPos={this.props.dropTargetRect.rect}>
          <Outer>
            <Inner>
              <TextCentered>{this.props.dropTargetRect.node.getAttr('type')}</TextCentered>
            </Inner>
          </Outer>
        </OutlineWrapper>
      )
    )
  }
}

export default DragOutline
