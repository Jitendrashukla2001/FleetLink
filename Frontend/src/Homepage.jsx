import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Booking, Vehicle } from "./config/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

function Homepage() {
  const [openModal, setOpenModal] = useState(false);
  const [vehicle, setVehicle] = useState({ name: "", capacityKg: "", tyres: "" });
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${Booking}/ongoing`, { withCredentials: true });
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load bookings");
      }
    };
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "capacityKg" || name === "tyres") {
      setVehicle({ ...vehicle, [name]: Number(value) });
    } else {
      setVehicle({ ...vehicle, [name]: value });
    }

  };

  const handleAddVehicle = async () => {
    if (!vehicle.name || !vehicle.capacityKg || !vehicle.tyres) {
      return toast.error("All fields are required!");
    }

    try {

      const res = await axios.post(`${Vehicle}/create`, vehicle, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message || "Vehicle added successfully!");
        setOpenModal(false);
        navigate("/vehicles"); // redirect to vehicles page
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const res = await axios.delete(`${Booking}/delete/${bookingId}`, { withCredentials: true });
      if (res.data.message) {
        toast.success(res.data.message);

        // Remove the deleted booking from local state
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (

    <>

      <div className="flex flex-col items-center mt-20 gap-8">
        {/* Vehicle Dashboard Card */}
        <Card className="w-full max-w-md mx-auto sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <CardHeader>
            <CardTitle>Vehicle Dashboard</CardTitle>
            <CardDescription>Add and manage vehicles</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setOpenModal(true)}>Add Vehicle</Button>
          </CardContent>
        </Card>

        {/* Ongoing Bookings */}
        <div className="w-full max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">Ongoing Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking._id} className="relative shadow-md">
                  {/* Sloped Booked Mark */}
                  <div className="p-2">
                    <div className="absolute top-2 right-0 transform rotate-45 origin-top-right bg-green-500 text-white px-4 py-1 text-xs font-semibold shadow-md">
                      Booked
                    </div></div>
                  <CardHeader>
                    <CardTitle>{booking.vehicleId.name}</CardTitle>
                    <CardDescription>
                      Capacity: {booking.vehicleId.capacityKg} Kg | Tyres: {booking.vehicleId.tyres}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Journey ends at:{" "}
                      <span className="font-medium">
                        {new Date(booking.endTime).toLocaleString()}
                      </span>
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2 sm:flex-col md:flex-col lg:flex-row">
                    <Button
                      className="w-full"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                    <Button disabled className="w-full flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4" /> Already Booked
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No ongoing bookings found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding Vehicle */}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Add Vehicle"
        description="Fill in the vehicle details"
        footer={<Button onClick={() => setOpenModal(false)}>Close</Button>}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddVehicle();
          }}
        >
          <Input
            name="name"
            placeholder="Vehicle Name"
            value={vehicle.name}
            onChange={handleChange}
            className="mb-2"
          />
          <Input
            name="capacityKg"
            placeholder="Capacity Kg"
            value={vehicle.capacityKg}
            onChange={handleChange}
            className="mb-2"
          />
          <Input
            name="tyres"
            placeholder="Tyres"
            value={vehicle.tyres}
            onChange={handleChange}
            className="mb-2"
          />
          <Button type="submit">Add Vehicle</Button>
        </form>
      </Modal>
    </>
  )
}

export default Homepage