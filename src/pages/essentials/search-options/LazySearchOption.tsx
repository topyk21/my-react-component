import * as React from 'react'

import { ApiSelector } from 'src/components/selector'
import { getApiUrl, LazyItemCode } from 'src/pages/essentials/search-options/Widgets'

interface ILazySearchOptionProps {
  itemType: LazyItemCode
}

class LazySearchOption extends React.Component<ILazySearchOptionProps, {}> {
  private selectorRef = React.createRef<ApiSelector>()

  getCheckedData = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  render() {
    const dataApi = getApiUrl(this.props.itemType)
    return (
      <ApiSelector
        multiple
        ref={this.selectorRef}
        formLabel={this.props.itemType}
        fetchMode="lazy-search"
        dataApi={dataApi}
      />
    )
  }
}

export default LazySearchOption
