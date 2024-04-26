import { Router } from "express";
import dotenv from 'dotenv';
import {OAuth2Client} from 'google-auth-library';
import { GetUserData, UserRepository } from "./services";
import { UserController } from "./presentation/user-controller";

dotenv.config();

const userRepository = new UserRepository();
const getUserData = new GetUserData();

const userController = new UserController(userRepository, getUserData, userRepository, userRepository)
var router = Router();
    router.post('/oauth/google/request', userController.requestGoogleOAuth.bind(userController));

    router.get('/oauth', userController.googleOAuth.bind(userController));

    router.post('/logout', userController.logout.bind(userController));

    router.delete('/users/:id', userController.deleteUser.bind(userController));

    export default router;