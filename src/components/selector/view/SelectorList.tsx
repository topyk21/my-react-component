import * as React from 'react'
import { Map } from 'immutable'
import { AutoSizer, List, ListRowProps } from 'react-virtualized'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import { SelectorItem } from 'src/components/selector/types'
import SearchBox from 'src/components/selector/view/SearchBox'
import SelectorListItem from 'src/components/selector/view/SelectorListItem'

interface ISelectorListProps {
  position: { x: number; y: number }
  itemList: SelectorItem[]
  selectedItems: Map<string, string>
  prevSearchKeyword: string
  onClick: (itemId: string, itemName: string) => void
  onClickCheckAllIcon: (e: React.MouseEvent<HTMLElement>) => void
  onChangeSearchBox: (e: React.ChangeEvent<HTMLInputElement>) => void
  isCheckAllIconVisible?: boolean
  loading?: boolean
}

const SelectorList: React.SFC<ISelectorListProps> = props => {
  const ROW_HEIGHT = 24
  const rowRenderer = ({ key, index, style }: ListRowProps) => {
    const row = props.itemList[index]
    const id = row.id
    const label = row.name
    const isChecked = props.selectedItems.has(id)
    return (
      <SelectorListItem
        key={key}
        id={id}
        label={label}
        isChecked={isChecked}
        style={style}
        onClick={props.onClick}
      />
    )
  }
  const noRowsRenderer = () => {
    return <SelectorListItem id={'No data'} label={'No data'} />
  }

  return (
    <Paper
      className="selector-list__wrapper"
      style={{
        top: props.position.y,
        left: props.position.x,
      }}
    >
      <SearchBox
        prevSearchKeyword={props.prevSearchKeyword}
        isIconVisible={props.isCheckAllIconVisible}
        onClickIcon={props.onClickCheckAllIcon}
        onChange={props.onChangeSearchBox}
      />
      <div className="selector-list__items-wrapper">
        {props.loading && <CircularProgress className="selector-list__progress" />}
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              className="selector-list__item"
              width={width}
              height={ROW_HEIGHT * 8}
              rowHeight={ROW_HEIGHT}
              rowCount={props.itemList.length}
              rowRenderer={rowRenderer}
              noRowsRenderer={noRowsRenderer}
              overscanRowCount={10}
              // Do not remove this. it's seems to like bug in react-virtualized.
              style={{}}
            />
          )}
        </AutoSizer>
      </div>
    </Paper>
  )
}

export default SelectorList
