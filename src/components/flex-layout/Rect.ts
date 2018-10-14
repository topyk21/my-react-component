// tslint:disable:no-any
import Orientation from 'components/flex-layout/Orientation'
import { JSMap } from 'components/flex-layout/Types'

class Rect {
  static empty() {
    return new Rect(0, 0, 0, 0)
  }

  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  clone() {
    return new Rect(this.x, this.y, this.width, this.height)
  }

  equals(rect: Rect) {
    return (
      this.x === rect.x &&
      this.y === rect.y &&
      this.width === rect.width &&
      this.height === rect.height
    )
  }

  getTop() {
    return this.y
  }

  getBottom() {
    return this.y + this.height
  }

  getLeft() {
    return this.x
  }

  getRight() {
    return this.x + this.width
  }

  getWidth() {
    return this.width
  }

  getHeight() {
    return this.height
  }

  positionElement(element: HTMLElement) {
    this.styleWithPosition(element.style)
  }

  styleWithPosition(style: JSMap<any>) {
    style.left = this.x + 'px'
    style.top = this.y + 'px'
    style.width = Math.max(0, this.width) + 'px'
    style.height = Math.max(0, this.height) + 'px'
    style.position = 'absolute'
    return style
  }

  contains(x: number, y: number) {
    if (this.x <= x && x <= this.getRight() && this.y <= y && y <= this.getBottom()) {
      return true
    }
    return false
  }

  removeInsets(insets: { top: number; left: number; bottom: number; right: number }) {
    return new Rect(
      this.x + insets.left,
      this.y + insets.top,
      Math.max(0, this.width - insets.left - insets.right),
      Math.max(0, this.height - insets.top - insets.bottom)
    )
  }

  centerInRect(outerRect: Rect) {
    this.x = (outerRect.width - this.width) / 2
    this.y = (outerRect.height - this.height) / 2
  }

  /** @hidden @internal */
  getSize(orientation: Orientation) {
    if (orientation === Orientation.VERT) {
      return this.height
    }
    return this.width
  }

  toString() {
    return `Rect: x=${this.x}, y=${this.y}, width=${this.width}, height=${this.height}`
  }
}

export default Rect
