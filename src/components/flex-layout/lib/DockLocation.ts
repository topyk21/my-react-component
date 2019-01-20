import Rect from 'src/components/flex-layout/lib/Rect'
import Orientation from 'src/components/flex-layout/lib/Orientation'
import { JSMap } from 'src/components/flex-layout/lib/Types'

class DockLocation {
  static values: JSMap<DockLocation> = {}
  static TOP = new DockLocation('top', Orientation.VERT, 0)
  static BOTTOM = new DockLocation('bottom', Orientation.VERT, 1)
  static LEFT = new DockLocation('left', Orientation.HORZ, 0)
  static RIGHT = new DockLocation('right', Orientation.HORZ, 1)
  static CENTER = new DockLocation('center', Orientation.VERT, 0)
  /** @hidden @internal */
  static getByName(name: string): DockLocation {
    return DockLocation.values[name]
  }
  /** @hidden @internal */
  static getLocation(rect: Rect, x: number, y: number) {
    if (x < rect.x + rect.width / 4) return DockLocation.LEFT
    if (x > rect.getRight() - rect.width / 4) return DockLocation.RIGHT
    if (y < rect.y + rect.height / 4) return DockLocation.TOP
    if (y > rect.getBottom() - rect.height / 4) return DockLocation.BOTTOM

    return DockLocation.CENTER
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
    let r1
    let r2
    switch (this) {
      case DockLocation.TOP:
        r1 = new Rect(rect.x, rect.y, rect.width, size)
        r2 = new Rect(rect.x, rect.y + size, rect.width, rect.height - size)
      case DockLocation.BOTTOM:
        r1 = new Rect(rect.x, rect.getBottom() - size, rect.width, size)
        r2 = new Rect(rect.x, rect.y, rect.width, rect.height - size)
      case DockLocation.LEFT:
        r1 = new Rect(rect.x, rect.y, size, rect.height)
        r2 = new Rect(rect.x + size, rect.y, rect.width - size, rect.height)
      default:
        // case DockLocation.RIGHT:
        r1 = new Rect(rect.getRight() - size, rect.y, size, rect.height)
        r2 = new Rect(rect.x, rect.y, rect.width - size, rect.height)
    }
    return { start: r1, end: r2 }
  }

  /** @hidden @internal */
  reflect() {
    switch (this) {
      case DockLocation.TOP:
        return DockLocation.BOTTOM
      case DockLocation.BOTTOM:
        return DockLocation.TOP
      case DockLocation.LEFT:
        return DockLocation.RIGHT
      default:
        // case DockLocation.RIGHT:
        return DockLocation.LEFT
    }
  }

  toString() {
    return `(DockLocation: name='${this.name}', orientation='${this.orientation}')`
  }
}

export default DockLocation
