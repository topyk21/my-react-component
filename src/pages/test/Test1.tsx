import * as React from 'react'

import { SearchOptions } from 'src/pages/essentials/search-options'

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
      <React.Fragment>
        <SearchOptions
          items={[
            'comments',
            'users',
            'users',
            'todos',
            'comments1',
            'comments2',
            'comments3',
            'comments4',
            'comments5',
            'comments6',
            'comments7',
            'comments8',
            'comments9',
            'comments0',
            'commentsa',
            'commentsb',
            'commentsc',
            'commentsd',
          ]}
          onClickSearchButton={this.onClickSearchButton}
        />
        <div style={{ flex: '1 1 auto' }}>123</div>
      </React.Fragment>
    )
  }
}

export default Test1
