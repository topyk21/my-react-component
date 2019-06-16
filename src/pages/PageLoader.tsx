import * as React from 'react'

const loadPage = (path: string) => {
  const Page = React.lazy(() => import(`./${path}`))
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Page />
    </React.Suspense>
  )
}

export default loadPage
