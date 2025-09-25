import mongoose from "mongoose";
import dotenv from "dotenv";

const database=()=>
{
    mongoose.connect(process.env.DATABASE_URL).then(()=>{
        console.log("database connected")
    }).catch((error)=>{
        console.log(error)
    })

}
export default database;