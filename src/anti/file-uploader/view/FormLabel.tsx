import * as React from 'react'

interface IFormLabelProps {
  id: string
  multiple?: boolean
  accept?: string
  onChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FormLabel: React.SFC<IFormLabelProps> = props => {
  return (
    <div className="file-uploader__form-label">
      <input
        className="hided-input"
        id={props.id}
        type="file"
        multiple={props.multiple}
        accept={props.accept}
        onChange={props.onChangeFile}
      />
      <span className="main-label">
        Drag & Drop File or&nbsp;
        <label className="browser" htmlFor={props.id}>
          Browse
        </label>
      </span>
    </div>
  )
}

export default FormLabel
