export interface ICheckboxViewProps {
  /** Checkbox id */
  id: string
  /** Checkbox label */
  label: string
  /** Checkbox value */
  value?: string
  /** Checkbox checked flag */
  checked?: boolean
  /** Checkbox checked status change event */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Checkbox classname of wrapper div */
  className?: string
  /** Checkbox wrapper class Name */
  style?: React.CSSProperties
  /** Checkbox width flag. If this flag is on, component width is same with wrapper element */
  fullWidth?: boolean
  /** Checkbox disabled flag */
  disabled?: boolean
}
