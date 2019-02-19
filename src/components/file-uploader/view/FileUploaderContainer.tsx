/**
 * File uploader component
 * Made by Hong Young Gi, topyk21@gmail.com
 *
 *  TODO:
 *  1. IE 고려 해야 할지?
 *  else if (event.dataTransfer.types && event.dataTransfer.types[0] === 'Files') {
 *   this.setState({ dragging: true });
 *  }
 *
 *  2. File upload 연동 시 현재 File 유지 기능을 제거할지?
 *     Input tag는 보안 ISSUE에 의해 신규 업로드 시 기존 파일을 제거하는데,
 *     현재 js coding을 통해 유지하게 해놓은 상태.
 *     Server쪽 완성되면 기능 Test 후 판단 필요
 */
import * as React from 'react'
import * as shortid from 'shortid'
import { List } from 'immutable'

import FileUploader from 'src/components/file-uploader/view/FileUploader'
import FileSource from 'src/components/file-uploader/FileSource'

interface IContProps {
  /** File upload host address */
  api: string
  /** Multi file upload option */
  multiple?: boolean
  /** File upload filter option. Please see html input='file' spec */
  accept?: string
  /** If this flag is on, file will be auto uploaded after mouting */
  mountingUpload?: boolean
  /** File extension limitation. */
  allowedExtension: string[]
}
interface IContState {
  formId: string
  isDragging: boolean
  files: List<FileSource>
}

class FileUploaderContainer extends React.Component<IContProps, IContState> {
  dragEventCounter = 0

  constructor(props: IContProps) {
    super(props)
    this.state = { isDragging: false, files: List(), formId: shortid.generate() }
  }

  dragEnterListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter += 1
    if (event.dataTransfer.items && event.dataTransfer.items[0]) {
      this.setState({ isDragging: true })
    }
  }

  dragLeaveListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter -= 1

    if (this.dragEventCounter === 0) {
      this.setState({ isDragging: false })
    }
  }

  dropListener = (event: React.DragEvent<HTMLDivElement>) => {
    this.overrideEventDefaults(event)
    this.dragEventCounter = 0

    if (event.dataTransfer.files && event.dataTransfer.files.length !== 0) {
      const newList = this.addNewFiles(event.dataTransfer.files)
      this.setState({ isDragging: false, files: newList })
    } else {
      this.setState({ isDragging: false })
    }
  }

  overrideEventDefaults = (event: Event | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  onFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length !== 0) {
      const newList = this.addNewFiles(event.target.files)
      this.setState({ files: newList })
    }
  }

  addNewFiles = (files: FileList) => {
    // immutable의 performance를 위해 아래와 같이 중복되는 Code가 존재합니다.
    return this.state.files.withMutations(list => {
      if (this.props.multiple) {
        // tslint:disable-next-line
        for (let i = 0; i < files.length; i += 1) {
          const fileId = shortid.generate()
          const newFile = new FileSource(fileId, files[i], this.props.allowedExtension)
          list.push(newFile)
        }
      } else {
        const fileId = shortid.generate()
        const newFile = new FileSource(fileId, files[0], this.props.allowedExtension)
        list.clear().push(newFile)
      }
    })
  }

  deleteFile = (idx: number) => {
    const newList = this.state.files.delete(idx)
    this.setState({ files: newList })
  }

  render() {
    return (
      <FileUploader
        formId={this.state.formId}
        isDragging={this.state.isDragging}
        files={this.state.files.toArray()}
        onDrag={this.overrideEventDefaults}
        onDragStart={this.overrideEventDefaults}
        onDragEnd={this.overrideEventDefaults}
        onDragOver={this.overrideEventDefaults}
        onDragEnter={this.dragEnterListener}
        onDragLeave={this.dragLeaveListener}
        onDrop={this.dropListener}
        onChangeFile={this.onFileChanged}
        onClickCloseIcon={this.deleteFile}
        {...this.props}
      />
    )
  }
}

export default FileUploaderContainer
