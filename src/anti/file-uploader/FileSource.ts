// tslint:disable
/**
 * File 관리 Class
 * Made by Hong Young Gi, topyk21@gmail.com
 *
 * TODO: Chunking upload
 *
 * @class FileManager
 * @extends {File}
 */
class FileSource {
  private static ALLOWED_IMG_SIZE = 1048576 // 1 MB
  private static ALLOWED_FILE_SIZE = 104857600 // 100 MB;
  private static SIZE_TYPE = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  id: string
  file: File
  data: FormData
  /**
   * 생성자에 의해 Generate 될 시점에서, 발생한 error를 저장합니다.
   *
   * @type {string}
   * @memberof FileSource
   */
  error?: string
  isImage: boolean
  uploadFlag: boolean
  private extension?: string
  private allowedExtension: string[]

  constructor(id: string, file: File, allowedExtension: string[]) {
    this.id = id
    this.file = file
    this.extension = file.name.split('.').pop()
    this.allowedExtension = allowedExtension
    this.uploadFlag = false
    this.isImage = false
    this.data = new FormData()
    this.data.append('file', this.file, this.file.name)

    if (this.extension) this.extension = this.extension.toLowerCase()

    this.error = this.checkValidation(this.allowedExtension)
  }

  convertByteFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + FileSource.SIZE_TYPE[i]
  }

  setError = (errorText: string) => {
    this.error = errorText
  }

  /**
   * 허용된 확장자인지 Check 한 뒤, File 용량을 하기 rule에 의해 점검합니다.
   * 1. Image File의 경우 < 1 MB Upload,
   * 2. 나머지 파일의 경우 < 100 MB Upload까지 지원합니다.
   * @private
   * @memberof FileSource
   */
  private checkValidation = (allowedExtension: string[]) => {
    // File extension check
    if (!this.extension) {
      return '파일 확장자가 필요합니다'
    }
    if (allowedExtension.indexOf(this.extension.toLowerCase()) < 0) {
      return '허용되지 않은 파일 확장자입니다'
    }
    // File size check
    if (this.file.size === 0) return 'File size가 0 byte 입니다.'
    switch (this.extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        if (this.file.size > FileSource.ALLOWED_IMG_SIZE) {
          return '이미지는 1MB이하 업로드 가능합니다'
        }
        this.isImage = true
        break
      default:
        if (this.file.size > FileSource.ALLOWED_FILE_SIZE) {
          return '일반 파일은 100MB이하 업로드 가능합니다'
        }
        break
    }
    return
  }
}

export default FileSource
