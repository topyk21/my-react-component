class Orientation {
  static HORZ = new Orientation('horz')
  static VERT = new Orientation('vert')
  static flip(from: Orientation) {
    if (from === Orientation.HORZ) {
      return Orientation.VERT
    }
    return Orientation.HORZ
  }
  /** @hidden @internal */
  private name: string
  /** @hidden @internal */
  private constructor(name: string) {
    this.name = name
  }

  toString() {
    return this.name
  }
}

export default Orientation
