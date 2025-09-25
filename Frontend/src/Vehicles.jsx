import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Booking, Vehicle } from "./config/api";
import axios from 'axios';
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function Vehicles() {
   const navigate=useNavigate();
   const [formData, setFormData] = useState({
    capacityRequired: "",
    fromPincode: "",
    toPincode: "",
    startTime: ""
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
     const { name, value } = e.target;
     if(name==="fromPincode" || name==="toPincode")
     {
       setFormData({ ...formData, [name]:Number(value) });
     }
     else{
      setFormData({ ...formData, [name]:value });
     }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const query = new URLSearchParams(formData).toString();
      const res = await axios.get(`${Vehicle}/Available?${query}`,{withCredentials:true});
       if (res.data.success)
       {
                toast.success(res.data.message || "Available Vehicle!");
                setVehicles(res.data.vehicles || []);
       }
      else {
             toast.error(res.data.message || "Something went wrong!");
            }
      
    } catch (err) {
       toast.error(err.response?.data?.message || err.message);
       
    } finally {
      setLoading(false);
    }
  };

   const handleBookNow = async (vehicleId) => {
    try {
      const bookingData = {
        vehicleId,
        fromPincode: formData.fromPincode,
        toPincode: formData.toPincode,
        startTime: formData.startTime
      };
      const res = await axios.post(`${Booking}/Booking`, bookingData, { withCredentials: true });
      toast.success(res.data.message ||"Vehicle booked successfully!");
      navigate("/homepage"); // Redirect to homepage after booking
    } catch (err) {
      toast.error(err?.res?.data?.message || err.message);
    }
  };
  return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Find Available Vehicles</CardTitle>
          <CardDescription>Enter details to check availability</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="capacityRequired">Capacity Required (KG)</Label>
              <Input
                id="capacityRequired"
                name="capacityRequired"
                type="number"
                value={formData.capacityRequired}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="fromPincode">From Pincode</Label>
              <Input
                id="fromPincode"
                name="fromPincode"
                type="Number"
                value={formData.fromPincode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="toPincode">To Pincode</Label>
              <Input
                id="toPincode"
                name="toPincode"
                type="Number"
                value={formData.toPincode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search Availability"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Error */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {vehicles.length > 0 ? (
    vehicles.map((v) => (
      <Card key={v._id} className="shadow-md">
        <CardHeader>
          <CardTitle>{v.name}</CardTitle>
          <CardDescription>
            Capacity: {v.capacityKg} kg | Tyres: {v.tyres}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Estimated Ride Duration: {v.estimatedRideDurationHours} hrs
          </p>
          <Button className="mt-3 w-full" onClick={() => handleBookNow(v._id)}>Book Now</Button>
        </CardContent>
      </Card>
    ))
  ) : (
    <p className="text-red-600 col-span-full text-center">
      Search Results
    </p>
  )}
</div>

    </div>
  )
}

export default Vehicles