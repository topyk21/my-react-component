/**
 * Inifinite scroll board component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import * as _ from 'lodash'
import axios from 'axios'
import { RowMouseEventHandlerParams } from 'react-virtualized'

import InfiniteApiGrid from 'src/components/grid/infinite-api-grid/InfiniteApiGrid'

export interface IContProps {
  /** Api, request url */
  api: string
  /** Api output key, default undefined */
  dataKey?: string
  /** Data unique key, data will be merged by this */
  dataUniqueKey: string
  /** Api last page key */
  lastPageKey: string
  /** Cols, The key of output data must match the key of column */
  cols: Array<{ key: string; value: string; width: number }>
  /** Search option items, Key-value pairs */
  searchOptions: Array<{ key: string; value: string }>
  /** Additional function when click edit icon. If there is props, edit icon will be shown  */
  onClickCreateIcon?: (e: React.MouseEvent<HTMLSelectElement>) => void
  /** Additional function when click board item */
  onClickBoardItem?: (e: RowMouseEventHandlerParams) => void
}
interface IContState {
  /** Data will be saved this state after fetch */
  data: object[]
  /** Current page value */
  nextPage: number
  /** If there is next page, flag is on */
  hasNextPage: boolean
  /** While doing first page loading, this flag is on */
  firstPageLoading: boolean
  /** While doing next page loading, this flag is on */
  nextPageLoading: boolean
  /** If data is filtered, this flag is on. */
  filtered: boolean
  /**  Search options, selected key */
  searchOption: string
  /**  Search options, input data */
  searchOptionText: string
}

class Container extends React.Component<IContProps, IContState> {
  private searchOptionRef = React.createRef<HTMLSelectElement>()
  private searchTextFieldRef = React.createRef<HTMLInputElement>()
  private dataKey?: string = undefined

  constructor(props: IContProps) {
    super(props)
    this.state = {
      data: [],
      firstPageLoading: false,
      nextPageLoading: false,
      filtered: false,
      nextPage: 1,
      hasNextPage: false,
      searchOption: '',
      searchOptionText: '',
    }
    this.dataKey = this.props.dataKey ? this.props.dataKey : this.dataKey
  }

  componentDidMount() {
    this.loadFirstPage()
  }

  onClickSearchIcon = (e: React.MouseEvent<HTMLDivElement>) => {
    this.loadFirstPage()
  }

  onKeyDownTextField = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') this.loadFirstPage()
  }

  loadMoreRows = () => {
    return this.loadNextPage()
      .then(response => {
        const results = this.dataKey ? response.data[this.dataKey] : response.data
        const hasNextPage = response.data[this.props.lastPageKey] >= this.state.nextPage
        const data = Object.assign(
          [],
          _.unionBy(this.state.data, results, this.props.dataUniqueKey)
        )

        this.setState({
          data,
          hasNextPage,
          nextPageLoading: false,
          nextPage: this.state.nextPage + 1,
        })
      })
      .catch(() => {
        this.setState({ nextPageLoading: false })
      })
  }

  render() {
    return (
      <InfiniteApiGrid
        {...this.state}
        {...this.props}
        searchTextFieldRef={this.searchTextFieldRef}
        searchOptionRef={this.searchOptionRef}
        onClickSearchIcon={this.onClickSearchIcon}
        onKeyDownTextField={this.onKeyDownTextField}
        loadMoreRows={this.loadMoreRows}
      />
    )
  }

  private getApi = (api: string, nextPage: number, searchOption: string, searchWord: string) => {
    if (this.state.filtered) return `${api}?${searchOption}=${searchWord}&page=${nextPage}`

    return `${api}?page=${nextPage}`
  }

  private loadFirstPage = () => {
    const serachOptionSelectedIndex = this.searchOptionRef.current!.options.selectedIndex
    this.setState(
      {
        firstPageLoading: true,
        nextPage: 2,
        searchOption: this.props.searchOptions[serachOptionSelectedIndex].key,
        searchOptionText: this.searchTextFieldRef.current!.value,
      },
      () => {
        const { api, lastPageKey } = this.props
        const { searchOption, searchOptionText } = this.state
        const searchApi = this.getApi(api, 1, searchOption, searchOptionText)

        axios
          .get(searchApi)
          .then(response => {
            const results = this.dataKey ? response.data[this.dataKey] : response.data
            const hasNextPage = response.data[lastPageKey] >= this.state.nextPage
            this.setState({
              hasNextPage,
              firstPageLoading: false,
              filtered: true,
              data: results,
            })
          })
          .catch(error => this.setState({ firstPageLoading: false }))
      }
    )
  }

  // tslint:disable-next-line:no-any
  private loadNextPage = (): Promise<any> => {
    if (!this.state.hasNextPage || this.state.nextPageLoading) {
      return new Promise(() => {
        return
      })
    }

    const { api } = this.props
    const { nextPage, searchOption, searchOptionText } = this.state
    const searchApi = this.getApi(api, nextPage, searchOption, searchOptionText)

    return new Promise((resolve, reject) => {
      this.setState({ nextPageLoading: true }, () => {
        axios.get(searchApi).then(response => resolve(response))
      })
    })
  }
}

export default Container
