import type { PageInfo } from "./common.types"

export interface Color {
    id: number,
    name: string,
    hexCode: string,
}

export interface SearchColorCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface SearchColorRequest {
    searchCondition: SearchColorCondition,
    pageInfo: PageInfo
}

export interface ColorRequest {
    name: string,
    hexCode: string
}