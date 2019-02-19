import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'

interface IIconLayerProps {
  onClickClearIcon: (e: React.MouseEvent<HTMLElement>) => void
  selectedCnt: number
  additionalIcon?: JSX.Element
}
interface IBadgeFormProps extends IIconLayerProps {
  label: string
}
interface ISelectorFormProps extends IBadgeFormProps {
  innerText: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLElement>) => void
}

const IconLayer: React.SFC<IIconLayerProps> = props => (
  <InputAdornment position="end">
    {props.additionalIcon}
    <Badge color="secondary" className="search-box__badge" badgeContent={props.selectedCnt}>
      <IconButton className="search-box__icon" onClick={props.onClickClearIcon}>
        <ClearIcon />
      </IconButton>
    </Badge>
  </InputAdornment>
)

const SelectorForm: React.SFC<ISelectorFormProps> = props => (
  <FormControl fullWidth={true}>
    <TextField
      label={props.label}
      value={props.innerText}
      onClick={props.onClick}
      onContextMenu={props.onContextMenu}
      placeholder={''}
      InputProps={{
        style: { fontSize: 'small' },
        readOnly: true,
        endAdornment: (
          <IconLayer
            selectedCnt={props.selectedCnt}
            onClickClearIcon={props.onClickClearIcon}
            additionalIcon={props.additionalIcon}
          />
        ),
      }}
      InputLabelProps={{ shrink: true }}
    />
  </FormControl>
)

export default SelectorForm
