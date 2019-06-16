import * as React from 'react'
import classNames from 'classnames'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isWithinInterval from 'date-fns/isWithinInterval'
import endOfWeek from 'date-fns/endOfWeek'
import startOfWeek from 'date-fns/startOfWeek'
import IconButton from '@material-ui/core/IconButton'
import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from '@material-ui/pickers'

import { Omit } from 'utils/Omit'

import 'css/DatePicker.scss'

export interface DatePickerProps extends Omit<MuiDatePickerProps, 'renderDay'> {
  colorizeWeekly: boolean
}

class DatePicker extends React.Component<DatePickerProps, {}> {
  render() {
    const { colorizeWeekly, ...rest } = this.props
    return (
      <MuiDatePicker renderDay={colorizeWeekly ? this.renderDayWeek : this.renderDay} {...rest} />
    )
  }

  private renderDayWeek = (day: any, selectedDate: any, dayInCurrentMonth: boolean) => {
    const start = startOfWeek(selectedDate)
    const end = endOfWeek(selectedDate)
    const isBetweeen = isWithinInterval(day, { start, end })
    const isFirstDay = isSameDay(day, start)
    const isLastDay = isSameDay(day, end)
    const wrapperClassName = classNames('date-picker__day-wrapper', {
      'date-picker__day-highlight': isBetweeen,
      'date-picker__day-first-hightlight': isFirstDay,
      'date-picker__day-last-hightlight': isLastDay,
    })
    const dayClassName = classNames('date-picker__day', {
      'date-picker__day-non-current-month': !dayInCurrentMonth,
      'date-picker__day-non-current-month-highlight': !dayInCurrentMonth && isBetweeen,
    })
    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(day, 'd')} </span>
        </IconButton>
      </div>
    )
  }

  private renderDay = (day: any, selectedDate: any, dayInCurrentMonth: boolean) => {
    const isSelected = isSameDay(day, selectedDate)
    const wrapperClassName = classNames('date-picker__day-wrapper', {
      'date-picker__day-highlight': isSelected,
    })
    const dayClassName = classNames('date-picker__day', {
      'date-picker__day-non-current-month': !dayInCurrentMonth,
      'date-picker__day-non-current-month-highlight': !dayInCurrentMonth && isSelected,
    })
    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span>{format(day, 'd')}</span>
        </IconButton>
      </div>
    )
  }
}

export default DatePicker
