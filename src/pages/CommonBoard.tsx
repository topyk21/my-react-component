// tslint:disable
import * as React from 'react'

import TextField from '@material-ui/core/TextField'

import { BoardWithDialog } from 'src/pages/essentials/board'

// tslint:disable-next-line
interface ICommonBoardProps {}
interface ICommonBoardState {
  open: boolean
  editing: boolean
  uploading: boolean
  boardContent: object
}

class CommonBoard extends React.Component<ICommonBoardProps, ICommonBoardState> {
  constructor(props: ICommonBoardProps) {
    super(props)
    this.state = {
      open: false,
      editing: false,
      uploading: false,
      boardContent: {},
    }
  }

  onCloseDialog = (e: React.SyntheticEvent<{}, Event>) => {
    this.setState({ open: false, editing: false })
  }

  onClickUpload = () => {
    this.setState({ editing: false, uploading: true }, () => {
      // axios.post
      this.setState({ uploading: false })
    })
  }

  onClickModifyIcon = (e: React.SyntheticEvent<{}, Event>) => {
    this.setState({ editing: true })
  }

  onClickCreateIcon = () => {
    this.setState({ open: true, editing: true })
  }

  onClickBoardItem = () => {
    this.setState({ open: true })
  }

  render() {
    return (
      <BoardWithDialog
        /** Dialog props */
        subject="게시판"
        open={this.state.open}
        editing={this.state.editing}
        onCloseDialog={this.onCloseDialog}
        onClickUploadIcon={this.onClickUpload}
        onClickModifyIcon={this.onClickModifyIcon}
        /** Board props */
        api="https://api.jikan.moe/v3/search/anime"
        cols={[
          { key: 'mal_id', value: 'ID', width: 60 },
          { key: 'title', value: 'Title', width: 210 },
          { key: 'type', value: 'Type', width: 60 },
          { key: 'score', value: 'Score', width: 60 },
        ]}
        dataKey="results"
        dataUniqueKey="mal_id"
        lastPageKey="last_page"
        searchOptions={[{ key: 'q', value: 'Anime title' }]}
        onClickCreateIcon={this.onClickCreateIcon}
        onClickBoardItem={this.onClickBoardItem}
      >
        <form>
          <TextField fullWidth label="Title" disabled={!this.state.editing} />
          <TextField fullWidth label="Author" disabled={!this.state.editing} />
        </form>
      </BoardWithDialog>
    )
  }
}

export default CommonBoard
