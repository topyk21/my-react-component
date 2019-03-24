import * as React from 'react'

import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CircularProgress from '@material-ui/core/CircularProgress'

interface ISearchWindowProps {
  /** Class name of wrapper div */
  className?: string
  /** Loading props. Progress circular icon will be presented to search icon layer */
  loading?: boolean
  /** Text field ref */
  inputRef: React.RefObject<HTMLInputElement>
  /** Selector field ref */
  selectorRef: React.RefObject<HTMLSelectElement>
  /** Search option Type */
  searchOptions?: Array<{ key: string; value: string }>
  onChangeSearchOption?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onClickSearchIcon?: (e: React.MouseEvent<HTMLDivElement>) => void
  onKeyDownTextField?: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onClickCreateIcon?: (e: React.MouseEvent<HTMLSelectElement>) => void
}

const SearchWindow: React.SFC<ISearchWindowProps> = props => {
  const searchOptions = props.searchOptions && (
    <Select
      native
      defaultValue={props.searchOptions[0].value}
      inputRef={props.selectorRef}
      onChange={props.onChangeSearchOption}
    >
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
  const crateIcon = props.onClickCreateIcon && (
    <Fab color="primary" size="small" onClick={props.onClickCreateIcon}>
      <EditIcon />
    </Fab>
  )

  return (
    <div className={props.className}>
      {searchOptions}
      {textField}
      {crateIcon}
    </div>
  )
}

export default SearchWindow
