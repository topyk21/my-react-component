/**
 * Selector component
 * Made by Hong Young Gi, topyk21@gmail.com
 */
import * as React from 'react'
import axios from 'axios'

import Selector from 'src/components/selector/container/SelectorContainer'
import {
  ISelectorContainerWithAjaxState,
  ISelectorContainerWithAjaxProps,
} from 'src/components/selector/type'

class SelectorContainerWithAjax extends React.Component<
  ISelectorContainerWithAjaxProps,
  ISelectorContainerWithAjaxState
> {
  static readonly USER_TYPING_TIMEOUT = 500
  private selectorRef = React.createRef<Selector>()
  private queryKey: string = 'name'
  private dataKey?: string = undefined

  constructor(props: ISelectorContainerWithAjaxProps) {
    super(props)
    this.state = {
      data: [],
      fetched: false,
      fetching: false,
    }
    this.queryKey = this.props.queryKey ? this.props.queryKey : this.queryKey
    this.dataKey = this.props.dataKey ? this.props.dataKey : this.dataKey
  }

  shouldComponentUpdate(
    nextProps: ISelectorContainerWithAjaxProps,
    nextState: ISelectorContainerWithAjaxState
  ) {
    return (
      this.state.fetching !== nextState.fetching ||
      this.state.data !== nextState.data ||
      nextProps !== this.props
    )
  }

  getSelectedItems = () => this.selectorRef.current!.getSelectedItems()

  clearSelectedItems = () => this.selectorRef.current!.clearSelectedItems()

  render() {
    return (
      <Selector
        ref={this.selectorRef}
        data={this.state.data}
        multiple={this.props.multiple}
        maxSelectedCount={this.props.maxSelectedCount}
        selectorFormProps={{
          textFieldProps: {
            ...this.props.selectorFormTextFieldProps,
            onClick: this.onClickSelectorForm,
          },
          onClickRefreshIcon:
            this.props.fetchMode === 'load-once' ? this.onClickRefreshIcon : undefined,
        }}
        searchTextFieldProps={{
          ...this.props.searchTextFieldProps,
          onChange: this.onChangeSearchTextField,
        }}
        searchListProps={{
          ...this.props.searchListProps,
          loading: this.state.fetching,
          onClose: this.onCloseSearchList,
        }}
      />
    )
  }

  private onClickSelectorForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'lazy-search' || this.state.fetching || this.state.fetched) {
      return
    }

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

  private onClickRefreshIcon = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    this.setState({ fetched: false })
  }

  private onCloseSearchList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.fetchMode === 'refresh-always') this.setState({ fetched: false })
  }

  private onChangeSearchTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
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
}

export default SelectorContainerWithAjax
