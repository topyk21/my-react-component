// tslint:disable:no-any
class DragDrop {
  static instance = new DragDrop()

  /** @hidden @internal */
  private fDblClick: ((event: Event) => void) | undefined
  /** @hidden @internal */
  private fClick: ((event: Event) => void) | undefined
  /** @hidden @internal */
  private fDragEnd: ((event: Event) => void) | undefined
  /** @hidden @internal */
  private fDragMove: ((event: Event) => void) | undefined
  /** @hidden @internal */
  private fDragStart: ((pos: { clientX: number; clientY: number }) => boolean) | undefined
  /** @hidden @internal */
  private fDragCancel: ((wasDragging: boolean) => void) | undefined
  /** @hidden @internal */
  private lastClick: number
  /** @hidden @internal */
  private clickX: number
  /** @hidden @internal */
  private clickY: number
  /** @hidden @internal */
  private startX: number = 0
  /** @hidden @internal */
  private startY: number = 0
  /** @hidden @internal */
  private dragging: boolean = false

  /** @hidden @internal */
  private constructor() {
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)

    this.onKeyPress = this.onKeyPress.bind(this)

    this.lastClick = 0
    this.clickX = 0
    this.clickY = 0
  }

  startDrag(
    event: Event | undefined,
    fDragStart: ((pos: { clientX: number; clientY: number }) => boolean) | undefined,
    fDragMove: ((event: Event) => void) | undefined,
    fDragEnd: ((event: Event) => void) | undefined,
    fDragCancel?: ((wasDragging?: boolean) => void) | undefined,
    fClick?: ((event: Event) => void) | undefined,
    fDblClick?: ((event: Event) => void) | undefined
  ) {
    const posEvent = this.getLocationEvent(event)

    if (event) {
      this.startX = posEvent.clientX
      this.startY = posEvent.clientY
      this.stopPropagation(event)
      this.preventDefault(event)
    } else {
      this.startX = 0
      this.startY = 0
    }

    this.dragging = false
    this.fDragStart = fDragStart
    this.fDragMove = fDragMove
    this.fDragEnd = fDragEnd
    this.fDragCancel = fDragCancel
    this.fClick = fClick
    this.fDblClick = fDblClick

    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('touchend', this.onMouseUp)
    document.addEventListener('touchmove', this.onMouseMove)
  }

  isDragging() {
    return this.dragging
  }

  toString() {
    return `DragDrop: startX=${this.startX}, startY=${this.startY}, dragging=${this.dragging}`
  }

  /** @hidden @internal */
  private onKeyPress(event: KeyboardEvent) {
    if (this.fDragCancel !== undefined && event.keyCode === 27) {
      // esc
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
      this.fDragCancel(this.dragging)
      this.dragging = false
    }
  }

  /** @hidden @internal */
  private getLocationEvent(event: any) {
    let posEvent: any = event
    if (event.touches) {
      posEvent = event.touches[0]
    }
    return posEvent
  }

  /** @hidden @internal */
  private getLocationEventEnd(event: any) {
    let posEvent: any = event
    if (event.changedTouches) {
      posEvent = event.changedTouches[0]
    }
    return posEvent
  }

  /** @hidden @internal */
  private stopPropagation(event: Event) {
    if (event.stopPropagation) {
      event.stopPropagation()
    }
  }

  /** @hidden @internal */
  private preventDefault(event: Event) {
    if (event.preventDefault) {
      event.preventDefault()
    }
    return event
  }

  /** @hidden @internal */
  private onMouseMove(event: Event) {
    const posEvent = this.getLocationEvent(event)
    this.stopPropagation(event)
    this.preventDefault(event)

    if (
      !this.dragging &&
      (Math.abs(this.startX - posEvent.clientX) > 5 || Math.abs(this.startY - posEvent.clientY) > 5)
    ) {
      this.dragging = true
      if (this.fDragStart) {
        this.dragging = this.fDragStart({ clientX: this.startX, clientY: this.startY })
      }
    }

    if (this.dragging) {
      if (this.fDragMove) {
        this.fDragMove(posEvent)
      }
    }
    return false
  }

  /** @hidden @internal */
  private onMouseUp(event: Event) {
    const posEvent = this.getLocationEventEnd(event)

    this.stopPropagation(event)
    this.preventDefault(event)

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('touchend', this.onMouseUp)
    document.removeEventListener('touchmove', this.onMouseMove)

    if (this.dragging) {
      this.dragging = false
      if (this.fDragEnd) {
        this.fDragEnd(event)
      }
    } else {
      if (this.fDragCancel) {
        this.fDragCancel(this.dragging)
      }
      if (
        Math.abs(this.startX - posEvent.clientX) <= 5 &&
        Math.abs(this.startY - posEvent.clientY) <= 5
      ) {
        const clickTime = new Date().getTime()
        // check for double click
        if (
          Math.abs(this.clickX - posEvent.clientX) <= 5 &&
          Math.abs(this.clickY - posEvent.clientY) <= 5
        ) {
          if (clickTime - this.lastClick < 500) {
            if (this.fDblClick) {
              this.fDblClick(event)
            }
          }
        }

        if (this.fClick) {
          this.fClick(event)
        }
        this.lastClick = clickTime
        this.clickX = posEvent.clientX
        this.clickY = posEvent.clientY
      }
    }
    return false
  }
}

export default DragDrop
