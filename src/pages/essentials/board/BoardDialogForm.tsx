import * as React from 'react'

import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import withMobileDialog, { InjectedProps } from '@material-ui/core/withMobileDialog'

import CreateIcon from '@material-ui/icons/Create'
import CloseIcon from '@material-ui/icons/Close'
import UploadIcon from '@material-ui/icons/CloudUpload'

interface IEditOrUploadButton {
  editing: boolean
  uploading?: boolean
  onClickModifyIcon?: (e: React.MouseEvent<HTMLElement>) => void
  onClickUploadIcon?: (e: React.MouseEvent<HTMLElement>) => void
}

export interface IBoardDialogFormProps extends IEditOrUploadButton {
  subject: string
  open: boolean
  onCloseDialog: (e: React.SyntheticEvent<{}, Event>) => void
}

const EditOrUploadButton: React.SFC<IEditOrUploadButton> = props => (
  <IconButton
    color="inherit"
    onClick={props.editing ? props.onClickUploadIcon : props.onClickModifyIcon}
  >
    {props.editing ? <UploadIcon /> : <CreateIcon />}
  </IconButton>
)

const BoardDialogForm: React.SFC<IBoardDialogFormProps & InjectedProps> = props => {
  const header = (
    <AppBar position="absolute">
      <Toolbar variant="dense">
        <Typography noWrap color="inherit" variant="h6" style={{ flexGrow: 1 }}>
          {props.subject}
        </Typography>
        <EditOrUploadButton {...props} />
        <IconButton color="inherit" onClick={props.onCloseDialog}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )

  return (
    <Dialog
      open={props.open}
      disableBackdropClick={props.uploading}
      fullScreen={props.fullScreen}
      PaperProps={{ style: { maxWidth: '80%', maxHeight: '80%' } }}
      onClose={props.onCloseDialog}
    >
      <DialogTitle>{header}</DialogTitle>
      <DialogContent style={{ padding: '20px' }}>{props.children}</DialogContent>
    </Dialog>
  )
}

export default withMobileDialog<IBoardDialogFormProps>()(BoardDialogForm)
