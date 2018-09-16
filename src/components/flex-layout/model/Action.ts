// tslint:disable:no-any
import { JSMap } from 'components/flex-layout/Types'

class Action {
  type: string
  data: JSMap<any>

  constructor(type: string, data: JSMap<any>) {
    this.type = type
    this.data = data
  }
}

export default Action
