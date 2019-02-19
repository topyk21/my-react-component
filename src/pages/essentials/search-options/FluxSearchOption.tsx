/**
 * Sign component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'

import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from '@material-ui/icons/Refresh'

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
        ref={this.selectorRef}
        multiple
        data={this.props.fluxData.data}
        loading={this.props.fluxData.fetching}
        formLabel={this.props.itemType}
        onClickForm={this.onClickForm}
        formSuffixIcon={
          <IconButton className="search-box__icon" onClick={this.onClickRefreshIcon}>
            <RefreshIcon />
          </IconButton>
        }
      />
    )
  }
}

export default FluxSearchOption
