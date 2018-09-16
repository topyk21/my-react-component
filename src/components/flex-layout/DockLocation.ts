import Rect from 'components/flex-layout/Rect'
import Orientation from 'components/flex-layout/Orientation'
import { JSMap } from 'components/flex-layout/Types'

class DockLocation {
  static values: JSMap<DockLocation> = {}
  static TOP = new DockLocation('top', Orientation.VERT, 0)
  static BOTTOM = new DockLocation('bottom', Orientation.VERT, 1)
  static LEFT = new DockLocation('left', Orientation.HORZ, 0)
  static RIGHT = new DockLocation('right', Orientation.HORZ, 1)
  static CENTER = new DockLocation('center', Orientation.VERT, 0)
  /** @hidden @internal */
  static getByName(name: string) {
    return DockLocation.values[name]
  }

  /** @hidden @internal */
  static getLocation(rect: Rect, x: number, y: number) {
    let ret
    if (x < rect.x + rect.width / 4) {
      ret = DockLocation.LEFT
    } else if (x > rect.getRight() - rect.width / 4) {
      ret = DockLocation.RIGHT
    } else if (y < rect.y + rect.height / 4) {
      ret = DockLocation.TOP
    } else if (y > rect.getBottom() - rect.height / 4) {
      ret = DockLocation.BOTTOM
    } else {
      ret = DockLocation.CENTER
    }
    return ret
  }

  /** @hidden @internal */
  name: string
  /** @hidden @internal */
  orientation: Orientation
  /** @hidden @internal */
  indexPlus: number

  /** @hidden @internal */
  constructor(name: string, orientation: Orientation, indexPlus: number) {
    this.name = name
    this.orientation = orientation
    this.indexPlus = indexPlus
    DockLocation.values[this.name] = this
  }

  getName() {
    return this.name
  }

  getOrientation() {
    return this.orientation
  }

  /** @hidden @internal */
  getDockRect(r: Rect) {
    switch (this) {
      case DockLocation.TOP:
        return new Rect(r.x, r.y, r.width, r.height / 2)
      case DockLocation.BOTTOM:
        return new Rect(r.x, r.getBottom() - r.height / 2, r.width, r.height / 2)
      case DockLocation.LEFT:
        return new Rect(r.x, r.y, r.width / 2, r.height)
      case DockLocation.RIGHT:
        return new Rect(r.getRight() - r.width / 2, r.y, r.width / 2, r.height)
      default:
        return r.clone()
    }
  }

  /** @hidden @internal */
  split(rect: Rect, size: number) {
    let start
    let end
    switch (this) {
      case DockLocation.TOP:
        start = new Rect(rect.x, rect.y, rect.width, size)
        end = new Rect(rect.x, rect.y + size, rect.width, rect.height - size)
        break
      case DockLocation.LEFT:
        start = new Rect(rect.x, rect.y, size, rect.height)
        end = new Rect(rect.x + size, rect.y, rect.width - size, rect.height)
        break
      case DockLocation.RIGHT:
        start = new Rect(rect.getRight() - size, rect.y, size, rect.height)
        end = new Rect(rect.x, rect.y, rect.width - size, rect.height)
        break
      default:
        // DockLocation.BOTTOM
        start = new Rect(rect.x, rect.getBottom() - size, rect.width, size)
        end = new Rect(rect.x, rect.y, rect.width, rect.height - size)
        break
    }
    return { start, end }
  }

  /** @hidden @internal */
  reflect() {
    switch (this) {
      case DockLocation.TOP:
        return DockLocation.BOTTOM
      case DockLocation.LEFT:
        return DockLocation.RIGHT
      case DockLocation.RIGHT:
        return DockLocation.LEFT
      default:
        // DockLocation.BOTTOM
        return DockLocation.TOP
    }
  }

  toString() {
    return `DockLocation: name=${this.name}', orientation=${this.orientation}`
  }
}

export default DockLocation
