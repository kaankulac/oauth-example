export interface GetUserDataRepository {
    getUserData: (access_token: string) => Promise<any>
}