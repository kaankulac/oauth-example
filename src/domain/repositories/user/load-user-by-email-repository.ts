export interface LoadUserByEmailRepository {
    loadByEmail: (email: string) => Promise<LoadUserByEmailRepository.Result>
}

export namespace LoadUserByEmailRepository {
    export type Result = {
        user_id: string
        email: string
    }
}