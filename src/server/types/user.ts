import {UserEntity} from "@/server/db/types";

export type PublicUser = Pick<UserEntity, 'id' | 'name' | 'username' | 'avatar'>

export interface UserStatsResponse {
    total: number
    year: number
    week: number
}