import * as React from 'react'
import classNames from 'classnames'

import FileItem from 'anti/file-uploader/view/FileItemContainer'
import FormLabel from 'anti/file-uploader/view/FormLabel'
import FileSource from 'anti/file-uploader/FileSource'

interface IFileUploaderProps {
  formId: string
  api: string
  multiple?: boolean
  accept?: string
  isDragging: boolean
  mountingUpload?: boolean
  files: FileSource[]
  onDrag: (event: React.DragEvent<HTMLDivElement>) => void
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void
  onDragEnd: (event: React.DragEvent<HTMLDivElement>) => void
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void
  onDragEnter: (event: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
  onChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void
  onClickCloseIcon: (itemIdx: number) => void
}

const FileUploader: React.SFC<IFileUploaderProps> = props => {
  const {
    api,
    formId,
    isDragging,
    mountingUpload,
    files,
    onDrag,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    onChangeFile,
    onClickCloseIcon,
  } = props

  const uploaderClass = classNames({
    'file-uploader': true,
    'file-uploader-dragging': isDragging,
  })

  const formLabel = <FormLabel id={formId} onChangeFile={onChangeFile} {...props} />
  const items = files.map((file, index) => (
    <FileItem
      key={file.id}
      index={index}
      api={api}
      mountingUpload={mountingUpload}
      fileSrc={file}
      onClose={onClickCloseIcon}
    />
  ))

  return (
    <div
      className={uploaderClass}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="file-uploader-contents">
        {formLabel}
        {items}
        {props.children}
      </div>
    </div>
  )
}

export default FileUploader
