import * as React from 'react'

import PageLoader from 'src/pages/PageLoader'
import { DefaultLayout } from 'src/pages/essentials/default-layout'

const Page: React.SFC<{}> = () => <DefaultLayout pageLoader={PageLoader} />

export default Page
