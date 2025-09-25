import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { persistor } from "./Features/Store";
import { LogoutUser } from "./Features/UserSlice";
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user)
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(LogoutUser()); // clear Redux state
    persistor.purge();      // clear persisted state
    navigate("/");     // redirect to login page
  };
  return (
    <>
      <nav className="bg-gray-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Site Name */}
            <div className="flex-shrink-0 font-bold text-lg">
              FleetLink
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link to="/homepage" className="hover:text-gray-300">Home</Link>
              <Link to="/vehicles" className="hover:text-gray-300">Start Trip</Link>
              {/* Avatar */}
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  {user.name}
                </TooltipContent>
              </Tooltip>
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center gap-1 hover:text-gray-300"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="focus:outline-none"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-700 px-4 pt-2 pb-4 space-y-2">
            <Link to="" className="block hover:text-gray-300">Add Vehicles</Link>
            <Link to="" className="block hover:text-gray-300">Start Trip</Link>
            <div className="flex items-center mt-2">
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  {user.name}
                </TooltipContent>
              </Tooltip>
              <button
                onClick={handleLogout}
                className="ml-4 flex items-center gap-1 hover:text-gray-300"
              >
                <LogOut size={20} />
                Logout
              </button>
              <span className="ml-2"></span>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar