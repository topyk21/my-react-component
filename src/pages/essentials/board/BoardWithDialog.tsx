import * as React from 'react'

import { InfiniteApiGrid, InfiniteApiGridProps } from 'src/components/grid'
import BoardDialogForm, { IBoardDialogFormProps } from 'src/pages/essentials/board/BoardDialogForm'

interface IBoardWithDialogProps extends InfiniteApiGridProps, IBoardDialogFormProps {}

const BoardWithDialog: React.SFC<IBoardWithDialogProps> = props => (
  <React.Fragment>
    <InfiniteApiGrid {...props} />
    <BoardDialogForm {...props} />
  </React.Fragment>
)

export default BoardWithDialog
