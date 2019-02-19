/**
 * Sign component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import axios from 'axios'

import { SelectorItem } from 'src/components/selector'
import Selector from 'src/components/selector/view/SelectorContainer'

interface IApiSelectorProps {
  /** Form label */
  formLabel: string
  /** Api, request url */
  dataApi: string
  /** Additional form classnaem */
  formClassName?: string
  /** If this flag is on, it is available to check multiple */
  multiple?: boolean
  /** When all check buttons are clicked, items of this number are checked */
  maxSelectedCnt?: number
  /**
   * Fetch mode.
   * 'refresh-direct' mode always reloads data.
   * 'keep-once' mode loads data only the first time you open the list
   */
  fetchMode: 'refresh-direct' | 'keep-once' | 'lazy-search'
  /** Additonal functions when the form is clicked  */
  onClickForm?: (e: React.MouseEvent<HTMLDivElement>) => void
  /** Additonal functions when the form is clicked  */
  onRightClickForm?: (e: React.MouseEvent<HTMLDivElement>) => void
  /**
   * Additonal functions when the search box value is changed.
   * When this props is used, the general filter function of the selector will not work.
   */
  onChangeSearchBox?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
interface IApiSelectorState {
  /** Data will be saved this state after fetch */
  data: SelectorItem[]
  /** While fetching, this flag is on */
  fetching: boolean
  /** All fetch is finished, this flag is on. This isn't used in 'lazy-search' mode  */
  fetched: boolean
  /** This is used in 'lazy-search' mode. Prevent event bubbling of user typing */
  typingTimeout?: NodeJS.Timeout
}

class ApiSelector extends React.Component<IApiSelectorProps, IApiSelectorState> {
  static readonly USER_TYPING_TIMEOUT = 350
  private selectorRef = React.createRef<Selector>()

  constructor(props: IApiSelectorProps) {
    super(props)
    this.state = {
      data: [],
      fetched: false,
      fetching: false,
    }
  }

  getSelectedItems = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  onClickForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'lazy-search') return
    if (this.state.fetching) return
    if (this.state.fetched) return

    this.setState({ fetching: true }, () => {
      this.getItem(this.props.dataApi)
        .then(response =>
          this.setState({
            data: response.data,
            fetched: true,
            fetching: false,
          })
        )
        .catch(error => this.setState({ fetching: false }))
    })
  }

  onCloseList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'refresh-direct') this.setState({ fetched: false })
  }

  onChangeSearchBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.fetchMode !== 'lazy-search') return
    // Prvent typing bubbling of users
    if (this.state.typingTimeout) clearTimeout(this.state.typingTimeout)
    // Event poolling, please see https://reactjs.org/docs/events.html#event-pooling
    const searchValue = e.target.value
    const searchApi = `${this.props.dataApi}?name=${searchValue}`

    this.setState({
      fetching: true,
      typingTimeout: setTimeout(() => {
        this.getItem(searchApi)
          .then(response =>
            this.setState({
              data: response.data,
              typingTimeout: undefined,
              fetching: false,
            })
          )
          .catch(error => this.setState({ fetching: false }))
        // tslint:disable-next-line
      }, ApiSelector.USER_TYPING_TIMEOUT),
    })
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
      />
    )
  }

  private getItem = (api: string) => {
    return axios.get(api)
  }
}

export default ApiSelector
