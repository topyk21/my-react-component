/**
 * Search Option
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import classNames from 'classnames'

import Button from '@material-ui/core/Button'

import { LayoutDirection } from 'src/common/type'
import {
  ItemCode,
  fluxItems,
  FluxItemCode,
  LazyItemCode,
  FetchingStatus,
} from 'src/pages/essentials/search-options/Widgets'
import LazySearchOption from 'src/pages/essentials/search-options/view/LazySearchOption'
import FluxSearchOption from 'src/pages/essentials/search-options/view/FluxSearchOption'

interface ISearchOptionsProps {
  // tslint:disable-next-line:array-type
  searchOptionRefs: React.RefObject<FluxSearchOption | LazySearchOption>[]
  items: ItemCode[]
  itemMap: { [key: string]: FetchingStatus }
  layoutDirection: LayoutDirection
  onClickFluxForm: (itemType: ItemCode) => void
  onClickFluxRefreshIcon: (itemType: ItemCode) => void
  onClickSearchButton: (e: React.MouseEvent<HTMLDivElement>) => void
  onClickInitButton: (e: React.MouseEvent<HTMLDivElement>) => void
}

const SearchOptions: React.SFC<ISearchOptionsProps> = props => {
  const mainItems = props.items.map((item, index) => {
    const isFluxItem = fluxItems.find(v => v === item)
    let ref = null
    if (isFluxItem) {
      const data = props.itemMap[item]
      ref = props.searchOptionRefs[index] as React.RefObject<FluxSearchOption>
      return (
        <FluxSearchOption
          key={index}
          ref={ref}
          itemType={item as FluxItemCode}
          fluxData={data}
          onClickForm={props.onClickFluxForm}
          onClickRefreshIcon={props.onClickFluxRefreshIcon}
        />
      )
    }
    // if it isn't flux item, it is lazy item unconditionally...
    ref = props.searchOptionRefs[index] as React.RefObject<LazySearchOption>
    return <LazySearchOption key={index} ref={ref} itemType={item as LazyItemCode} />
  })

  const searchOptionItems = (
    <div className="search-options__items">
      {mainItems}
      {props.children}
    </div>
  )

  const searchOptionButtons = (
    <div className="search-options__buttons">
      <Button
        className="search-options__button-item"
        variant="contained"
        color="primary"
        onClick={props.onClickSearchButton}
      >
        Search
      </Button>
      <Button
        className="search-options__button-item"
        variant="contained"
        color="primary"
        onClick={props.onClickInitButton}
      >
        Init
      </Button>
    </div>
  )

  const directionClass =
    props.layoutDirection === 'column' ? 'search-options__row-base' : 'search-options__col-base'
  const wrapperClass = classNames('search-options', directionClass)

  return (
    <div className={wrapperClass}>
      {searchOptionItems}
      {searchOptionButtons}
    </div>
  )
}
export default SearchOptions
