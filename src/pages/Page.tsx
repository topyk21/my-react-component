import * as React from 'react'
import styled from 'styled-components'

import MainLayout from 'src/pages/MainLayout'

const PageWrapper = styled.div`
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  position: absolute;
  overflow: hidden;
  font-size: 12px;
  font-family: Arial, sans-serif;
`

const Page: React.SFC<{}> = props => {
  return (
    <PageWrapper>
      <MainLayout />
    </PageWrapper>
  )
}

export default Page
