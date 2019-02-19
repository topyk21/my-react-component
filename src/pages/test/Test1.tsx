import * as React from 'react'

import Container from 'src/pages/essentials/search-options/SearchOptionsContainer'

interface ITest1State {
  searchOptionsJson: string
}

class Test1 extends React.Component<{}, ITest1State> {
  // tslint:disable-next-line
  onClickSearchButton = (serachOptionsJson: string) => {
    this.setState({ searchOptionsJson: serachOptionsJson }, () =>
      // tslint:disable-next-line
      console.log(this.state.searchOptionsJson)
    )
  }

  render() {
    return (
      <div>
        <Container
          items={['comments', 'users', 'users', 'todos']}
          onClickSearchButton={this.onClickSearchButton}
        />
      </div>
    )
  }
}

export default Test1
