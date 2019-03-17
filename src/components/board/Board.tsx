// tslint:disable:no-any
import * as React from 'react'
import { RowMouseEventHandlerParams } from 'react-virtualized'

import { BasicSearchWindow } from 'src/components/search-window'
import { InfiniteVirtualGrid } from 'src/components/grid'

interface IBoardProps {
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
  searchOption: string
  searchOptions: Array<{ key: string; value: string }>
  onChangeSearchOption: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClickSearchIcon: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyDownTextField: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onClickEditIcon?: (e: React.MouseEvent<HTMLSelectElement>) => void
}

const Board: React.SFC<IBoardProps> = props => (
  <div className="board">
    <BasicSearchWindow
      className="board-search-window"
      loading={props.firstPageLoading}
      inputRef={props.searchTextFieldRef}
      {...props}
    />
    <InfiniteVirtualGrid rows={props.data} onClickRow={props.onClickBoardItem} {...props} />
  </div>
)

export default Board
