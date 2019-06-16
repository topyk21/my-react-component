import * as React from 'react'

import Switchbox from 'molecules/Switchbox'
import Checkbox from 'molecules/Checkbox'

class Test2 extends React.Component<{}, {}> {
  render() {
    return (
      <React.Fragment>
        <Checkbox label="123" />
        <Switchbox label="what!" />
      </React.Fragment>
    )
  }
}

export default Test2
