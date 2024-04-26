import { Request, Response } from "express";
import { CreateUserRepository } from "../domain/repositories/user/create-user-repository";
import { OAuth2Client } from "google-auth-library";
import { DeleteUserByIdRepository, GetUserDataRepository, LoadUserByEmailRepository } from "../domain/repositories";

import jwt from 'jsonwebtoken';

export class UserController {
    constructor(private readonly createUserRepository: CreateUserRepository,
        private readonly getUserDataRepository: GetUserDataRepository,
        private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
        private readonly deleteUserByIdRepository: DeleteUserByIdRepository) { }

    async requestGoogleOAuth(req: Request, res: Response) {
        try {
            const redirectUrl = 'http://localhost:3000/oauth';

            const oAuth2Client = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                redirectUrl
            );

            const authorizeUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: 'https://www.googleapis.com/auth/userinfo.email openid',
                prompt: 'consent'
            });

            return res.status(200).json({ url: authorizeUrl });
        } catch (error) {
            return res.status(500).json({ error: error })
        }
    }

    async googleOAuth(req: Request, res: Response) {
        try {
            const code = req.query.code;
            if (code) {
                const redirectUrl = 'http://localhost:3000/oauth';
                const oAuth2Client = new OAuth2Client(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET,
                    redirectUrl
                );

                const response = await oAuth2Client.getToken(code.toString());
                await oAuth2Client.setCredentials(response.tokens);
                const user = oAuth2Client.credentials;
                if (user.access_token) {
                    const userData = await this.getUserDataRepository.getUserData(user.access_token);
                    if (userData) {
                        const token = jwt.sign({ email: userData.email, protocol: 'google-oauth' }, 'secret', { expiresIn: '1m' })
                        const checkUser = await this.loadUserByEmailRepository.loadByEmail(userData.email);
                        if (!checkUser) {
                            const result = await this.createUserRepository.create({
                                sub_id: userData.sub,
                                email: userData.email,
                                username: '',
                                password: '',
                                name: userData.name,
                                surname: userData.surname
                            });
                            if (result) {
                                res.cookie('token', token, { maxAge: 15 * 60 * 1000, sameSite: 'lax', httpOnly: true, secure: false })
                                return res.redirect('/home');
                            }
                            return res.status(500).send('Error while creating user');
                        }
                        res.cookie('token', token, { maxAge: 15 * 60 * 1000, sameSite: 'lax', httpOnly: true, secure: false })
                        return res.redirect('/home');
                    }
                    return res.status(500).send('Error')
                }
            }
        } catch (error) {
            return res.status(500).json({ error: error })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie('token');
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: error })
        }
    }
    
    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await this.deleteUserByIdRepository.deleteById(id);
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ error: error })
        }
    }
}