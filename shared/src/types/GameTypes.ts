import {MapSchema} from "@colyseus/schema"

export type TokenCountMap = MapSchema<number>

export const genCostMap = (entries: [string, number][]) => {
  return new MapSchema<number>(new Map(entries))
}