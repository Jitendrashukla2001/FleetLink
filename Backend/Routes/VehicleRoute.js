import express from 'express';
import { createVehicles, getAvailable } from '../Controller/VehicleController.js';
import isAuthenticated from '../Middleware/isAuthenticated.js';

const Router=express.Router();

Router.route('/create').post(isAuthenticated,createVehicles);
Router.route('/Available').get(isAuthenticated,getAvailable);


export default Router;