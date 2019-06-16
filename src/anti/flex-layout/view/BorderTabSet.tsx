import * as React from 'react'

import DockLocation from 'anti/flex-layout/lib/DockLocation'
import Border from 'anti/flex-layout/model/BorderNode'
import TabNode from 'anti/flex-layout/model/TabNode'
import BorderButton from 'anti/flex-layout/view/BorderButton'
import Layout from 'anti/flex-layout/view/Layout'

/** @hidden @internal */
interface IBorderTabSetProps {
  border: Border
  layout: Layout
}

/** @hidden @internal */
class BorderTabSet extends React.Component<IBorderTabSetProps, {}> {
  private toolbarRef = React.createRef<HTMLDivElement>()

  constructor(props: IBorderTabSetProps) {
    super(props)
  }

  render() {
    const border = this.props.border
    const style = border.getTabHeaderRect()!.styleWithPosition({})
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
    // tslint:disable-next-line:no-any
    let buttons: any[] = []
    const renderState = { buttons, headerContent: {} }
    this.props.layout.customizeTabSet(border, renderState)
    buttons = renderState.buttons

    const toolbar = (
      <div
        key="toolbar"
        ref={this.toolbarRef}
        className={'flexlayout__border_toolbar_' + border.getLocation().getName()}
      >
        {buttons}
      </div>
    )

    return (
      <div style={style} className={'flexlayout__border_' + border.getLocation().getName()}>
        <div className={'flexlayout__border_inner_' + border.getLocation().getName()}>{tabs}</div>
        {toolbar}
      </div>
    )
  }
}

export default BorderTabSet
