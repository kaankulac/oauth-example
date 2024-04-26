import { GetUserDataRepository } from "../domain/repositories";

export class GetUserData implements GetUserDataRepository {
    constructor() {}

    async getUserData(access_token: string): Promise<any> {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`)
        const data = await response.json()
        return data;
    
    }
}