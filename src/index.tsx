import * as React from 'react'
import * as ReactDOM from 'react-dom'

import 'typeface-roboto'
import App from 'src/App'
import registerServiceWorker from 'src/registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
