import { CanvasInterface } from '@/application/services/canvas/canvasInterface'
import { Coord } from '@/domain/models/dataset/datasetInterface'
import ExtractStrategyInterface from '@/application/strategies/extractStrategies/extractStrategyInterface'

export interface ExtractorInterface {
  strategy: ExtractStrategyInterface
  strategies: string[]
  colorPicker: string
  colors: { R: number; G: number; B: number }[][]
  colorDistancePct: number
  swatches: string[][]

  setColorDistancePct(colorDistancePct: number): void
  setStrategy(strategy: ExtractStrategyInterface): void
  setColorPicker(color: string): void
  setSwatches(colorSwatches: string[]): void

  execute(canvas: CanvasInterface): Coord[]

  get targetColor(): { R: number; G: number; B: number }
  get targetColorHex(): string
  updateSwatches(colorSwatches: string[]): void
}
