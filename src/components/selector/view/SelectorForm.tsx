import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import RefreshIcon from '@material-ui/icons/Refresh'

interface IIconLayerProps {
  onClickClearIcon: (e: React.MouseEvent<HTMLElement>) => void
  onClickRefreshIcon?: (e: React.MouseEvent<HTMLElement>) => void
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
    {props.onClickRefreshIcon && (
      <IconButton className="selector-form__icon" onClick={props.onClickRefreshIcon}>
        <RefreshIcon />
      </IconButton>
    )}
    <Badge color="secondary" className="selector-form__badge" badgeContent={props.selectedCnt}>
      <IconButton className="selector-form__icon" onClick={props.onClickClearIcon}>
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
        endAdornment: <IconLayer {...props} />,
      }}
      InputLabelProps={{ shrink: true }}
    />
  </FormControl>
)

export default SelectorForm
