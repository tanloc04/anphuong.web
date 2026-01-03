import type { IPageInfo } from "./common.types"

export interface IColor {
    id: number,
    name: string,
    hexCode: string,
}

export interface ISearchColorCondition {
    keyword: string,
    status: string,
    isDeleted: boolean
}

export interface ISearchColorRequest {
    searchCondition: ISearchColorCondition,
    pageInfo: IPageInfo
}

export interface IColorRequest {
    name: string,
    hexCode: string
}