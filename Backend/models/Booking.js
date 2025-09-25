import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
    vehicleId:{type:mongoose.Schema.Types.ObjectId, ref:"Vehicle",required:true},
    fromPincode:{type:Number,required:true},
    toPincode:{type:Number,required:true},
    startTime:{type:Date,required:true},
    endTime:{type:Date,required:true},
    customerId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    createdAt:{type:Date,default:Date.now},
})
bookingSchema.index({ endTime: 1 }, { expireAfterSeconds: 0 });

export const Booking=mongoose.model("Booking",bookingSchema);