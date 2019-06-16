import * as React from 'react'
import FileUploader from 'anti/file-uploader'

interface ITest1State {
  searchOptionsJson: string
}

class Test1 extends React.Component<{}, ITest1State> {
  render() {
    return (
      <div>
        {' '}
        Test1 <FileUploader multiple api="" allowedExtension={['jpg', 'png']} />
      </div>
    )
  }
}

export default Test1
