/**
 * Search Option
 * Made by Hong Young Gi, topyk21@gmail.com
 *
 * 1. 만약 Data가 정상적으로 보이지 않는다면,
 *  a. Server가 죽어 Data를 못받아온 경우 => Console 창에 Error 표시 및 No Data로 표시
 *  b. Server에서 Data를 id + name 패턴으로 반환하지 않은 경우 Checkbox는 표기되나 Data는 미표기되니 참고 바랍니다.
 *
 * 2. ref로 검색조건 Data를 받아오게 설계해놓았습니다.
 *  검색조건은 모든 Page에서 별개로서 재사용 되야하기에 각 검색조건마다 status를 가지고 있어야 하는 구조에서
 *  각 검색조건을 특정 버튼을 누른 시점에서 모두 Load 해올려면 ref로 끌어오는 수밖에 없었습니다.
 *  React를 잘 모르는 자가 쉽게 사용하기 위해서 HOC등의 테크닉은 고려하지 않았으니 참고 바랍니다.
 *  (Data가 역으로 흐르는 부분이 생겨 맘에 안드는 부분입니다)
 */
import * as React from 'react'
import { connect } from 'react-redux'
import * as _ from 'lodash'

import { IReduxState } from 'src/common/GlobalReducer'
import { LayoutDirection } from 'src/common/type'
import {
  ItemCode,
  FluxItemCode,
  FetchingStatus,
  getSearchOptionItems,
  actionCreators as fluxSearchOptionActions,
} from 'src/pages/essentials/search-options/Widgets'
import LazySearchOption from 'src/pages/essentials/search-options/view/LazySearchOption'
import FluxSearchOption from 'src/pages/essentials/search-options/view/FluxSearchOption'
import SearchOptions from 'src/pages/essentials/search-options/view/SearchOptions'

interface IStateProps {
  dataMap: { [key: string]: FetchingStatus }
  layoutDirection: LayoutDirection
}
interface IDispatchProps {
  getFluxItem: (itemType: FluxItemCode) => void
  getFluxItemNextTime: (itemType: FluxItemCode) => void
}
interface IOwnProps {
  items: ItemCode[]
  onClickSearchButton: (serachOptionsJson: string) => void
}
interface IContProps extends IStateProps, IDispatchProps, IOwnProps {}
interface IContState {
  items: ItemCode[]
}

class Container extends React.Component<IContProps, IContState> {
  // tslint:disable-next-line:array-type
  private searchOptionRefs: React.RefObject<FluxSearchOption | LazySearchOption>[] = []

  constructor(props: IContProps) {
    super(props)
    this.state = {
      items: _.uniq(this.props.items),
    }
    for (let i = 0; i < this.state.items.length; i += 1) {
      this.searchOptionRefs[i] = React.createRef<FluxSearchOption | LazySearchOption>()
    }
  }

  onClickSearchButton = () => {
    const jsonData = {}
    this.state.items.map((item, index) => {
      const checkedData = this.searchOptionRefs[index].current!.getCheckedData()
      if (checkedData.size !== 0) jsonData[item] = checkedData.keySeq()
      return
    })
    const output = JSON.stringify(jsonData)
    this.props.onClickSearchButton(output)
  }

  onClickInitButton = () => {
    this.state.items.map((item, index) => {
      this.searchOptionRefs[index].current!.clearSelectedItems()
    })
  }

  onClickFluxForm = (itemType: FluxItemCode) => {
    const item = this.props.dataMap[itemType]
    if (!item.fetching && !item.fetched) this.props.getFluxItem(itemType)
  }

  onClickFluxRefreshIcon = (itemType: FluxItemCode) => {
    this.props.getFluxItemNextTime(itemType)
  }

  render() {
    return (
      <SearchOptions
        {...this.props}
        itemMap={this.props.dataMap}
        items={this.state.items}
        onClickFluxForm={this.onClickFluxForm}
        onClickFluxRefreshIcon={this.onClickFluxRefreshIcon}
        onClickSearchButton={this.onClickSearchButton}
        onClickInitButton={this.onClickInitButton}
        searchOptionRefs={this.searchOptionRefs}
      />
    )
  }
}

const mapStateToProps = (state: IReduxState) => ({
  dataMap: state.searchOptions,
  layoutDirection: state.defaultLayout.layoutDirection,
})
// tslint:disable-next-line:no-any
const mapDispatchToProps = (dispatch: any): IDispatchProps => ({
  getFluxItem: itemType => dispatch(getSearchOptionItems(itemType)),
  getFluxItemNextTime: itemType => dispatch(fluxSearchOptionActions.doFetchNextTime(itemType)),
})

export default connect<IStateProps, IDispatchProps, IOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(Container)
