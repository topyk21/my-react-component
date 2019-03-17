/**
 * Selector component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import axios from 'axios'

import Selector from 'src/components/selector/view/SelectorContainer'

interface IContProps {
  /** Form label */
  formLabel: string
  /** Api, request url */
  api: string
  /** Api query string, default 'name' */
  queryKey?: string
  /** Api output key, default undefined */
  dataKey?: string
  /**
   * Data object key field array.
   * Index 0: key,
   * Index 1: value,
   * Default :['id', 'name']
   */
  fieldKey?: string[]
  /** Additional form classnaem */
  formClassName?: string
  /** If this flag is on, it is available to check multiple */
  multiple?: boolean
  /** When all check buttons are clicked, items of this number are checked */
  maxSelectedCnt?: number
  /**
   * Fetch mode.
   * 'refresh-direct' mode always reloads data.
   * 'keep-once' mode loads data only the first time you open the list.
   * 'lazy-search' mode only loads data when search keyword is existed.
   */
  fetchMode: 'refresh-always' | 'load-once' | 'lazy-search'
}
interface IContState {
  /** Data will be saved this state after fetch */
  data: object[]
  /** While fetching, this flag is on */
  fetching: boolean
  /** All fetch is finished, this flag is on. This isn't used in 'lazy-search' mode  */
  fetched: boolean
  /** This is used in 'lazy-search' mode. Prevent event bubbling of user typing */
  typingTimeout?: NodeJS.Timeout
}

class SelectorContainerWithAjax extends React.Component<IContProps, IContState> {
  static readonly USER_TYPING_TIMEOUT = 500
  private selectorRef = React.createRef<Selector>()
  private queryKey: string = 'name'
  private dataKey?: string = undefined

  constructor(props: IContProps) {
    super(props)
    this.state = {
      data: [],
      fetched: false,
      fetching: false,
    }
    this.queryKey = this.props.queryKey ? this.props.queryKey : this.queryKey
    this.dataKey = this.props.dataKey ? this.props.dataKey : this.dataKey
  }

  shouldComponentUpdate(nextProps: IContProps, nextState: IContState) {
    return (
      this.state.fetching !== nextState.fetching ||
      this.state.data !== nextState.data ||
      nextProps !== this.props
    )
  }

  getSelectedItems = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  onClickForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'lazy-search') return
    if (this.state.fetching) return
    if (this.state.fetched) return

    this.setState({ fetching: true }, () => {
      axios
        .get(this.props.api)
        .then(response =>
          this.setState({
            data: this.dataKey ? response.data[this.dataKey] : response.data,
            fetched: true,
            fetching: false,
          })
        )
        .catch(error => this.setState({ fetching: false }))
    })
  }

  onClickRefreshIcon = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    this.setState({ fetched: false })
  }

  onCloseList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'refresh-always') this.setState({ fetched: false })
  }

  onChangeSearchBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.fetchMode !== 'lazy-search') return true
    // Prvent typing bubbling of users
    if (this.state.typingTimeout) clearTimeout(this.state.typingTimeout)

    // Event poolling, please see https://reactjs.org/docs/events.html#event-pooling
    const searchValue = e.target.value
    const searchApi = `${this.props.api}?${this.queryKey}=${searchValue}`

    this.setState({
      fetching: true,
      typingTimeout: setTimeout(() => {
        axios
          .get(searchApi)
          .then(response =>
            this.setState({
              data: this.dataKey ? response.data[this.dataKey] : response.data,
              typingTimeout: undefined,
              fetching: false,
            })
          )
          .catch(error => this.setState({ fetching: false }))
        // tslint:disable-next-line
      }, SelectorContainerWithAjax.USER_TYPING_TIMEOUT),
    })

    return false
  }

  render() {
    return (
      <Selector
        ref={this.selectorRef}
        {...this.props}
        // selector props
        data={this.state.data}
        loading={this.state.fetching}
        onClickForm={this.onClickForm}
        onCloseList={this.onCloseList}
        onChangeSearchBox={this.onChangeSearchBox}
        onClickRefreshIcon={
          this.props.fetchMode === 'load-once' ? this.onClickRefreshIcon : undefined
        }
      />
    )
  }
}

export default SelectorContainerWithAjax
