import * as React from 'react'
import SignForm from 'components/auth/SignForm';

// tslint:disable-next-line
interface IPageProps {}

const Page: React.SFC<IPageProps> = props => {
  return <div><SignForm /></div>
}

export default Page
