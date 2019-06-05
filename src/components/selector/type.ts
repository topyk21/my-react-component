import { Map } from 'immutable'
import { StandardTextFieldProps } from '@material-ui/core/TextField'
import { PopoverProps } from '@material-ui/core/Popover'

import { Omit } from 'src/common/type'

type SearchTextField = Omit<StandardTextFieldProps, 'autoFocus' | 'fullWidth' | 'InputProps'>

/**
 * Selector Click 시 나오는 List의 검색 박스 View interface 입니다.
 *
 * @export
 * @interface ISearchTextFieldProps
 */
export interface ISearchTextFieldProps {
  /** Material ui의 text field props, autoFocus/fullWidth/InputProps 속성은 고정 */
  textFieldProps: SearchTextField
  /** 전부 체크 icon 클릭시 event 정의  */
  onClickCheckAllIcon?: (e: React.MouseEvent<HTMLElement>) => void
}

/**
 * Selector Click 시 나오는 List의 Item box의 View interface 입니다.
 *
 * @export
 * @interface ISearchListProps
 */
export interface ISearchListProps {
  data: object[]
  /**
   * 표현될 Data의 field id를 지정합니다.
   * @example ['id', 'name']
   * @field [0]: Logic 수행시 Item 구별 key
   * @field [1]: View에 표현될 label
   */
  field: string[]
  /**
   * 선택된 Item들을 전달합니다. 해당 Map을 토대로 Item의 체크여부를 판단합니다.
   *
   * @type {Map<string, string>}
   * @memberof ISearchListProps
   */
  selectedData: Map<string, string>
  /**
   * Loading flag입니다. true 시, List에 원형 Progress bar가 표현됩니다.
   *
   * @type {boolean}
   * @memberof ISearchListProps
   */
  loading?: boolean
  /**
   * Item click시 발생할 event를 지정합니다.
   * event.id와 event.value를 통해 click된 Item 값에 접근 가능합니다.
   * @memberof ISearchListProps
   */
  onClickItem: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type SelectorFormTextField = Omit<StandardTextFieldProps, 'InputLabelProps' | 'InputProps'>

export interface ISelectorFormProps {
  textFieldProps: SelectorFormTextField
  /**
   * 선택된 Item의 갯수
   * Selector에 Badge로 표현되는 수량입니다.
   *
   * @type {number}
   * @memberof ISelectorFormProps
   */
  selectedCount: number
  /**
   * Clear icon Click 시 동작할 event prop
   *
   * @memberof ISelectorFormProps
   */
  onClickClearIcon: (e: React.MouseEvent<HTMLElement>) => void
  /**
   * Refresh icon Click 시 동작할 event prop
   * 실제 icon 표시는 해당 prop이 주입될 때만 표시됩니다.
   *
   * @memberof ISelectorFormProps
   */
  onClickRefreshIcon?: (e: React.MouseEvent<HTMLElement>) => void
}

export interface ISelectorProps {
  /**
   * Material ui Popover
   *
   * @type {PopoverProps}
   * @memberof ISelectorProps
   */
  listPopoverProps: PopoverProps
  /**
   * List의 검색어 영역
   *
   * @type {ISearchTextFieldProps}
   * @memberof ISelectorProps
   */
  searchTextFieldProps: ISearchTextFieldProps
  /**
   * List의 item 영역
   *
   * @type {ISearchListProps}
   * @memberof ISelectorProps
   */
  searchListProps: ISearchListProps
  /**
   * Main Selector form 영역
   *
   * @type {ISelectorFormProps}
   * @memberof ISelectorProps
   */
  selectorFormProps: ISelectorFormProps
}

/**
 * Selector list의 검색 text field material ui 속성을 지정합니다.
 * onChange는 내부 logic 처리를 위하여 boolean을 return 하도록 변환하였습니다.
 */
interface ISearchTextFieldContainerProps extends SearchTextField {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => boolean
}

/**
 * Selector click 시 나올 item 영역의 사용자 노출 속성을 정의합니다.
 */
interface ISearchListContainerProps
  extends Omit<ISearchListProps, 'selectedData' | 'onClickItem' | 'data'> {
  onClose?: (e: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * Main Selector form의 사용자 노출 속성을 정의합니다.
 *
 * @interface ISelectorFormContainerProps
 * @extends {Omit<ISelectorFormProps, 'selectedCount' | 'onClickClearIcon' | 'textFieldProps'>}
 */
export interface ISelectorFormContainerProps
  extends Omit<ISelectorFormProps, 'selectedCount' | 'onClickClearIcon' | 'textFieldProps'> {
  textFieldProps: Omit<SelectorFormTextField, 'value'>,
  buttonId?: string
}

/**
 * User에게 노출되는 실제 Selector 속성
 * 당신이 일반 Page 개발자라면, 해당 속성의 문제 혹은 추가 필요 속성을 상위에 건의하십시오.
 *
 * @export
 * @interface ISelectorContainerProps
 */
export interface ISelectorContainerProps {
  /** 기본 Data */
  data: object[]
  /** 다중 체크 가능 여부 */
  multiple?: boolean
  /** Check all icon click 시, 최대 check 될 item 갯수 제한 */
  maxSelectedCount?: number
  /**
   * Selector list의 검색어 text field material ui 속성을 지정합니다.
   */
  searchTextFieldProps?: ISearchTextFieldContainerProps
  /**
   * Selector list의 속성을 지정합니다.
   */
  searchListProps: ISearchListContainerProps
  /**
   * Selector form의 속성을 지정합니다.
   */
  selectorFormProps: ISelectorFormContainerProps
}

/**
 * Selector Container state
 *
 * @export
 * @interface ISelectorContainerState
 */
export interface ISelectorContainerState {
  /** Search List Open flag */
  listOpen: boolean
  /** Search list의 position을 결정하기 위한 앵커 */
  listAnchorEl: HTMLElement | null | undefined
  /**
   * 선택된 Dataset.
   * 해당 Data는 getSelectedItems()에 의해 외부로 노출됩니다.
   */
  selectedData: Map<string, string>
  /** 현재 검색어 */
  searchWord: string
}

/**
 * User에게 노출되는 실제 Selector with ajax 속성
 * 당신이 일반 Page 개발자라면, 해당 속성의 문제 혹은 추가 필요 속성을 상위에 건의하십시오.
 *
 * @export
 * @interface ISelectorContainerWithAjaxProps
 */
export interface ISelectorContainerWithAjaxProps
  extends Omit<ISelectorContainerProps, 'data' | 'selectorFormProps'> {
  /** Request url을 담고있는 end point api */
  api: string
  /**
   * Api 요청시 파라미터로 사용할 query string id
   * @default 'name'
   */
  queryKey?: string
  /**
   * Api 응답 결과 key
   * @default undefined
   */
  dataKey?: string
  /**
   * Fetch mode.
   * @property refresh-direct: search-list open 시 항상 data를 fetch해 옵니다.
   * @property keep-once: 초기 search-list open 시에만 data를 fetch해 옵니다.
   * @property lazy-search: 검색어가 바뀔때만 data를 fetch를 가져옵니다.
   */
  fetchMode: 'refresh-always' | 'load-once' | 'lazy-search'
  /**
   * Selector form의 material ui 속성을 지정합니다.
   * value와 onClick event는 내부 사용으로 인해 사용 불가능 합니다.
   */
  selectorFormTextFieldProps?: Omit<SelectorFormTextField, 'value' | 'onClick'>
}

/**
 * Selector Container state
 *
 * @export
 * @interface ISelectorContainerWithAjaxState
 */
export interface ISelectorContainerWithAjaxState {
  /** Fetch 된 data는 이곳에 저장 됩니다 */
  data: object[]
  /** Fetching 중에는 해당 flag가 on 됩니다 */
  fetching: boolean
  /**
   * 이미 Data를 fetch한 상태라면, 해당 flag가 on 되며, lazy-search mode에서 해당 상태는 무시됩니다.
   * lazy-search mode의 경우 값 입력 시 항상 data를 가져오는 구조이기 때문에,
   * 이미 fetch된 상태인지 체크할 필요가 없기 때문입니다.
   */
  fetched: boolean
  /**
   * lazy-search mode를 위하여 존재하는 timer로,
   * User의 typing에 의한 event bubbling을 차단합니다.
   */
  typingTimeout?: NodeJS.Timeout
}
