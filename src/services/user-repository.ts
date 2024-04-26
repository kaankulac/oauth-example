import { CreateUserRepository, LoadUserByEmailRepository, DeleteUserByIdRepository } from "../domain/repositories";

import { pool } from "./postgre-db";

export class UserRepository implements CreateUserRepository, LoadUserByEmailRepository, DeleteUserByIdRepository {
    async create(params: CreateUserRepository.Params): Promise<boolean> {
        const result = await pool.query('INSERT INTO "users" (sub_id, email, username, password, name, surname) VALUES ($1, $2, $3, $4, $5, $6)', [params.sub_id, params.email, params.username, params.password, params.name, params.surname])
        return result.rowCount !== 0
    }

    async loadByEmail(email: string): Promise<LoadUserByEmailRepository.Result> {
        const user = await pool.query('SELECT user_id, email FROM "users" WHERE email = $1', [email]);
        return user.rows[0]
    }
    
    async deleteById(id: string): Promise<void> {
        await pool.query('DELETE FROM "users" WHERE user_id = $1', [id]);
    }
}