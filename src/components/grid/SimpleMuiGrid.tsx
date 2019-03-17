import * as React from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

interface IBoardListProps {
  rows: object[]
  cols?: string[]
  onClickGridItem?: (e: React.MouseEvent<HTMLDivElement>) => void
}

const SimpleMuiGrid: React.SFC<IBoardListProps> = props => {
  const muiPaddingVal = 'dense'
  const renderColCells = () => {
    if (props.cols) {
      // if there is custom cols,
      return props.cols.map((col, index) => (
        <TableCell className="simple-mui-grid__cell" padding={muiPaddingVal} key={index}>
          <div>{col}</div>
        </TableCell>
      ))
    }
    if (props.rows.length > 0) {
      // if there are keys of row data,
      return Object.keys(props.rows[0]).map(key => (
        <TableCell className="simple-mui-grid__cell" padding={muiPaddingVal} key={key}>
          <div>{key}</div>
        </TableCell>
      ))
    }
    // if no custom cols and no row data
    return null
  }
  const renderRowCells = (row: object) =>
    Object.keys(row).map(key => (
      <TableCell className="simple-mui-grid__cell" padding={muiPaddingVal} key={key}>
        <div>{row[key]}</div>
      </TableCell>
    ))

  return (
    <Paper className="simple-mui-grid">
      <Table>
        <TableHead className="simple-mui-grid__header">
          <TableRow>{renderColCells()}</TableRow>
        </TableHead>
        <TableBody className="simple-mui-grid__body">
          {props.rows.map((row, index) => (
            <TableRow hover key={index} onClick={props.onClickGridItem}>
              {renderRowCells(row)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default SimpleMuiGrid
