import * as React from 'react'

import { SelectorWithAjax } from 'src/components/selector'
import { getUrl, LazyItemCode } from 'src/pages/essentials/search-options/Widgets'

interface ILazySearchOptionProps {
  itemType: LazyItemCode
}

class LazySearchOption extends React.Component<ILazySearchOptionProps, {}> {
  private selectorRef = React.createRef<SelectorWithAjax>()

  getCheckedData = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  render() {
    const dataApi = getUrl(this.props.itemType)
    return (
      <SelectorWithAjax
        api={dataApi}
        fetchMode="lazy-search"
        multiple
        ref={this.selectorRef}
        searchListProps={{ field: ['id', 'name'] }}
        selectorFormTextFieldProps={{ label: this.props.itemType }}
      />
    )
  }
}

export default LazySearchOption
