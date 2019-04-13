/**
 * Sign component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import { Selector } from 'src/components/selector'
import { FluxItemCode, FetchingStatus } from 'src/pages/essentials/search-options/Widgets'

interface IFluxSearchOptionProps {
  fluxData: FetchingStatus
  itemType: FluxItemCode
  onClickForm: (itemType: FluxItemCode) => void
  onClickRefreshIcon: (itemType: FluxItemCode) => void
}

class FluxSearchOption extends React.Component<IFluxSearchOptionProps, {}> {
  private selectorRef = React.createRef<Selector>()

  constructor(props: IFluxSearchOptionProps) {
    super(props)
  }

  shouldComponentUpdate(nextProps: IFluxSearchOptionProps) {
    return nextProps.fluxData !== this.props.fluxData
  }

  getCheckedData = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  onClickForm = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onClickForm(this.props.itemType)
  }

  onClickRefreshIcon = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    this.props.onClickRefreshIcon(this.props.itemType)
  }

  render() {
    return (
      <Selector
        data={this.props.fluxData.data}
        multiple
        ref={this.selectorRef}
        searchListProps={{
          field: ['id', 'name'],
          loading: this.props.fluxData.fetching,
        }}
        selectorFormProps={{
          buttonId: this.props.itemType,
          onClickRefreshIcon: this.onClickRefreshIcon,
          textFieldProps: { label: this.props.itemType, onClick: this.onClickForm },
        }}
      />
    )
  }
}

export default FluxSearchOption
