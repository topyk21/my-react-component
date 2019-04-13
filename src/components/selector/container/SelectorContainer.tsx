/**
 *  Selector Component
 *  Made by Hong Young Gi
 */
// TODO: Keyboard esc 누를 경우 popup 꺼지도록...
import * as React from 'react'
import { Map } from 'immutable'

import Selector from 'src/components/selector/view/Selector'
import { ISelectorContainerState, ISelectorContainerProps } from 'src/components/selector/type'

class SelectorContainer extends React.Component<ISelectorContainerProps, ISelectorContainerState> {
  constructor(props: ISelectorContainerProps) {
    super(props)
    this.state = {
      listOpen: false,
      listAnchorEl: null,
      selectedData: Map(),
      searchWord: '',
    }
  }

  getSelectedItems = () => this.state.selectedData

  clearSelectedItems = () => {
    this.setState({ selectedData: this.state.selectedData.clear() })
  }

  render() {
    return (
      <Selector
        listPopoverProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          anchorEl: this.state.listAnchorEl,
          open: this.state.listOpen,
          onClose: this.onCloseSearchList,
        }}
        selectorFormProps={{
          ...this.props.selectorFormProps,
          textFieldProps: {
            ...this.props.selectorFormProps.textFieldProps,
            value: this.state.selectedData.join(', '),
            onClick: this.onClickSelectorForm,
          },
          selectedCount: this.state.selectedData.size,
          onClickClearIcon: this.onClickClearIcon,
        }}
        searchTextFieldProps={{
          textFieldProps: {
            ...this.props.searchTextFieldProps,
            onChange: this.onChangeSearchTextField,
          },
          onClickCheckAllIcon: this.props.multiple ? this.onClickCheckAllIcon : undefined,
        }}
        searchListProps={{
          ...this.props.searchListProps,
          data: this.getFilteredList(this.state.searchWord),
          selectedData: this.state.selectedData,
          onClickItem: this.onClickItem,
        }}
      />
    )
  }

  private onClickSelectorForm = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.selectorFormProps.textFieldProps.onClick) {
      this.props.selectorFormProps.textFieldProps.onClick(e)
    }
    this.setState({
      listOpen: true,
      listAnchorEl: e.currentTarget,
    })
  }

  private onCloseSearchList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.searchListProps.onClose) this.props.searchListProps.onClose(e)
    this.setState({ listOpen: false })
  }

  private onClickClearIcon = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    this.setState({ selectedData: this.state.selectedData.clear() })
    return
  }

  private onChangeSearchTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
    let needToChange = true
    if (this.props.searchTextFieldProps && this.props.searchTextFieldProps.onChange) {
      needToChange = this.props.searchTextFieldProps.onChange(e)
    }

    if (needToChange) {
      this.setState({ searchWord: e.target.value })
    }
  }

  private onClickCheckAllIcon = (e: React.MouseEvent<HTMLInputElement>) => {
    const newSelectedItems = this.toggleAllItems()
    this.setState({ selectedData: newSelectedItems })
  }

  private onClickItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedItems = this.toggleSelectedItem(e.target.id, e.target.value)
    this.setState({ selectedData: newSelectedItems })
  }

  private toggleSelectedItem = (itemId: string, itemName: string) => {
    const { selectedData } = this.state
    const { multiple } = this.props
    const isClickedItem = selectedData.has(itemId)
    // if data is checked, unchecked
    if (isClickedItem) return selectedData.delete(itemId)
    // if data checked option is single, clear other data.
    if (!multiple) return selectedData.clear().set(itemId, itemName)

    return selectedData.set(itemId, itemName)
  }

  private toggleAllItems = () => {
    const { selectedData, searchWord } = this.state
    const { maxSelectedCount, searchListProps } = this.props
    const list = this.getFilteredList(searchWord)
    let maxSelectedCnt = maxSelectedCount
    let isUnchecked = false

    if (maxSelectedCnt === undefined) maxSelectedCnt = Number.MAX_SAFE_INTEGER
    // item check 여부 검사
    list.some((item, index) => {
      if (index >= maxSelectedCnt!) return true

      const key = item[searchListProps.field[0]].toString()
      isUnchecked = !selectedData.has(key)
      return isUnchecked
    })
    // 전체 item check 혹은 unchecked
    const toggleCnt = maxSelectedCnt > list.length ? list.length : maxSelectedCnt
    if (isUnchecked) {
      return selectedData.withMutations(proto => {
        for (let i = 0; i < toggleCnt; i += 1) {
          const key = list[i][searchListProps.field[0]].toString()
          const value = list[i][searchListProps.field[1]]
          proto.set(key, value)
        }
      })
    }
    return selectedData.withMutations(proto => {
      for (let i = 0; i < toggleCnt; i += 1) {
        const key = list[i][searchListProps.field[0]].toString()
        proto.delete(key)
      }
    })
  }

  private getFilteredList = (value: string) => {
    const { data, searchListProps } = this.props

    if (value.length !== 0) {
      const inputPattern = new RegExp(value, 'i')
      return data.filter(item => item[searchListProps.field[1]].search(inputPattern) > -1)
    }
    return data
  }
}

export default SelectorContainer
