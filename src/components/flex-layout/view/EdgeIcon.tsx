import * as React from 'react'
import styled from 'styled-components'

/** @hidden @internal */
export interface IEdgeIconInfo {
  top?: number
  left?: number
  width?: number
  height?: number
}
/** @hidden @internal */
interface IEdgeIconProps {
  edgeIconInfo: IEdgeIconInfo
}
/** @hidden @internal */
const IconWrapper = styled<{ edgeInfo: IEdgeIconInfo }, 'div'>('div')`
  position: absolute;
  width: ${props => props.edgeInfo.width}px;
  height: ${props => props.edgeInfo.height}px;
  top: ${props => props.edgeInfo.top}px;
  left: ${props => props.edgeInfo.left}px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background-color: green;
  z-index: 1000;
`
/** @hidden @internal */
const EdgeIcon: React.SFC<IEdgeIconProps> = props => <IconWrapper edgeInfo={props.edgeIconInfo} />

export default EdgeIcon
