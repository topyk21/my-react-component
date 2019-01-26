import * as React from 'react'
import axios from 'axios'

import FileSource from 'src/components/file-uploader/FileSource'
import FileItem from 'src/components/file-uploader/view/FileItem'

interface IContainerProps {
  api: string
  mountingUpload?: boolean
  index: number
  fileSrc: FileSource
  onClose: (itemIdx: number) => void
}

interface IContainerState {
  // tslint:disable-next-line
  image: any
  isUploading: boolean
  isUploaded: boolean
  uploadProgress: number
  uploadError?: string
}

class FileItemContainer extends React.Component<IContainerProps, IContainerState> {
  constructor(props: IContainerProps) {
    super(props)
    this.state = { image: undefined, isUploading: false, isUploaded: false, uploadProgress: 0 }

    if (this.props.fileSrc.isImage) {
      const reader = new FileReader()
      reader.onload = () => {
        this.setState({ image: reader.result })
      }
      reader.readAsDataURL(this.props.fileSrc.file)
    }
  }

  shouldComponentUpdate(nextProps: IContainerProps, nextState: IContainerState) {
    return nextState !== this.state
  }

  componentDidMount() {
    const { fileSrc, api, mountingUpload } = this.props

    // do auto upload if there is no mouting upload props, and has error based on file
    if (mountingUpload && !fileSrc.error) {
      setTimeout(() => this.upload(api, fileSrc.data), 100)
    }
  }

  onClose = (event: React.MouseEvent<HTMLElement>) => {
    this.props.onClose(this.props.index)
  }

  onUpload = (event: React.MouseEvent<HTMLElement>) => {
    const { fileSrc, api } = this.props
    this.upload(api, fileSrc.data)
  }

  upload = (api: string, data: FormData) => {
    this.setState({ isUploading: true }, () =>
      axios
        .post(api, data, {
          onUploadProgress: e => {
            this.setState({
              uploadProgress: (e.loaded / e.total) * 100,
            })
          },
        })
        .then(() => {
          this.setState({ isUploading: false, isUploaded: true })
        })
        .catch(error => {
          this.setState({ isUploading: false, uploadError: error.message })
        })
    )
  }

  render() {
    const errorMsg = this.props.fileSrc.error ? this.props.fileSrc.error : this.state.uploadError
    return (
      <FileItem
        {...this.props}
        {...this.state}
        error={errorMsg}
        onClose={this.onClose}
        onUpload={this.onUpload}
      />
    )
  }
}

export default FileItemContainer
