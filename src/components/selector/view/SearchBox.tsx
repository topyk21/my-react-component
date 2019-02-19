import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import DoneAllIcon from '@material-ui/icons/DoneAll'

interface ICheckIconProps {
  prevSearchKeyword: string
  onClickIcon: (e: React.MouseEvent<HTMLElement>) => void
}
interface ISearchBoxProps extends ICheckIconProps {
  isIconVisible?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckAllIcon: React.SFC<ICheckIconProps> = props => (
  <InputAdornment position="end">
    <IconButton className="search-box__icon" onClick={props.onClickIcon}>
      <DoneAllIcon />
    </IconButton>
  </InputAdornment>
)

class SearchBox extends React.Component<ISearchBoxProps, {}> {
  constructor(props: ISearchBoxProps) {
    super(props)
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <TextField
        fullWidth
        autoFocus
        margin="dense"
        label="검색어"
        variant="outlined"
        defaultValue={this.props.prevSearchKeyword}
        onChange={this.props.onChange}
        InputProps={{
          endAdornment: this.props.isIconVisible && <CheckAllIcon {...this.props} />,
        }}
      />
    )
  }
}

export default SearchBox
