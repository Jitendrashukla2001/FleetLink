import { Vehicle } from "../models/Vehicles.js";
import {Booking} from "../models/Booking.js";
import estimatedRideDurationHours from '../utils/duration.js'

export const createVehicles=async (req,res)=>{
    try {
        
        const {name,capacityKg,tyres}=req.body;
        const createdBy=req.id;
        if(!name || !capacityKg ||!tyres)
        {
            return res.status(400).json({success:false, message: 'name, capacityKg and tyres are required' });
        }
        if (typeof name !== 'string' || typeof capacityKg !== 'number' || typeof tyres !== 'number')
          {
         return res.status(400).json({success:false, message: 'Invalid field types' });
          }
          const vehicle = await Vehicle.create({ name, capacityKg, tyres,createdBy });
          return res.status(201).json({success:true,vehicle});
    } catch (error) {
        console.log(error);
       return res.status(500).json({ message: 'Server error' });
    }
}

export const getAvailable=async (req,res)=>{
    try {
       const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
       if(!capacityRequired || !fromPincode || !toPincode || !startTime)
        {
            return res.status(400).json({ message: 'Missing query parameters' });
        }
        
        const capacityNum = Number(capacityRequired);
      if (Number.isNaN(capacityNum)) return res.status(400).json({ message: 'capacityRequired must be a number' });


       const start = new Date(startTime);
      if (isNaN(start.getTime())) return res.status(400).json({ message: 'Invalid startTime' });


       const hours = estimatedRideDurationHours(fromPincode, toPincode);
       const end = new Date(start.getTime() + hours * 3600 * 1000);

       // find vehicles with sufficient capacity
      const candidates = await Vehicle.find({ capacityKg: { $gte: capacityNum } }).lean();


       // fetch bookings that overlap with window
     const vehicleIds = candidates.map(v => v._id);


     const overlappingBookings = await Booking.find({
     vehicleId: { $in: vehicleIds },
       $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } },
           ]
          }).lean();

    const bookedVehicleIds = new Set(overlappingBookings.map(b => String(b.vehicleId)));
      

    const available = candidates.filter(v => !bookedVehicleIds.has(String(v._id))).map(v => ({...v,estimatedRideDurationHours: hours}));
    return res.status(200).json({success:true, estimatedRideDurationHours: hours, vehicles: available });

    } catch (error) {
         console.error(err);
       return res.status(500).json({ message: 'Server error' });
    }
}