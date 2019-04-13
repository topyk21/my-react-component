import * as React from 'react'
import { AutoSizer, List, ListRowProps } from 'react-virtualized'

import CircularProgress from '@material-ui/core/CircularProgress'

import Checkbox from 'src/components/checkbox'
import { ISearchListProps } from 'src/components/selector/type'

class SearchList extends React.Component<ISearchListProps, {}> {
  static readonly ROW_HEIGHT = 24

  constructor(props: ISearchListProps) {
    super(props)
  }

  rowRenderer = ({ key, index, style }: ListRowProps) => {
    const row = this.props.data[index]
    const dataIdKey = this.props.field[0]
    const dataValueKey = this.props.field[1]
    const id = row[dataIdKey].toString()
    const label = row[dataValueKey]
    const checked = this.props.selectedData.has(id)

    return (
      <Checkbox
        checkboxProps={{
          checked,
          id,
          value: label,
          onChange: this.props.onClickItem,
        }}
        formLabelProps={{
          label,
          style,
          labelPlacement: 'end',
        }}
        key={key}
        mode="toggle"
      />
    )
  }

  noRowsRenderer = () => {
    return <Checkbox formLabelProps={{ label: 'No data' }} />
  }

  render() {
    return (
      <div className="selector-list__items-wrapper">
        {this.props.loading && <CircularProgress className="selector-list__progress" />}
        {this.props.data && (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                className="selector-list__item"
                width={width}
                height={SearchList.ROW_HEIGHT * 12}
                rowHeight={SearchList.ROW_HEIGHT}
                rowCount={this.props.data.length}
                rowRenderer={this.rowRenderer}
                noRowsRenderer={this.noRowsRenderer}
                overscanRowCount={10}
                // Do not remove, it's seems to like bug in react-virtualized.
                style={{}}
              />
            )}
          </AutoSizer>
        )}
      </div>
    )
  }
}

export default SearchList
