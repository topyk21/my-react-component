/**
 * Inifinite scroll grid component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import {
  AutoSizer,
  Table,
  Column,
  RowMouseEventHandlerParams,
  Index,
  InfiniteLoader,
} from 'react-virtualized'

import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

interface IBoardListProps {
  /** List of items loaded so far */
  rows: object[]
  /** Mapping column */
  cols: Array<{ key: string; value: string; width: number }>
  /** Page loading flag */
  nextPageLoading: boolean
  /**
   * Callback function (eg. Redux action-creator) responsible for loading the next page of items
   */
  // tslint:disable-next-line:no-any
  loadMoreRows: () => Promise<any>
  /** Row click event */
  onClickRow?: (info: RowMouseEventHandlerParams) => void
}

const InfiniteVirtualGrid: React.SFC<IBoardListProps> = props => {
  const ROW_HEIGHT = 36
  const noRowsRenderer = () => <div>No data</div>
  const rowGetter = ({ index }: Index) => props.rows[index]
  const isRowLoaded = ({ index }: Index) => !!props.rows[index]

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={props.loadMoreRows}
      rowCount={props.rows.length + 1}
    >
      {({ onRowsRendered, registerChild }) => (
        <Paper className="infinite-virtual-grid">
          <AutoSizer>
            {({ height, width }) => (
              <Table
                ref={registerChild}
                rowClassName="infinite-virtual-grid__row"
                headerClassName="infinite-virtual-grid__header"
                width={width}
                height={height}
                headerHeight={ROW_HEIGHT}
                rowCount={props.rows.length}
                rowGetter={rowGetter}
                rowHeight={ROW_HEIGHT}
                noRowsRenderer={noRowsRenderer}
                onRowsRendered={onRowsRendered}
                onRowClick={props.onClickRow}
              >
                {props.cols.map(col => (
                  <Column key={col.key} dataKey={col.key} label={col.value} width={col.width} />
                ))}
              </Table>
            )}
          </AutoSizer>
          {props.nextPageLoading && <CircularProgress className="infinite-virtual-grid__loading" />}
        </Paper>
      )}
    </InfiniteLoader>
  )
}

export default InfiniteVirtualGrid
