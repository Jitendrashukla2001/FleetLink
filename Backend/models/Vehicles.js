import mongoose from 'mongoose';

const VehicleSchema=new mongoose.Schema({
    name:{type:String,required:true},
    capacityKg:{type:Number,required:true},
    tyres:{type:Number,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    createdAt:{type:Date,default:Date.now},
});

export const Vehicle=mongoose.model("Vehicle",VehicleSchema);