import * as React from 'react'

import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CircularProgress from '@material-ui/core/CircularProgress'

interface IBasicSearchWindowProps {
  /** Class name of wrapper div */
  className?: string
  /** Loading props. Progress circular icon will be presented to search icon layer */
  loading?: boolean
  /** Text field ref */
  inputRef: React.RefObject<HTMLInputElement>
  /** Current search option */
  searchOption?: string
  /** Search option Type */
  searchOptions?: Array<{ key: string; value: string }>
  onChangeSearchOption?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClickSearchIcon?: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyDownTextField?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onClickEditIcon?: (e: React.MouseEvent<HTMLSelectElement>) => void
}

const BasicSearchWindow: React.SFC<IBasicSearchWindowProps> = props => {
  const searchOptions = props.searchOptions && (
    <Select native value={props.searchOption} onChange={props.onChangeSearchOption}>
      {props.searchOptions.map(item => (
        <option key={item.key} value={item.value}>
          {item.value}
        </option>
      ))}
    </Select>
  )
  const textField = (
    <TextField
      inputRef={props.inputRef}
      onKeyDown={props.onKeyDownTextField}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={props.onClickSearchIcon}>
              {props.loading ? <CircularProgress size={30} /> : <SearchIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
  const editIcon = props.onClickEditIcon && (
    <Fab color="primary" size="small" onClick={props.onClickEditIcon}>
      <EditIcon />
    </Fab>
  )

  return (
    <div className={props.className}>
      {searchOptions}
      {textField}
      {editIcon}
    </div>
  )
}

export default BasicSearchWindow
