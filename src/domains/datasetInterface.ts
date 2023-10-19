import { Vector } from './axes/axesInterface'

// INFO: Coord is coordinate
export type Coord = {
  xPx: number
  yPx: number
}
export type Plot = {
  id: number
  xPx: number
  yPx: number
}

export type Plots = Plot[]

export type PlotValue = { xV: string; yV: string } & Plot

export interface DatasetInterface {
  name: string
  plots: Plots
  id: number
  plotsAreAdjusting: boolean
  activePlotIds: number[]
  get nextPlotId(): number
  get plotsAreActive(): boolean
  scaledPlots(scale: number): Plots
  addPlot(xPx: number, yPx: number): void
  moveActivePlot(vector: Vector): void
  switchActivatedPlot(id: number): void
  addActivatedPlot(id: number): void
  hasActive(): boolean
  toggleActivatedPlot(toggledId: number): void
  clearPlot(id: number): void
  clearPlots(): void
  inactivatePlots(): void
  clearActivePlots(): void
  activatePlotsInRectangleArea(
    topLeftCoord: Coord,
    bottomRightCoord: Coord,
  ): void
  plotsInRectangleArea(topLeftCoord: Coord, bottomRightCoord: Coord): Plots
  plotsSortedByXDescending(): Plots
  plotsSortedByYAscending(): Plots
  plotsSortedByYDescending(): Plots
  plotsSortedByIdAscending(): Plots
  plotsSortedByIdDescending(): Plots
}
