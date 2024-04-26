export interface CreateUserRepository {
    create: (params: CreateUserRepository.Params) => Promise<boolean>
}

export namespace CreateUserRepository {
    export type Params = {
        sub_id: string;
        email: string;
        username: string;
        password: string;
        name: string;
        surname: string;
    }
}