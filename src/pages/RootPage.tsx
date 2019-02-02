import * as React from 'react'

import Layout from 'src/components/default-layout/LayoutContainer'
import PageLoader from 'src/pages/PageLoader'

const Page: React.SFC<{}> = () => <Layout loadPage={PageLoader} />

export default Page
