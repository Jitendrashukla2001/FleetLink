
import dotenv from 'dotenv';
dotenv.config({
    path:".env"
});
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import database from "./Config/database.js";
import userRoute from './Routes/UserRoute.js';
import VehicleRoute from './Routes/VehicleRoute.js';
import BookingRoute from './Routes/BookingRoute.js';

const app=express();
const options={
     origin: 'http://localhost:5173', // Allow your frontend to access the API
    credentials: true, // Allow cookies and credentials to be sent
}
app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
database();
// console.log(process.env.DATABASE_URL)

//different routes
app.use('/api/v1/user',userRoute);
app.use('/api/v2/vehicle',VehicleRoute);
app.use('/api/v3/Booking',BookingRoute);

app.listen(process.env.PORT,()=>{
    console.log('connected successfully');
});