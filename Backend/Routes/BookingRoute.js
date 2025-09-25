import express from 'express';

import isAuthenticated from '../Middleware/isAuthenticated.js';
import {booking, deleteBooking, getOngoingBookings } from '../Controller/BookingController.js';

const Router=express.Router();

Router.route('/Booking').post(isAuthenticated,booking);
Router.route('/ongoing').get(isAuthenticated,getOngoingBookings);
Router.route('/delete/:id').delete(isAuthenticated,deleteBooking);
export default Router;

