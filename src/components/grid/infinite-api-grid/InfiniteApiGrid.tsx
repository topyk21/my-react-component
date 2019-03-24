// tslint:disable:no-any
import * as React from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'

import SearchWindow from 'src/components/grid/infinite-api-grid/SearchWindow'
import { InfiniteVirtualGrid } from 'src/components/grid'

interface IInfiniteApiGridProps {
  // Grid props
  data: object[]
  cols: Array<{ key: string; value: string; width: number }>
  nextPageLoading: boolean
  hasNextPage: boolean
  loadMoreRows: () => Promise<any>
  onClickBoardItem?: (e: RowMouseEventHandlerParams) => void
  // Search window props
  firstPageLoading: boolean
  searchTextFieldRef: React.RefObject<HTMLInputElement>
  searchOptionRef: React.RefObject<HTMLSelectElement>
  searchOptions: Array<{ key: string; value: string }>
  onChangeSearchOption?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClickSearchIcon?: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyDownTextField?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onClickCreateIcon?: (e: React.MouseEvent<HTMLSelectElement>) => void
}

const InfiniteApiGrid: React.SFC<IInfiniteApiGridProps> = props => (
  <div className="infinite-api-grid">
    <SearchWindow
      className="infinite-api-grid__search-window"
      loading={props.firstPageLoading}
      inputRef={props.searchTextFieldRef}
      selectorRef={props.searchOptionRef}
      {...props}
    />
    <InfiniteVirtualGrid rows={props.data} onClickRow={props.onClickBoardItem} {...props} />
  </div>
)

export default InfiniteApiGrid
