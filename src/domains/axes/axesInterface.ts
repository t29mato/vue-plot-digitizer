import { Coord } from '../datasetInterface'
import { AxisInterface } from './axisInterface'

// TODO: VectorはDatasetInterfaceでも利用しており共通Typeの場所を用意するべきか検討する
export type Vector = {
  direction: 'up' | 'down' | 'right' | 'left',
  distancePx: number,
}

export interface AxesInterface {
  x1: AxisInterface
  x2: AxisInterface
  y1: AxisInterface
  y2: AxisInterface
  xIsLog: boolean
  yIsLog: boolean
  activeAxisName: string
  x1IsSameAsY1: boolean

  get hasAtLeastOneAxis(): boolean
  get activeAxis(): AxisInterface | null
  get nextAxis(): AxisInterface | null
  moveActiveAxis(vector: Vector): void
  clearAxesCoords(): void
  addAxisCoord(coord: Coord): void
  inactivateAxis(): void
}
