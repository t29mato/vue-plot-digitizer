import { Position } from '@/types'
import ColorThief from 'colorthief'
const colorThief = new ColorThief()

export class CanvasManager {
  static #instance: CanvasManager
  #canvasWrapper?: HTMLDivElement
  #imageCanvas?: HTMLCanvasElement
  #maskCanvas?: HTMLCanvasElement
  #imageElement?: HTMLImageElement
  #isFit = false
  #imageRatio = 1
  #cursor: Position = { xPx: 0, yPx: 0 }

  static get instance(): CanvasManager {
    if (!this.#instance) {
      this.#instance = new CanvasManager()
    }
    return this.#instance
  }

  async initialize(
    canvasWrapperId: string,
    imageCanvasId: string,
    maskCanvasId: string,
    graphImagePath: string,
    isFit: boolean
  ) {
    this.#canvasWrapper = this.#getDivElementById(canvasWrapperId)
    this.#imageCanvas = this.#getCanvasElementById(imageCanvasId)
    this.#maskCanvas = this.#getCanvasElementById(maskCanvasId)
    this.#imageElement = await this.loadImage(graphImagePath)
    this.#isFit = isFit

    this.drawFitSizeImage()
  }

  #getDivElementById(id: string) {
    return document.getElementById(id) as HTMLDivElement
  }

  #getCanvasElementById(id: string) {
    return document.getElementById(id) as HTMLCanvasElement
  }

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = (error) => reject(error)
      img.src = src
    })
  }

  drawMask(xPx: number, yPx: number) {
    const ctx = this.maskCanvasCtx
    ctx.beginPath()
    if (this.#cursor.xPx === 0) {
      ctx.moveTo(xPx, yPx)
    } else {
      ctx.moveTo(this.#cursor.xPx, this.#cursor.yPx)
    }
    ctx.lineTo(xPx, yPx)
    ctx.lineCap = 'round'
    ctx.lineWidth = 50
    ctx.stroke()
    ctx.strokeStyle = '#ffff00ff' // INFO: yellow
    this.#cursor = { xPx, yPx }
  }

  resetDrawMaskPos() {
    this.#cursor = { xPx: 0, yPx: 0 }
  }

  get originalImageCanvasColors() {
    const newCanvas = document.createElement('canvas')
    newCanvas.setAttribute('width', String(this.imageElement.width))
    newCanvas.setAttribute('height', String(this.imageElement.height))
    const ctx = newCanvas.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(
      this.imageElement,
      0,
      0,
      this.imageElement.width,
      this.imageElement.height
    )
    return ctx.getImageData(
      0,
      0,
      this.imageElement.width,
      this.imageElement.height
    ).data
  }

  get originalSizeMaskCanvasColors() {
    const newCanvas = document.createElement('canvas')
    newCanvas.setAttribute('width', String(this.imageElement.width))
    newCanvas.setAttribute('height', String(this.imageElement.height))
    const ctx = newCanvas.getContext('2d') as CanvasRenderingContext2D
    ctx.drawImage(
      this.maskCanvas,
      0,
      0,
      this.imageElement.width,
      this.imageElement.height
    )
    return ctx.getImageData(
      0,
      0,
      this.imageElement.width,
      this.imageElement.height
    ).data
  }

  get colorSwatches() {
    if (!this.#imageElement) {
      throw new Error('#imageElement is undefined.')
    }
    return colorThief.getPalette(this.#imageElement).map((color) => {
      // INFO: rgbからhexへの切り替え
      return color.reduce((prev, cur) => {
        // INFO: HEXは各色16進数2桁なので
        if (cur.toString(16).length === 1) {
          return prev + '0' + cur.toString(16)
        }
        return prev + cur.toString(16)
      }, '#')
    })
  }

  changeImage(imageElement: HTMLImageElement) {
    this.#imageElement = imageElement
    this.drawFitSizeImage()
  }

  set isFit(isFit: boolean) {
    this.#isFit = isFit
  }

  set imageRatio(imageRatio: number) {
    this.#imageRatio = imageRatio
  }

  get canvasWrapper() {
    if (!this.#canvasWrapper) {
      throw new Error('#canvasWrapper is undefined.')
    }
    return this.#canvasWrapper
  }

  get imageRatio() {
    if (!this.#imageRatio) {
      throw new Error('#imageRatio is undefined.')
    }
    return this.#imageRatio
  }

  get imageElement() {
    if (!this.#imageElement) {
      throw new Error('#imageElement is undefined.')
    }
    return this.#imageElement
  }

  get imageCanvas() {
    if (!this.#imageCanvas) {
      throw new Error('#imageCanvas is undefined.')
    }
    return this.#imageCanvas
  }

  get imageCanvasCtx() {
    if (!this.#imageCanvas) {
      throw new Error('#imageCanvas is undefined.')
    }
    return this.#imageCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  get imageCanvasColors() {
    return this.imageCanvasCtx.getImageData(
      0,
      0,
      this.imageElement.width,
      this.imageElement.height
    ).data
  }

  get maskCanvas() {
    if (!this.#maskCanvas) {
      throw new Error('#maskCanvas is undefined.')
    }
    return this.#maskCanvas
  }

  get maskCanvasCtx() {
    if (!this.#maskCanvas) {
      throw new Error('#maskCanvas is undefined.')
    }
    return this.#maskCanvas.getContext('2d') as CanvasRenderingContext2D
  }

  get maskCanvasColors() {
    return this.maskCanvasCtx.getImageData(
      0,
      0,
      this.maskCanvas.width,
      this.maskCanvas.height
    ).data
  }

  drawImage() {
    if (this.#isFit) {
      return this.drawFitSizeImage()
    }
    return this.drawOriginalSizeImage()
  }
  drawFitSizeImage() {
    const wrapperWidthPx = this.canvasWrapper.offsetWidth
    const imageWidthPx = this.imageElement.width
    const imageHeightPx = this.imageElement.height
    const imageRatio = wrapperWidthPx / imageWidthPx
    const wrapperHeightPx = imageHeightPx * imageRatio
    this.maskCanvas.setAttribute('width', String(wrapperWidthPx))
    this.maskCanvas.setAttribute('height', String(wrapperHeightPx))
    this.imageCanvas.setAttribute('width', String(wrapperWidthPx))
    this.imageCanvas.setAttribute('height', String(wrapperHeightPx))
    this.imageCanvasCtx.drawImage(
      this.imageElement,
      0,
      0,
      wrapperWidthPx,
      wrapperHeightPx
    )
    this.imageRatio = imageRatio
    // this.#maskCanvas = this.#getCanvasElementById('maskCanvas')
    // this.#maskCanvas.width = this.imageElement.width
    // this.#maskCanvas.height = this.imageElement.height
  }

  scaleDown() {
    const downRatio = 0.9
    const expandedWidth = this.imageCanvas.width * downRatio
    const expandedHeight = this.imageCanvas.height * downRatio
    this.maskCanvas.setAttribute('width', String(expandedWidth))
    this.maskCanvas.setAttribute('height', String(expandedHeight))
    this.imageCanvas.setAttribute('width', String(expandedWidth))
    this.imageCanvas.setAttribute('height', String(expandedHeight))
    this.imageCanvasCtx.drawImage(
      this.imageElement,
      0,
      0,
      expandedWidth,
      expandedHeight
    )
    this.imageRatio = this.imageRatio * downRatio
  }

  scaleUp() {
    const upRatio = 1.1
    const expandedWidth = this.imageCanvas.width * upRatio
    const expandedHeight = this.imageCanvas.height * upRatio
    this.maskCanvas.setAttribute('width', String(expandedWidth))
    this.maskCanvas.setAttribute('height', String(expandedHeight))
    this.imageCanvas.setAttribute('width', String(expandedWidth))
    this.imageCanvas.setAttribute('height', String(expandedHeight))
    this.imageCanvasCtx.drawImage(
      this.imageElement,
      0,
      0,
      expandedWidth,
      expandedHeight
    )
    this.imageRatio = this.imageRatio * upRatio
  }

  drawOriginalSizeImage() {
    this.#imageCanvas = this.#getCanvasElementById('imageCanvas')
    this.#imageCanvas.width = this.imageElement.width
    this.#imageCanvas.height = this.imageElement.height
    this.imageCanvasCtx.drawImage(
      this.imageElement,
      0,
      0,
      this.#imageCanvas.width,
      this.#imageCanvas.height
    )
  }
}
