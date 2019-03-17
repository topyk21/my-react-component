import * as React from 'react'
import * as Loadable from 'react-loadable'

const loadPage = (path: string) => {
  const Page = Loadable({
    loader: () => import(`./${path}`),
    loading() {
      return <div>Loading...</div>
    },
  })
  return <Page />
}

export default loadPage
