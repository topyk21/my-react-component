import * as React from 'react'

import FileUploader from 'src/components/file-uploader'

class Test1 extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        Hello! Test page2!
        <FileUploader multiple api="" allowedExtension={['jpg', 'png']} />
      </div>
    )
  }
}

export default Test1
