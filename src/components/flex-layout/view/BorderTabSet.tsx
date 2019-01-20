import * as React from 'react'
import DockLocation from 'src/components/flex-layout/lib/DockLocation'
import Border from 'src/components/flex-layout/model/BorderNode'
import TabNode from 'src/components/flex-layout/model/TabNode'
import BorderButton from 'src/components/flex-layout/view/BorderButton'
import Layout from 'src/components/flex-layout/view/Layout'

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
    const cm = this.props.layout.getClassName
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

    let borderClasses = cm('flexlayout__border_' + border.getLocation().getName())
    if (this.props.border.getClassName() !== undefined) {
      borderClasses += ' ' + this.props.border.getClassName()
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
        className={cm('flexlayout__border_toolbar_' + border.getLocation().getName())}
      >
        {buttons}
      </div>
    )

    return (
      <div style={style} className={borderClasses}>
        <div className={cm('flexlayout__border_inner_' + border.getLocation().getName())}>
          {tabs}
        </div>
        {toolbar}
      </div>
    )
  }
}

export default BorderTabSet
