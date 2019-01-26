// tslint:disable:no-any
import * as React from 'react'
import classNames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import LinearProgress from '@material-ui/core/LinearProgress'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ClearIcon from '@material-ui/icons/Clear'

import FileSource from 'src/components/file-uploader/FileSource'

interface ICloseIconProps {
  onClose: (e: React.MouseEvent<HTMLElement>) => void
}

interface IFileItemProps extends ICloseIconProps {
  fileSrc: FileSource
  image: any
  error?: any
  isUploading: boolean
  uploadProgress: number
  onUpload: (e: React.MouseEvent<HTMLElement>) => void
}

const ItemWrapper: React.SFC<{ error?: any; image: any }> = props => {
  const wrapperClass = classNames('file-uploader__item-box', {
    'error-item': props.error,
    'valid-item': !props.error,
  })

  if (props.error) {
    return (
      <Tooltip placement="right" title={props.error}>
        <div className={wrapperClass}>{props.children}</div>
      </Tooltip>
    )
  }

  return <div className={wrapperClass}>{props.children}</div>
}

const PreviewImage: React.SFC<{ image: any }> = props => (
  <figure className="img-wrapper">
    <img style={{ width: '100%' }} src={props.image} />
  </figure>
)

const FileItem: React.SFC<IFileItemProps> = props => {
  const { fileSrc } = props
  const targetFile = fileSrc.file
  const name = fileSrc.file.name
  const size = fileSrc.convertByteFileSize(targetFile.size)
  const closeIcon = (
    <IconButton className="icon" onClick={props.onClose}>
      <ClearIcon />
    </IconButton>
  )
  const uploadIcon = !props.error && (
    <IconButton className="icon" onClick={props.onUpload}>
      <CloudUploadIcon />
    </IconButton>
  )
  const previewImg = props.image && <PreviewImage image={props.image} />
  const uploadProgress = props.isUploading && (
    <LinearProgress className="progress-bar" variant="determinate" value={props.uploadProgress} />
  )
  const contentClass = classNames('file-contents', {
    'image-content': props.image,
  })

  return (
    <ItemWrapper error={props.error} image={props.image}>
      {uploadProgress}
      {previewImg}
      <div className={contentClass}>
        {closeIcon}
        <div className="file-info">
          <div className="main-text">{name}</div>
          <div className="sub-text">{size}</div>
        </div>
        {uploadIcon}
      </div>
    </ItemWrapper>
  )
}

export default FileItem
