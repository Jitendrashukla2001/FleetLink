import mongoose from "mongoose";
import { Vehicle } from "../models/Vehicles.js";
import { Booking } from "../models/Booking.js";
import estimatedRideDurationHours from "../utils/duration.js";

// const booking=async (req,res)=>{
//    const session = await mongoose.startSession();
// try {

//    const { vehicleId, fromPincode, toPincode, startTime} = req.body;
//    const customerId=req.id;
//    if (!vehicleId || !fromPincode || !toPincode || !startTime) 
//     {
//       return res.status(400).json({ message: 'Missing fields' });
//      }


// // verify vehicle exists
// const vehicle = await Vehicle.findById(vehicleId);

// if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });


// const start = new Date(startTime);
// if (isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid startTime' });


// const hours = estimatedRideDurationHours(fromPincode, toPincode);
// const end = new Date(start.getTime() + hours * 3600 * 1000);


// // Use transaction to reduce chance of race condition (requires replica set)
// let createdBooking = null;
// await session.withTransaction(async () => {
// const conflict = await Booking.findOne({
// vehicleId: vehicle._id,
// $or: [ { startTime: { $lt: end }, endTime: { $gt: start } } ]
// }).session(session);


// if (conflict) {
// throw new Error('CONFLICT');
// }


// createdBooking = await Booking.create([{
// vehicleId: vehicle._id,
// fromPincode,
// toPincode,
// startTime: start,
// endTime: end,
// customerId,
// }], { session });
// });


// // createdBooking is an array returned by create() with session
//       return res.status(201).json(createdBooking[0]);
// }
//  catch (err) {
//      if (err.message === 'CONFLICT') 
//       {
//         return res.status(409).json({ message: 'Vehicle already booked for this time window' });
//       }
//      console.log(err);
//         return res.status(500).json({ message: 'Server error' });
// } finally {
// session.endSession();
// }
// }
export const booking = async (req, res) => {
  try {
    const customerId = req.id;  // ✅ from JWT
    const { vehicleId, fromPincode, toPincode, startTime } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // verify vehicle exists
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const start = new Date(startTime);
    if (isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid startTime' });

    const hours = estimatedRideDurationHours(fromPincode, toPincode);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

    // 1. Check if a conflicting booking exists
    const conflict = await Booking.findOne({
      vehicleId: vehicle._id,
      $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }]
    });

    if (conflict) {
      return res.status(409).json({ message: 'Vehicle already booked for this time window' });
    }

    // 2. Create booking if no conflict
    const createdBooking = await Booking.create({
      vehicleId: vehicle._id,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId
    });

    return res.status(201).json({message:"Booked Successfully",createdBooking});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const getOngoingBookings = async (req, res) => {
  try {
    const customerId = req.id;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const bookings = await Booking.find({
      customerId,
      endTime: { $gt: now }, // only ongoing
    }).populate("vehicleId"); // get vehicle details

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (err) {
    console.error("Error fetching ongoing bookings:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const customerId = req.id; // from JWT

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ensure the customer owns this booking
    if (booking.customerId.toString() !== customerId) {
      return res.status(403).json({ message: "You are not authorized to delete this booking" });
    }

    // Delete the booking
    await Booking.findByIdAndDelete(bookingId);

    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};