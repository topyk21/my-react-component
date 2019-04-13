import * as React from 'react'

import Paper from '@material-ui/core/Paper'
import Popover from '@material-ui/core/Popover'

import SearchTextField from 'src/components/selector/view/SearchTextField'
import SearchList from 'src/components/selector/view/SearchList'
import SelectorForm from 'src/components/selector/view/SelectorForm'
import { ISelectorProps } from 'src/components/selector/type'

const Selector: React.SFC<ISelectorProps> = props => (
  <React.Fragment>
    <SelectorForm {...props.selectorFormProps} />
    <Popover className="selector-list-popper" {...props.listPopoverProps}>
      <Paper className="selector-list__wrapper">
        <SearchTextField {...props.searchTextFieldProps} />
        <SearchList {...props.searchListProps} />
      </Paper>
    </Popover>
  </React.Fragment>
)

export default Selector
