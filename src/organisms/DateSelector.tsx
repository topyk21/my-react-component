import * as React from 'react'

import DatePicker, { DatePickerProps } from 'molecules/DatePicker'
import RadioControl, { RadioControlProps } from 'molecules/RadioControl'

import 'css/DateSelector.scss'

type DateType = 'day' | 'week' | 'month'
type DateExpressionFormat = 'yyyy/MM/dd' | 'yyyy/wo' | 'yyyy/MMM'
type DateFormat = { [K in DateType]: DateExpressionFormat }

export interface DateSelectorProps {
  radioControlProps?: RadioControlProps
  startDatePickerProps?: DatePickerProps
  endDatePickerProps?: DatePickerProps
}
interface DateSelectorState {
  selectedDateType: DateType
  startDate: Date
  endDate: Date
}

class DateSelector extends React.Component<DateSelectorProps, DateSelectorState> {
  private static readonly dateFormats: DateFormat = {
    day: 'yyyy/MM/dd',
    week: 'yyyy/wo',
    month: 'yyyy/MMM',
  }
  private static readonly dateType: DateType[] = ['day', 'week', 'month']

  constructor(props: DateSelectorProps) {
    super(props)
    this.state = {
      selectedDateType: 'day',
      startDate: new Date(),
      endDate: new Date(),
    }
  }

  render() {
    return (
      <div className="date-selector">
        <RadioControl
          className="date-selector__radio-control"
          items={DateSelector.dateType}
          row
          value={this.state.selectedDateType}
          onChange={this.onChangeDateTypeRadioControl}
        />
        <div className="date-selector__date-wrapper">
          <DatePicker
            autoOk
            className="date-selector__date-picker"
            colorizeWeekly={this.state.selectedDateType === 'week'}
            disableToolbar={this.state.selectedDateType !== 'month'}
            format={DateSelector.dateFormats[this.state.selectedDateType]}
            variant="inline"
            value={this.state.startDate}
            views={
              this.state.selectedDateType === 'month'
                ? ['year', 'month']
                : ['year', 'month', 'date']
            }
            onChange={this.onChangeStartDate}
          />
          <span className="date-selector__dash">-</span>
          <DatePicker
            autoOk
            className="date-selector__date-picker"
            colorizeWeekly={this.state.selectedDateType === 'week'}
            disableToolbar={this.state.selectedDateType !== 'month'}
            format={DateSelector.dateFormats[this.state.selectedDateType]}
            variant="inline"
            value={this.state.startDate}
            views={
              this.state.selectedDateType === 'month'
                ? ['year', 'month']
                : ['year', 'month', 'date']
            }
            onChange={this.onChangeStartDate}
          />
        </div>
      </div>
    )
  }

  private onChangeDateTypeRadioControl = (e: React.ChangeEvent<{}>, value: string) => {
    this.setState({ selectedDateType: value as DateType })
  }

  private onChangeStartDate = (date: any) => {
    this.setState({ startDate: date })
  }

  private onChangeEndDate = (date: any) => {
    this.setState({ endDate: date })
  }
}

export default DateSelector
