import * as React from 'react'
import { Map } from 'immutable'
import classNames from 'classnames'

import SelectorForm from 'src/components/selector/view/SelectorForm'
import SelectorList from 'src/components/selector/view/SelectorList'

interface IDefaultFormProps {
  // tslint:disable-next-line:no-any
  selectorRef: React.RefObject<any>
  formLabel: string
  formText: string
  formClassName?: string
  formSuffixIcon?: JSX.Element
  selectedItems: Map<string, string>
  onClickForm: (e: React.MouseEvent<HTMLElement>) => void
  onRightClickForm?: (e: React.MouseEvent<HTMLElement>) => void
  onClearForm: (e: React.MouseEvent<HTMLElement>) => void
  onClickRefreshIcon?: (e: React.MouseEvent<HTMLElement>) => void
}
interface IListFormProps {
  list: object[]
  field: string[]
  listPosition: { x: number; y: number }
  isListIconVisible?: boolean
  selectedItems: Map<string, string>
  searchWord: string
  onClickList: (itemId: string, itemName: string) => void
  onCloseList: (e: React.MouseEvent<HTMLDivElement>) => void
  onClickSearchBoxIcon: (e: React.MouseEvent<HTMLDivElement>) => void
  onChangeSearchBox: (e: React.ChangeEvent<HTMLInputElement>) => void
  loading?: boolean
}

interface ISelectorProps extends IDefaultFormProps, IListFormProps {
  isListVisible: boolean
}

const DefaultForm: React.SFC<IDefaultFormProps> = props => {
  const formClass = classNames('selector-form', props.formClassName)
  return (
    <div className={formClass} ref={props.selectorRef}>
      <SelectorForm
        label={props.formLabel}
        innerText={props.formText}
        selectedCnt={props.selectedItems.size}
        additionalIcon={props.formSuffixIcon}
        onClick={props.onClickForm}
        onContextMenu={props.onRightClickForm}
        onClickClearIcon={props.onClearForm}
        onClickRefreshIcon={props.onClickRefreshIcon}
      />
      {props.children}
    </div>
  )
}
const ListForm: React.SFC<IListFormProps> = props => (
  <React.Fragment>
    <div className="selector-list-overlay" onClick={props.onCloseList} />
    <SelectorList
      {...props}
      position={props.listPosition}
      itemList={props.list}
      isCheckAllIconVisible={props.isListIconVisible}
      onClick={props.onClickList}
      onClickCheckAllIcon={props.onClickSearchBoxIcon}
      onChangeSearchBox={props.onChangeSearchBox}
    />
  </React.Fragment>
)

class Selector extends React.Component<ISelectorProps, {}> {
  render() {
    return (
      <DefaultForm {...this.props}>
        {this.props.isListVisible && <ListForm {...this.props} />}
      </DefaultForm>
    )
  }
}

export default Selector
