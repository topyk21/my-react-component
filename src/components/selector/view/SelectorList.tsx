import * as React from 'react'
import { Map } from 'immutable'
import { AutoSizer, List, ListRowProps } from 'react-virtualized'

import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

import SearchBox from 'src/components/selector/view/SearchBox'
import SelectorListItem from 'src/components/selector/view/SelectorListItem'

interface ISelectorListProps {
  position: { x: number; y: number }
  itemList: object[]
  field: string[]
  selectedItems: Map<string, string>
  searchWord: string
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
    const dataIdKey = props.field[0]
    const dataValueKey = props.field[1]
    const id = row[dataIdKey]
    const label = row[dataValueKey]
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
        searchWord={props.searchWord}
        isIconVisible={props.isCheckAllIconVisible}
        onClickIcon={props.onClickCheckAllIcon}
        onChange={props.onChangeSearchBox}
      />
      <div className="selector-list__items-wrapper">
        {props.loading && <CircularProgress className="selector-list__progress" />}
        {props.itemList && (
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
        )}
      </div>
    </Paper>
  )
}

export default SelectorList
