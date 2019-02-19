/**
 *  Selector Component
 *  Made by Hong Young Gi
 */
import * as React from 'react'
import { Map } from 'immutable'

import { SelectorItem } from 'src/components/selector/types'
import Selector from 'src/components/selector/view/Selector'

export interface IContProps {
  /** Form label */
  formLabel: string
  /** Input data */
  data: SelectorItem[]
  /** Additional form classnaem */
  formClassName?: string
  /** If this flag is on, THE list will apperar to be loading */
  loading?: boolean
  /** If this flag is on, it is available to check multiple */
  multiple?: boolean
  /** When all check buttons are clicked, items of this number are checked */
  maxSelectedCnt?: number
  /** If you want add suffix icon to form, using this props */
  formSuffixIcon?: JSX.Element
  /** Additonal functions when the form is clicked  */
  onClickForm?: (e: React.MouseEvent<HTMLDivElement>) => void
  /** Additonal functions when the form is clicked  */
  onRightClickForm?: (e: React.MouseEvent<HTMLDivElement>) => void
  /**
   * Additonal functions when the search box value is changed.
   * When this props is used, the general filter function of the selector will not work.
   */
  onChangeSearchBox?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Additonal functions when the form list is closed  */
  onCloseList?: (e: React.MouseEvent<HTMLDivElement>) => void
}
interface IContState {
  /** List mouting flag */
  isListVisible: boolean
  /** List position. Dom control element... */
  listPosition: {
    x: number
    y: number
  }
  /**
   * Selected Item set.
   * This item is exposed to the parent using getSelectedItems() functions.
   */
  selectedItems: Map<string, string>
  /** Form text. The id of checked data is represented here */
  formText: string
  /**  Search keyword */
  searchWord: string
}

class SelectorContainer extends React.Component<IContProps, IContState> {
  private selectorRef = React.createRef<HTMLDivElement>()

  constructor(props: IContProps) {
    super(props)
    this.state = {
      isListVisible: false,
      listPosition: { x: 0, y: 0 },
      selectedItems: Map(),
      formText: '',
      searchWord: '',
    }
  }

  getSelectedItems = () => this.state.selectedItems

  clearSelectedItems = () => {
    this.setState({ selectedItems: this.state.selectedItems.clear(), formText: '' })
  }

  onClickForm = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = this.selectorRef.current!.getBoundingClientRect()
    this.setState({
      isListVisible: true,
      listPosition: { x: rect.left, y: rect.top + rect.height },
    })
    if (this.props.onClickForm) this.props.onClickForm(e)
  }

  onCloseList = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.onCloseList) this.props.onCloseList(e)
    this.setState({ isListVisible: false })
  }

  onClearForm = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    this.setState({ selectedItems: this.state.selectedItems.clear(), formText: '' })
    return
  }

  onChangeSearchBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChangeSearchBox) this.props.onChangeSearchBox(e)
    this.setState({ searchWord: e.target.value })
  }

  onClickSearchBoxIcon = (e: React.MouseEvent<HTMLInputElement>) => {
    const newSelectedItems = this.toggleAllItems()
    this.setState({ selectedItems: newSelectedItems, formText: newSelectedItems.join(', ') })
  }

  onClickList = (itemId: string, itemName: string) => {
    const newSelectedItems = this.toggleSelectedItem(itemId, itemName)
    this.setState({ selectedItems: newSelectedItems, formText: newSelectedItems.join(', ') })
  }

  render() {
    const list = this.getFilteredList(this.state.searchWord)
    return (
      <Selector
        {...this.state}
        {...this.props}
        list={list}
        isListIconVisible={this.props.multiple}
        prevSearchKeyword={this.state.searchWord}
        selectorRef={this.selectorRef}
        onClickForm={this.onClickForm}
        onClearForm={this.onClearForm}
        onClickList={this.onClickList}
        onCloseList={this.onCloseList}
        onClickSearchBoxIcon={this.onClickSearchBoxIcon}
        onChangeSearchBox={this.onChangeSearchBox}
      />
    )
  }

  private toggleSelectedItem = (itemId: string, itemName: string) => {
    const { selectedItems } = this.state
    const { multiple } = this.props
    const isClickedItem = selectedItems.has(itemId)
    // if data is checked, unchecked
    if (isClickedItem) return selectedItems.delete(itemId)
    // if data checked option is single, clear other data.
    if (!multiple) return selectedItems.clear().set(itemId, itemName)

    return selectedItems.set(itemId, itemName)
  }

  private toggleAllItems = () => {
    const { selectedItems } = this.state
    const list = this.getFilteredList(this.state.searchWord)
    let maxSelectedCnt = this.props.maxSelectedCnt
    let isUnchecked = false

    if (maxSelectedCnt === undefined) maxSelectedCnt = Number.MAX_SAFE_INTEGER
    // item check 여부 검사
    list.some((item, index) => {
      if (index >= maxSelectedCnt!) return true

      isUnchecked = !selectedItems.has(item.id)
      return isUnchecked
    })
    // 전체 item check 혹은 unchecked
    const toggleCnt = maxSelectedCnt > list.length ? list.length : maxSelectedCnt
    if (isUnchecked) {
      return selectedItems.withMutations(proto => {
        for (let i = 0; i < toggleCnt; i += 1) {
          proto.set(list[i].id, list[i].name)
        }
      })
    }
    return selectedItems.withMutations(proto => {
      for (let i = 0; i < toggleCnt; i += 1) {
        proto.delete(list[i].id)
      }
    })
  }

  private getFilteredList = (inputText: string) => {
    if (this.props.onChangeSearchBox) return this.props.data
    if (inputText.length === 0) return this.props.data

    const inputPattern = new RegExp(inputText, 'i')
    return this.props.data.filter(item => item!.name.search(inputPattern) > -1)
  }
}

export default SelectorContainer
