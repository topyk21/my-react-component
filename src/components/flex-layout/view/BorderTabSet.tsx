// tslint:disable:no-any
import * as React from 'react'
import styled from 'styled-components'

import DockLocation from 'components/flex-layout/DockLocation'
import Border from 'components/flex-layout/model/BorderNode'
import TabNode from 'components/flex-layout/model/TabNode'
import BorderButton from 'components/flex-layout/view/BorderButton'
import Layout from 'components/flex-layout/view/Layout'

/** @hidden @internal */
export interface IBorderTabSetProps {
  border: Border
  layout: Layout
}
/** @hidden @internal */
const BorderTabSetWrapper = styled.div`
  background-color: #eeeeee;
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  overflow: hidden;
`
/** @hidden @internal */
const HorizontalBorderInner = styled.div`
  display: flex;
`
/** @hidden @internal */
const HorizontalBorderToolbar = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  top: 0;
  bottom: 0;
  right: 0;
`
/** @hidden @internal */
const VerticalBorderInner = styled<{ borderSide: string }, 'div'>('div')`
  position: absolute;
  white-space: nowrap;
  ${props => (props.borderSide === 'left' ? 'right: 23px' : 'left: 23px')};
  transform-origin: ${props => (props.borderSide === 'left' ? 'top right' : 'top left')};
  transform: ${props => (props.borderSide === 'left' ? 'rotate(-90deg)' : 'rotate(90deg)')};
`
/** @hidden @internal */
const VerticalBorderToolbar = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
`
/** @hidden @internal */
class BorderTabSet extends React.Component<IBorderTabSetProps, {}> {
  constructor(props: IBorderTabSetProps) {
    super(props)
  }

  render() {
    const border = this.props.border
    const styleWithPosition = border.getTabHeaderRect()!.styleWithPosition({})
    const tabs = []
    if (border.getLocation() !== DockLocation.LEFT) {
      for (let i = 0; i < border.getChildren().length; i += 1) {
        const isSelected = border.getSelected() === i
        const child = border.getChildren()[i] as TabNode
        tabs.push(
          <BorderButton
            layout={this.props.layout}
            border={border.getLocation().getName()}
            node={child}
            key={child.getId()}
            selected={isSelected}
          />
        )
      }
    } else {
      for (let i = border.getChildren().length - 1; i >= 0; i -= 1) {
        const isSelected = border.getSelected() === i
        const child = border.getChildren()[i] as TabNode
        tabs.push(
          <BorderButton
            layout={this.props.layout}
            border={border.getLocation().getName()}
            node={child}
            key={child.getId()}
            selected={isSelected}
          />
        )
      }
    }

    // allow customization of tabset right/bottom buttons
    let buttons: any[] = []
    const renderState = { buttons, headerContent: {} }
    const borderSide = border.getLocation().getName()
    this.props.layout.customizeTabSet(border, renderState)
    buttons = renderState.buttons

    const tabArea =
      borderSide === 'bottom' || borderSide === 'top' ? (
        <HorizontalBorderInner>{tabs}</HorizontalBorderInner>
      ) : (
        <VerticalBorderInner borderSide={borderSide}>{tabs}</VerticalBorderInner>
      )
    const toolbar =
      borderSide === 'bottom' || borderSide === 'top' ? (
        <HorizontalBorderToolbar key="toolbar">{buttons}</HorizontalBorderToolbar>
      ) : (
        <VerticalBorderToolbar key="toolbar">{buttons}</VerticalBorderToolbar>
      )

    return (
      <BorderTabSetWrapper style={styleWithPosition}>
        {tabArea}
        {toolbar}
      </BorderTabSetWrapper>
    )
  }
}

export default BorderTabSet
