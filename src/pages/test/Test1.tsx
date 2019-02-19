import * as React from 'react'
import { Selector } from 'src/components/selector'

class Test1 extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Selector data={[]} formLabel="test" /> Hello! Test page!
      </div>
    )
  }
}

export default Test1
