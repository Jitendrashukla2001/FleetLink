
import express from 'express';
import { createUser, login, logout } from '../Controller/UserController.js';

const Router=express.Router();

Router.route('/register').post(createUser);
Router.route('/login').post(login);
Router.route('/logout').get(logout);
export default Router;